#!/usr/bin/env node
/**
 * Derived media, so the site never ships a full-size file where a tile needs a
 * small one. Originals are left alone: opening an image or a clip still loads
 * the untouched file.
 *
 *   stills  name.webp  ->  name.w480.webp, name.w960.webp  (tiles, at 1x and 2x)
 *                          name.w1600.webp                 (the opened view, when
 *                                                          the original is bigger)
 *   clips   name.mp4   ->  name.tile.mp4   (640px wide, 30fps, silent, first 10s, for
 *                                            the wall and grid, where a clip plays
 *                                            in a box about 200px across)
 *
 * The stills are cheap and are generated on every dev start and build, and are
 * not committed. The tile clips need ffmpeg, which the build machine does not
 * have, so they are generated here and committed.
 *
 *   node scripts/optimize.mjs            stills and clips
 *   node scripts/optimize.mjs --stills   stills only (predev, prebuild)
 *
 * Idempotent: a derived file newer than its source is left alone.
 */
import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const ROOT = new URL("../public", import.meta.url).pathname;
const DIRS = ["work", "posts"];
const stillsOnly = process.argv.includes("--stills");

/** Keep in step with thumb() and hasMedium() in src/lib/work.ts. */
const WIDTHS = [480, 960];
const MEDIUM = 1600;
const MEDIUM_MIN_SOURCE = 2000;

const DERIVED = /\.(w\d+\.webp|tile\.mp4)$/;

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)]
  );
}

const fresh = (out, src) => existsSync(out) && statSync(out).mtimeMs >= statSync(src).mtimeMs;

const files = DIRS.flatMap((d) => (existsSync(join(ROOT, d)) ? walk(join(ROOT, d)) : []));
const stills = files.filter((f) => f.endsWith(".webp") && !DERIVED.test(f));
const clips = files.filter((f) => f.endsWith(".mp4") && !DERIVED.test(f));

let made = 0;
await Promise.all(
  stills.map(async (src) => {
    const { width } = await sharp(src).metadata();
    const targets = [...WIDTHS.map((w) => [w, 84]), ...(width > MEDIUM_MIN_SOURCE ? [[MEDIUM, 90]] : [])];
    for (const [w, quality] of targets) {
      const out = src.replace(/\.webp$/, `.w${w}.webp`);
      if (fresh(out, src)) continue;
      // Never enlarged: a source narrower than the target is only re-encoded.
      await sharp(src)
        .resize({ width: w, withoutEnlargement: true })
        .webp({ quality, smartSubsample: true, effort: 5 })
        .toFile(out);
      made++;
    }
  })
);
console.log(`stills: ${stills.length} sources, ${made} derived files written`);

if (!stillsOnly) {
  let have = true;
  try {
    execFileSync("ffmpeg", ["-version"], { stdio: "ignore" });
  } catch {
    have = false;
    console.warn("clips: ffmpeg not found, tile clips skipped");
  }
  if (have) {
    let n = 0;
    for (const src of clips) {
      const out = src.replace(/\.mp4$/, ".tile.mp4");
      if (fresh(out, src)) continue;
      execFileSync(
        "ffmpeg",
        [
          "-v", "error", "-y", "-i", src,
          "-t", "10",
          "-vf", "fps=30,scale='min(640,iw)':-2:flags=lanczos",
          "-an",
          "-c:v", "libx264", "-crf", "30", "-preset", "slow", "-pix_fmt", "yuv420p",
          "-movflags", "+faststart",
          out,
        ],
        { stdio: "inherit" }
      );
      n++;
    }
    console.log(`clips: ${clips.length} sources, ${n} tile clips written`);
  }
}
