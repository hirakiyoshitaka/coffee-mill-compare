import { readFile } from 'node:fs/promises';

const site = new URL('https://ouchi-dougubako.com');
const endpoint = 'https://api.indexnow.org/indexnow';
const key = 'cf350672f897ba45ec4fcaaf4ea9aeb9';
const keyFile = `${key}.txt`;
const maxBatchSize = 10_000;
const pageCheckConcurrency = 10;

function parseArgs(args) {
  const threeDaysAgo = new Date();
  threeDaysAgo.setUTCDate(threeDaysAgo.getUTCDate() - 3);
  let since = threeDaysAgo.toISOString().slice(0, 10);
  let dry = false;
  let urls;

  for (const arg of args) {
    if (arg === '--dry') dry = true;
    else if (arg.startsWith('--since=')) since = arg.slice('--since='.length);
    else if (arg.startsWith('--urls=')) urls = arg.slice('--urls='.length).split(',');
    else throw new Error(`不明なオプションです: ${arg}`);
  }

  const cutoff = new Date(`${since}T00:00:00Z`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(since) || Number.isNaN(cutoff.getTime()) ||
      cutoff.toISOString().slice(0, 10) !== since) {
    throw new Error('--since に有効な日付を YYYY-MM-DD 形式で指定してください。');
  }
  return { dry, cutoff, urls };
}

function request(url, options = {}) {
  return fetch(url, { ...options, redirect: 'manual', signal: AbortSignal.timeout(15_000) });
}

function decodeXml(text) {
  const entities = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" };
  return text.replace(/&(amp|lt|gt|quot|apos|#x[\da-fA-F]+|#\d+);/g, (_, entity) => {
    if (entity.startsWith('#x')) return String.fromCodePoint(Number.parseInt(entity.slice(2), 16));
    if (entity.startsWith('#')) return String.fromCodePoint(Number(entity.slice(1)));
    return entities[entity];
  });
}

async function sitemapUrls(cutoff) {
  const response = await request(new URL('/sitemap.xml', site));
  if (response.status !== 200) {
    await response.body?.cancel();
    throw new Error(`sitemap.xml の取得に失敗しました（HTTP ${response.status}）。`);
  }

  const xml = await response.text();
  if (!/^\s*(?:<\?xml[^?]*\?>\s*)?<urlset\b[^>]*>[\s\S]*<\/urlset>\s*$/.test(xml)) {
    throw new Error('sitemap.xml が URL 一覧の形式ではありません。');
  }

  const urls = [];
  for (const [, entry] of xml.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
    const loc = entry.match(/<loc>([^<]+)<\/loc>/)?.[1];
    const lastmod = entry.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1];
    if (loc && lastmod && Date.parse(lastmod.trim()) >= cutoff.getTime()) {
      urls.push(decodeXml(loc.trim()));
    }
  }
  return urls;
}

function productionUrl(value) {
  const url = URL.canParse(value) ? new URL(value) : null;
  if (url?.protocol !== 'https:' || url.origin !== site.origin || url.username || url.password) return null;
  url.hash = '';
  return url.href;
}

async function isPublished(url) {
  let response = await request(url, { method: 'HEAD' });
  if (response.status === 405 || response.status === 501) {
    response = await request(url);
    await response.body?.cancel();
  }
  if (response.status === 429 || response.status >= 500) {
    throw new Error(`HTTP ${response.status}`);
  }
  return response.status === 200;
}

function errorMessage(error) {
  const code = error.cause?.code;
  return code ? `${error.message} (${code})` : error.message;
}

async function main() {
  const { dry, cutoff, urls } = parseArgs(process.argv.slice(2));
  const candidates = urls ?? await sitemapUrls(cutoff);
  const uniqueUrls = [...new Set(candidates.map(productionUrl).filter(Boolean))];
  const published = [];
  let failed = false;

  for (let i = 0; i < uniqueUrls.length; i += pageCheckConcurrency) {
    const batch = uniqueUrls.slice(i, i + pageCheckConcurrency);
    const results = await Promise.allSettled(batch.map(isPublished));
    for (const [index, result] of results.entries()) {
      if (result.status === 'rejected') {
        console.error(`${batch[index]} の公開確認に失敗しました。${errorMessage(result.reason)}`);
        failed = true;
      } else if (result.value) {
        published.push(batch[index]);
      }
    }
  }

  if (dry) {
    for (const url of published) console.log(url);
    console.log(`送信予定 ${published.length} 件`);
  } else if (published.length === 0) {
    console.log('送信 0 件');
  } else {
    const localKey = await readFile(new URL(`../public/${keyFile}`, import.meta.url), 'utf8');
    if (localKey !== key) throw new Error('公開鍵ファイルの中身が IndexNow の鍵と一致しません。');

    for (let i = 0; i < published.length; i += maxBatchSize) {
      const urlList = published.slice(i, i + maxBatchSize);
      const response = await request(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify({ host: site.hostname, key, keyLocation: new URL(keyFile, site).href, urlList }),
      });
      await response.body?.cancel();
      console.log(`IndexNow HTTP ${response.status}、送信 ${urlList.length} 件`);
      if (response.status !== 200 && response.status !== 202) return 1;
    }
  }

  return failed ? 1 : 0;
}

try {
  process.exitCode = await main();
} catch (error) {
  console.error(`IndexNow の処理に失敗しました。${errorMessage(error)}`);
  process.exitCode = 1;
}
