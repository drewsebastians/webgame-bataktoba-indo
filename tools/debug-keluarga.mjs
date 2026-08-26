import { chromium } from "@playwright/test";

const browser = await chromium.launch();
const page = await browser.newPage();
page.on("pageerror", (err) => console.log("PAGEERROR", String(err).slice(0, 250)));
await page.goto("http://127.0.0.1:4183/learn/keluarga/");
await page.waitForTimeout(1200);
console.log((await page.textContent("#lesson-root")).slice(0, 200));
await browser.close();
