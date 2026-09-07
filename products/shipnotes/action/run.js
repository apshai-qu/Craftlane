#!/usr/bin/env node
"use strict";

/**
 * Thin GitHub Action wrapper around the ShipNotes CLI.
 * Reads INPUT_* env vars set by action.yml and invokes the CLI.
 */
const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");

function appendOutput(name, value) {
  const out = process.env.GITHUB_OUTPUT;
  if (!out) return;
  const safe = String(value).replace(/\n/g, "%0A");
  fs.appendFileSync(out, `${name}=${safe}\n`);
}

function git(args) {
  try {
    return execFileSync("git", args, {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    }).trim();
  } catch {
    return "";
  }
}

function previousTag(currentTag) {
  // Prefer the tag immediately older than current on the history
  if (currentTag) {
    const list = git(["describe", "--tags", "--abbrev=0", `${currentTag}^`]);
    if (list) return list;
  }
  const tags = git(["tag", "--sort=-creatordate", "--list"])
    .split("\n")
    .map((t) => t.trim())
    .filter(Boolean);
  if (!tags.length) return "";
  if (currentTag && tags[0] === currentTag) return tags[1] || "";
  return tags[0] || "";
}

const cliBin = process.argv[2];
if (!cliBin || !fs.existsSync(cliBin)) {
  console.error("shipnotes action: CLI binary path missing");
  process.exit(1);
}

let since = (process.env.INPUT_SINCE || "").trim();
let tag = (process.env.INPUT_TAG || "").trim();
let outfile = (process.env.INPUT_OUTFILE || "RELEASE_NOTES.md").trim();
let version = (process.env.INPUT_VERSION || "").trim();

const refType = process.env.GITHUB_REF_TYPE || "";
const refName = process.env.GITHUB_REF_NAME || "";

if (!version && refType === "tag" && refName) {
  version = refName.replace(/^v/, "");
}

// On tag push with no explicit --tag, use previous tag as lower bound
if (!tag && !since && refType === "tag" && refName) {
  tag = previousTag(refName);
}

const args = [];
if (since) args.push("--since", since);
if (tag) args.push("--tag", tag);
if (outfile) args.push("--outfile", outfile);
if (version) args.push("--version", version);

const md = execFileSync("node", [cliBin, ...args], {
  encoding: "utf8",
  stdio: ["ignore", "pipe", "pipe"],
  env: { ...process.env, SHIPNOTES_VERSION: version || process.env.SHIPNOTES_VERSION },
});

const outPath = path.resolve(process.cwd(), outfile);
appendOutput("notes-path", outPath);
const preview = md.length > 60000 ? md.slice(0, 60000) + "\n…(truncated)" : md;
appendOutput("notes", preview);

process.stdout.write(md);
