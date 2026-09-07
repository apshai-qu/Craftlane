# AGENTS.md — Idiomatic Go services

Guidance for coding agents working in this repository.

## Mission
Write clear, tested Go with explicit error handling, context-aware concurrency, and boring, reliable service boundaries.

## Before you write code
1. Read `go.mod` and existing `cmd/` + `internal/` layout.
2. Prefer extending an existing package over creating a new top-level one.
3. Note how logging, config, and HTTP are already wired — match them.

## Implementation rules
- **`gofmt`/`goimports` clean** on every change.
- **Context first** on functions that do I/O or may be canceled.
- **Wrap errors** with `%w` and stable messages; branch with `errors.Is` / `As`.
- **Interfaces at the consumer** — don't invent large interfaces up front.
- **Tables for tests**; `httptest` for handlers; fakes for narrow deps.
- **Timeouts** on servers and clients; cancel goroutines on shutdown.

## File touch etiquette
- Keep `main` thin. Business logic lives under `internal/`.
- No drive-by refactors or dependency bumps.
- Update this file only when process defaults change.

## Done means
- [ ] `gofmt` / `goimports` applied
- [ ] `go test ./…` (or affected packages) pass
- [ ] `go test -race` for concurrency-sensitive packages when practical
- [ ] `go vet` clean on touched packages
- [ ] No secrets in the diff; errors handled or explicitly justified

## Out of scope unless asked
- Rewriting the service onto a different framework
- Changing the module path
- Large dependency major-version upgrades

## Security defaults
Validate input. Use TLS where appropriate. Bound outbound time. Parameterize SQL. Keep secrets out of VCS and logs.
