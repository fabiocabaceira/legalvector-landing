// Conversion plumbing ported from the v4 page (lv-facts 9): origin and UTMs, the LV code, WhatsApp ref,
// dataLayer, Umami and the visit tracker. Same keys, same payloads, same event names.
import { CHAVES, EH_HOME, EVENTOS, PAGINA, PAGINA_FORM, SECCOES, SITE_PRODUTO, UMAMI, VARIANTE, VISITA_URL, WA_NUMERO, WA_TEXTO } from "./base";

type Dados = Record<string, string | number | boolean | undefined>;
declare global {
  interface Window {
    dataLayer?: Dados[];
    umami?: { track: (nome: string, dados?: Dados) => void };
  }
}

const q = new URLSearchParams(location.search);
const limpa = (v: string | null, n = 60) => (v || "").replace(/[^\w\-.@ ]/g, "").slice(0, n);

export let origem: Dados = {
  variant: VARIANTE,
  o: limpa(q.get("o")),
  utm_source: limpa(q.get("utm_source")),
  utm_medium: limpa(q.get("utm_medium")),
  utm_campaign: limpa(q.get("utm_campaign")),
  utm_content: limpa(q.get("utm_content")),
  lead_id: limpa(q.get("lid")),
};
try {
  if (origem.utm_source || origem.o) localStorage.setItem(CHAVES.origin, JSON.stringify({ o: origem, t: Date.now() }));
  else {
    const guardado = JSON.parse(localStorage.getItem(CHAVES.origin) || "null");
    if (guardado && Date.now() - guardado.t < 2592e6) origem = Object.assign(guardado.o, { variant: VARIANTE, returning: "1" });
  }
} catch {
  /* no storage */
}

const eCodigo = (v: string) => /^LV-\d{4}$/.test(v);
let codigo = (q.get("r") || (location.pathname.match(/\/r\/(lv-\d{4})\/?$/i) || [])[1] || "").toUpperCase();
try {
  if (eCodigo(codigo)) sessionStorage.setItem(CHAVES.r, codigo);
  else codigo = sessionStorage.getItem(CHAVES.r) || "";
} catch {
  /* no storage */
}
if (!eCodigo(codigo)) codigo = "";
export const CODIGO = codigo;

let teste = q.get("lvteste") === "1";
try {
  if (teste) sessionStorage.setItem(CHAVES.teste, "1");
  else teste = sessionStorage.getItem(CHAVES.teste) === "1";
} catch {
  /* no storage */
}
export const TESTE = teste;

export const REF = CODIGO || [origem.utm_source, origem.utm_campaign].filter(Boolean).join("/") || String(origem.o || "");
export const WA_HREF = `https://wa.me/${WA_NUMERO}?text=${encodeURIComponent(WA_TEXTO + (REF ? " Ref: " + REF : ""))}`;

export function urlProduto() {
  const u = new URL(SITE_PRODUTO);
  (["utm_source", "utm_medium", "utm_campaign"] as const).forEach((k) => {
    if (origem[k]) u.searchParams.set(k, String(origem[k]));
  });
  u.searchParams.set("utm_content", "lp-" + VARIANTE);
  return u.toString();
}

let ultimo = "direct";
export const ultimoCta = () => ultimo;

export function track(nome: string, extra?: Dados) {
  (window.dataLayer = window.dataLayer || []).push(Object.assign({ event: nome }, origem, extra || {}));
}
export function umami(nome: string, dados?: Dados) {
  try {
    window.umami?.track(nome, dados);
  } catch {
    /* analytics must never break the page */
  }
}

let filmesVistos: Record<string, boolean> = {};
export function filmeComSom(chave: string) {
  if (filmesVistos[chave]) return;
  filmesVistos[chave] = true;
  track("demo_video_play", { video: chave });
  umami(EVENTOS.videoPlay, { page: VARIANTE, video: chave });
}

let iniciado = false;
export function iniciarRastreio() {
  if (iniciado) return;
  iniciado = true;
  filmesVistos = {};

  if (location.hostname === UMAMI.dominios) {
    const s = document.createElement("script");
    s.defer = true;
    s.src = UMAMI.src;
    s.dataset.websiteId = PAGINA === "ask" ? UMAMI.ask : UMAMI.desk;
    s.dataset.domains = UMAMI.dominios;
    document.head.appendChild(s);
  }

  track("page_view");
  document.addEventListener("click", (e) => {
    const t = e.target as Element | null;
    const wa = t?.closest?.('a[href^="https://wa.me/"]');
    if (wa) umami(EVENTOS.whatsapp, { page: PAGINA_FORM, cta: wa.getAttribute("data-cta") || "", ref: REF });
    const a = t?.closest?.("[data-cta],[data-event]");
    if (!a) return;
    const c = a.getAttribute("data-cta");
    if (c && c !== "submit") {
      ultimo = c;
      track("cta", { cta: c });
    } else if (!c) track(a.getAttribute("data-event") || "");
  });
  document.addEventListener(
    "click",
    (e) => {
      const a = (e.target as Element | null)?.closest?.('a[href="#demo"][data-cta]');
      if (a) umami(EVENTOS.bookDemo, { cta: a.getAttribute("data-cta") || "" });
    },
    true,
  );

  visitas();
}

// Visit tracker: only with a valid LV code, skipped for webdriver unless lvteste=1 (v4, LP:476-523).
function visitas() {
  if (!CODIGO || !EH_HOME || (navigator.webdriver && !TESTE)) return;
  const L = PAGINA_FORM;
  const IDLE = 60000;
  const GAP = 29 * 60000;
  interface Visita { v: string; a: number; p: number; s: Record<string, 1>; vd: Record<string, 1>; k: string[]; on: boolean; la: number; sa: number; dirty: boolean }
  let V: Visita;
  let lastInput = Date.now();
  let tick = Date.now();
  let armT: number | null = null;
  let playing: HTMLVideoElement[] = [];
  const now = () => Date.now();
  const vis = () => document.visibilityState === "visible";
  const rid = () => {
    try {
      return crypto.randomUUID();
    } catch {
      return now().toString(36) + Math.random().toString(36).slice(2, 14);
    }
  };
  const fresh = () => {
    V = { v: rid(), a: 0, p: 0, s: {}, vd: {}, k: [], on: false, la: now(), sa: -1, dirty: true };
  };
  const active = () => vis() && (now() - lastInput < IDLE || playing.length > 0);
  const accrue = () => {
    const n = now();
    if (V.on && active()) {
      V.a += Math.min(n - tick, 5000);
      V.la = n;
    }
    tick = n;
  };
  const pct = () => {
    const d = document.documentElement;
    const h = Math.max(d.scrollHeight, document.body.scrollHeight) || 1;
    return Math.min(100, Math.round((100 * ((window.scrollY || d.scrollTop) + innerHeight)) / h));
  };
  const look = () => {
    if (!V.on || !vis()) return;
    const p = pct();
    const vh = innerHeight;
    if (p > V.p) {
      V.p = p;
      V.dirty = true;
    }
    SECCOES.forEach(([sel, k]) => {
      if (V.s[k]) return;
      const el = document.querySelector(sel);
      if (!el) return;
      const r = el.getBoundingClientRect();
      const seen = Math.max(0, Math.min(r.bottom, vh) - Math.max(r.top, 0));
      if (r.height && (seen / r.height >= 0.35 || seen >= vh * 0.5)) {
        V.s[k] = 1;
        V.dirty = true;
      }
    });
  };
  const body = (t: string) =>
    JSON.stringify({ t, v: V.v, c: CODIGO, l: L, a: V.a, p: V.p, s: Object.keys(V.s), vd: Object.keys(V.vd), k: V.k, x: TESTE ? 1 : 0, ua: navigator.userAgent || "", ref: document.referrer || "" });
  const send = (t: string) => {
    if (!V.on) return;
    const b = body(t);
    V.sa = V.a;
    V.dirty = false;
    try {
      if (navigator.sendBeacon && navigator.sendBeacon(VISITA_URL, b)) return;
    } catch {
      /* fall through to fetch */
    }
    try {
      fetch(VISITA_URL, { method: "POST", body: b, keepalive: true, headers: { "content-type": "text/plain;charset=UTF-8" } }).catch(() => {});
    } catch {
      /* ignore */
    }
  };
  const start = () => {
    if (V.on || !vis()) return;
    V.on = true;
    V.la = now();
    tick = now();
    look();
    send("s");
  };
  const arm = () => {
    if (V.on || armT || !vis()) return;
    armT = window.setTimeout(() => {
      armT = null;
      start();
    }, 2500);
  };
  const stale = () => V.on && now() - V.la > GAP;
  const touch = () => {
    const n = now();
    if (stale()) {
      fresh();
      lastInput = n;
      start();
    }
    lastInput = n;
  };
  fresh();
  ["pointerdown", "pointermove", "keydown", "wheel", "touchstart"].forEach((e) => addEventListener(e, touch, { passive: true, capture: true }));
  let raf = 0;
  addEventListener(
    "scroll",
    () => {
      touch();
      if (!raf)
        raf = requestAnimationFrame(() => {
          raf = 0;
          look();
        });
    },
    { passive: true },
  );
  // media events do not bubble, so the tracker listens in the capture phase
  const chave = (v: HTMLVideoElement) => {
    const i = Array.from(document.querySelectorAll("video[data-live]")).indexOf(v);
    return i === 0 ? "v1" : i === 1 ? "v2" : "";
  };
  const filme = (e: Event) => {
    const v = e.target;
    return v instanceof HTMLVideoElement && v.dataset.film ? v : null;
  };
  document.addEventListener(
    "playing",
    (e) => {
      const v = filme(e);
      if (!v) return;
      touch();
      if (!playing.includes(v)) playing.push(v);
    },
    true,
  );
  document.addEventListener(
    "pause",
    (e) => {
      const v = filme(e);
      if (v) playing = playing.filter((o) => o !== v);
    },
    true,
  );
  document.addEventListener(
    "timeupdate",
    (e) => {
      const v = filme(e);
      if (!v) return;
      const k = chave(v);
      if (k && V.on && !V.vd[k] && v.currentTime >= 3) {
        V.vd[k] = 1;
        V.dirty = true;
        send("h");
      }
    },
    true,
  );
  document.addEventListener(
    "click",
    (e) => {
      const a = (e.target as Element | null)?.closest?.("[data-cta]");
      if (!a) return;
      const k = a.getAttribute("data-cta") || "";
      if (k === "submit") return;
      touch();
      start();
      if (V.on && V.k.length < 30) {
        V.k.push(k);
        send("h");
      }
    },
    true,
  );
  setInterval(() => {
    accrue();
    look();
  }, 1000);
  setInterval(() => {
    if (V.on && (V.dirty || V.a - V.sa >= 1000)) send("h");
  }, 15000);
  document.addEventListener("visibilitychange", () => {
    if (vis()) {
      tick = now();
      if (stale()) fresh();
      arm();
    } else {
      if (armT) {
        clearTimeout(armT);
        armT = null;
      }
      accrue();
      if (V.on) send("h");
    }
  });
  addEventListener("pagehide", () => {
    accrue();
    if (V.on) send("e");
  });
  addEventListener("pageshow", (e) => {
    if (e.persisted) {
      fresh();
      lastInput = now();
      arm();
    }
  });
  arm();
}
