#!/usr/bin/env node
/**
 * Dev-only visual check. Drives the installed Chrome via puppeteer-core so no
 * browser binary is downloaded.
 *
 *   node scripts/shot.mjs <url> <out.png> [scrollToSelector] [hoverSelector]
 *
 * hoverSelector captures a hover state — useful for the row tables, whose
 * quieting effect is invisible in a plain screenshot.
 */
import puppeteer from "puppeteer-core";

const CHROME =
  process.env.CHROME_PATH ??
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const [url, out, selector, hover] = process.argv.slice(2);
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
await new Promise((r) => setTimeout(r, 1800));

if (hover) {
  const el = await page.$(hover);
  if (!el) {
    console.error(`no element matched ${hover}`);
    await browser.close();
    process.exit(1);
  }
  await el.hover();
  await new Promise((r) => setTimeout(r, 600));
}
await page.screenshot({ path: out });
await browser.close();
console.log(`✓ ${out}`);
