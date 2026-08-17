#!/usr/bin/env node
/**
 * Figma thumbnails for project cards.
 *
 *   npm run figma:list    — show every file in your team, with its fileKey
 *   npm run figma:pull    — download thumbnails for files mapped in figma.config.json
 *
 * Why download rather than link: Figma's thumbnail URLs are signed and expire
 * within hours, so a linked URL 404s the same day. `pull` writes real files to
 * public/work/ and a manifest the app reads, so the images keep working.
 *
 * Credentials are read from the environment — put them in .env.local, which is
 * gitignored. Never commit a token.
 *
 *   FIGMA_TOKEN=figd_xxx        (Figma > Settings > Security > personal access token)
 *   FIGMA_TEAM_ID=123456789     (only needed for `list` — see below)
 */

import { writeFile, mkdir, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const API = "https://api.figma.com/v1";
const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, "public", "work");
const MANIFEST = path.join(ROOT, "data", "thumbnails.generated.json");
const CONFIG = path.join(ROOT, "figma.config.json");

const TOKEN = process.env.FIGMA_TOKEN;
const TEAM_ID = process.env.FIGMA_TEAM_ID;

const c = {
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
};

function die(msg) {
  console.error(`\n${c.red("✗")} ${msg}\n`);
  process.exit(1);
}

async function figma(endpoint) {
  const res = await fetch(`${API}${endpoint}`, {
    headers: { "X-Figma-Token": TOKEN },
  });
  if (res.status === 403) {
    die(
      "Figma rejected the token (403).\n" +
        "  Check FIGMA_TOKEN, and that the token's scopes include file read access."
    );
  }
  if (!res.ok) {
    die(`Figma API ${res.status} on ${endpoint}\n  ${await res.text()}`);
  }
  return res.json();
}

/* ── list ─────────────────────────────────────────────────────────
   Walks every project in the team and prints each file's key, so you
   can paste the ones you want into figma.config.json. */
async function list() {
  if (!TEAM_ID) {
    die(
      "FIGMA_TEAM_ID is not set.\n\n" +
        "  Open Figma in the browser and look at the URL while viewing your team:\n" +
        c.dim("    figma.com/files/team/") +
        c.bold("123456789") +
        c.dim("/Your-Team\n") +
        "                          ^^^^^^^^^ that number\n\n" +
        "  Then:  FIGMA_TEAM_ID=123456789 npm run figma:list"
    );
  }

  const { name, projects } = await figma(`/teams/${TEAM_ID}/projects`);
  console.log(`\n${c.bold(name ?? "Team")} — ${projects.length} project(s)\n`);

  for (const project of projects) {
    const { files } = await figma(`/projects/${project.id}/files`);
    console.log(c.bold(`  ${project.name}`) + c.dim(`  (${files.length} files)`));

    for (const file of files) {
      const modified = (file.last_modified ?? "").slice(0, 10);
      console.log(
        `    ${c.green(file.key.padEnd(24))} ${file.name}` + c.dim(`  ${modified}`)
      );
    }
    console.log();
  }

  console.log(
    c.dim("  Paste a key into figma.config.json against the matching project slug,\n") +
      c.dim("  then run: npm run figma:pull\n")
  );
}

/* ── pull ─────────────────────────────────────────────────────────
   Resolves a thumbnail URL per configured file and downloads it. */
async function thumbnailUrlFor({ fileKey, nodeId }) {
  if (nodeId) {
    // Rendering a chosen frame looks far better than the file thumbnail.
    const { images, err } = await figma(
      `/images/${fileKey}?ids=${encodeURIComponent(nodeId)}&format=png&scale=2`
    );
    if (err) throw new Error(`Figma render error: ${err}`);
    const url = images?.[nodeId];
    if (!url) {
      throw new Error(
        `No image returned for node ${nodeId}. Check the id uses a colon (1:23), not a dash.`
      );
    }
    return url;
  }

  const file = await figma(`/files/${fileKey}?depth=1`);
  if (!file.thumbnailUrl) throw new Error("File has no thumbnail yet.");
  return file.thumbnailUrl;
}

async function pull() {
  if (!existsSync(CONFIG)) die(`Missing ${path.relative(ROOT, CONFIG)}`);

  const config = JSON.parse(await readFile(CONFIG, "utf8"));
  const entries = Object.entries(config).filter(
    ([slug, v]) => !slug.startsWith("_") && v && v.fileKey
  );

  if (!entries.length) {
    die(
      "No fileKeys set in figma.config.json.\n" +
        "  Run `npm run figma:list` to see your files and their keys."
    );
  }

  await mkdir(OUT_DIR, { recursive: true });
  const manifest = {};
  let failures = 0;

  for (const [slug, { fileKey, nodeId }] of entries) {
    process.stdout.write(`  ${slug.padEnd(24)}`);
    try {
      const url = await thumbnailUrlFor({ fileKey, nodeId: nodeId || undefined });
      const res = await fetch(url);
      if (!res.ok) throw new Error(`download failed (${res.status})`);

      const buf = Buffer.from(await res.arrayBuffer());
      const rel = `/work/${slug}.png`;
      await writeFile(path.join(OUT_DIR, `${slug}.png`), buf);
      manifest[slug] = rel;

      console.log(c.green(`ok`) + c.dim(`  ${(buf.length / 1024).toFixed(0)}KB  ${rel}`));
    } catch (e) {
      failures++;
      console.log(c.red("failed") + c.dim(`  ${e.message}`));
    }
  }

  await writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
  console.log(
    `\n${c.green("✓")} ${Object.keys(manifest).length} thumbnail(s) → ${path.relative(ROOT, MANIFEST)}` +
      (failures ? c.yellow(`  (${failures} failed)`) : "") +
      "\n"
  );
}

/* ── entry ───────────────────────────────────────────────────────── */
const cmd = process.argv[2];

if (!TOKEN) {
  die(
    "FIGMA_TOKEN is not set.\n\n" +
      "  Figma > Settings > Security > Personal access tokens > Generate.\n" +
      "  Then add it to .env.local (gitignored):\n\n" +
      c.dim("    FIGMA_TOKEN=figd_your_token_here\n")
  );
}

if (cmd === "list") await list();
else if (cmd === "pull") await pull();
else die(`Unknown command "${cmd ?? ""}". Use: list | pull`);
