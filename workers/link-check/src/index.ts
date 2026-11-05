import { buildReport, type Report } from "./logic";

export interface Env {
  SITE_ORIGIN: string;
  /** https URL of `{ "links": [{ "url", "page" }] }`. Empty reads the sitemap. */
  LINK_SOURCE_URL?: string;
  /** Empty disables GET /run. Set with `wrangler secret put RUN_KEY` and remove this var. */
  RUN_KEY?: string;
  REPORTS?: {
    put(key: string, value: string): Promise<void>;
  };
}

function summarize(report: Report): void {
  console.log(
    `link-check ${report.checkedAt} source=${report.source} pages=${report.pagesFetched} pageErrors=${report.pageErrors} links=${report.uniqueLinks} ok=${report.ok} issues=${report.issues.length} truncated=${report.truncated}`,
  );
  for (const issue of report.issues) {
    console.log(`link-check issue ${issue.kind} ${issue.status ?? "-"} ${issue.url} ${issue.detail}`);
  }
}

async function store(env: Env, report: Report): Promise<void> {
  summarize(report);
  if (!env.REPORTS) return;
  const json = JSON.stringify(report);
  const day = report.checkedAt.slice(0, 10);
  await env.REPORTS.put("report:latest", json);
  await env.REPORTS.put(`report:${day}`, json);
}

async function run(env: Env): Promise<Report> {
  const origin = env.SITE_ORIGIN?.trim();
  if (!origin) throw new Error("SITE_ORIGIN is empty");
  return buildReport({ origin, linkSourceUrl: env.LINK_SOURCE_URL, fetchImpl: fetch });
}

const worker = {
  async scheduled(_event: { cron: string; scheduledTime: number }, env: Env, ctx: { waitUntil(promise: Promise<unknown>): void }): Promise<void> {
    ctx.waitUntil(
      run(env)
        .then((report) => store(env, report))
        .catch((error: unknown) => {
          const message = error instanceof Error ? error.message : "link-check failed";
          console.log(`link-check failed ${message}`);
        }),
    );
  },

  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname !== "/run") return new Response("link-check cron worker", { status: 200 });
    const key = env.RUN_KEY?.trim() ?? "";
    if (!key || url.searchParams.get("key") !== key) return new Response("not found", { status: 404 });
    try {
      const report = await run(env);
      await store(env, report);
      return Response.json(report);
    } catch (error) {
      const message = error instanceof Error ? error.message : "link-check failed";
      console.log(`link-check failed ${message}`);
      return Response.json({ error: message }, { status: 500 });
    }
  },
};

export default worker;
