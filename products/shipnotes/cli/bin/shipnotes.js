#!/usr/bin/env node
"use strict";

const { run } = require("../lib/cli");

run(process.argv.slice(2)).catch((err) => {
  console.error(`shipnotes: ${err.message || err}`);
  process.exit(1);
});
