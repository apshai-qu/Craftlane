# RuleLane — Go Pack

**Version:** 0.1.0  
**Stack focus:** idiomatic Go services · testing · error handling  

Curated editor/agent rules so Cursor defaults to Go conventions: wrapped errors, context, table-driven tests, and service layout that stays maintainable.

## What's inside

| File | Role |
|------|------|
| `.cursorrules` | Project-level rules for Cursor at the module root. |
| `AGENTS.md` | Agent checklist: mission, testing, security, done criteria. |
| `README.md` | This install guide. |

## Install in Cursor

1. Unzip this pack.
2. Copy `.cursorrules` and `AGENTS.md` into your **Go module root** (same folder as `go.mod`).
3. Open the module in Cursor so Agent/Chat sessions load `.cursorrules`.
4. Merge with any existing rules — preserve your module path, deploy targets, and package names.

### Cursor Rules UI (newer Cursor)

Optionally add `.cursor/rules/` entries with globs like `**/*.go`, `cmd/**/*`, `internal/**/*`.

## Install in VS Code / Copilot Chat

1. Keep `AGENTS.md` at the module root.
2. Copilot: copy high-signal bullets into `.github/copilot-instructions.md` if you use it.
3. Point Continue (or similar) at `AGENTS.md` for custom system prompts.

## Customize

- Document your router choice (stdlib mux, chi, echo, etc.) in one line so agents don't swap it.
- Note SQL driver / migrate tool if present.
- Add team conventions for logging fields (request ID, tenant ID).

## License (purchase)

Personal and commercial use in your projects after purchase from Craftlane. Do not redistribute the pack as a competing product. See craftlane.app Terms.

## Support

admin@craftlane.app — include pack name + version (`go` / `0.1.0`).
