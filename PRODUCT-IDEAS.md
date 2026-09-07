# Craftlane Product Ideas

**Brand:** Craftlane ([craftlane.app](https://craftlane.app)) — indie digital tools & editor plugins for developers  
**Channel:** Creem (MoR, checkout, tax, license keys) → overseas buyers  
**Ops model:** AI assistant builds & runs on a **CPU-only Linux box** (no GPU, **no inbound public IP**). Public surface = **static downloads** and/or **Cloudflare Pages/Workers** + Creem license keys. Human in China: **KYC / Creem registration only**.

**Delivery patterns (allowed):**
- Static zip/tarball / VS Code VSIX on R2 or Pages (signed download URL after Creem purchase)
- Cloudflare Pages marketing + Worker APIs (egress-only from box; deploy via `wrangler`)
- License activation/validate via Creem API (Worker or CLI phones home to Creem, not to the box)

---

## Ideas (10)

### 1. RuleLane Packs
| Field | Detail |
| --- | --- |
| **Pitch** | Curated `.cursorrules`, Claude Code skills, and agent prompt packs that actually ship production-ready defaults for Next.js, Python, and Go. |
| **Deliverable** | Static zip + optional Pages catalog; Creem one-time license unlocks download. |
| **Effort** | **S** |
| **Price** | **$19** single pack / **$49** "All Packs" bundle |
| **Why it sells** | Cursor/Claude Code users pay for better defaults; content is the product; competitors are noisy free gists. |
| **Autonomy** | **Yes** — bot authors packs, versions zips, updates Pages, issues keys via Creem; human only for KYC. |

### 2. DiffCommit
| Field | Detail |
| --- | --- |
| **Pitch** | VS Code / Cursor extension that drafts conventional commit messages from the staged diff using local heuristics (no GPU, optional user-BYO API key). |
| **Deliverable** | VSIX + marketplace/private download; Creem license key gates Pro features. |
| **Effort** | **M** |
| **Price** | **$29** lifetime (1–3 seats) |
| **Why it sells** | Daily friction for every git user; clear before/after demo; indie pricing beats SaaS commit tools. |
| **Autonomy** | **Yes after setup** — bot builds, signs releases, bumps versions, answers support from templates; optional LLM calls use *buyer's* key. |

### 3. EdgeOG
| Field | Detail |
| --- | --- |
| **Pitch** | Drop-in Cloudflare Worker that renders Open Graph / social cards from URL params or Markdown (Satori / resvg — CPU, edge). |
| **Deliverable** | Worker template + hosted multi-tenant Worker (license to API key); Pages docs. |
| **Effort** | **M** |
| **Price** | **$9/mo** or **$79** lifetime (fair-use rate limits) |
| **Why it sells** | Every indie site needs OG images; self-host is annoying; Workers are cheap and fast worldwide. |
| **Autonomy** | **Yes** — bot deploys Workers, rotates keys, monitors CF analytics via API; no inbound IP on the box. |

### 4. SchemaShip CLI
| Field | Detail |
| --- | --- |
| **Pitch** | One CLI: OpenAPI/JSON Schema to Zod, TS types, FastAPI models. Offline-friendly. |
| **Deliverable** | Cross-platform CLI and registry package; sold via checkout. |
| **Effort** | **M** |
| **Price** | **$39** lifetime |
| **Why it sells** | Type drift across API boundaries; teams pay once for reliable codegen. |
| **Autonomy** | **Yes** — bot owns generators, builds, and R2/Pages publishes. |

### 5. FormLane Worker
| Field | Detail |
| --- | --- |
| **Pitch** | Edge Worker for spam-resistant contact/waitlist forms posting to chat apps or a custom endpoint — no origin server. |
| **Deliverable** | Worker template + Pages landing with embed snippet; checkout unlocks deploy script. |
| **Effort** | **S** |
| **Price** | **$29** lifetime (or **$5/mo** higher limits) |
| **Why it sells** | Replaces Formspree/Basin for simple sites; developers prefer owning the Worker. |
| **Autonomy** | **Yes** — bot ships template updates, validates at edge via Creem, no box inbound. |

### 6. ShipNotes
| Field | Detail |
| --- | --- |
| **Pitch** | CLI + GitHub Action that turns conventional commits into polished release notes and CHANGELOG.md. |
| **Deliverable** | Registry CLI + Action YAML; Pro templates gated after checkout. |
| **Effort** | **S** |
| **Price** | **$19** lifetime |
| **Why it sells** | Release-day busywork; Action installs in 2 minutes; clear demo GIFs. |
| **Autonomy** | **Yes** — pure text tooling; bot owns releases and docs. |

### 7. EnvSeal
| Field | Detail |
| --- | --- |
| **Pitch** | Tiny CLI to age-encrypt .env files for sharing across machines/CI without dumping secrets in chat. |
| **Deliverable** | Cross-platform CLI + docs site; personal vs team tiers. |
| **Effort** | **S** |
| **Price** | **$15** personal / **$49** team |
| **Why it sells** | Universal pain; age is trusted; packaging + UX is the product. |
| **Autonomy** | **Yes** — offline crypto, no hosted secrets on Craftlane; bot ships releases only. |

### 8. SnipLane
| Field | Detail |
| --- | --- |
| **Pitch** | Premium VS Code / Cursor snippet packs for Next.js, Tailwind, Drizzle, and tRPC — opinionated and kept current. |
| **Deliverable** | Editor extension or importable snippets archive after checkout. |
| **Effort** | **S** |
| **Price** | **$12** pack / **$29** bundle |
| **Why it sells** | Low price, impulse buy; stacks change yearly so packs refresh. |
| **Autonomy** | **Yes** — content product; bot refreshes packs when frameworks bump. |

### 9. CreemGate Kit
| Field | Detail |
| --- | --- |
| **Pitch** | Complete starter: Cloudflare Pages + Worker gate + Creem checkout + signed object storage assets — the kit Craftlane itself uses. |
| **Deliverable** | Private template repo + setup guide; one-time checkout. |
| **Effort** | **M** |
| **Price** | **$79** |
| **Why it sells** | Indie hackers want to sell a product tomorrow; MoR + gate wiring is the hard part. Dogfoods Craftlane stack. |
| **Autonomy** | **Mostly** — bot maintains template; buyers self-host on their CF accounts; support is docs-first. |

### 10. Lockfile Atlas
| Field | Detail |
| --- | --- |
| **Pitch** | Browser tool on Pages with WASM: drop a lockfile, get an interactive dep graph, notice summary, and duplicate finder. |
| **Deliverable** | Cloudflare Pages SPA; Pro unlock via Creem after checkout. |
| **Effort** | **L** |
| **Price** | **$24** lifetime |
| **Why it sells** | Visual what-am-I-shipping for audits; works in-browser. |
| **Autonomy** | **Yes after MVP** — static app, no GPU; bot ships Pages deploys; heavier parser work upfront. |

---

## Comparison matrix

| # | Name | Format | Effort | Price | Autonomy |
| --- | --- | --- | --- | --- | --- |
| 1 | RuleLane Packs | Static zip + Pages | S | $19–49 | Excellent |
| 2 | DiffCommit | VSIX + key | M | $29 | Excellent |
| 3 | EdgeOG | CF Worker + docs | M | $9/mo or $79 | Excellent |
| 4 | SchemaShip CLI | CLI + registry | M | $39 | Excellent |
| 5 | FormLane Worker | Worker template | S | $29 | Excellent |
| 6 | ShipNotes | CLI + GH Action | S | $19 | Excellent |
| 7 | EnvSeal | CLI | S | $15–49 | Excellent |
| 8 | SnipLane | Snippets / extension | S | $12–29 | Excellent |
| 9 | CreemGate Kit | Repo template | M | $79 | Good |
| 10 | Lockfile Atlas | Pages SPA | L | $24 | Good |

---

## Top 3 recommended for MVP (first week)

Ranked for speed to first Creem sale, fit with craftlane.app positioning, CPU/no-inbound constraints, and bot-operable after KYC.

### 1. RuleLane Packs — ship day 1–2
- Smallest build: research + write packs + zip + Pages product page + Creem product.
- Matches tools for developers / Cursor positioning already on the site.
- Zero runtime infra risk; pure content + file delivery.
- Upsell path: bundle then DiffCommit / SnipLane later.

### 2. FormLane Worker — ship day 2–4
- Clear paid alternative to Formspree; demo embed on craftlane.app.
- Entire public surface on Cloudflare; box only runs wrangler outbound.
- Creem key to Worker API token is a reusable pattern for later products (EdgeOG, CreemGate).

### 3. ShipNotes — ship day 3–5
- Narrow CLI + one GitHub Action; easy GIF demo for social / Product Hunt.
- Complements RuleLane audience (ship-focused developers).
- Sets up registry publish + key-check muscle for SchemaShip / EnvSeal.

**Defer for week 2+:** DiffCommit (extension review friction), EdgeOG (rate-limit/abuse design), CreemGate Kit (needs RuleLane/FormLane patterns proven), Lockfile Atlas (L effort).

---

## Operating notes for the bot

1. **Human:** Creem KYC, Cloudflare account, domain DNS for craftlane.app.
2. **Bot:** product code, wrangler deploys, R2/Pages assets, Creem product/price/key config via API, changelog, support macros.
3. **Never:** open inbound ports on the box; host buyer data on the box; call GPU APIs billed to Craftlane without caps; scrape copyrighted snippet corpora into packs.
4. **Key flow:** Creem checkout to Worker webhook to issue file token or activate key; CLI/extension validates with Creem (not the Linux box).

---

*Generated for Craftlane MVP planning — 2026-09-07 (Asia/Shanghai).*
