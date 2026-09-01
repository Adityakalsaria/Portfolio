/**
 * Imports one brand's work, clustered by campaign.
 *
 * Subfolder = campaign. The folder structure is the source of truth, so
 * regrouping is drag-and-drop and re-running this — no mapping table to keep
 * in sync with what is actually on disk.
 *
 * Usage: node scripts/brand-images.mjs "<source dir>" <slug>
 *
 * Carries the guards the KOSH import grew: a source that is flat-coloured or
 * too small is dropped loudly rather than shipped (that is how a dead Figma
 * export reached the site as a solid green frame), and filenames carry a
 * content hash so changed pixels always mean a changed URL.
 */
import { readdir, mkdir, rm, writeFile, readFile, rename, stat } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { createHash } from "node:crypto";
import path from "node:path";

const run = promisify(execFile);
const [SRC, SLUG] = process.argv.slice(2);
if (!SRC || !SLUG) {
  console.error('usage: node scripts/brand-images.mjs "<source dir>" <slug>');
  process.exit(1);
}
const OUT = `public/work/marketing-assets/${SLUG}`;
const MAX = 2048;

const identify = async (f) =>
  (await run("/opt/ImageMagick/bin/identify", ["-format", "%w %h", f])).stdout
    .trim().split(" ").map(Number);

const stats = async (f) => {
  const { stdout } = await run("/opt/ImageMagick/bin/convert", [
    f, "-resize", "64x64!", "-format", "%[fx:standard_deviation]", "info:",
  ]);
  return Number(stdout.trim());
};

const dirs = (await readdir(SRC, { withFileTypes: true }))
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .sort();

if (!dirs.length) {
  console.error(`no campaign subfolders in ${SRC}`);
  process.exit(1);
}

await rm(OUT, { recursive: true, force: true });
await mkdir(OUT, { recursive: true });

const sections = [];
let n = 0;

for (const dir of dirs) {
  // "01 Ignite Dubai" -> "Ignite Dubai". The number is for ordering on disk.
  const title = dir.replace(/^\d+\s+/, "");
  const files = (await readdir(path.join(SRC, dir)))
    .filter((f) => /\.(png|jpe?g|webp)$/i.test(f))
    .sort();
  const shots = [];
  console.log(`\n${title}`);

  for (const name of files) {
    const src = path.join(SRC, dir, name);
    const [w, h] = await identify(src);
    const sd = await stats(src);
    // Longest edge, not both. Requiring both over 800 threw out every wide
    // banner — 1568x196 and 2161x546 are legitimate work, not low-res files.
    // The dead-export case is caught by flatness below, which is what
    // actually identified it.
    if (Math.max(w, h) < 800) {
      console.log(`  skip  ${name} — ${w}x${h}, too small to show at ${MAX}`);
      continue;
    }
    if (sd < 0.02) {
      console.log(`  skip  ${name} — flat frame (sd ${sd.toFixed(4)}), a dead export`);
      continue;
    }
    n += 1;
    const tmp = path.join(OUT, `tmp-${n}.webp`);
    const scale = Math.min(1, MAX / Math.max(w, h));
    await run("/opt/homebrew/bin/cwebp", [
      "-q", "88", "-resize", String(Math.round(w * scale)), String(Math.round(h * scale)),
      "-quiet", src, "-o", tmp,
    ]);
    const hash = createHash("sha1").update(await readFile(tmp)).digest("hex").slice(0, 8);
    const file = `${SLUG}-${String(n).padStart(2, "0")}.${hash}.webp`;
    await rename(tmp, path.join(OUT, file));
    const [aw, ah] = await identify(path.join(OUT, file));
    shots.push({ src: `/work/marketing-assets/${SLUG}/${file}`, width: aw, height: ah });
    console.log(`  ok    ${file}  ${aw}x${ah}   ← ${name}`);
  }
  if (shots.length) sections.push({ title, shots });
}

const block = sections
  .map(
    (s) =>
      `  {\n    title: ${JSON.stringify(s.title)},\n    shots: [\n` +
      s.shots
        .map((x) => `      { src: "${x.src}", width: ${x.width}, height: ${x.height} },`)
        .join("\n") +
      `\n    ],\n  },`
  )
  .join("\n");

await writeFile(`/tmp/${SLUG}-sections.txt`, block);
const total = sections.reduce((a, s) => a + s.shots.length, 0);
console.log(
  `\n${total} images across ${sections.length} campaigns → /tmp/${SLUG}-sections.txt`
);
