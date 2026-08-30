#!/usr/bin/env node
/**
 * Print the readout's element boxes and the gaps between them.
 *
 *   node scripts/measure.mjs
 *
 * Reading boxes from the DOM beats scanning pixels: thin grey text washes out
 * of a row-average long before it stops being visible.
 */
import puppeteer from "puppeteer-core";

const browser = await puppeteer.launch({
  executablePath:
    process.env.CHROME_PATH ??
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: true,
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto("http://localhost:3007", { waitUntil: "networkidle0" });
await new Promise((r) => setTimeout(r, 1200));

const m = await page.evaluate(() => {
  const g = (s) => {
    const el = document.querySelector(s);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { top: +r.top.toFixed(1), bottom: +r.bottom.toFixed(1) };
  };
  return { logo: g(".tl-avatars"), title: g(".tl-title"), dates: g(".tl-dates") };
});
await browser.close();

const gap = (a, b) => +(b.top - a.bottom).toFixed(1);
console.log("logo ", m.logo);
console.log("title", m.title);
console.log("dates", m.dates);
console.log("gap logo -> title :", gap(m.logo, m.title), "px");
console.log("gap title -> dates:", gap(m.title, m.dates), "px");
