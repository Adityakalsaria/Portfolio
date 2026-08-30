#!/usr/bin/env node
/**
 * Pulls the portfolio Figma file into the site.
 *
 *   node scripts/figma-import.mjs
 *
 * Reads FIGMA_TOKEN from .env.local, walks the file's pages, exports every
 * top-level frame as a 2x PNG into public/work/<page>/, and writes
 * src/lib/work.generated.ts. Re-runnable: existing files are overwritten,
 * removed frames are pruned.
 */
import { readFile, writeFile, mkdir, readdir, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const FILE_KEY = process.env.FIGMA_FILE_KEY ?? "s5PjAQnih3ygkV9b5WYFvK";
const ROOT = path.resolve(import.meta.dirname, "..");
const OUT_DIR = path.join(ROOT, "public", "work");
const DATA_FILE = path.join(ROOT, "src", "lib", "work.generated.ts");

/** Figma caps image requests; stay well under the URL length limit too. */
const BATCH = 25;
const SCALE = 2;

async function loadToken() {
  if (process.env.FIGMA_TOKEN) return process.env.FIGMA_TOKEN;
  const envPath = path.join(ROOT, ".env.local");
  if (!existsSync(envPath)) {
    fail(
      "No FIGMA_TOKEN. Create one at figma.com > Settings > Security >\n" +
        "Personal access tokens (scope: file_content:read), then:\n" +
        "  echo 'FIGMA_TOKEN=figd_...' > .env.local"
    );
  }
  const match = (await readFile(envPath, "utf8")).match(
    /^FIGMA_TOKEN\s*=\s*(.+)$/m
  );
  if (!match) fail("FIGMA_TOKEN not found in .env.local");
  return match[1].trim().replace(/^["']|["']$/g, "");
}

function fail(msg) {
  console.error(`\n✗ ${msg}\n`);
  process.exit(1);
}

async function figma(token, endpoint) {
  const res = await fetch(`https://api.figma.com/v1${endpoint}`, {
    headers: { "X-Figma-Token": token },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    fail(`Figma API ${res.status} on ${endpoint}\n${body.slice(0, 400)}`);
  }
  return res.json();
}

const slugify = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "untitled";

/** Frames Figma treats as exportable art, not scaffolding. */
const EXPORTABLE = new Set(["FRAME", "COMPONENT", "COMPONENT_SET", "SECTION"]);

async function main() {
  const token = await loadToken();

  console.log(`→ Reading file ${FILE_KEY}`);
  // depth=2 gives us pages and their direct children without the whole tree.
  const file = await figma(token, `/files/${FILE_KEY}?depth=2`);

  const pages = (file.document.children ?? []).filter(
    (p) => p.type === "CANVAS"
  );
  if (!pages.length) fail("No pages found in the file.");

  const categories = [];
  const allNodes = [];

  for (const page of pages) {
    const frames = (page.children ?? []).filter(
      (n) => EXPORTABLE.has(n.type) && n.visible !== false
    );
    if (!frames.length) {
      console.log(`  · ${page.name} — no top-level frames, skipping`);
      continue;
    }

    const pageSlug = slugify(page.name);
    const projects = frames.map((frame) => {
      const box = frame.absoluteBoundingBox ?? { width: 1600, height: 1000 };
      const slug = `${pageSlug}-${slugify(frame.name)}`;
      const file = `/work/${pageSlug}/${slug}.png`;
      allNodes.push({ id: frame.id, dest: path.join(OUT_DIR, pageSlug, `${slug}.png`) });
      return {
        slug,
        title: frame.name,
        width: Math.round(box.width),
        height: Math.round(box.height),
        cover: file,
      };
    });

    categories.push({ id: pageSlug, name: page.name, projects });
    console.log(`  · ${page.name} — ${projects.length} frames`);
  }

  if (!allNodes.length) fail("Nothing exportable found.");

  console.log(`→ Rendering ${allNodes.length} frames at ${SCALE}x`);
  const urls = {};
  for (let i = 0; i < allNodes.length; i += BATCH) {
    const chunk = allNodes.slice(i, i + BATCH);
    const ids = chunk.map((n) => n.id).join(",");
    const res = await figma(
      token,
      `/images/${FILE_KEY}?ids=${encodeURIComponent(ids)}&format=png&scale=${SCALE}`
    );
    if (res.err) fail(`Render failed: ${res.err}`);
    Object.assign(urls, res.images);
    console.log(`  · ${Math.min(i + BATCH, allNodes.length)}/${allNodes.length}`);
  }

  // Prune stale exports so a renamed frame does not leave an orphan behind.
  if (existsSync(OUT_DIR)) {
    const keep = new Set(allNodes.map((n) => n.dest));
    for (const dir of await readdir(OUT_DIR, { withFileTypes: true })) {
      if (!dir.isDirectory()) continue;
      const dirPath = path.join(OUT_DIR, dir.name);
      for (const f of await readdir(dirPath)) {
        const full = path.join(dirPath, f);
        if (!keep.has(full)) await rm(full);
      }
    }
  }

  console.log("→ Downloading");
  let done = 0;
  await Promise.all(
    allNodes.map(async (node) => {
      const url = urls[node.id];
      if (!url) {
        console.warn(`  ! no render for ${node.id}`);
        return;
      }
      const res = await fetch(url);
      if (!res.ok) {
        console.warn(`  ! download ${res.status} for ${node.id}`);
        return;
      }
      await mkdir(path.dirname(node.dest), { recursive: true });
      await writeFile(node.dest, Buffer.from(await res.arrayBuffer()));
      done++;
    })
  );
  console.log(`  · ${done} images written`);

  const body = `// Generated by scripts/figma-import.mjs — do not edit by hand.
// Source: https://www.figma.com/design/${FILE_KEY}/
import type { Category } from "./work";

export const GENERATED: Category[] = ${JSON.stringify(categories, null, 2)};
`;
  await mkdir(path.dirname(DATA_FILE), { recursive: true });
  await writeFile(DATA_FILE, body);

  console.log(`\n✓ ${categories.length} pages → ${DATA_FILE}\n`);
}

main().catch((e) => fail(e.stack ?? String(e)));
