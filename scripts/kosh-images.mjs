/**
 * Re-encodes the KOSH project stills from their originals.
 *
 * Written after a dead Figma export ("Home Screen - iPhone.png", a 402x874
 * frame that came out solid #00FF40) shipped as kosh-05 and the numbering
 * drifted out of step with the sources. Regenerating the whole set from one
 * sorted pass is the only way to keep the files, their numbers, and the
 * dimensions in manual.ts agreeing with each other.
 *
 * Sources that are flat-coloured or tiny are dropped loudly rather than
 * silently shipped — that is exactly how the green one got through.
 *
 * Filenames carry a content hash. Re-encoding under a stable name left every
 * browser that had already loaded the page serving the old bytes from its own
 * cache — the dead green frame outlived three server-side cache clears that
 * way. A changed image now means a changed URL, which no cache can defeat.
 */
import { readdir, mkdir, rm, writeFile, readFile, rename } from "node:fs/promises";
import { createHash } from "node:crypto";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import path from "node:path";

const run = promisify(execFile);
const SRC = "/Users/akash/Downloads/KOSH work for portfolio";
const OUT = "public/work/marketing-assets/kosh";
/** Matches scripts/brand-images.mjs — see the note there on why near-native. */
const MAX = 3200;

const identify = async (f) =>
  (await run("/opt/ImageMagick/bin/identify", ["-format", "%w %h", f])).stdout
    .trim()
    .split(" ")
    .map(Number);

/** Distinct colours; a dead export has exactly one. See brand-images.mjs. */
const colours = async (f) =>
  Number(
    (await run("/opt/ImageMagick/bin/convert", [f, "-format", "%k", "info:"])).stdout.trim()
  );

const files = (await readdir(SRC))
  .filter((f) => /\.(png|jpe?g|webp)$/i.test(f))
  .sort();

await rm(OUT, { recursive: true, force: true });
await mkdir(OUT, { recursive: true });

const kept = [];
for (const name of files) {
  const src = path.join(SRC, name);
  const [w, h] = await identify(src);
  const k = await colours(src);

  if (Math.max(w, h) < 400) {
    console.log(`  skip  ${name} — ${w}x${h}, too small to show at ${MAX}`);
    continue;
  }
  if (k <= 2) {
    console.log(`  skip  ${name} — ${k} colour(s), a dead export`);
    continue;
  }

  const n = String(kept.length + 1).padStart(2, "0");
  const tmp = path.join(OUT, `kosh-${n}.tmp.webp`);
  const scale = Math.min(1, MAX / Math.max(w, h));
  const ow = Math.round(w * scale);
  const oh = Math.round(h * scale);
  await run("/opt/homebrew/bin/cwebp", [
    "-q", "95", "-m", "6", "-sharp_yuv",
    "-resize", String(ow), String(oh), "-quiet", src, "-o", tmp,
  ]);
  const hash = createHash("sha1").update(await readFile(tmp)).digest("hex").slice(0, 8);
  const file = `kosh-${n}.${hash}.webp`;
  await rename(tmp, path.join(OUT, file));
  const [aw, ah] = await identify(path.join(OUT, file));
  kept.push({ src: `/work/marketing-assets/kosh/${file}`, width: aw, height: ah });
  console.log(`  ok    ${file}  ${aw}x${ah}   ← ${name}`);
}

const block = kept
  .map((s) => `  { src: "${s.src}", width: ${s.width}, height: ${s.height} },`)
  .join("\n");
await writeFile("/tmp/kosh-shots.txt", block);
console.log(`\n${kept.length} images. Block written to /tmp/kosh-shots.txt`);
