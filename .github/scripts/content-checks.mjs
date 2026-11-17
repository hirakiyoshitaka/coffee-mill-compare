// PRごとの機械チェック（Claude その52-4）。
// 追加された行だけを検査する。既存の行は対象外。
// 失敗させるもの：
// 1. Amazonリンクのタグ違い（amazon.co.jp は tag=stocknotelife-22、
// amazon.com は tag=ouchidougub03-20 だけ。逆の組み合わせ・ほかのタグは失敗）
// 2. 煽り表現（最安／今すぐ／残りわずか）の追加。値段（円・$）と一緒ならなお失敗
// 3. 体験の語（使ってみた／買った／買ってみた／試してみた／使った感想）の追加
// → 「Claude 待ち」の印を付けて止める（＝このチェックを失敗させる）
// 値段だけの追加は失敗させず警告（::warning::）にとどめる。
// 運営者の見積もり価格など、正当な値段の追加がありうるため。
import { execFileSync} from "node:child_process";
import { readFileSync} from "node:fs";

const JP_TAG = "stocknotelife-22";
const US_TAG = "ouchidougub03-20";
const HYPE_WORDS = ["最安", "今すぐ", "残りわずか"];
const EXPERIENCE_WORDS = ["使ってみた", "買った", "買ってみた", "試してみた", "使った感想"];
// 条件形（買ったら／使ってみたら）や「買ったあと」は一人称の体験ではないので対象外
const EXPERIENCE_EXCLUDE_AFTER = { 買った: ["ら", "あと"], 使ってみた: ["ら"], 買ってみた: ["ら"], 試してみた: ["ら"], 使った感想: [] };

function containsExperienceWord(text, word) {
  const excluded = EXPERIENCE_EXCLUDE_AFTER[word] || [];
  let idx = text.indexOf(word);
  while (idx !== -1) {
    const after = text.slice(idx + word.length);
    if (!excluded.some((suffix) => after.startsWith(suffix))) return true;
    idx = text.indexOf(word, idx + 1);
  }
  return false;
}
// 否定の文脈（「架空の最安値は書きません」など）は煽りとみなさない
const HYPE_NEGATIONS = ["書きません", "架空の", "ではありません"];
const PRICE_RE = /(?:¥\s?\d[\d,]*|\d[\d,]*\s?円|\$\s?\d[\d,.]*)/;
// Amazonの商品・検索リンクだけを対象にする（画像URL amazon.com/images/ や
// テンプレート ${} は対象外）。ドメイン直後のパスが必須。
const AMAZON_URL_RE = /amazon\.(co\.jp|com)\/([^\s"'`)\]]+)/g;

function parseArgs(argv) {
const out = { base: null, diffFile: null};
for (let i = 0; i < argv.length; i++) {
if (argv[i] === "--base") out.base = argv[++i];
else if (argv[i] === "--diff-file") out.diffFile = argv[++i];
}
return out;
}

function loadDiff({ base, diffFile}) {
if (diffFile) return readFileSync(diffFile, "utf8");
const ref = base || "origin/main";
return execFileSync("git", ["diff", "--unified=0", `${ref}...HEAD`, "--"], {
encoding: "utf8",
maxBuffer: 10 * 1024 * 1024,
});
}

// diffを解析し、追加行だけを { file, line, text} の一覧にする。
function addedLines(diff) {
const lines = [];
let file = null;
let newLine = 0;
for (const raw of diff.split("\n")) {
if (raw.startsWith("+++ ")) {
const m = raw.slice(4).trim().replace(/^b\//, "");
file = m === "/dev/null"? null: m;
continue;
}
if (raw.startsWith("@@ ")) {
const m = raw.match(/\+(\d+)(?:,\d+)? @@/);
newLine = m? Number(m[1]): 0;
continue;
}
if (!file) continue;
if (raw.startsWith("+") &&!raw.startsWith("+++")) {
lines.push({ file, line: newLine, text: raw.slice(1)});
newLine++;
} else if (raw.startsWith(" ")) {
newLine++;
}
}
return lines;
}

function isCheckTarget(file) {
// このスクリプト自身（判定語を文字列として含む）とワークフローは対象外
if (file.startsWith(".github/")) return false;
return true;
}

function isTextTarget(file) {
// 煽り・値段・体験の語の検査は記事（content配下のmd）だけ
return file.startsWith("content/") && file.endsWith(".md");
}

function main() {
const args = parseArgs(process.argv.slice(2));
const diff = loadDiff(args);
const added = addedLines(diff).filter((l) => isCheckTarget(l.file));
const errors = [];
const warnings = [];

// 1. Amazonリンクのタグ
for (const { file, line, text} of added) {
for (const m of text.matchAll(AMAZON_URL_RE)) {
const domain = m[1];
const path = m[2];
if (path.includes("${") || path.startsWith("images/")) continue;
const expected = domain === "co.jp"? JP_TAG: US_TAG;
const tagMatch = text.match(/tag=([^&\s"'`)\]]+)/);
const where = `${file}:${line}`;
if (!tagMatch) {
errors.push(`${where}: amazon.${domain} のリンクにタグがありません（${expected} が必要です）：${text.trim()}`);
} else if (tagMatch[1]!== expected) {
errors.push(`${where}: amazon.${domain} のタグが違います（${tagMatch[1]} → ${expected}）：${text.trim()}`);
}
}
}

// 2・3. 煽り・値段・体験の語（記事だけ）
const textAdded = added.filter((l) => isTextTarget(l.file));
let hypeFound = null;
let priceFound = null;
for (const { file, line, text} of textAdded) {
const where = `${file}:${line}`;
for (const w of HYPE_WORDS) {
if (text.includes(w) &&!HYPE_NEGATIONS.some((n) => text.includes(n))) {
hypeFound = hypeFound || `${where}: 煽り表現「${w}」が追加されました：${text.trim()}`;
}
}
if (PRICE_RE.test(text)) {
priceFound = priceFound || `${where}: 値段が追加されました：${text.trim()}`;
}
for (const w of EXPERIENCE_WORDS) {
if (containsExperienceWord(text, w)) {
errors.push(`${where}: 【Claude 待ち】体験の語「${w}」が追加されました：${text.trim()}`);
}
}
}
if (hypeFound) errors.push(hypeFound);
if (hypeFound && priceFound) {
errors.push(`${priceFound}（煽り表現と値段の組み合わせ）`);
} else if (priceFound) {
warnings.push(priceFound);
}

for (const w of warnings) console.log(`::warning::${w}`);
for (const e of errors) console.log(`::error::${e}`);
if (errors.length > 0) {
console.log(`\ncontent-checks: ${errors.length}件の失敗`);
process.exit(1);
}
console.log("content-checks: OK");
}

main();
