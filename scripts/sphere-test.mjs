#!/usr/bin/env node
/** Switch a project page to Sphere mode and report what actually rendered. */
import puppeteer from "puppeteer-core";
const out = process.argv[2];
const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH ??
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: true,
  args: ["--hide-scrollbars", "--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
});
const page = await browser.newPage();
const errors = [];
page.on("console", (m) => { if (m.type() === "error") errors.push(m.text().slice(0, 160)); });
page.on("pageerror", (e) => errors.push("pageerror: " + String(e).slice(0, 160)));

await page.setViewport({ width: 1440, height: 950 });
await page.goto("http://localhost:3007/work/kosh-work", { waitUntil: "networkidle0" });
await new Promise((r) => setTimeout(r, 900));

const btns = await page.$$(".mode-btn");
await btns[1].click();
await new Promise((r) => setTimeout(r, 3500));

const state = await page.evaluate(() => {
  const host = document.querySelector(".sphere-host");
  const canvas = host?.querySelector("canvas");
  let painted = false;
  if (canvas) {
    // Any non-transparent pixel means textures reached the GPU.
    const c = document.createElement("canvas");
    c.width = canvas.width; c.height = canvas.height;
    try {
      c.getContext("2d").drawImage(canvas, 0, 0);
      const d = c.getContext("2d").getImageData(0, 0, c.width, c.height).data;
      for (let i = 3; i < d.length; i += 4 * 97) if (d[i] > 8) { painted = true; break; }
    } catch { painted = false; }
  }
  return {
    active: document.querySelector(".mode-btn.is-on")?.textContent,
    hasCanvas: !!canvas,
    size: canvas ? `${canvas.width}x${canvas.height}` : null,
    hostH: host ? Math.round(host.getBoundingClientRect().height) : null,
    painted,
  };
});
console.log(state);
console.log("console errors:", errors.length ? errors.slice(0, 4) : "none");
await page.screenshot({ path: out });
await browser.close();
