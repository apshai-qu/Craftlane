"use strict";

const { execFileSync } = require("child_process");

function runGit(args, cwd) {
  try {
    return execFileSync("git", args, {
      cwd: cwd || process.cwd(),
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
      maxBuffer: 16 * 1024 * 1024,
    });
  } catch (err) {
    const stderr = (err.stderr && String(err.stderr).trim()) || err.message;
    throw new Error(`git ${args.join(" ")} failed: ${stderr}`);
  }
}

function looksLikeDate(s) {
  return (
    /^\d{4}-\d{2}-\d{2}/.test(s) ||
    /^(yesterday|today|[0-9]+\s+(day|week|month|year)s?\s+ago)$/i.test(s)
  );
}

/**
 * Fetch commit records as "hash|subject\\nbody" chunks separated by ==END==.
 */
function fetchCommits({ tag, since, cwd } = {}) {
  const args = [
    "log",
    "--no-merges",
    "--pretty=format:%h|%s%n%b%n==END==",
  ];

  if (since && looksLikeDate(since)) {
    args.push(`--since=${since}`);
    if (tag) args.push(`${tag}..HEAD`);
  } else if (since && !looksLikeDate(since)) {
    const upper = tag || "HEAD";
    args.push(`${since}..${upper}`);
  } else if (tag) {
    args.push(`${tag}..HEAD`);
  }

  const out = runGit(args, cwd);
  return out
    .split(/\n==END==\n?/)
    .map((c) => c.trim())
    .filter(Boolean);
}

function detectLatestTag(cwd) {
  try {
    const tags = runGit(["tag", "--sort=-creatordate", "--list"], cwd)
      .split("\n")
      .map((t) => t.trim())
      .filter(Boolean);
    return tags[0] || null;
  } catch {
    return null;
  }
}

module.exports = {
  fetchCommits,
  detectLatestTag,
  looksLikeDate,
  runGit,
};
