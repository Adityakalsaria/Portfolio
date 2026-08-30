#!/usr/bin/env node
/** Emulate a finger dragging across the timeline and report the readout. */
import puppeteer from "puppeteer-core";

const browser = await puppeteer.launch({
  executablePath:
    process.env.CHROME_PATH ??
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: true,
});
const page = await browser.newPage();
await page.setViewport({
  width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true,
});
await page.goto("http://localhost:3007", { waitUntil: "networkidle0" });
await page.evaluate(() =>
  document.querySelector(".tl")?.scrollIntoView({ block: "center" })
);
await new Promise((r) => setTimeout(r, 1000));

const read = () =>
  page.evaluate(() => ({
    company: document.querySelector(".tl-title")?.textContent?.trim(),
    dates: document.querySelector(".tl-dates")?.textContent?.trim(),
  }));

const box = await page.evaluate(() => {
  const r = document.querySelector(".tl-track").getBoundingClientRect();
  return { x: r.left, y: r.top, w: r.width, h: r.height };
});

console.log("before drag:", await read());

const y = box.y + box.h / 2;
await page.touchscreen.touchStart(box.x + box.w * 0.95, y);
for (const f of [0.7, 0.5, 0.3, 0.08]) {
  await page.touchscreen.touchMove(box.x + box.w * f, y);
  await new Promise((r) => setTimeout(r, 120));
}
await page.touchscreen.touchEnd();
await new Promise((r) => setTimeout(r, 400));

console.log("after drag :", await read());
await browser.close();
