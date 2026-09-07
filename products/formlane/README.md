# FormLane Worker

Spam-resistant contact / waitlist forms on a **Cloudflare Worker** — no origin server.
Submissions POST to your Worker; the Worker forwards to Discord, Slack, or a custom URL.

**Version:** 0.1.0 · **Price:** $29 lifetime · [craftlane.app](https://craftlane.app)

## What is included

| Path | Purpose |
|------|---------|
| `worker/` | TypeScript Worker source (`POST /submit`) |
| `wrangler.toml.example` | Deploy config template |
| `.dev.vars.example` | Local env template |
| `embed/snippet.html` | Copy-paste HTML form |
| `CHANGELOG.md` | Release notes |

## Features

- JSON or form body: name, email, message, plus optional extra fields
- Hidden trap field (default name: website)
- Basic per-IP rate limit via the Cloudflare Cache API
- Configurable CORS (ALLOWED_ORIGINS)
- Forward to Discord, Slack, or a custom HTTPS URL
- JSON ok/error responses

## Setup

- Cloudflare account and Node 18+

## Buyer setup

1. Unzip and install deps in worker/.
2. Copy config example; set main + ALLOWED_ORIGINS.
3. Configure one destination URL via Wrangler or dashboard.
4. Local: .dev.vars.example then wrangler dev; POST /submit.
5. wrangler deploy; set YOUR_WORKER_URL in embed snippet.

## API

### POST /submit

Body JSON: name, email, message, website (must be empty). Extra string fields are forwarded.

Success: 200 {"ok": true}
Errors: 400/403/429/502/503 with {"ok": false, "error": "<code>"}

Codes: invalid_name, invalid_email, message_too_long, rate_limited, cors_denied, webhook_not_configured, webhook_failed.

### GET / or GET /health

Returns service name and version.

## Environment reference

| Name | Where | Description |
|------|--------|-------------|
| ALLOWED_ORIGINS | [vars] | Comma-separated origins, or * |
| HONEYPOT_FIELD | [vars] | Field that must stay empty (default website) |
| RATE_LIMIT_MAX | [vars] | Max posts per IP per window (default 5) |
| RATE_LIMIT_WINDOW_SEC | [vars] | Window seconds (default 60) |
| DISCORD_WEBHOOK_URL | secret | Discord incoming URL |
| SLACK_WEBHOOK_URL | secret | Slack incoming URL |
| GENERIC_WEBHOOK_URL | secret | Any JSON POST endpoint |

Priority if multiple are set: Discord, then Slack, then generic.

## License (purchase)

After purchase you may deploy and modify FormLane on projects you own or operate. Do not resell or redistribute the template as a competing product. Support: admin@craftlane.app

## Support

admin@craftlane.app
