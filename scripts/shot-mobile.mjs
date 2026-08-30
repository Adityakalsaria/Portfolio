#!/usr/bin/env node
/**
 * Full-page capture at a phone viewport.
 *
 *   node scripts/shot-mobile.mjs <url> <out.png> [width=390]
 */
import puppeteer from "puppeteer-core";

const [url, out, width = "390"] = process.argv.slice(2);
const browser = await puppeteer.launch({
  executablePath:
    process.env.CHROME_PATH ??
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: true,
  args: ["--hide-scrollbars"],
});
const page = await browser.newPage();
await page.setViewport({
  width: Number(width),
  height: 844,
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
});
await page.goto(url, { waitUntil: "networkidle0" });
// Nudge every reveal into view so nothing captures mid-animation.
await page.evaluate(async () => {
  for (let y = 0; y < document.body.scrollHeight; y += 400) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 60));
  }
  window.scrollTo(0, 0);
});
await new Promise((r) => setTimeout(r, 1500));
await page.screenshot({ path: out, fullPage: true });
await browser.close();
console.log(`ok ${out} @ ${width}px`);
