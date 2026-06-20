#!/usr/bin/env node
// Parses a GitHub issue created from .github/ISSUE_TEMPLATE/portfolio-submission.yml
// and scaffolds a f1/<slug>/ folder + portfolio.json from it.
// Zero npm dependencies — same reasoning as validate-portfolios.mjs.
//
// Reads the issue body from the ISSUE_BODY env var.
// Prints the resulting slug to stdout on the last line (the workflow reads
// this to name the branch/PR).

import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const ISSUE_BODY = process.env.ISSUE_BODY || "";
const ISSUE_NUMBER = process.env.ISSUE_NUMBER || "0";

function parseIssueForm(body) {
  const fields = {};
  const blocks = body.split(/\n###\s+/).slice(1);
  for (const block of blocks) {
    const newlineIdx = block.indexOf("\n");
    const heading = (newlineIdx === -1 ? block : block.slice(0, newlineIdx)).trim();
    const value = newlineIdx === -1 ? "" : block.slice(newlineIdx + 1).trim();
    fields[heading] = value === "_No response_" ? "" : value;
  }
  return fields;
}

function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function typeFromDropdown(value) {
  if (!value) return "external";
  if (value.startsWith("static")) return "static";
  if (value.startsWith("prebuilt")) return "prebuilt";
  return "external";
}

function listFromCsv(value) {
  if (!value) return [];
  return value.split(",").map((s) => s.trim()).filter(Boolean);
}

// Field labels below must match .github/ISSUE_TEMPLATE/portfolio-submission.yml
// exactly (each `attributes.label` becomes a "### Label" heading in the
// rendered issue body).
const fields = parseIssueForm(ISSUE_BODY);

const name = fields["Your name"] || "Unknown";
const username = slugify(fields["Your GitHub username"] || "anonymous");
const shortSlug = slugify(fields["Short slug for your portfolio"] || `submission-${ISSUE_NUMBER}`);
const slug = `${username}-${shortSlug}`;
const title = fields["Portfolio title"] || "Untitled portfolio";
const description = (fields["Description"] || "").slice(0, 200);
const type = typeFromDropdown(fields["Submission type"]);
const tech = listFromCsv(fields["Technologies used"]);
const tags = listFromCsv(fields["Style tags (optional)"]);
const demoUrl = fields["Live demo URL"] || "";
const filesField = fields["Link to your files"] || "";

const folder = path.join("f1", slug);
fs.mkdirSync(folder, { recursive: true });

const zipMatch = filesField.match(/https:\/\/github\.com\/\S+?\.zip/);
let extracted = false;
if (zipMatch && (type === "static" || type === "prebuilt")) {
  const zipUrl = zipMatch[0];
  const zipPath = path.join(folder, "_upload.zip");
  try {
    execSync(`curl -sL "${zipUrl}" -o "${zipPath}"`, { stdio: "inherit" });
    execSync(`unzip -o -q "${zipPath}" -d "${folder}"`, { stdio: "inherit" });
    fs.unlinkSync(zipPath);
    extracted = true;
  } catch (err) {
    console.error(`Could not download/extract attached zip: ${err.message}`);
  }
}

if (!extracted && type !== "external") {
  fs.writeFileSync(
    path.join(folder, "NEEDS_FILES.md"),
    `This folder was scaffolded automatically from issue #${ISSUE_NUMBER}.\n\n` +
      `No files could be extracted automatically. Push your portfolio files ` +
      `to this branch to complete the submission, then delete this file.\n\n` +
      `Source link provided by submitter: ${filesField || "(none given)"}\n`
  );
}

const hasPreview = ["preview.png", "preview.jpg", "preview.svg"].some((f) =>
  fs.existsSync(path.join(folder, f))
);
let screenshotName = "preview.png";
if (!hasPreview) {
  screenshotName = "preview.svg";
  fs.writeFileSync(
    path.join(folder, screenshotName),
    `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="750">` +
      `<rect width="100%" height="100%" fill="#EEF0E8"/>` +
      `<text x="50%" y="50%" font-family="monospace" font-size="28" ` +
      `fill="#5C5F52" text-anchor="middle">preview pending — replace this file</text>` +
      `</svg>\n`
  );
}

const manifest = {
  name,
  title,
  slug,
  type,
  description: description || "Description pending.",
  tech: tech.length ? tech : ["unknown"],
  tags,
  github: `https://github.com/${username}`,
  demo_url: demoUrl,
  screenshot: screenshotName,
};

fs.writeFileSync(
  path.join(folder, "portfolio.json"),
  JSON.stringify(manifest, null, 2) + "\n"
);

console.log(`Scaffolded ${folder}`);
console.log(slug);
