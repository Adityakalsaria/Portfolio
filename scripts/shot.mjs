#!/usr/bin/env node
/**
 * Dev-only visual check. Drives the installed Chrome via puppeteer-core so no
 * browser binary is downloaded.
 *
 *   node scripts/shot.mjs <url> <out.png> [selectorToScrollTo]
 */
import puppeteer from "puppeteer-core";

const CHROME =
  process.env.CHROME_PATH ??
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const [url, out, selector] = process.argv.slice(2);
if (!url || !out) {
  console.error("usage: node scripts/shot.mjs <url> <out.png> [selector]");
  process.exit(1);
}

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--hide-scrollbars"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
await page.goto(url, { waitUntil: "networkidle0" });

if (selector) {
  await page.evaluate((sel) => {
    document.querySelector(sel)?.scrollIntoView({ block: "start" });
  }, selector);
}

// Let entrance animations land before capturing.
await new Promise((r) => setTimeout(r, 2200));
await page.screenshot({ path: out });
await browser.close();
console.log(`✓ ${out}`);
