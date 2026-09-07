/**
 * FormLane Worker — spam-resistant contact / waitlist form endpoint.
 * Deploy on your Cloudflare account; posts to Discord, Slack, or a generic webhook.
 */

export interface Env {
  /** Comma-separated origins, or `*` for any. Empty = deny browser CORS (server-to-server OK). */
  ALLOWED_ORIGINS?: string;
  /** Hidden honeypot field name expected empty. Default: `website`. */
  HONEYPOT_FIELD?: string;
  /** Max submissions per IP per window. Default: 5. */
  RATE_LIMIT_MAX?: string;
  /** Rate-limit window in seconds. Default: 60. */
  RATE_LIMIT_WINDOW_SEC?: string;
  DISCORD_WEBHOOK_URL?: string;
  SLACK_WEBHOOK_URL?: string;
  GENERIC_WEBHOOK_URL?: string;
}

interface SubmitBody {
  name?: string;
  email?: string;
  message?: string;
  [key: string]: unknown;
}

const JSON_HEADERS = { "Content-Type": "application/json; charset=utf-8" };

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return corsPreflight(request, env);
    }

    if (request.method === "GET" && (url.pathname === "/" || url.pathname === "/health")) {
      return json({ ok: true, service: "formlane", version: "0.1.0" }, 200, request, env);
    }

    if (request.method === "POST" && (url.pathname === "/submit" || url.pathname === "/")) {
      return handleSubmit(request, env, ctx);
    }

    return json({ ok: false, error: "not_found" }, 404, request, env);
  },
};

async function handleSubmit(
  request: Request,
  env: Env,
  ctx: ExecutionContext,
): Promise<Response> {
  const origin = request.headers.get("Origin");
  if (origin && !isOriginAllowed(origin, env)) {
    return json({ ok: false, error: "cors_denied" }, 403, request, env);
  }

  let body: SubmitBody;
  try {
    const ct = request.headers.get("Content-Type") || "";
    if (ct.includes("application/json")) {
      body = (await request.json()) as SubmitBody;
    } else if (
      ct.includes("application/x-www-form-urlencoded") ||
      ct.includes("multipart/form-data")
    ) {
      const fd = await request.formData();
      body = Object.fromEntries([...fd.entries()].map(([k, v]) => [k, String(v)]));
    } else {
      body = (await request.json()) as SubmitBody;
    }
  } catch {
    return json({ ok: false, error: "invalid_json" }, 400, request, env);
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return json({ ok: false, error: "invalid_body" }, 400, request, env);
  }

  const honeypot = env.HONEYPOT_FIELD || "website";
  const trap = body[honeypot];
  if (typeof trap === "string" && trap.trim() !== "") {
    // Silent success for bots — do not forward.
    return json({ ok: true }, 200, request, env);
  }

  const name = str(body.name).trim();
  const email = str(body.email).trim();
  const message = str(body.message).trim();

  if (!name || name.length > 200) {
    return json({ ok: false, error: "invalid_name" }, 400, request, env);
  }
  if (!email || email.length > 320 || !looksLikeEmail(email)) {
    return json({ ok: false, error: "invalid_email" }, 400, request, env);
  }
  if (message.length > 5000) {
    return json({ ok: false, error: "message_too_long" }, 400, request, env);
  }

  const ip = clientIp(request);
  const limited = await isRateLimited(ip, env, ctx);
  if (limited) {
    return json({ ok: false, error: "rate_limited" }, 429, request, env);
  }

  const extras: Record<string, string> = {};
  for (const [k, v] of Object.entries(body)) {
    if (k === "name" || k === "email" || k === "message" || k === honeypot) continue;
    if (typeof v === "string" && v.trim()) extras[k] = v.trim().slice(0, 500);
  }

  const webhook = pickWebhook(env);
  if (!webhook) {
    return json({ ok: false, error: "webhook_not_configured" }, 503, request, env);
  }

  try {
    await forwardWebhook(webhook, { name, email, message, extras, ip });
  } catch (err) {
    console.error("webhook_forward_failed", err);
    return json({ ok: false, error: "webhook_failed" }, 502, request, env);
  }

  return json({ ok: true }, 200, request, env);
}

function pickWebhook(env: Env): { kind: "discord" | "slack" | "generic"; url: string } | null {
  if (env.DISCORD_WEBHOOK_URL) return { kind: "discord", url: env.DISCORD_WEBHOOK_URL };
  if (env.SLACK_WEBHOOK_URL) return { kind: "slack", url: env.SLACK_WEBHOOK_URL };
  if (env.GENERIC_WEBHOOK_URL) return { kind: "generic", url: env.GENERIC_WEBHOOK_URL };
  return null;
}

async function forwardWebhook(
  webhook: { kind: "discord" | "slack" | "generic"; url: string },
  data: {
    name: string;
    email: string;
    message: string;
    extras: Record<string, string>;
    ip: string;
  },
): Promise<void> {
  const lines = [
    `**Name:** ${data.name}`,
    `**Email:** ${data.email}`,
  ];
  if (data.message) lines.push(`**Message:**\n${data.message}`);
  for (const [k, v] of Object.entries(data.extras)) {
    lines.push(`**${k}:** ${v}`);
  }
  lines.push(`_IP: ${data.ip}_`);
  const text = lines.join("\n");

  let payload: unknown;
  if (webhook.kind === "discord") {
    payload = {
      content: null,
      embeds: [
        {
          title: "New form submission",
          description: text.slice(0, 4000),
          color: 0x7c9cff,
          timestamp: new Date().toISOString(),
        },
      ],
    };
  } else if (webhook.kind === "slack") {
    payload = {
      text: "New form submission",
      blocks: [
        {
          type: "section",
          text: { type: "mrkdwn", text: text.slice(0, 2900) },
        },
      ],
    };
  } else {
    payload = {
      name: data.name,
      email: data.email,
      message: data.message,
      ...data.extras,
      meta: { ip: data.ip, source: "formlane", at: new Date().toISOString() },
    };
  }

  const res = await fetch(webhook.url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`webhook HTTP ${res.status}: ${body.slice(0, 200)}`);
  }
}

/**
 * Rate limit with the Cache API: each IP gets a cache key that stores a hit count
 * for RATE_LIMIT_WINDOW_SEC. Works across isolates better than process memory.
 */
async function isRateLimited(
  ip: string,
  env: Env,
  ctx: ExecutionContext,
): Promise<boolean> {
  const max = Math.max(1, parseInt(env.RATE_LIMIT_MAX || "5", 10) || 5);
  const windowSec = Math.max(1, parseInt(env.RATE_LIMIT_WINDOW_SEC || "60", 10) || 60);
  const keyUrl = `https://formlane.rate/limit/${encodeURIComponent(ip)}`;
  const cache = caches.default;

  const existing = await cache.match(keyUrl);
  let count = 0;
  if (existing) {
    count = parseInt(await existing.text(), 10) || 0;
  }
  count += 1;

  const headers = new Headers();
  headers.set("Content-Type", "text/plain");
  headers.set("Cache-Control", `public, max-age=${windowSec}`);
  const response = new Response(String(count), { headers });
  ctx.waitUntil(cache.put(keyUrl, response.clone()));

  return count > max;
}

function corsPreflight(request: Request, env: Env): Response {
  const origin = request.headers.get("Origin") || "";
  if (!isOriginAllowed(origin, env)) {
    return new Response(null, { status: 403 });
  }
  return new Response(null, {
    status: 204,
    headers: corsHeaders(origin, env, true),
  });
}

function json(
  data: unknown,
  status: number,
  request: Request,
  env: Env,
): Response {
  const origin = request.headers.get("Origin") || "";
  const headers = new Headers(JSON_HEADERS);
  if (origin && isOriginAllowed(origin, env)) {
    for (const [k, v] of Object.entries(corsHeaders(origin, env, false))) {
      headers.set(k, v);
    }
  }
  return new Response(JSON.stringify(data), { status, headers });
}

function corsHeaders(
  origin: string,
  env: Env,
  preflight: boolean,
): Record<string, string> {
  const allowed = (env.ALLOWED_ORIGINS || "").trim();
  const allowOrigin =
    allowed === "*" ? "*" : origin && isOriginAllowed(origin, env) ? origin : "";

  const h: Record<string, string> = {
    "Access-Control-Allow-Origin": allowOrigin || "null",
    "Access-Control-Allow-Methods": "POST, OPTIONS, GET",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  };
  if (allowOrigin && allowOrigin !== "*") {
    h["Vary"] = "Origin";
  }
  if (!preflight) {
    // still useful on actual responses
  }
  return h;
}

function isOriginAllowed(origin: string, env: Env): boolean {
  const raw = (env.ALLOWED_ORIGINS || "").trim();
  if (!raw) return false;
  if (raw === "*") return true;
  const list = raw.split(",").map((s) => s.trim()).filter(Boolean);
  return list.includes(origin);
}

function clientIp(request: Request): string {
  return (
    request.headers.get("CF-Connecting-IP") ||
    request.headers.get("X-Forwarded-For")?.split(",")[0]?.trim() ||
    "unknown"
  );
}

function looksLikeEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

function str(v: unknown): string {
  return typeof v === "string" ? v : v == null ? "" : String(v);
}
