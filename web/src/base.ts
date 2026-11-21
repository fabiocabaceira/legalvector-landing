import { HERO_FILM, type Filme } from "./filme-heroi";

export { HERO_FILM };
export type { Filme };

export type Pagina = "home" | "ask" | "product" | "alfresco" | "doxis" | "questions" | "contact" | "lab";
export type Linhas = readonly [string, string];

const raiz = document.getElementById("raiz");
export const PAGINA = (raiz?.dataset.pagina || "home") as Pagina;
export const RAIZ = raiz?.dataset.raiz || "./";
export const EH_HOME = PAGINA === "home" || PAGINA === "ask";

// desk.texter.ai serves folders only through its own routes; a file path keeps inner pages reachable there without a server patch.
const DESK = location.hostname === "desk.texter.ai";
export const A = (p: string) => RAIZ + p;
export const R = (p: string) => RAIZ + (DESK && p.endsWith("/") && p !== "ask/" ? p + "index.html" : p);

export const ROTAS: Record<Exclude<Pagina, "lab">, string> = {
  home: "",
  ask: "ask/",
  product: "product/",
  alfresco: "integrations/alfresco/",
  doxis: "integrations/doxis/",
  questions: "questions/",
  contact: "contact/",
};
export const NAV: ReadonlyArray<readonly [string, Exclude<Pagina, "lab">]> = [
  ["Product", "product"],
  ["Alfresco", "alfresco"],
  ["Doxis", "doxis"],
  ["Questions", "questions"],
];

export const curva: [number, number, number, number] = [0.2, 0.7, 0.1, 1];
export const ABRE = document.documentElement.classList.contains("abre");
export const movLigado = () => document.documentElement.dataset.mov !== "off";

/* conversion wording and contacts */
export const CTA = "Book a demo";
export const FALAR = "Talk to us";
export const WA_NUMERO = "351916868318";
export const TELEFONE = "+351 916 868 318";
export const TEL_HREF = "tel:+351916868318";
export const PRIVACIDADE = "https://texter.ai/privacy";
export const SITE_PRODUTO = "https://legal.texter.ai/en";
/** The one caption under a real screen or film (copy deck 3.3, 4.2, 5.3, 6.2). */
export const LEGENDA = "Real product, demo data.";

/* form plumbing (lv-facts 9) */
export const PAGINA_FORM: "desk" | "ask" = PAGINA === "ask" ? "ask" : "desk";
export const VARIANTE = PAGINA === "ask" ? "requests" : "review";
// v4 spelling kept on purpose: the server-side WhatsApp text is matched as v4 wrote it.
export const WA_TEXTO = `Hi Fábio, I saw the LegalVector page (${PAGINA_FORM}) and I'd like a demo.`;
export const FORM_URL = "/lv/t";
export const VISITA_URL = "/lv/v";

export const UMAMI = {
  src: "/u/script.js",
  desk: "8499cd0c-df4b-4963-9b01-1f8da7ba6086",
  ask: "1889c764-360b-4e0e-a63b-b9c795d907e9",
  dominios: "desk.texter.ai",
} as const;

export const EVENTOS = {
  bookDemo: "book-demo",
  formSubmit: "demo-form-submit",
  whatsapp: "whatsapp-click",
  videoPlay: "demo-video-play",
} as const;

export const CHAVES = { calm: "lv-calm", origin: "lv-origin", r: "lv-r", teste: "lv-teste" } as const;

// visit-tracker keys: [selector, key]. Only topo, problema and demo are on the live server list today.
export const SECCOES: ReadonlyArray<readonly [string, string]> = [
  ["#top", "topo"],
  ["#pain", "problema"],
  ["#features", "funcoes"],
  ["#why", "comparar"],
  ["#rule", "regra"],
  ["#demo", "demo"],
];

/* the other two real-product films, for the inner pages */
export const FILME_REVIEW: Filme = {
  src720: "campaign/film/live-ai-review.mp4",
  poster: "campaign/film/live-ai-review.webp",
  vtt: "campaign/film/live-ai-review.vtt",
  label: "The real product: the AI review checks a contract against Legal’s playbook, 29 seconds",
  seconds: 29.27,
};
export const FILME_DECISAO: Filme = {
  src720: "campaign/film/live-decision.mp4",
  poster: "campaign/film/live-decision.webp",
  vtt: "campaign/film/live-decision.vtt",
  label: "The real product: a lawyer approves and the decision is written back to Doxis, 21 seconds",
  seconds: 20.8,
};
export const chaveFilme = (f: Filme) => f.src720.replace(/^.*\//, "").replace(/\.\w+$/, "");

/* one sound at a time: a player that takes the sound tells the others to go quiet */
export function pedeSom(dono: string) {
  dispatchEvent(new CustomEvent<string>("lv-som", { detail: dono }));
}
export function ouveSom(dono: string, calar: () => void) {
  const f = (e: Event) => {
    if ((e as CustomEvent<string>).detail !== dono) calar();
  };
  addEventListener("lv-som", f);
  return () => removeEventListener("lv-som", f);
}

/* the home intro tells the page when the curtain starts to lift */
let cortina = !ABRE;
export const cortinaAberta = () => cortina;
export function abreCortina() {
  if (cortina) return;
  cortina = true;
  dispatchEvent(new Event("lv-cortina"));
}
