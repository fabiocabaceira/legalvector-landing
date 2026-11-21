// Gate check: builds nothing, opens dist/ in local Chromium through serve.mjs and fails on the house rules.
// node scripts/check.mjs [--dir dist] [--port 0] [--routes ,product/,integrations/doxis/]
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { chromium } from "playwright-core";
import { servir } from "./serve.mjs";

const arg = (n, d) => {
  const i = process.argv.indexOf(n);
  return i > 0 ? process.argv[i + 1] : d;
};
const DIR = resolve(arg("--dir", "dist"));
// port 0 = any free port, so several builders can run the check at once
const PORT = Number(arg("--port", process.env.PORT || 0));
const PREFIXO = "/legalvector-landing/";
const TODAS = ["/", "/ask/", "/product/", "/integrations/alfresco/", "/integrations/doxis/", "/questions/", "/contact/", "/r/LV-0001", "/ask/r/LV-0001"];
if (existsSync(join(DIR, "lab", "index.html"))) TODAS.push("/lab/");
// routes may be given without the leading slash (Git Bash rewrites "/x/" into a Windows path)
const ROTAS = arg("--routes") ? [...new Set(arg("--routes").split(",").map((r) => "/" + r.replace(/^[/]+/, "")))] : TODAS;
const VISTAS = [
  { nome: "390", viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
  { nome: "1440", viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 },
];
const FALHOU = "We couldn’t send your request. Please try again, or reach us on WhatsApp or at +351 916 868 318.";
const ignora = (u) => /\/lv\/[tv](\?|$)|\/u\/script\.js/.test(u);

const falhas = [];
let feitos = 0;
const falha = (onde, msg) => falhas.push(`${onde}: ${msg}`);

function chrome() {
  const p = chromium.executablePath();
  if (p && existsSync(p)) return p;
  const base = join(process.env.LOCALAPPDATA || "", "ms-playwright");
  const dirs = existsSync(base) ? readdirSync(base).filter((d) => /^chromium-\d+$/.test(d)).sort((a, b) => Number(b.slice(9)) - Number(a.slice(9))) : [];
  for (const d of dirs) for (const s of ["chrome-win64/chrome.exe", "chrome-win/chrome.exe", "chrome-linux/chrome"]) if (existsSync(join(base, d, s))) return join(base, d, s);
  throw new Error("No local Chromium found under " + base);
}

/* ---------- static checks on dist ---------- */
function percorre(d, out = []) {
  for (const n of readdirSync(d)) {
    const p = join(d, n);
    if (statSync(p).isDirectory()) percorre(p, out);
    else out.push(p);
  }
  return out;
}
if (!existsSync(join(DIR, "index.html"))) {
  console.error(`FAIL no build at ${DIR}`);
  process.exit(1);
}
for (const f of percorre(DIR)) {
  const rel = f.slice(DIR.length + 1).replace(/\\/g, "/");
  if (rel.split("/").some((s) => /^[_.]/.test(s))) falha("dist", `${rel} starts with "_" or "." (404 on desk.texter.ai)`);
  if (/demo-en/i.test(rel)) falha("dist", `${rel} must never ship`);
  if (/\.(html|js|css)$/.test(rel) && readFileSync(f, "utf8").includes("demo-en")) falha("dist", `${rel} references demo-en`);
}
feitos++;

/* ---------- in-page probes ---------- */
const SONDA_H1 = `(() => {
  let min = 1;
  const f = () => {
    const h = document.querySelector("h1");
    if (h) {
      let o = 1;
      for (let e = h; e && e !== document.documentElement; e = e.parentElement) o *= parseFloat(getComputedStyle(e).opacity);
      if (o < min) min = o;
    }
    window.__h1min = min;
    requestAnimationFrame(f);
  };
  requestAnimationFrame(f);
})();`;

function medir() {
  const out = { pequenos: [], media: [], tracos: [], retos: [], larg: 0, vw: innerWidth, vv: visualViewport ? visualViewport.width : innerWidth };
  out.larg = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth);
  const escondido = (el) => {
    let o = 1;
    for (let e = el; e && e.nodeType === 1; e = e.parentElement) {
      const cs = getComputedStyle(e);
      if (cs.display === "none" || cs.visibility === "hidden") return true;
      o *= parseFloat(cs.opacity);
      const r = e.getBoundingClientRect();
      if ((r.width <= 1 || r.height <= 1) && cs.overflow !== "visible") return true;
      if (cs.clipPath === "inset(50%)") return true;
    }
    return o === 0 || el.getClientRects().length === 0;
  };
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const vistos = new Set();
  for (let n = w.nextNode(); n; n = w.nextNode()) {
    const t = n.textContent.trim();
    const el = n.parentElement;
    if (!t || !el || vistos.has(el) || /^(SCRIPT|STYLE|NOSCRIPT|TITLE|OPTION)$/.test(el.tagName)) continue;
    vistos.add(el);
    if (escondido(el)) continue;
    const fs = parseFloat(getComputedStyle(el).fontSize);
    let k = 1;
    if (el instanceof SVGElement) {
      const m = el.getScreenCTM();
      if (m) k = Math.hypot(m.a, m.b);
    } else {
      for (let e = el; e && e.nodeType === 1; e = e.parentElement) {
        const tr = getComputedStyle(e).transform;
        if (tr && tr !== "none") {
          const m = new DOMMatrix(tr);
          k *= Math.hypot(m.a, m.b);
        }
        const sc = getComputedStyle(e).scale;
        if (sc && sc !== "none") k *= parseFloat(sc.split(" ")[0]);
      }
    }
    const ef = fs * k;
    if (ef < 11.95) out.pequenos.push(`${ef.toFixed(1)}px "${t.slice(0, 40)}" <${el.tagName.toLowerCase()} class="${String(el.getAttribute("class") || "").slice(0, 60)}">`);
  }
  const semNome = (el) => !el.getAttribute("aria-label") && !el.getAttribute("aria-labelledby") && !el.querySelector(":scope > title");
  const oculto = (el) => !!el.closest('[aria-hidden="true"]');
  document.querySelectorAll("img").forEach((el) => {
    if (!el.hasAttribute("alt")) out.media.push(`img without alt: ${el.getAttribute("src")}`);
  });
  document.querySelectorAll("video").forEach((el) => {
    if (!oculto(el) && semNome(el)) out.media.push(`video without aria-label: ${el.getAttribute("src") || el.currentSrc}`);
  });
  document.querySelectorAll("svg").forEach((el) => {
    if (!oculto(el) && semNome(el) && !el.closest("[aria-label],[role=img]")) out.media.push(`svg neither aria-hidden nor labelled: <svg class="${el.getAttribute("class") || ""}">`);
  });
  document.querySelectorAll('[role="img"], iframe').forEach((el) => {
    if (!oculto(el) && semNome(el) && !el.getAttribute("title")) out.media.push(`${el.tagName.toLowerCase()} without a name`);
  });
  // house rule: every h1 and h2 renders in exactly two lines (text rows, so a drawn line between them does not count)
  out.titulos = [];
  document.querySelectorAll("h1, h2").forEach((h) => {
    if (escondido(h)) return;
    const centros = [];
    const tw = document.createTreeWalker(h, NodeFilter.SHOW_TEXT);
    for (let n = tw.nextNode(); n; n = tw.nextNode()) {
      if (!n.textContent.trim() || n.parentElement.closest(".sr-only")) continue;
      const r = document.createRange();
      r.selectNodeContents(n);
      for (const q of r.getClientRects()) if (q.width > 1 && q.height > 1) centros.push(q.top + q.height / 2);
    }
    centros.sort((a, b) => a - b);
    const fs = parseFloat(getComputedStyle(h).fontSize);
    let linhas = centros.length ? 1 : 0;
    for (let i = 1; i < centros.length; i++) if (centros[i] - centros[i - 1] > fs * 0.5) linhas++;
    if (linhas !== 2) out.titulos.push(`${h.tagName.toLowerCase()} in ${linhas} lines at ${fs}px: "${h.textContent.trim().slice(0, 60)}"`);
  });
  const textos = [document.body.innerText];
  document.querySelectorAll("[aria-label],[alt],[title],[placeholder]").forEach((el) => textos.push(el.getAttribute("aria-label") || "", el.getAttribute("alt") || "", el.getAttribute("title") || "", el.getAttribute("placeholder") || ""));
  for (const linha of textos.join("\n").split("\n")) {
    if (/[—–]|\s-\s/.test(linha)) out.tracos.push(linha.trim().slice(0, 90));
    if (/\p{L}'\p{L}/u.test(linha)) out.retos.push(linha.trim().slice(0, 90));
  }
  out.links = [...document.querySelectorAll("a[href]")].map((a) => a.href).filter((h) => h.startsWith(location.origin) && !h.includes("#"));
  return out;
}

async function percorrePagina(page) {
  await page.waitForFunction(() => !document.documentElement.classList.contains("abre"), null, { timeout: 6000 }).catch(() => {});
  const alto = await page.evaluate(() => document.documentElement.scrollHeight);
  const passo = (await page.evaluate(() => innerHeight)) * 0.7;
  for (let y = 0; y < alto; y += passo) {
    await page.evaluate((v) => scrollTo(0, v), y);
    await page.waitForTimeout(110);
  }
  await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
  await page.waitForTimeout(900);
}

const linksVistos = new Map();
async function estado(url) {
  if (linksVistos.has(url)) return linksVistos.get(url);
  const r = await fetch(url, { redirect: "follow" }).then((x) => x.status, () => 0);
  linksVistos.set(url, r);
  return r;
}

async function abre(ctx, url, onde, preparar) {
  const page = await ctx.newPage();
  const erros = [];
  let ativo = true;
  page.on("console", (m) => {
    if (ativo && m.type() === "error" && !ignora(m.location()?.url || "") && !ignora(m.text())) erros.push(`console: ${m.text().slice(0, 160)}`);
  });
  page.on("pageerror", (e) => ativo && erros.push(`page error: ${String(e.message || e).slice(0, 160)}`));
  page.on("requestfailed", (r) => {
    const u = r.url();
    const f = r.failure()?.errorText || "";
    if (!ativo || ignora(u) || (f.includes("ERR_ABORTED") && /\.(mp4|webm|vtt)(\?|$)/.test(u))) return;
    erros.push(`request failed: ${u} ${f}`);
  });
  page.on("response", (r) => {
    if (ativo && r.status() >= 400 && !ignora(r.url())) erros.push(`HTTP ${r.status()}: ${r.url()}`);
  });
  if (preparar) await preparar(page);
  const resp = await page.goto(url, { waitUntil: "load" });
  if (!resp || resp.status() !== 200) falha(onde, `route answered ${resp ? resp.status() : "nothing"}`);
  return {
    page,
    erros,
    fecha: async () => {
      ativo = false;
      await page.close();
    },
  };
}

const servidor = await servir({ dir: DIR, port: PORT });
const servidorSub = await servir({ dir: DIR, port: 0, prefixo: PREFIXO });
const ORIGEM = `http://127.0.0.1:${servidor.address().port}`;
const ORIGEM_SUB = `http://127.0.0.1:${servidorSub.address().port}`;
const browser = await chromium.launch({ executablePath: chrome(), args: ["--autoplay-policy=no-user-gesture-required", "--mute-audio"] });

try {
  for (const v of VISTAS) {
    const ctx = await browser.newContext({ viewport: v.viewport, isMobile: v.isMobile, hasTouch: v.hasTouch, deviceScaleFactor: v.deviceScaleFactor, reducedMotion: "no-preference" });
    await ctx.addInitScript(SONDA_H1);
    for (const rota of ROTAS) {
      const onde = `${v.nome} ${rota}`;
      const { page, erros, fecha } = await abre(ctx, ORIGEM + rota, onde);
      await percorrePagina(page);
      const m = await page.evaluate(medir);
      const h1 = await page.evaluate(() => (document.querySelector("h1") ? window.__h1min : -1));
      if (h1 === -1) falha(onde, "no h1");
      else if (h1 < 1) falha(onde, `h1 opacity dropped to ${h1}`);
      if (v.nome === "390" && (m.larg > 390 || m.vw !== 390 || Math.round(m.vv) !== 390)) falha(onde, `horizontal overflow: scrollWidth ${m.larg}, innerWidth ${m.vw}, visualViewport ${m.vv}`);
      m.pequenos.slice(0, 6).forEach((p) => falha(onde, `text under 12px ${p}`));
      m.media.forEach((p) => falha(onde, p));
      m.tracos.forEach((p) => falha(onde, `dash joining phrases: "${p}"`));
      m.retos.forEach((p) => falha(onde, `straight apostrophe (the copy uses ’): "${p}"`));
      m.titulos.forEach((p) => falha(onde, `title not in 2 lines: ${p}`));
      for (const l of new Set(m.links)) {
        const s = await estado(l);
        if (s !== 200) falha(onde, `link ${l} answered ${s}`);
      }
      erros.forEach((e) => falha(onde, e));
      await fecha();
      feitos++;
      console.log(`${falhas.some((f) => f.startsWith(onde + ":")) ? "FAIL" : "ok  "} ${onde}`);
    }
    await ctx.close();
  }

  // the intro runs on the home, lifts, and leaves the header logo visible
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const { page, erros, fecha } = await abre(ctx, ORIGEM + "/", "intro");
    const comeca = await page.evaluate(() => document.documentElement.classList.contains("abre"));
    if (!comeca) falha("intro", "html.abre was not set on a fresh home visit");
    await page.waitForTimeout(3200);
    const fim = await page.evaluate(() => ({ abre: document.documentElement.classList.contains("abre"), logo: getComputedStyle(document.querySelector("[data-logo-topo]")).opacity, caixa: !!document.querySelector(".abertura") }));
    if (fim.abre || fim.caixa || fim.logo !== "1") falha("intro", `did not lift: ${JSON.stringify(fim)}`);
    erros.forEach((e) => falha("intro", e));
    await fecha();
    await ctx.close();
    feitos++;
  }

  // the intro moves only by transform: the home with the intro stays under a 0.05 layout-shift budget
  for (const rota of ["/", "/ask/"]) {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
    await ctx.addInitScript(() => {
      window.__cls = 0;
      new PerformanceObserver((l) => {
        for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value;
      }).observe({ type: "layout-shift", buffered: true });
    });
    const onde = `cls ${rota}`;
    const { page, erros, fecha } = await abre(ctx, ORIGEM + rota, onde);
    await page.waitForTimeout(3600);
    const cls = await page.evaluate(() => window.__cls);
    if (!(cls < 0.05)) falha(onde, `layout shift ${cls.toFixed(4)} with the intro (budget 0.05)`);
    erros.forEach((e) => falha(onde, e));
    await fecha();
    await ctx.close();
    feitos++;
  }

  // motion off (OS setting or the footer toggle): no element fades or blurs through in-between values
  {
    const amostra = (page) =>
      page.evaluate(
        () =>
          new Promise((ok) => {
            const vals = new Map();
            const t0 = performance.now();
            const f = () => {
              document.querySelectorAll("[style]").forEach((el) => {
                if (!/opacity|filter/.test(el.getAttribute("style") || "")) return;
                const cs = getComputedStyle(el);
                let s = vals.get(el);
                if (!s) vals.set(el, (s = new Set()));
                s.add(`${cs.opacity}|${cs.filter}`);
              });
              if (performance.now() - t0 < 700) requestAnimationFrame(f);
              else ok([...vals].filter(([, s]) => s.size >= 3).map(([el, s]) => `<${el.tagName.toLowerCase()} class="${(el.getAttribute("class") || "").slice(0, 50)}"> ${[...s].slice(0, 3).join(", ")}`));
            };
            requestAnimationFrame(f);
          }),
      );
    for (const [nome, opcoes, calma] of [
      ["os-reduce", { reducedMotion: "reduce" }, false],
      ["lv-calm", { reducedMotion: "no-preference" }, true],
    ]) {
      const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, ...opcoes });
      if (calma) await ctx.addInitScript(() => localStorage.setItem("lv-calm", "1"));
      for (const rota of ["/", "/product/"]) {
        const onde = `motion-off ${nome} ${rota}`;
        const { page, erros, fecha } = await abre(ctx, ORIGEM + rota, onde);
        const a = await amostra(page);
        await page.evaluate(() => document.getElementById("demo").scrollIntoView());
        const b = await amostra(page);
        [...a, ...b].slice(0, 4).forEach((p) => falha(onde, `animates with motion off: ${p}`));
        erros.forEach((e) => falha(onde, e));
        await fecha();
        feitos++;
      }
      await ctx.close();
    }
  }

  // reduced motion: no intro, motion off, page still whole
  {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: "reduce" });
    const { page, erros, fecha } = await abre(ctx, ORIGEM + "/", "reduced-motion");
    const s = await page.evaluate(() => ({ mov: document.documentElement.dataset.mov, abre: document.documentElement.classList.contains("abre"), intro: !!document.querySelector(".abertura") }));
    if (s.mov !== "off" || s.abre || s.intro) falha("reduced-motion", JSON.stringify(s));
    erros.forEach((e) => falha("reduced-motion", e));
    await fecha();
    await ctx.close();
    feitos++;
  }

  // the footer toggle writes lv-calm and switches motion off
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const { page, erros, fecha } = await abre(ctx, ORIGEM + "/product/", "motion-toggle");
    await page.getByRole("button", { name: "Reduce motion" }).click();
    const s = await page.evaluate(() => ({ mov: document.documentElement.dataset.mov, calm: localStorage.getItem("lv-calm") }));
    if (s.mov !== "off" || s.calm !== "1") falha("motion-toggle", JSON.stringify(s));
    await page.reload({ waitUntil: "load" });
    if ((await page.evaluate(() => document.documentElement.dataset.mov)) !== "off") falha("motion-toggle", "lv-calm not honoured after reload");
    erros.forEach((e) => falha("motion-toggle", e));
    await fecha();
    await ctx.close();
    feitos++;
  }

  // in-page links keep the /r/ path under the <base> tag
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const { page, erros, fecha } = await abre(ctx, ORIGEM + "/r/LV-0001#demo", "r-route");
    await page.locator('a[data-cta="header"]').click();
    await page.waitForTimeout(400);
    const u = await page.evaluate(() => location.pathname + location.hash);
    if (u !== "/r/LV-0001#demo") falha("r-route", `in-page link went to ${u}`);
    erros.forEach((e) => falha("r-route", e));
    await fecha();
    await ctx.close();
    feitos++;
  }

  // the form on a host without /lv/t shows the real error with WhatsApp, never a success
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const { page, erros, fecha } = await abre(ctx, ORIGEM + "/contact/#demo", "form");
    await page.locator('a[data-cta="header"]').click();
    await page.getByRole("button", { name: "Continue" }).click();
    const semEscolha = (await page.locator('#demo [role="alert"]').textContent().catch(() => "")) || "";
    if (semEscolha.trim() !== "Choose an option to continue.") falha("form", `no announced error for a missing option: "${semEscolha.trim()}"`);
    await page.locator("#demo label", { hasText: "Alfresco" }).click();
    await page.getByRole("button", { name: "Continue" }).click();
    await page.waitForTimeout(900);
    const focoNome = await page.evaluate(() => document.activeElement?.getAttribute("name"));
    if (focoNome !== "name") falha("form", `focus after Continue is on ${focoNome}, expected the name field`);
    const caso = async (esperado, campo) => {
      await page.click('#demo button[type="submit"]');
      await page.waitForTimeout(150);
      const r = await page.evaluate(() => ({
        alerta: document.querySelector('#demo [role="alert"]')?.textContent?.trim() || "",
        foco: document.activeElement?.getAttribute("name") || document.activeElement?.tagName,
        invalido: [...document.querySelectorAll('#demo [aria-invalid="true"]')].map((e) => e.getAttribute("name")),
      }));
      if (r.alerta !== esperado || r.foco !== campo || r.invalido.join() !== campo) falha("form", `expected "${esperado}" on ${campo}, got ${JSON.stringify(r)}`);
    };
    await caso("Please enter your name.", "name");
    await page.fill('input[name="name"]', "Check");
    await caso("Please enter your work email.", "email");
    await page.fill('input[name="email"]', "check@");
    await caso("Please enter a valid work email.", "email");
    await page.fill('input[name="email"]', "check@example.com");
    await caso("Please enter your company.", "company");
    await page.fill('input[name="company"]', "Check");
    await caso("Please agree to be contacted about this request.", "consent");
    await page.getByRole("button", { name: "Back" }).click();
    await page.getByRole("button", { name: "Continue" }).click();
    await page.waitForTimeout(900);
    const depois = await page.evaluate(() => ({ nome: document.querySelector('input[name="name"]')?.value, alerta: !!document.querySelector('#demo [role="alert"]') }));
    if (depois.nome !== "Check" || depois.alerta) falha("form", `Back then Continue lost the values or kept the old error: ${JSON.stringify(depois)}`);
    await page.check('input[name="consent"]');
    const pedido = page.waitForRequest((r) => r.url().endsWith("/lv/t") && r.method() === "POST");
    await page.click('#demo button[type="submit"]');
    const corpo = JSON.parse((await pedido).postData() || "{}");
    for (const [k, v] of Object.entries({ page: "desk", repository: "Alfresco", name: "Check", email: "check@example.com", company: "Check", website: "", evento: "form", cta: "header" }))
      if (corpo[k] !== v) falha("form", `body.${k} = ${JSON.stringify(corpo[k])}, expected ${JSON.stringify(v)}`);
    const alerta = page.locator('#demo [role="alert"]');
    await alerta.waitFor({ timeout: 5000 }).catch(() => {});
    const texto = (await alerta.textContent().catch(() => "")) || "";
    if (texto.trim() !== FALHOU) falha("form", `error line is "${texto.trim()}"`);
    if (!(await alerta.locator('a[href^="https://wa.me/351916868318"]').count())) falha("form", "error line has no WhatsApp link");
    if (await page.getByText("Request received.").count()) falha("form", "success state shown without a server");
    const focoErro = await page.evaluate(() => document.activeElement?.tagName);
    if (focoErro === "BODY") falha("form", "focus fell to the page after the send error");
    erros.forEach((e) => falha("form", e));
    await fecha();
    await ctx.close();
    feitos++;
  }

  // the same build under a sub-path (GitHub Pages)
  {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    for (const rota of ["", "product/", "integrations/doxis/", "r/LV-0001", "ask/r/LV-0001"]) {
      const onde = `sub-path ${PREFIXO}${rota}`;
      const { page, erros, fecha } = await abre(ctx, ORIGEM_SUB + PREFIXO + rota, onde);
      await page.waitForTimeout(600);
      const links = await page.evaluate(() => [...document.querySelectorAll("a[href]")].map((a) => a.href).filter((h) => h.startsWith(location.origin) && !h.includes("#")));
      for (const l of new Set(links)) {
        const s = await estado(l);
        if (s !== 200) falha(onde, `link ${l} answered ${s}`);
      }
      erros.forEach((e) => falha(onde, e));
      await fecha();
      feitos++;
    }
    await ctx.close();
  }
} finally {
  await browser.close();
  servidor.close();
  servidorSub.close();
}

for (const f of falhas) console.log("FAIL " + f);
console.log(`check: ${feitos} checks, ${falhas.length} failures`);
process.exit(falhas.length ? 1 : 0);
