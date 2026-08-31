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
const MAX = 2048;

const identify = async (f) =>
  (await run("/opt/ImageMagick/bin/identify", ["-format", "%w %h", f])).stdout
    .trim()
    .split(" ")
    .map(Number);

/** Mean colour and spread; a flat frame has near-zero standard deviation. */
const stats = async (f) => {
  const { stdout } = await run("/opt/ImageMagick/bin/convert", [
    f, "-resize", "64x64!", "-format",
    "%[fx:mean.r] %[fx:mean.g] %[fx:mean.b] %[fx:standard_deviation]", "info:",
  ]);
  const [r, g, b, sd] = stdout.trim().split(/\s+/).map(Number);
  return { r, g, b, sd };
};

const files = (await readdir(SRC))
  .filter((f) => /\.(png|jpe?g|webp)$/i.test(f))
  .sort();

await rm(OUT, { recursive: true, force: true });
await mkdir(OUT, { recursive: true });

const kept = [];
for (const name of files) {
  const src = path.join(SRC, name);
  const [w, h] = await identify(src);
  const { sd } = await stats(src);

  if (w < 800 || h < 800) {
    console.log(`  skip  ${name} — ${w}x${h}, too small to show at 2048`);
    continue;
  }
  if (sd < 0.02) {
    console.log(`  skip  ${name} — flat frame (sd ${sd.toFixed(4)}), a dead export`);
    continue;
  }

  const n = String(kept.length + 1).padStart(2, "0");
  const tmp = path.join(OUT, `kosh-${n}.tmp.webp`);
  const scale = Math.min(1, MAX / Math.max(w, h));
  const ow = Math.round(w * scale);
  const oh = Math.round(h * scale);
  await run("/opt/homebrew/bin/cwebp", [
    "-q", "88", "-resize", String(ow), String(oh), "-quiet", src, "-o", tmp,
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
