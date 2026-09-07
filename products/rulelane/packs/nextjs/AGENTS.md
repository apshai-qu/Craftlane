# AGENTS.md — Next.js / TypeScript / Tailwind

Guidance for coding agents working in this repository.

## Mission
Ship correct, typed, accessible Next.js App Router features with minimal bundle cost and clear server/client boundaries.

## Before you write code
1. Identify whether the change belongs in a Server Component, Client Component, Server Action, or Route Handler.
2. Locate existing patterns in `app/`, `components/`, and `lib/` — copy structure before inventing new folders.
3. Confirm env vars needed (server-only vs `NEXT_PUBLIC_`).

## Implementation rules
- **Default to Server Components.** `"use client"` is an explicit opt-in.
- **Validate inputs** at the boundary (Zod schemas colocated near the action/route).
- **Authorize on the server** every time; never trust the client for permissions.
- **Tailwind utilities** in markup; extract components for repeated class clusters.
- **Types over `any`.** Prefer `unknown` + narrowing when parsing external data.
- **Errors:** use `error.tsx` for route segments; throw typed errors from actions that the UI can map to messages.
- **Loading:** add `loading.tsx` or `<Suspense>` for slow async sections.

## File touch etiquette
- Prefer editing existing files over adding parallel abstractions.
- Keep PRs/task diffs focused: feature + tests + types. No drive-by renames.
- Update this file only when durable process changes land.

## Done means
- [ ] `tsc --noEmit` clean (or project equivalent)
- [ ] Lint clean for touched files
- [ ] Manual or automated check of the happy path
- [ ] No secrets committed; no debug `console.log` left behind
- [ ] README / comments updated only if behavior is non-obvious

## Out of scope unless asked
- Migrating Pages Router → App Router wholesale
- Introducing a new CSS framework or state library
- Large dependency upgrades

## Security defaults
Treat every user input as hostile. Sanitize HTML. Check sessions inside mutations. Prefer httpOnly secure cookies for session tokens.
