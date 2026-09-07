# AGENTS.md — Python / FastAPI / pytest

Guidance for coding agents working in this repository.

## Mission
Deliver typed, testable Python services and libraries with clear boundaries, safe defaults, and tooling that fits uv or poetry workflows already in the repo.

## Before you write code
1. Read `pyproject.toml` (and lockfile) for Python version, deps, and tool config (Ruff, mypy/pyright, pytest).
2. Detect package layout (`src/` vs flat) and follow it.
3. Prefer extending existing routers/modules over new top-level packages.

## Implementation rules
- **Type everything public.** Parse external JSON into Pydantic (or project-standard) models.
- **Settings from env** — no hardcoded hosts, keys, or DSN fragments in code.
- **FastAPI:** thin routes, fat services; `Depends` for shared resources; explicit status codes.
- **Errors:** domain exceptions → mapped HTTP responses; never silent `except Exception`.
- **Async:** don't block the loop; use async DB/HTTP clients consistently inside `async def`.
- **SQL:** parameterized only; migrations via the project's tool (Alembic, etc.) when schema changes.

## Testing rules
- Add or update pytest coverage for behavior you change.
- Use dependency overrides in API tests; keep unit tests network-free.
- Fixtures over copy-pasted setup.

## File touch etiquette
- Keep diffs focused. Don't reformat untouched modules.
- Update `AGENTS.md` only for durable process changes.

## Done means
- [ ] Types check under the project's checker (when configured)
- [ ] Ruff/lint clean for touched files (when configured)
- [ ] Relevant pytest targets pass
- [ ] No secrets in the diff; no debug prints left in library paths
- [ ] Migrations included if schema changed

## Out of scope unless asked
- Switching uv ↔ poetry ↔ pip wholesale
- Rewriting sync services as async (or the reverse) without need
- Major framework migrations

## Security defaults
Validate input. Authorize per resource. Parameterize SQL. Keep secrets in the environment. Log carefully.
