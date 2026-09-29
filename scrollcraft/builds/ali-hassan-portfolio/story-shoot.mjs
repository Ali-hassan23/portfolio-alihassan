// Samples inside every story section (not evenly across the page) at
// desktop, phone and reduced motion. Usage:
//   node story-shoot.mjs [desktop|mobile|reduced|compact] [outDir]
import { chromium } from "playwright-core";
import path from "node:path";
import fs from "node:fs";

const mode = process.argv[2] || "desktop";
const outDir = path.resolve(process.argv[3] || `lab/story-${mode}`);
fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

const viewports = {
  desktop: { width: 1440, height: 900 },
  mobile: { width: 390, height: 844 },
  compact: { width: 360, height: 640 },
  reduced: { width: 1440, height: 900 },
};
const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: viewports[mode],
  isMobile: mode === "mobile" || mode === "compact",
  hasTouch: mode === "mobile" || mode === "compact",
  reducedMotion: mode === "reduced" ? "reduce" : "no-preference",
});
await ctx.addInitScript(() => {
  Element.prototype.requestPointerLock = () => {};
  Element.prototype.setPointerCapture = () => {};
});
const page = await ctx.newPage();
const errors = [];
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
page.on("pageerror", (e) => errors.push(String(e)));
page.on("requestfailed", (r) => errors.push(`failed: ${r.url()}`));

await page.goto(process.env.URL || "http://localhost:3001", { waitUntil: "networkidle" });
await page.waitForTimeout(1200);

const sections = await page.evaluate(() =>
  Array.from(document.querySelectorAll("[data-stage-anchor]")).map((el) => {
    const r = el.getBoundingClientRect();
    return { id: el.id, top: r.top + window.scrollY, height: r.height };
  })
);
const vh = viewports[mode].height;
let i = 0;
for (const s of sections) {
  const travel = Math.max(0, s.height - vh);
  const samples = travel > vh * 0.5 ? [0, 0.33, 0.66, 1] : [0, 0.5];
  for (const f of samples) {
    const y = Math.round(s.top + travel * f + (travel === 0 ? (s.height - vh) * f : 0));
    await page.evaluate((yy) => window.scrollTo({ top: yy, behavior: "instant" }), Math.max(0, y));
    await page.waitForTimeout(900);
    const name = `${String(i++).padStart(2, "0")}-${s.id}-${Math.round(f * 100)}.png`;
    await page.screenshot({ path: path.join(outDir, name) });
  }
}

if (mode === "desktop") {
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.waitForTimeout(700);
  await page.mouse.move(150, 450);
  await page.waitForTimeout(900);
  await page.screenshot({ path: path.join(outDir, "pointer-left.png") });
  await page.mouse.move(1300, 450);
  await page.waitForTimeout(900);
  await page.screenshot({ path: path.join(outDir, "pointer-right.png") });
}

const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
console.log(JSON.stringify({ mode, sections, overflow, errors }, null, 2));
await browser.close();
