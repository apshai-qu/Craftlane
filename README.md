# Craftlane site

Static landing page for [craftlane.app](https://craftlane.app) — indie digital products for developers (VS Code / Cursor plugins, tools, downloads via Creem).

No build step. Plain HTML + CSS (+ tiny year script).

## Files

| File | Purpose |
|------|---------|
| `index.html` | Home: hero, what we sell, featured placeholders, FAQ, contact |
| `styles.css` | Shared styles |
| `privacy.html` | Privacy Policy stub (store / payments) |
| `terms.html` | Terms of Service stub (store / payments) |

## Deploy to Cloudflare Pages

### Option A — Dashboard (drag & drop)

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com) → **Workers & Pages** → **Create** → **Pages** → **Upload assets**.
2. Project name e.g. `craftlane-site`.
3. Upload the contents of this folder (`index.html`, `styles.css`, `privacy.html`, `terms.html`). Do **not** nest an extra parent folder as the root.
4. After deploy, open the `*.pages.dev` URL and check `/`, `/privacy.html`, `/terms.html`.
5. **Custom domain:** Pages → your project → **Custom domains** → add `craftlane.app` (and optionally `www`). Point DNS as Cloudflare instructs (usually CNAME or proxied A/AAAA for the apex).

### Option B — Wrangler CLI

```bash
# from this directory
npx wrangler pages project create craftlane-site   # once
npx wrangler pages deploy . --project-name=craftlane-site
```

No build command. Production branch / output directory = this folder (or `.`).

### Suggested Pages settings

- **Build command:** _(empty)_
- **Build output directory:** `/` (or `.` if the repo root is this site)
- **Root directory:** this folder if the site lives in a monorepo subpath

## After go-live checklist

- [ ] Replace Privacy / Terms stubs with counsel-reviewed text before taking payments.
- [ ] Wire real product cards + Creem checkout links (remove “Coming soon” placeholders).
- [ ] Confirm `admin@craftlane.app` receives mail (or update the address).
- [ ] Optional: add `favicon.ico` / Open Graph image when brand assets exist.

## Local preview

Any static server, e.g.:

```bash
npx serve .
# or: python3 -m http.server 8080
```

Open `http://localhost:3000` (or the port shown).
