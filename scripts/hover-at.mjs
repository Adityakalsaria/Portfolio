#!/usr/bin/env node
/**
 * Hover the timeline at a fraction of its width and capture.
 *
 *   node scripts/hover-at.mjs <fraction 0-1> <out.png>
 *
 * Uses real mouse coordinates. Puppeteer's element.hover() scrolls the target
 * into view first, which masks anything sitting outside the viewport.
 */
import puppeteer from "puppeteer-core";

const CHROME =
  process.env.CHROME_PATH ??
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const [frac, out] = process.argv.slice(2);

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--hide-scrollbars"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto("http://localhost:3007", { waitUntil: "networkidle0" });
await page.evaluate(() =>
  document.querySelector(".tl")?.scrollIntoView({ block: "center" })
);
await new Promise((r) => setTimeout(r, 1200));

const box = await page.evaluate(() => {
  const el = document.querySelector(".tl-track");
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return { x: r.left, y: r.top, w: r.width, h: r.height };
});
if (!box) {
  console.error("no .tl-track");
  process.exit(1);
}

await page.mouse.move(box.x + box.w * Number(frac), box.y + box.h / 2);
await new Promise((r) => setTimeout(r, 700));
await page.screenshot({ path: out });
await browser.close();
console.log(`ok ${out} @ ${Math.round(Number(frac) * 100)}% of strip`);
