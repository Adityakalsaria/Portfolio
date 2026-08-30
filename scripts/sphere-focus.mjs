#!/usr/bin/env node
/** Click a plane in the sphere and capture the focused state. */
import puppeteer from "puppeteer-core";
const out = process.argv[2];
const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH ??
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: true,
  args: ["--hide-scrollbars", "--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 950 });
await page.goto("http://localhost:3007/work/kosh-work", { waitUntil: "networkidle0" });
await new Promise((r) => setTimeout(r, 900));
const btns = await page.$$(".mode-btn");
await btns[1].click();
await new Promise((r) => setTimeout(r, 3000));

const host = await page.evaluate(() => {
  const r = document.querySelector(".sphere-host").getBoundingClientRect();
  return { x: r.left, y: r.top, w: r.width, h: r.height };
});
// Click dead centre — with the cloud rotating something is usually there.
await page.mouse.click(host.x + host.w / 2, host.y + host.h / 2);
await new Promise((r) => setTimeout(r, 2600));
await page.screenshot({ path: out });
const after = await page.evaluate(() => {
  const r = document.querySelector(".sphere-host").getBoundingClientRect();
  return {
    hostCentreY: Math.round(r.top + r.height / 2),
    viewportCentreY: Math.round(window.innerHeight / 2),
  };
});
console.log(after);
await browser.close();
