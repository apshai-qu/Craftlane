# RuleLane — Python Pack

**Version:** 0.1.0  
**Stack focus:** Python 3.11+ · uv/poetry · FastAPI-oriented · typing · pytest  

Curated editor/agent rules for modern Python services and libraries—typed boundaries, safe defaults, and pytest habits agents actually follow.

## What's inside

| File | Role |
|------|------|
| `.cursorrules` | Project-level rules for Cursor at the repo root. |
| `AGENTS.md` | Agent checklist: mission, testing, security, done criteria. |
| `README.md` | This install guide. |

## Install in Cursor

1. Unzip this pack.
2. Copy `.cursorrules` and `AGENTS.md` into your **Python project root** (alongside `pyproject.toml`).
3. Open the folder in Cursor so Agent/Chat sessions load `.cursorrules`.
4. If you already maintain rules, merge sections instead of blind overwrite — keep your package name, test paths, and deploy notes.

### Cursor Rules UI (newer Cursor)

Optionally place content under `.cursor/rules/` as `.mdc`/`.md` files with globs such as `**/*.py`, `app/**/*`, `tests/**/*`.

## Install in VS Code / Copilot Chat

1. Keep `AGENTS.md` at the repo root.
2. Copilot users: mirror key bullets into `.github/copilot-instructions.md` if you use that convention.
3. Point Continue (or similar) custom prompts at `AGENTS.md`.

## Customize

- Note whether you use **uv** or **poetry** so agents don't flip tools.
- Add your auth scheme (JWT, session, API keys) in one short section.
- Point at your real package path (`src/myapp/…`).

## License (purchase)

Personal and commercial use in your projects after purchase from Craftlane. Do not redistribute the pack as a competing product. See craftlane.app Terms.

## Support

admin@craftlane.app — include pack name + version (`python` / `0.1.0`).
