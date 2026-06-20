#!/usr/bin/env node
// Scans ../f1 and produces data/portfolios.json + mirrors the *static,
// embeddable* assets into public/f1/. This is the only script that ever
// reads contributor folders — it never installs or executes anything found
// inside them, it only copies files and reads portfolio.json.
//
// Runs automatically before `npm run dev` and `npm run build` (see
// package.json's predev/prebuild hooks).

import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SITE_ROOT = path.resolve(__dirname, "..");
const REPO_ROOT = path.resolve(SITE_ROOT, "..");
const F1_DIR = path.join(REPO_ROOT, "f1");
const PUBLIC_F1_DIR = path.join(SITE_ROOT, "public", "f1");
const DATA_FILE = path.join(SITE_ROOT, "data", "portfolios.json");

function readJSONSafe(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return null;
  }
}

function gitAddedDate(relativePath) {
  try {
    const out = execSync(
      `git log --diff-filter=A --follow --format=%aI -- "${relativePath}" | tail -n 1`,
      { cwd: REPO_ROOT, stdio: ["ignore", "pipe", "ignore"] }
    )
      .toString()
      .trim();
    if (out) return out;
  } catch {
    // not a git repo yet, or no history — fall through
  }
  return null;
}

function copyDirContents(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      fs.cpSync(s, d, { recursive: true });
    } else {
      fs.copyFileSync(s, d);
    }
  }
}

function main() {
  if (!fs.existsSync(F1_DIR)) {
    console.warn(`No f1/ directory found at ${F1_DIR} — writing empty manifest.`);
    fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
    fs.writeFileSync(DATA_FILE, "[]\n");
    return;
  }

  // Clean slate so removed/renamed portfolios don't leave orphaned files.
  fs.rmSync(PUBLIC_F1_DIR, { recursive: true, force: true });
  fs.mkdirSync(PUBLIC_F1_DIR, { recursive: true });

  const folders = fs
    .readdirSync(F1_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory() && !e.name.startsWith("_") && !e.name.startsWith("."))
    .map((e) => e.name);

  const entries = [];

  for (const folderName of folders) {
    const folderPath = path.join(F1_DIR, folderName);
    const manifestPath = path.join(folderPath, "portfolio.json");
    const manifest = readJSONSafe(manifestPath);

    if (!manifest) {
      console.warn(`Skipping f1/${folderName} — missing or invalid portfolio.json`);
      continue;
    }
    if (!manifest.slug || manifest.slug !== folderName) {
      console.warn(`Skipping f1/${folderName} — slug doesn't match folder name`);
      continue;
    }

    const destDir = path.join(PUBLIC_F1_DIR, folderName);
    fs.mkdirSync(destDir, { recursive: true });

    // Always mirror the screenshot, used by the gallery card regardless of type.
    const screenshotName = manifest.screenshot || "preview.png";
    const screenshotSrc = path.join(folderPath, screenshotName);
    let screenshotUrl = null;
    if (fs.existsSync(screenshotSrc)) {
      fs.copyFileSync(screenshotSrc, path.join(destDir, screenshotName));
      screenshotUrl = `/f1/${folderName}/${screenshotName}`;
    }

    // Only mirror live, embeddable content — and only ever the *output*,
    // never a package.json or anything requiring install/build.
    let embeddable = false;
    if (manifest.type === "static") {
      copyDirContents(folderPath, destDir);
      embeddable = fs.existsSync(path.join(destDir, "index.html"));
    } else if (manifest.type === "prebuilt") {
      const distSrc = path.join(folderPath, "dist");
      if (fs.existsSync(distSrc)) {
        copyDirContents(distSrc, destDir);
        embeddable = fs.existsSync(path.join(destDir, "index.html"));
      }
      // Re-copy the screenshot in case it lived outside dist/ and got
      // skipped/overwritten by the copy above.
      if (fs.existsSync(screenshotSrc)) {
        fs.copyFileSync(screenshotSrc, path.join(destDir, screenshotName));
      }
    }
    // type === "external": nothing to mirror beyond the screenshot above.

    const addedAt =
      gitAddedDate(`f1/${folderName}/portfolio.json`) || new Date(0).toISOString();

    entries.push({
      name: manifest.name,
      title: manifest.title,
      slug: manifest.slug,
      type: manifest.type,
      description: manifest.description,
      tech: Array.isArray(manifest.tech) ? manifest.tech : [],
      tags: Array.isArray(manifest.tags) ? manifest.tags : [],
      github: manifest.github || "",
      demoUrl: manifest.demo_url || "",
      screenshotUrl,
      embeddable,
      embedUrl: embeddable ? `/f1/${folderName}/index.html` : null,
      addedAt,
    });
  }

  // Sort by submission order (oldest first) and assign accession numbers —
  // this is the numbering used throughout the site, and it's real data,
  // not decoration.
  entries.sort((a, b) => new Date(a.addedAt) - new Date(b.addedAt));
  entries.forEach((entry, i) => {
    entry.accession = String(i + 1).padStart(3, "0");
  });

  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(entries, null, 2) + "\n");
  console.log(`Wrote ${entries.length} portfolio(s) to data/portfolios.json`);
}

main();
