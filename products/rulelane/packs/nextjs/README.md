# RuleLane — Next.js Pack

**Version:** 0.1.0  
**Stack focus:** Next.js App Router · TypeScript · Tailwind CSS  

Curated editor/agent rules so Cursor (and similar) default to production-minded Next.js patterns instead of generic React advice.

## What's inside

| File | Role |
|------|------|
| `.cursorrules` | Project-level rules Cursor reads automatically when placed at the repo root (or project root you open). |
| `AGENTS.md` | Agent-oriented checklist (mission, done criteria, security defaults). Works with tools that look for `AGENTS.md`. |
| `README.md` | This install guide. |

## Install in Cursor

1. Unzip this pack.
2. Copy `.cursorrules` and `AGENTS.md` into the **root of your Next.js project** (same folder as `package.json`).
3. Open the project in Cursor. New Agent / Chat sessions should pick up `.cursorrules`.
4. Optional: if you already have a `.cursorrules` or `.cursor/rules`, merge the sections you want instead of overwriting — keep your project-specific paths and naming.

### Cursor Rules UI (newer Cursor)

Some Cursor builds prefer rules under `.cursor/rules/`. You can:

- Keep `.cursorrules` at the root (widely supported), **or**
- Create `.cursor/rules/rulelane-nextjs.mdc` (or `.md`) and paste the contents of `.cursorrules` / `AGENTS.md` into rule files with appropriate globs (`app/**/*`, `components/**/*`, etc.).

## Install in VS Code / Copilot Chat

1. Copy `AGENTS.md` to the project root (many agents discover it).
2. For Copilot: add key bullets from `.cursorrules` into `.github/copilot-instructions.md` if you use that file.
3. For Continue / other extensions: point custom system prompts at `AGENTS.md`.

## Customize

- Replace generic folder names (`lib/`, `server/`) with your real layout.
- Add one short section for your auth provider (Clerk, Auth.js, Supabase, etc.).
- Delete pitfalls that don't apply; keep the security checklist.

## License (purchase)

Personal and commercial use in your projects is allowed after purchase from Craftlane. Redistribution of the pack files as a competing product is not allowed. See craftlane.app Terms.

## Support

admin@craftlane.app — include pack name + version (`nextjs` / `0.1.0`).
