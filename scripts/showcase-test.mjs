#!/usr/bin/env node
/** Capture the project page in both showcase modes. */
import puppeteer from "puppeteer-core";
const out = process.argv[2];
const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH ??
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: true, args: ["--hide-scrollbars"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 950 });
await page.goto("http://localhost:3007/work/kosh-work", { waitUntil: "networkidle0" });
await new Promise((r) => setTimeout(r, 1200));
await page.screenshot({ path: `${out}-scroll.png` });

// Switch to reveal and let the mask travel.
const btns = await page.$$(".mode-btn");
await btns[1].click();
await new Promise((r) => setTimeout(r, 420));
await page.screenshot({ path: `${out}-mid.png` });
await new Promise((r) => setTimeout(r, 1400));
await page.screenshot({ path: `${out}-done.png` });

const state = await page.evaluate(() => {
  const el = document.querySelector(".mode-btn.is-on");
  const img = document.querySelector("img[alt*='of']");
  const masked = document.querySelector("[style*='mask-position']");
  return {
    active: el?.textContent,
    counter: document.querySelectorAll(".sub.tabular-nums")[0]?.textContent?.trim(),
    hasMask: !!masked,
    maskPos: masked ? getComputedStyle(masked).maskPosition : null,
    img: img?.getAttribute("alt"),
  };
});
console.log(state);
await browser.close();
