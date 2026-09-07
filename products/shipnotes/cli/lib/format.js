"use strict";

const SECTION_ORDER = [
  { key: "breaking", title: "Breaking changes" },
  { key: "feat", title: "Features" },
  { key: "fix", title: "Fixes" },
  { key: "perf", title: "Performance" },
  { key: "refactor", title: "Refactors" },
  { key: "docs", title: "Documentation" },
  { key: "test", title: "Tests" },
  { key: "build", title: "Build" },
  { key: "ci", title: "CI" },
  { key: "chore", title: "Chores" },
  { key: "revert", title: "Reverts" },
  { key: "style", title: "Style" },
  { key: "other", title: "Other" },
];

function groupCommits(commits) {
  const groups = Object.create(null);
  for (const s of SECTION_ORDER) groups[s.key] = [];

  for (const c of commits) {
    if (c.breaking) {
      groups.breaking.push(c);
      continue;
    }
    const bucket = groups[c.type] ? c.type : "other";
    groups[bucket].push(c);
  }
  return groups;
}

function bullet(c) {
  const scope = c.scope ? `**${c.scope}:** ` : "";
  const hash = c.hash ? ` (\`${c.hash.slice(0, 7)}\`)` : "";
  return `- ${scope}${c.subject}${hash}`;
}

function formatNotes(commits, options = {}) {
  const {
    version = null,
    date = new Date().toISOString().slice(0, 10),
    headingLevel = 2,
    title = null,
  } = options;

  const h = "#".repeat(Math.min(6, Math.max(1, headingLevel)));
  const groups = groupCommits(commits);

  let heading;
  if (title) {
    heading = `${h} ${title}`;
  } else if (version) {
    heading = `${h} ${version} — ${date}`;
  } else {
    heading = `${h} Release notes — ${date}`;
  }

  const parts = [heading, ""];

  let any = false;
  for (const { key, title: sectionTitle } of SECTION_ORDER) {
    const list = groups[key] || [];
    if (!list.length) continue;
    any = true;
    parts.push(`${h}# ${sectionTitle}`);
    parts.push("");
    for (const c of list) parts.push(bullet(c));
    parts.push("");
  }

  if (!any) {
    parts.push("_No conventional commits in this range._");
    parts.push("");
  }

  return parts.join("\n").replace(/\n{3,}/g, "\n\n").trim() + "\n";
}

module.exports = { formatNotes, groupCommits, SECTION_ORDER };
