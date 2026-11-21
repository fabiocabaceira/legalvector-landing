// Static server for dist/ that behaves like desk.texter.ai for the routes the cold emails use:
// /r/LV-#### serves the home and /ask/r/LV-#### serves /ask/, also under a sub-path prefix (GitHub Pages).
// POST /lv/t and /lv/v answer 405, as GitHub Pages does, so the form shows its real error state.
import { createServer } from "node:http";
import { createReadStream, existsSync, statSync } from "node:fs";
import { extname, join, normalize, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const TIPOS = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".vtt": "text/vtt; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
};

export function servir({ dir = "dist", port = 4790, prefixo = "/" } = {}) {
  const raiz = resolve(dir);
  const pre = ("/" + prefixo + "/").replace(/\/+/g, "/");
  const server = createServer((req, res) => {
    const url = new URL(req.url || "/", "http://x");
    let p = decodeURIComponent(url.pathname);
    if (pre !== "/") {
      if (p + "/" === pre) return redirige(res, pre + url.search);
      if (!p.startsWith(pre)) return fim(res, 404);
      p = "/" + p.slice(pre.length);
    }
    if (p.startsWith("/lv/")) return fim(res, req.method === "POST" ? 405 : 404);
    if (/^\/r\/lv-\d+\/?$/i.test(p)) p = "/index.html";
    else if (/^\/ask\/r\/lv-\d+\/?$/i.test(p)) p = "/ask/index.html";

    let f = normalize(join(raiz, p));
    if (f !== raiz && !f.startsWith(raiz + sep)) return fim(res, 403);
    if (!existsSync(f)) return fim(res, 404);
    if (statSync(f).isDirectory()) {
      if (!p.endsWith("/")) return redirige(res, url.pathname + "/" + url.search);
      f = join(f, "index.html");
      if (!existsSync(f)) return fim(res, 404);
    }
    if (req.method !== "GET" && req.method !== "HEAD") return fim(res, 405);

    const tam = statSync(f).size;
    const tipo = TIPOS[extname(f).toLowerCase()] || "application/octet-stream";
    const cab = { "content-type": tipo, "accept-ranges": "bytes", "cache-control": "no-cache" };
    const range = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range || "");
    if (range && (range[1] || range[2])) {
      const ini = range[1] ? Number(range[1]) : Math.max(0, tam - Number(range[2]));
      const fimB = range[1] && range[2] ? Math.min(Number(range[2]), tam - 1) : tam - 1;
      if (ini >= tam || ini > fimB) {
        res.writeHead(416, { "content-range": `bytes */${tam}` });
        return res.end();
      }
      res.writeHead(206, { ...cab, "content-range": `bytes ${ini}-${fimB}/${tam}`, "content-length": fimB - ini + 1 });
      if (req.method === "HEAD") return res.end();
      return createReadStream(f, { start: ini, end: fimB }).pipe(res);
    }
    res.writeHead(200, { ...cab, "content-length": tam });
    if (req.method === "HEAD") return res.end();
    createReadStream(f).pipe(res);
  });
  return new Promise((ok, falha) => {
    server.once("error", falha);
    server.listen(port, "127.0.0.1", () => ok(server));
  });
}

function fim(res, codigo) {
  res.writeHead(codigo, { "content-type": "text/plain; charset=utf-8" });
  res.end(String(codigo));
}
function redirige(res, para) {
  res.writeHead(301, { location: para });
  res.end();
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const arg = (n, d) => {
    const i = process.argv.indexOf(n);
    return i > 0 ? process.argv[i + 1] : d;
  };
  const dir = arg("--dir", "dist");
  const port = Number(arg("--port", process.env.PORT || 4790));
  const prefixo = arg("--prefix", "/");
  await servir({ dir, port, prefixo });
  console.log(`serving ${resolve(dir)} at http://127.0.0.1:${port}${("/" + prefixo + "/").replace(/\/+/g, "/")}`);
}
