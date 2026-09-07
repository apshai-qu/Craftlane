"use strict";

const fs = require("fs");
const path = require("path");
const { parseCommitLines } = require("./parse");
const { formatNotes } = require("./format");
const { fetchCommits } = require("./git");

const HELP = `ShipNotes — conventional commits → polished release notes

Usage:
  shipnotes [options]
  git log ... | shipnotes [options]

Options:
  --since <date|rev>   Only commits after a date (e.g. 2026-01-01) or revision
  --tag <tag>          Only commits after this tag (tag..HEAD)
  --outfile <path>     Write markdown to a file (also prints to stdout)
  --version <ver>      Version label in the heading (e.g. 1.2.0)
  --title <text>       Override the heading title
  --stdin              Read commits from stdin (default when stdin is a pipe)
  --cwd <path>         Git working directory (default: process cwd)
  -h, --help           Show help

Examples:
  shipnotes --tag v1.0.0 --outfile CHANGELOG.section.md
  shipnotes --since 2026-08-01 --version 0.2.0
  git log v1.0.0..HEAD --pretty=format:'%h %s' | shipnotes --stdin
`;

function parseArgs(argv) {
  const opts = {
    since: null,
    tag: null,
    outfile: null,
    version: null,
    title: null,
    stdin: false,
    cwd: process.cwd(),
    help: false,
  };

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const next = () => {
      const v = argv[++i];
      if (v == null || v.startsWith("-")) {
        throw new Error(`missing value for ${a}`);
      }
      return v;
    };

    switch (a) {
      case "-h":
      case "--help":
        opts.help = true;
        break;
      case "--since":
        opts.since = next();
        break;
      case "--tag":
        opts.tag = next();
        break;
      case "--outfile":
      case "-o":
        opts.outfile = next();
        break;
      case "--version":
        opts.version = next();
        break;
      case "--title":
        opts.title = next();
        break;
      case "--stdin":
        opts.stdin = true;
        break;
      case "--cwd":
        opts.cwd = path.resolve(next());
        break;
      default:
        throw new Error(`unknown option: ${a}\n\n${HELP}`);
    }
  }
  return opts;
}

function readStdin() {
  return new Promise((resolve, reject) => {
    const chunks = [];
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (c) => chunks.push(c));
    process.stdin.on("end", () => resolve(chunks.join("")));
    process.stdin.on("error", reject);
  });
}

function stdinIsPipe() {
  return Boolean(process.stdin.isTTY === false);
}

function prependChangelog(existing, section) {
  const trimmed = existing.replace(/^\uFEFF/, "");
  const m = trimmed.match(/^(#\s*Changelog[^\n]*\n+)([\s\S]*)$/i);
  if (m) {
    return `${m[1]}${section}\n${m[2].replace(/^\n+/, "")}`;
  }
  return `${section}\n${trimmed}`;
}

async function run(argv) {
  const opts = parseArgs(argv);
  if (opts.help) {
    process.stdout.write(HELP);
    return;
  }

  const useStdin = opts.stdin || stdinIsPipe();
  let commits;

  if (useStdin) {
    const raw = await readStdin();
    if (!raw.trim()) {
      throw new Error("stdin was empty — pipe git log output or drop --stdin");
    }
    commits = parseCommitLines(raw);
  } else {
    const chunks = fetchCommits({
      tag: opts.tag,
      since: opts.since,
      cwd: opts.cwd,
    });
    commits = parseCommitLines(chunks.join("\n\n"));
  }

  let version = opts.version;
  if (!version && process.env.SHIPNOTES_VERSION) {
    version = process.env.SHIPNOTES_VERSION;
  }
  if (
    !version &&
    process.env.GITHUB_REF_TYPE === "tag" &&
    process.env.GITHUB_REF_NAME
  ) {
    version = process.env.GITHUB_REF_NAME.replace(/^v/, "");
  }

  const md = formatNotes(commits, {
    version,
    title: opts.title,
  });

  if (opts.outfile) {
    const outPath = path.isAbsolute(opts.outfile)
      ? opts.outfile
      : path.resolve(opts.cwd, opts.outfile);
    const dir = path.dirname(outPath);
    fs.mkdirSync(dir, { recursive: true });

    if (
      fs.existsSync(outPath) &&
      /changelog\.md$/i.test(path.basename(outPath))
    ) {
      const existing = fs.readFileSync(outPath, "utf8");
      fs.writeFileSync(outPath, prependChangelog(existing, md), "utf8");
    } else {
      fs.writeFileSync(outPath, md, "utf8");
    }
  }

  process.stdout.write(md);
}

module.exports = { run, parseArgs, prependChangelog };
