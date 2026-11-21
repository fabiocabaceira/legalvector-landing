// Renders the home share card (copy deck §9) to public/og-v5.jpg, 1200x630. /ask/ keeps ask/og-v4.jpg.
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { chromium } from "playwright-core";

const PUB = resolve("public");
const fonte = readFileSync(resolve(PUB, "fonts/inter.woff2")).toString("base64");
const marca = readFileSync(resolve(PUB, "brand/legalvector-mark.svg")).toString("base64");

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face { font-family: Inter; src: url(data:font/woff2;base64,${fonte}) format("woff2"); font-weight: 100 900; }
* { margin: 0; box-sizing: border-box; }
body { width: 1200px; height: 630px; overflow: hidden; background: #0e1a19; font-family: Inter, sans-serif; color: #fff; position: relative; }
.grade { position: absolute; inset: 0; background-image: linear-gradient(rgba(94,234,212,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(94,234,212,.05) 1px, transparent 1px); background-size: 72px 72px; }
.luz { position: absolute; width: 900px; height: 700px; right: -260px; top: -260px; background: radial-gradient(closest-side, rgba(20,184,166,.38), transparent); }
.luz2 { position: absolute; width: 700px; height: 500px; left: -200px; bottom: -300px; background: radial-gradient(closest-side, rgba(15,118,110,.4), transparent); }
.c { position: absolute; inset: 0; padding: 72px 80px; display: flex; flex-direction: column; }
.logo { display: flex; align-items: center; gap: 14px; font-size: 34px; font-weight: 650; letter-spacing: -0.02em; }
.logo img { width: 56px; height: 56px; }
.logo b { color: #5eead4; font-weight: 650; }
h1 { margin-top: auto; font-size: 82px; line-height: 1.02; font-weight: 650; letter-spacing: -0.045em; }
h1 span { display: block; }
.g { background: linear-gradient(180deg, #fff 18%, #b9f5ea 62%, #5eead4); -webkit-background-clip: text; background-clip: text; color: transparent; padding-bottom: 6px; }
p { margin-top: 28px; font-size: 30px; color: #b9c6c3; letter-spacing: -0.01em; }
</style></head><body><div class="grade"></div><div class="luz"></div><div class="luz2"></div>
<div class="c"><div class="logo"><img src="data:image/svg+xml;base64,${marca}" alt=""><span>legal<b>Vector</b></span></div>
<h1><span>Legal isn't the bottleneck.</span><span class="g">Email is.</span></h1>
<p>One front door to Legal · On Alfresco or Doxis</p></div></body></html>`;

const browser = await chromium.launch(process.env.LV_CHROME ? { executablePath: process.env.LV_CHROME } : {});
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html, { waitUntil: "load" });
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: resolve(PUB, "og-v5.jpg"), type: "jpeg", quality: 88 });
await browser.close();
console.log("public/og-v5.jpg written");
