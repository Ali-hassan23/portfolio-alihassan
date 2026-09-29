import { chromium } from "playwright-core";
import path from "node:path";

const refs = [
  ["igloo", "https://www.igloo.inc/"],
  ["lusion", "https://lusion.co/"],
];
const outDir = path.resolve("lab/research");
const browser = await chromium.launch({ args: ["--use-gl=swiftshader", "--enable-webgl", "--ignore-gpu-blocklist"] });
for (const [name, url] of refs) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
  await page.waitForTimeout(7000);
  await page.mouse.move(720, 450);
  for (let step = 1; step <= 4; step++) {
    for (let i = 0; i < 12; i++) {
      await page.mouse.wheel(0, 250);
      await page.waitForTimeout(80);
    }
    await page.waitForTimeout(2500);
    await page.screenshot({ path: path.join(outDir, `${name}-wheel${step}.png`) });
  }
  await page.close();
  console.log(name, "done");
}
await browser.close();
