import { chromium } from "playwright-core";
import path from "node:path";
import fs from "node:fs";

const refs = [
  ["igloo", "https://www.igloo.inc/"],
  ["lusion", "https://lusion.co/"],
  ["linear", "https://linear.app/"],
  ["activetheory", "https://activetheory.net/"],
];
const outDir = path.resolve("lab/research");
fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({ args: ["--use-gl=swiftshader", "--enable-webgl", "--ignore-gpu-blocklist"] });
for (const [name, url] of refs) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
    await page.waitForTimeout(6000);
    const h = await page.evaluate(() => document.documentElement.scrollHeight);
    for (const f of [0, 0.15, 0.35, 0.6]) {
      await page.mouse.wheel(0, 0);
      await page.evaluate((y) => window.scrollTo(0, y), Math.round(h * f));
      await page.mouse.wheel(0, 200);
      await page.waitForTimeout(2500);
      await page.screenshot({ path: path.join(outDir, `${name}-${Math.round(f * 100)}.png`) });
    }
    console.log(name, "ok, height", h);
  } catch (e) {
    console.log(name, "failed", e.message.slice(0, 120));
  }
  await page.close();
}
await browser.close();
