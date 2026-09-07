# ShipNotes

**Version:** 0.1.0
**By:** [Craftlane](https://craftlane.app)

CLI + GitHub Action that turns **conventional commits** into polished **release notes** and CHANGELOG.md sections. No GPU, no API key, no network call — just git history and markdown.

## What is in this zip

- `cli/` — Node.js CLI (Node 18+), entry at `cli/bin/shipnotes.js`
- `action/` — GitHub Action composite (`action.yml` + `run.js`) and `example-workflow.yml`
- `README.md` — this file

## Install (CLI)

Requires Node.js 18+ and git on PATH.

From the unzipped folder run: node cli/bin/shipnotes.js --help
Optional local install: link the cli package or add a shell alias to the entry script.

## CLI usage

Examples:
- shipnotes --tag v1.0.0
- shipnotes --since 2026-08-01 --version 0.2.0
- shipnotes --outfile CHANGELOG.md
- pipe git log into shipnotes --stdin

### Flags

- --since date or rev
- --tag TAG (range TAG..HEAD)
- --outfile PATH (CHANGELOG.md prepends when file exists)
- --version VER
- --title TEXT
- --stdin
- --cwd PATH
- -h / --help

### Commit shape

Understands Conventional Commits: feat, fix, docs, refactor, perf, test, build, ci, chore, revert, plus breaking markers (! or BREAKING CHANGE footers).

Output groups: Breaking changes, Features, Fixes, Performance, Refactors, Docs, Tests, Build, CI, Chores, and Other.

## GitHub Action usage

1. Copy cli/ and action/ into your repo (for example under .github/shipnotes/).
2. Add a workflow based on action/example-workflow.yml.
3. Typical triggers: push tags matching v*, and workflow_dispatch.
4. Checkout with fetch-depth 0, setup Node 20, then uses: ./.github/shipnotes/action with outfile CHANGELOG.md.

### Action inputs

- since — date or revision lower bound
- tag — lower-bound tag; on tag pushes defaults to the previous tag
- outfile — default RELEASE_NOTES.md; CHANGELOG.md prepends
- version — heading version (defaults to tag name on tag pushes)
- working-directory — default .

### Outputs

- notes-path — absolute path written
- notes — markdown body (may be truncated in GITHUB_OUTPUT)

## License

Purchased from Craftlane. Personal and commercial use in your projects is fine. Do not resell or redistribute the product as a competing release-notes tool. See craftlane.app/terms.html.

## Support

admin@craftlane.app
