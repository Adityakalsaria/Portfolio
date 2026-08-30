#!/usr/bin/env node
/**
 * Hover the KOSH row and hash the preview's pixels over time. Tests what is
 * on screen, not what the DOM claims — the DOM check missed a stall where
 * every frame was mounted but only one had ever decoded.
 */
import puppeteer from "puppeteer-core";
import { createHash } from "node:crypto";

const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH ??
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: true,
  args: ["--hide-scrollbars"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto("http://localhost:3007", { waitUntil: "networkidle0" });
await page.evaluate(() =>
  document.querySelector(".table")?.scrollIntoView({ block: "center" })
);
await new Promise((r) => setTimeout(r, 800));

const row = await page.evaluate(() => {
  const el = document.querySelector('a[href="/work/kosh-work"] .cell-title');
  const r = el.getBoundingClientRect();
  return { x: Math.round(r.left + 20), y: Math.round(r.top + r.height / 2) };
});

await page.mouse.move(row.x, row.y);
await new Promise((r) => setTimeout(r, 250));

const box = await page.evaluate(() => {
  const el = [...document.querySelectorAll("div")].find(
    (d) => d.querySelector("img.preview-frame") && getComputedStyle(d).position === "fixed"
  );
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return { x: Math.round(r.x), y: Math.round(r.y), width: Math.round(r.width), height: Math.round(r.height) };
});
if (!box || box.width < 4) {
  console.log("preview box not found/zero:", box);
  await browser.close();
  process.exit(1);
}
console.log("preview box:", box);

const hashes = [];
for (let i = 0; i < 10; i++) {
  // Nudge 1px so the hover never lapses, without leaving the row.
  await page.mouse.move(row.x + (i % 2), row.y);
  await new Promise((r) => setTimeout(r, 400));
  const shot = await page.screenshot({ clip: box });
  hashes.push(createHash("md5").update(shot).digest("hex").slice(0, 8));
}
console.log("pixel hashes:", hashes.join(" "));
console.log("distinct renders:", new Set(hashes).size, "of", hashes.length);
await browser.close();
