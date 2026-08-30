#!/usr/bin/env node
/** Hover the KOSH work row and sample which image the preview shows. */
import puppeteer from "puppeteer-core";
const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH ??
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: true,
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto("http://localhost:3007", { waitUntil: "networkidle0" });
await page.evaluate(() => document.querySelector("#work, .table")?.scrollIntoView({ block: "center" }));
await new Promise((r) => setTimeout(r, 900));

const link = await page.$('a[href="/work/kosh-work"] .cell-title');
await link.hover();

const seen = [];
for (let i = 0; i < 8; i++) {
  await new Promise((r) => setTimeout(r, 480));
  const src = await page.evaluate(() => {
    // Every frame is mounted now; the visible one is the opaque one.
    const imgs = [...document.querySelectorAll("img.preview-frame")];
    const img = imgs.find((el) => Number(getComputedStyle(el).opacity) > 0.5);
    if (!img) return null;
    const s = img.getAttribute("src") || "";
    const m = decodeURIComponent(s).match(/kosh-(\d+)/);
    return m ? `kosh-${m[1]}` : s.slice(-24);
  });
  seen.push(src);
}
console.log("frames seen:", seen.join(" -> "));
console.log("distinct:", new Set(seen.filter(Boolean)).size);
await browser.close();
