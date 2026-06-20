#!/usr/bin/env node
// Validates every changed folder under f1/ against the submission rules in
// CONTRIBUTING.md. Zero npm dependencies on purpose — this must be able to
// run with nothing installed beyond Node itself, since we never run
// `npm install` against anything under f1/.
//
// Usage: node validate-portfolios.mjs <folder1> <folder2> ...
// Each <folderN> is a path like "f1/jane-doe-minimalist".
// Exits non-zero if any folder fails validation.

import fs from "node:fs";
import path from "node:path";

const REQUIRED_FIELDS = [
  "name",
  "title",
  "slug",
  "type",
  "description",
  "tech",
  "github",
  "screenshot",
];
const VALID_TYPES = ["static", "prebuilt", "external"];
const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const MAX_FOLDER_BYTES = 15 * 1024 * 1024; // 15 MB — generous enough for a prebuilt dist/ with a few images
const MAX_DESCRIPTION_CHARS = 200;

const folders = process.argv.slice(2).filter(Boolean);

if (folders.length === 0) {
  console.log("No portfolio folders changed — nothing to validate.");
  process.exit(0);
}

let hasErrors = false;
const report = [];

function fail(folder, message) {
  hasErrors = true;
  report.push(`❌ \`${folder}\`: ${message}`);
}

function pass(folder, message) {
  report.push(`✅ \`${folder}\`: ${message}`);
}

function dirSizeBytes(dir) {
  let total = 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      total += dirSizeBytes(full);
    } else if (entry.isFile()) {
      total += fs.statSync(full).size;
    }
  }
  return total;
}

for (const folder of folders) {
  const folderName = path.basename(folder);

  if (folderName === "_template") {
    continue; // template folder is not a submission
  }

  if (!fs.existsSync(folder) || !fs.statSync(folder).isDirectory()) {
    // Folder was deleted in this PR — nothing to validate.
    continue;
  }

  if (!SLUG_PATTERN.test(folderName)) {
    fail(
      folder,
      "folder name must be lowercase, hyphen-separated (e.g. `jane-doe-minimalist`)"
    );
    continue;
  }

  const manifestPath = path.join(folder, "portfolio.json");
  if (!fs.existsSync(manifestPath)) {
    fail(folder, "missing `portfolio.json`");
    continue;
  }

  let manifest;
  try {
    manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  } catch (err) {
    fail(folder, `\`portfolio.json\` is not valid JSON (${err.message})`);
    continue;
  }

  for (const field of REQUIRED_FIELDS) {
    if (
      manifest[field] === undefined ||
      manifest[field] === null ||
      manifest[field] === ""
    ) {
      fail(folder, `\`portfolio.json\` is missing required field \`${field}\``);
    }
  }
  if (hasErrors && !manifest.slug) continue;

  if (manifest.slug && manifest.slug !== folderName) {
    fail(
      folder,
      `\`slug\` ("${manifest.slug}") must exactly match the folder name ("${folderName}")`
    );
  }

  if (manifest.type && !VALID_TYPES.includes(manifest.type)) {
    fail(
      folder,
      `\`type\` must be one of ${VALID_TYPES.join(", ")} — got "${manifest.type}"`
    );
  }

  if (
    typeof manifest.description === "string" &&
    manifest.description.length > MAX_DESCRIPTION_CHARS
  ) {
    fail(
      folder,
      `\`description\` is ${manifest.description.length} characters — keep it under ${MAX_DESCRIPTION_CHARS}`
    );
  }

  if (manifest.tech && !Array.isArray(manifest.tech)) {
    fail(folder, "`tech` must be an array of strings");
  }

  const screenshotPath = path.join(folder, manifest.screenshot || "preview.png");
  if (!fs.existsSync(screenshotPath)) {
    fail(folder, `screenshot file \`${manifest.screenshot || "preview.png"}\` not found`);
  }

  // Type-specific structural checks
  if (manifest.type === "external") {
    if (!manifest.demo_url) {
      fail(folder, '`type` is "external" but `demo_url` is empty');
    }
  }

  if (manifest.type === "static") {
    if (!fs.existsSync(path.join(folder, "index.html"))) {
      fail(folder, '`type` is "static" but no `index.html` was found at the folder root');
    }
    if (fs.existsSync(path.join(folder, "package.json"))) {
      fail(
        folder,
        '`type` is "static" but a `package.json` is present — static submissions must have zero dependencies. Use `type: "prebuilt"` instead if you need a build step.'
      );
    }
  }

  if (manifest.type === "prebuilt") {
    const distPath = path.join(folder, "dist");
    if (!fs.existsSync(distPath) || !fs.statSync(distPath).isDirectory()) {
      fail(folder, '`type` is "prebuilt" but no `dist/` folder was found');
    } else if (!fs.existsSync(path.join(distPath, "index.html"))) {
      fail(folder, "`dist/` is missing an `index.html`");
    }
    if (fs.existsSync(path.join(distPath, "package.json"))) {
      fail(
        folder,
        "`dist/` should be a built static output, not source — found a `package.json` inside it"
      );
    }
  }

  // Never allow a node_modules folder to be committed by anyone
  if (fs.existsSync(path.join(folder, "node_modules"))) {
    fail(folder, "`node_modules/` must not be committed — add it to your own .gitignore");
  }
  if (fs.existsSync(path.join(folder, "source", "node_modules"))) {
    fail(folder, "`source/node_modules/` must not be committed");
  }

  // Size cap
  if (fs.existsSync(folder)) {
    const size = dirSizeBytes(folder);
    if (size > MAX_FOLDER_BYTES) {
      fail(
        folder,
        `folder is ${(size / 1024 / 1024).toFixed(2)} MB — must be under ${
          MAX_FOLDER_BYTES / 1024 / 1024
        } MB`
      );
    }
  }

  if (!hasErrors) {
    pass(folder, "all checks passed");
  }
}

console.log(report.join("\n"));

const summaryPath = process.env.GITHUB_STEP_SUMMARY;
if (summaryPath) {
  fs.appendFileSync(
    summaryPath,
    `## Portfolio validation\n\n${report.join("\n\n")}\n`
  );
}

process.exit(hasErrors ? 1 : 0);
