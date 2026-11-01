# Craftlane Dodo Payments (LIVE)

Checkout pattern: `https://checkout.dodopayments.com/buy/{id}`

Do not wire Buy buttons on craftlane.app until each product has its digital zip entitlement attached in Dodo.

## Live

| Product | ID | Price | Zip (box) | Status |
|---|---|---|---|---|
| RuleLane Next.js Pack | `pdt_0NnVdeofw7i3pLaHSOebo` | $19 | `/workspace/craftlane-site/dist/rulelane-nextjs-v0.1.0.zip` | Checkout page live; confirm zip attached before wiring Buy |

## Create + attach (pending)

| Product | Price | Zip (box) | Suggested description |
|---|---|---|---|
| RuleLane Python Pack | $19 | `dist/rulelane-python-v0.1.0.zip` | Curated Cursor rules and AGENTS.md for modern Python, FastAPI, typing, pytest. Digital download zip. |
| RuleLane Go Pack | $19 | `dist/rulelane-go-v0.1.0.zip` | Curated Cursor rules and AGENTS.md for idiomatic Go services, errors, tests. Digital download zip. |
| RuleLane All Packs | $49 | `dist/rulelane-all-v0.1.0.zip` | All three RuleLane packs (Next.js, Python, Go) in one zip. Digital download. |
| FormLane Worker | $29 | `dist/formlane-worker-v0.1.0.zip` | Spam-resistant contact/waitlist Cloudflare Worker template. Digital download zip. |
| ShipNotes | $19 | `dist/shipnotes-v0.1.0.zip` | CLI + GitHub Action: conventional commits to release notes / CHANGELOG. Digital download zip. |

All six zips rebuilt 2026-10-30 (Asia/Shanghai) under `/workspace/craftlane-site/dist/`.

## After Dodo products are complete

1. Fill product IDs into this file.
2. Point each product page Buy button to `https://checkout.dodopayments.com/buy/{id}` (replace mailto placeholders).
3. Update homepage Featured line from "checkout links landing soon" to live.
4. Redeploy Cloudflare Pages from `craftlane-site` (or public zip without paid source trees).

## Blocker

Dodo dashboard login / 2FA needs the user in chat (desktop handoff). No API key on the box yet.
