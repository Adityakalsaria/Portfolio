/**
 * Captures a live page at retina resolution and writes it as WebP segments.
 *
 * Usage: node scripts/capture-page.mjs <url> <slug> [name]
 *
 * Two things make this less simple than it sounds.
 *
 * Puppeteer's screenshot `clip` is in page coordinates, not viewport ones, so
 * a band has to be clipped at its absolute offset. Clipping at y:0 while
 * scrolling returns the top of the document every time — nineteen copies of
 * the hero, which is exactly what the first attempt produced.
 *
 * And WebP cannot exceed 16383px in either direction. A 16400px page at 2x is
 * 32796 tall, so a single file would have to come down to about 1438px wide —
 * softer than a retina viewer wants. It is written as segments at full width
 * instead, stacked seamlessly by the viewer.
 */
import { mkdir, rm, writeFile } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import puppeteer from "puppeteer-core";

const run = promisify(execFile);
const [URL_, SLUG, NAME] = process.argv.slice(2);
if (!URL_ || !SLUG) {
  console.error("usage: node scripts/capture-page.mjs <url> <slug> [name]");
  process.exit(1);
}

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const WIDTH = 1440;
const VH = 900;
const DPR = 2;
/** Kept under WebP's 16383 ceiling with room to spare. */
const MAX_SEG = 11000;
const OUT = `public/work/pages/${SLUG}`;
const TMP = `/tmp/capture-${SLUG}`;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

await rm(TMP, { recursive: true, force: true });
await mkdir(`${TMP}/slices`, { recursive: true });
await rm(OUT, { recursive: true, force: true });
await mkdir(OUT, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  protocolTimeout: 300000,
  args: ["--hide-scrollbars"],
});
const page = await browser.newPage();
await page.setViewport({ width: WIDTH, height: VH, deviceScaleFactor: DPR });
console.log(`loading ${URL_}`);
// domcontentloaded, not networkidle: a site with long-polling or a live chat
// never goes idle, and the wait times out on a page that is perfectly ready.
await page.goto(URL_, { waitUntil: "domcontentloaded", timeout: 90000 });
await sleep(4000);
try {
  await page.evaluate(() => document.fonts.ready);
} catch {}

// A sticky header repeats down a stitched capture and a fixed widget rides
// along with it. Static leaves the header where it belongs: at the top, once.
await page.evaluate(() => {
  for (const el of document.querySelectorAll("body *")) {
    const pos = getComputedStyle(el).position;
    if (pos === "sticky") el.style.position = "static";
    if (pos === "fixed" && el.getBoundingClientRect().height > 20)
      el.style.display = "none";
  }
});
await sleep(800);

// One full pass first: lazy images and scroll-triggered animations only fire
// once their section has been in view.
let height = await page.evaluate(() => document.documentElement.scrollHeight);
for (let y = 0; y < height; y += 700) {
  await page.evaluate((v) => window.scrollTo(0, v), y);
  await sleep(450);
}
await sleep(2000);
height = await page.evaluate(() => document.documentElement.scrollHeight);
console.log(`page is ${WIDTH}x${height} CSS px`);

// Capture the visible band, never a clip. A clip is in page coordinates, so
// Chrome re-renders the whole document to satisfy it — on a 32000px page at
// 2x that takes long enough to trip the protocol timeout. Scrolling and
// grabbing the viewport is both correct and cheap.
const full = Math.floor(height / VH);
const tail = height - full * VH;
let n = 0;
for (let i = 0; i < full; i++) {
  await page.evaluate((v) => window.scrollTo(0, v), i * VH);
  await sleep(320);
  await page.screenshot({ path: `${TMP}/slices/${String(++n).padStart(3, "0")}.png` });
}
if (tail > 0) {
  // The last scroll clamps at the page end, so this band overlaps the one
  // before it. Keep only the part that has not been captured already.
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await sleep(400);
  const last = `${TMP}/slices/${String(++n).padStart(3, "0")}.png`;
  await page.screenshot({ path: `${TMP}/last-full.png` });
  await run("/opt/ImageMagick/bin/convert", [
    `${TMP}/last-full.png`,
    "-crop", `${WIDTH * DPR}x${tail * DPR}+0+${(VH - tail) * DPR}`,
    "+repage", last,
  ]);
}
await browser.close();
console.log(`${n} slices`);

await run("/opt/ImageMagick/bin/convert", [
  ...Array.from({ length: n }, (_, i) => `${TMP}/slices/${String(i + 1).padStart(3, "0")}.png`),
  "-append",
  `${TMP}/full.png`,
]);
const [fw, fh] = (
  await run("/opt/ImageMagick/bin/identify", ["-format", "%w %h", `${TMP}/full.png`])
).stdout.trim().split(" ").map(Number);
console.log(`stitched ${fw}x${fh}`);

const segments = Math.ceil(fh / MAX_SEG);
const segH = Math.ceil(fh / segments);
const parts = [];
for (let i = 0; i < segments; i++) {
  const top = i * segH;
  const h = Math.min(segH, fh - top);
  const raw = `${TMP}/seg-${i}.png`;
  await run("/opt/ImageMagick/bin/convert", [
    `${TMP}/full.png`, "-crop", `${fw}x${h}+0+${top}`, "+repage", raw,
  ]);
  const tmpWebp = `${OUT}/tmp.webp`;
  await run("/opt/homebrew/bin/cwebp", [
    "-q", "90", "-m", "6", "-sharp_yuv", "-quiet", raw, "-o", tmpWebp,
  ]);
  const hash = createHash("sha1").update(await readFile(tmpWebp)).digest("hex").slice(0, 8);
  const file = `${SLUG}-${i + 1}.${hash}.webp`;
  await run("mv", [tmpWebp, path.join(OUT, file)]);
  parts.push({ src: `/work/pages/${SLUG}/${file}`, width: fw, height: h });
  console.log(`  ${file}  ${fw}x${h}`);
}

const block =
  `  {\n    src: "${parts[0].src}",\n    width: ${fw},\n    height: ${fh},\n` +
  (NAME ? `    name: ${JSON.stringify(NAME)},\n` : "") +
  `    parts: [\n` +
  parts.map((p) => `      { src: "${p.src}", width: ${p.width}, height: ${p.height} },`).join("\n") +
  `\n    ],\n  },`;
await writeFile(`/tmp/${SLUG}-page.txt`, block);
console.log(`\n${segments} segments → /tmp/${SLUG}-page.txt`);
