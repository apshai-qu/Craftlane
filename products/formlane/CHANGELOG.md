# Changelog — FormLane Worker

## 0.1.0 — 2026-09-07

### Added
- Initial sellable release of FormLane Worker.
- Cloudflare Worker (`worker/src/index.ts`) with `POST /submit`, honeypot, Cache API rate limit, configurable CORS.
- Webhook forwarders for Discord, Slack, and generic JSON endpoints.
- `wrangler.toml.example` and `.dev.vars.example` for deploy and local dev.
- Embeddable HTML form snippet at `embed/snippet.html`.
- Build script producing `dist/formlane-worker-v0.1.0.zip` (no secrets).
- Product sales page at `/products/formlane/`.

### Notes
- Checkout link pending; price shown on the product page ($29 lifetime).
