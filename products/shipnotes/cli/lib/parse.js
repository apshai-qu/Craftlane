"use strict";

/**
 * Parse a conventional-commit subject (and optional body) into a structured note.
 * Spec-ish: type(scope)!: subject
 */
const TYPE_RE =
  /^(?<type>feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(?:\((?<scope>[^)]+)\))?(?<breaking>!)?:\s*(?<subject>.+)$/i;

const BREAKING_BODY_RE = /^BREAKING CHANGE:\s*(.+)$/im;

function parseCommit(raw) {
  const text = String(raw || "").trim();
  if (!text) return null;

  const lines = text.split(/\r?\n/);
  const first = lines[0].trim();
  const body = lines.slice(1).join("\n").trim();

  let subjectLine = first;
  let hash = null;
  const pipe = first.match(/^([a-f0-9]{7,40})\|(.+)$/i);
  if (pipe) {
    hash = pipe[1];
    subjectLine = pipe[2].trim();
  } else {
    const spaced = first.match(/^([a-f0-9]{7,40})\s+(.+)$/i);
    if (spaced) {
      hash = spaced[1];
      subjectLine = spaced[2].trim();
    }
  }

  const m = subjectLine.match(TYPE_RE);
  if (!m) {
    return {
      hash,
      type: "other",
      scope: null,
      breaking: false,
      subject: subjectLine,
      body,
      raw: text,
    };
  }

  const type = m.groups.type.toLowerCase();
  const scope = m.groups.scope || null;
  let breaking = Boolean(m.groups.breaking);
  const subject = m.groups.subject.trim();

  if (BREAKING_BODY_RE.test(body)) breaking = true;

  return {
    hash,
    type,
    scope,
    breaking,
    subject,
    body,
    raw: text,
  };
}

function parseCommitLines(input) {
  const text = String(input || "").replace(/\r\n/g, "\n").trim();
  if (!text) return [];

  if (text.includes("\0")) {
    return text
      .split("\0")
      .map((c) => parseCommit(c))
      .filter(Boolean);
  }

  // Custom delimiter used by git fetch helper
  if (text.includes("\n==END==")) {
    return text
      .split(/\n==END==\n?/)
      .map((c) => parseCommit(c))
      .filter(Boolean);
  }

  const blocks = text.split(/\n{2,}/);
  if (blocks.length > 1 && blocks.some((b) => b.includes("\n"))) {
    return blocks.map((b) => parseCommit(b)).filter(Boolean);
  }

  return text
    .split("\n")
    .map((line) => parseCommit(line))
    .filter(Boolean);
}

module.exports = { parseCommit, parseCommitLines, TYPE_RE };
