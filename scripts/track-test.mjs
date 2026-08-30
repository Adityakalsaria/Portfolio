#!/usr/bin/env node
/** Sweep the strip and report the readout plus the card's left offset. */
import puppeteer from "puppeteer-core";
const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH ??
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: true,
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto("http://localhost:3007", { waitUntil: "networkidle0" });
await page.evaluate(() => document.querySelector(".tl")?.scrollIntoView({ block: "center" }));
await new Promise((r) => setTimeout(r, 1000));
const box = await page.evaluate(() => {
  const r = document.querySelector(".tl-track").getBoundingClientRect();
  return { x: r.left, y: r.top, w: r.width, h: r.height };
});
for (const f of [0.02, 0.2, 0.4, 0.6, 0.75, 0.9, 0.99]) {
  await page.mouse.move(box.x + box.w * f, box.y + box.h / 2);
  await new Promise((r) => setTimeout(r, 250));
  const s = await page.evaluate(() => {
    const el = document.querySelector(".tl-label");
    return {
      company: document.querySelector(".tl-title")?.textContent?.trim(),
      left: Math.round(parseFloat(getComputedStyle(el).left)),
    };
  });
  console.log(`${String(Math.round(f * 100)).padStart(3)}%  left=${String(s.left).padStart(4)}  ${s.company}`);
}
await browser.close();
