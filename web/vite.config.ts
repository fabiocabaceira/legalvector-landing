import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { HERO_FILM } from "./src/filme-heroi";

const AQUI = __dirname;
const FORA = new Set(["node_modules", "src", "dist", "public", "scripts"]);

/** Every index.html in the folder tree is one page. The lab page is built only with LV_LAB=1. */
function entradas(dir = AQUI, out: Record<string, string> = {}) {
  for (const nome of readdirSync(dir)) {
    if (FORA.has(nome) || nome.startsWith(".")) continue;
    if (nome === "lab" && !process.env.LV_LAB) continue;
    const p = join(dir, nome);
    if (statSync(p).isDirectory()) entradas(p, out);
    else if (nome === "index.html") out[relative(AQUI, dir).replace(/\\/g, "/") || "home"] = p;
  }
  return out;
}

/** The hero poster preload in the home and ask heads comes from the one HERO_FILM record. */
function filmeHeroi(): Plugin {
  return {
    name: "lv-filme-heroi",
    transformIndexHtml: { order: "pre", handler: (html) => html.replaceAll("__HERO_POSTER__", HERO_FILM.poster) },
  };
}

/**
 * Home and ask are also served at /r/LV-#### and /ask/r/LV-####, where a script sets <base> to the real folder.
 * The browser's preload scanner fetches static relative tags before that script runs and gets 404s, so their
 * asset tags are written by a script after the <base> instead of sitting in the markup.
 */
function rotasR(): Plugin {
  return {
    name: "lv-rotas-r",
    apply: "build",
    transformIndexHtml: {
      order: "post",
      handler(html) {
        if (!html.includes('id="lv-r"')) return html;
        const fim = html.indexOf("</head>");
        const tags: string[] = [];
        const cabeca = html.slice(0, fim).replace(/<(?:link|script)\b[^>]*\s(?:href|src)="\.\.?\/[^"]*"[^>]*>(?:<\/script>)?\s*/g, (t) => {
          tags.push(t.trim());
          return "";
        });
        const escrito = JSON.stringify(tags.join("")).split("</").join("<" + String.fromCharCode(92) + "/");
        return `${cabeca}<script>document.write(${escrito})</script>\n${html.slice(fim)}`;
      },
    },
  };
}

/**
 * The absolute address in the share tags (canonical, og:url, og:image, twitter:image). One place: LV_SITE at build time,
 * for example LV_SITE=https://fabiocabaceira.github.io/legalvector-landing/ for a GitHub Pages copy. desk.texter.ai by default.
 * desk.texter.ai serves folders only through its own routes, so there the inner pages are named by their index.html.
 */
const SITE = (process.env.LV_SITE || "https://desk.texter.ai/").replace(/\/?$/, "/");
function site(): Plugin {
  const desk = new URL(SITE).hostname === "desk.texter.ai";
  return {
    name: "lv-site",
    transformIndexHtml: {
      order: "pre",
      handler: (html) =>
        html
          .replace(/(<link rel="canonical" href="|<meta property="og:url" content=")https:\/\/desk\.texter\.ai\/([^"]*)"/g, (_, a: string, rota: string) => `${a}${SITE}${desk && rota && rota !== "ask/" ? rota + "index.html" : rota}"`)
          .replaceAll("https://desk.texter.ai/", SITE),
    },
  };
}

/**
 * GitHub Pages has no rewrites: /r/LV-#### and /ask/r/LV-#### reach 404.html (HTTP 404). This page writes the built home
 * or ask HTML in place, so the URL keeps the code and the lv-r script sets <base> as on desk.texter.ai.
 */
function naoEncontrada(): Plugin {
  let dir = "";
  return {
    name: "lv-404",
    apply: "build",
    configResolved: (c) => void (dir = resolve(c.root, c.build.outDir)),
    closeBundle() {
      const js = (s: string) => JSON.stringify(s).split("</").join("<" + String.fromCharCode(92) + "/");
      const home = readFileSync(join(dir, "index.html"), "utf8");
      const ask = readFileSync(join(dir, "ask", "index.html"), "utf8");
      const nada = `<title>Not found · legalVector</title><style>html{background:#0e1a19;color:#e6efe9;font:16px/1.5 system-ui,sans-serif}body{margin:20vh auto;max-width:32rem;padding:0 1.5rem}a{color:inherit}</style><p>This page does not exist.</p><p><a href="${SITE}">Go to legalVector</a></p>`;
      writeFileSync(
        join(dir, "404.html"),
        `<!doctype html>\n<meta charset="utf-8">\n<script>(function(){var m=location.pathname.match(/\\/(ask\\/)?r\\/lv-\\d+\\/?$/i);document.write(m?(m[1]?${js(ask)}:${js(home)}):${js(nada)})})()</script>\n`,
      );
    },
  };
}

// desk.texter.ai's static server answers 404 for any path segment that starts with "_" or "."
const limpo = (n: string) => n.replace(/^[_.]+/, "").replace(/\/[_.]+/g, "/");

export default defineConfig({
  base: "./",
  publicDir: "public",
  plugins: [react(), tailwindcss(), filmeHeroi(), site(), rotasR(), naoEncontrada()],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    assetsDir: "app",
    rollupOptions: {
      input: entradas(),
      output: {
        entryFileNames: (c) => `app/${limpo(c.name.replace(/\//g, "-"))}-[hash].js`,
        chunkFileNames: (c) => `app/${limpo(c.name)}-[hash].js`,
        assetFileNames: (a) => `app/${limpo((a.name ?? "asset").replace(/\.[^.]+$/, ""))}-[hash][extname]`,
        sanitizeFileName: (n) => limpo(n.replace(/[^\w./-]/g, "-")),
      },
    },
  },
  server: { port: 4790, strictPort: false },
  preview: { port: 4790 },
});
