import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { A, ouveSom, pedeSom } from "./base";
import { track } from "./rastreio";

/* ---------------- the reel deck (Doxter Carrossel, imperative core kept) ---------------- */
export interface Reel {
  id: string;
  titulo: string;
}

/** The three 9:16 reels, in the order of the reels body sentence (copy deck 3.2). */
export const REELS: readonly Reel[] = [
  { id: "reel-intake", titulo: "How many requests reached Legal today?" },
  { id: "reel-review", titulo: "One contract. Five versions." },
  { id: "reel-deadlines", titulo: "The notice deadline passed yesterday." },
];

const SVG_SOM_ON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor" stroke="none"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/></svg>';
const SVG_SOM_OFF = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor" stroke="none"/><path d="m16 9.5 5 5m0-5-5 5"/></svg>';

/**
 * Fanned deck of 9:16 reels: drag, swipe, horizontal wheel, arrows and keys; only the front card and its
 * neighbours load; the front plays muted while the deck is in view. The panel's sound button turns the deck
 * sound on and mutes every other player (and the other way round).
 */
export function Carrossel({ reels = REELS, rotulo = "legalVector reels" }: { reels?: readonly Reel[]; rotulo?: string }) {
  const raizRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const raiz = raizRef.current!;
    const palco = raiz.querySelector<HTMLUListElement>("[data-reels-palco]")!;
    const num = raiz.querySelector<HTMLSpanElement>("[data-reels-num]")!;
    const btSom = raiz.querySelector<HTMLButtonElement>("[data-reels-som]")!;
    const mq = matchMedia("(min-width: 900px)");
    const parado = () => document.documentElement.dataset.mov === "off";
    const R = reels.length;
    const dados = reels.concat(reels);
    const N = dados.length;
    let cur = 0;
    let dentro = false;
    let somLigado = false;
    let arrastou = false;

    const marcaSom = () => {
      btSom.setAttribute("aria-pressed", String(somLigado));
      btSom.setAttribute("aria-label", somLigado ? "Turn sound off" : "Turn sound on");
      btSom.innerHTML = somLigado ? SVG_SOM_ON : SVG_SOM_OFF;
    };

    const lis = dados.map((r, i) => {
      const li = document.createElement("li");
      li.className = "reels-cartao";
      li.dataset.reel = r.id;
      li.innerHTML =
        `<video muted playsinline preload="none" poster="${A(`campaign/film/${r.id}.webp`)}" data-src="${A(`campaign/film/${r.id}.mp4`)}" width="720" height="1280"></video>` +
        `<span class="reels-pausa" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M7 4.5v15l12.5-7.5z"/></svg></span>` +
        `<input type="range" class="barra-video reels-barra" min="0" max="1000" step="1" value="0" aria-label="Reel position">`;
      const v = li.querySelector("video")!;
      v.setAttribute("aria-label", r.titulo);
      const barra = li.querySelector<HTMLInputElement>(".reels-barra")!;
      li.addEventListener("click", (e) => {
        if ((e.target as Element).closest(".reels-barra")) return;
        if (arrastou) {
          arrastou = false;
          return;
        }
        e.preventDefault();
        if (cur !== i) {
          vai(i);
          return;
        }
        // tapping the front reel pauses and resumes at the same point
        if (v.paused) {
          li.dataset.mao = "";
          if (!v.getAttribute("src")) v.src = v.dataset.src!;
          v.play().catch(() => {});
        } else {
          li.dataset.mao = "1";
          v.pause();
        }
      });
      v.addEventListener("ended", () => {
        if (cur === i) vai(i + 1);
      });
      (["play", "pause"] as const).forEach((t) => v.addEventListener(t, () => li.classList.toggle("pausado", !!li.dataset.mao && v.paused)));
      v.addEventListener("timeupdate", () => {
        if (!v.duration) return;
        const p = v.currentTime / v.duration;
        barra.value = String(Math.round(p * 1000));
        barra.style.setProperty("--p", `${(p * 100).toFixed(2)}%`);
      });
      barra.addEventListener("input", () => {
        if (v.duration) v.currentTime = (Number(barra.value) / 1000) * v.duration;
        barra.style.setProperty("--p", `${Number(barra.value) / 10}%`);
      });
      palco.appendChild(li);
      return li;
    });

    function pinta() {
      const largo = mq.matches;
      lis.forEach((li, i) => {
        let dd = i - cur;
        if (dd > N / 2) dd -= N;
        if (dd < -N / 2) dd += N;
        const a = Math.abs(dd);
        const x = dd * (largo ? 70 : 52);
        const rot = a === 0 ? 1.5 : dd < 0 ? -2 : 2.5;
        li.style.transform = `translate(${x}%,0) scale(${a ? 0.84 : 1}) rotate(${rot}deg)`;
        li.style.zIndex = String(50 - a);
        li.style.opacity = a > 1 ? "0" : a ? ".72" : "1";
        li.style.pointerEvents = a > 1 ? "none" : "auto";
        li.classList.toggle("frente", a === 0);
        li.setAttribute("aria-hidden", a ? "true" : "false");
        li.querySelectorAll("input").forEach((el) => (el.tabIndex = a ? -1 : 0));
        const v = li.querySelector("video")!;
        if (a) li.dataset.mao = "";
        if (a <= 1 && !v.getAttribute("src")) v.src = v.dataset.src!;
        if (a <= 1 && dentro) v.preload = a === 0 ? "auto" : "metadata";
        if (a === 0 && dentro && !li.dataset.mao && (!parado() || somLigado)) {
          v.muted = !somLigado;
          const p = v.play();
          if (p)
            p.catch(() => {
              somLigado = false;
              marcaSom();
              v.muted = true;
              v.play().catch(() => {});
            });
        } else {
          v.pause();
          v.muted = true;
        }
      });
      num.textContent = `0${(cur % R) + 1}`.slice(-2) + " / " + `0${R}`.slice(-2);
      marcaSom();
    }
    const vai = (i: number) => {
      cur = (i + N) % N;
      pinta();
      track("reel_view", { reel: dados[cur].id });
    };

    const ant = () => vai(cur - 1);
    const seg = () => vai(cur + 1);
    const btAnt = raiz.querySelector<HTMLButtonElement>("[data-reels-ant]")!;
    const btSeg = raiz.querySelector<HTMLButtonElement>("[data-reels-seg]")!;
    btAnt.addEventListener("click", ant);
    btSeg.addEventListener("click", seg);
    const teclas = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") vai(cur - 1);
      if (e.key === "ArrowRight") vai(cur + 1);
      // on the deck itself (not on its buttons) Space, Enter and K pause and resume the front reel, as a tap does
      if (e.target === raiz && (e.key === " " || e.key === "Enter" || e.key === "k" || e.key === "K")) {
        e.preventDefault();
        const li = lis[cur];
        const v = li.querySelector("video")!;
        if (v.paused) {
          li.dataset.mao = "";
          if (!v.getAttribute("src")) v.src = v.dataset.src!;
          v.play().catch(() => {});
        } else {
          li.dataset.mao = "1";
          v.pause();
        }
      }
    };
    raiz.addEventListener("keydown", teclas);

    // the sound turns on inside the tap itself (iOS only allows it there)
    const somClique = () => {
      const v = lis[cur].querySelector("video")!;
      somLigado = !somLigado;
      if (!v.getAttribute("src")) v.src = v.dataset.src!;
      v.muted = !somLigado;
      if (somLigado) {
        lis[cur].dataset.mao = "";
        pedeSom("reels");
        v.play().catch(() => {
          somLigado = false;
          v.muted = true;
          marcaSom();
        });
      }
      track(somLigado ? "reel_sound_on" : "reel_sound_off", { reel: dados[cur].id });
      pinta();
    };
    btSom.addEventListener("click", somClique);
    const calaOutro = ouveSom("reels", () => {
      if (!somLigado) return;
      somLigado = false;
      lis.forEach((li) => (li.querySelector("video")!.muted = true));
      marcaSom();
    });

    // mouse drag, finger swipe, horizontal trackpad (one reel per gesture); vertical scroll stays free
    let x0: number | null = null;
    const prime = (e: PointerEvent) => {
      arrastou = false;
      if (e.pointerType === "mouse" && !(e.target as Element).closest(".reels-barra")) x0 = e.clientX;
    };
    palco.addEventListener("pointerdown", prime, { passive: true });
    const solta = (e: PointerEvent) => {
      if (x0 === null) return;
      const dx = e.clientX - x0;
      x0 = null;
      if (Math.abs(dx) > 40) {
        arrastou = true;
        vai(cur + (dx < 0 ? 1 : -1));
      }
    };
    addEventListener("pointerup", solta, { passive: true });
    let trav = false;
    let acum = 0;
    let tAcum = 0;
    const roda = (e: WheelEvent) => {
      if (e.ctrlKey) return;
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY) * 1.1) return;
      e.preventDefault();
      acum += e.deltaX;
      if (trav) acum = 0;
      else if (Math.abs(acum) > 28) {
        vai(cur + (acum > 0 ? 1 : -1));
        acum = 0;
        trav = true;
      }
      clearTimeout(tAcum);
      tAcum = window.setTimeout(() => {
        acum = 0;
        trav = false;
      }, 200);
    };
    raiz.addEventListener("wheel", roda, { passive: false });
    let t0: { x: number; y: number } | null = null;
    const tIni = (e: TouchEvent) => {
      if ((e.target as Element).closest(".reels-barra")) {
        t0 = null;
        return;
      }
      const t = e.touches[0];
      t0 = { x: t.clientX, y: t.clientY };
    };
    const tFim = (e: TouchEvent) => {
      if (!t0) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - t0.x;
      const dy = t.clientY - t0.y;
      t0 = null;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.2) vai(cur + (dx < 0 ? 1 : -1));
    };
    raiz.addEventListener("touchstart", tIni, { passive: true });
    raiz.addEventListener("touchend", tFim, { passive: true });
    // iPhone in low power mode: a tap with the deck in view starts the front reel
    const toque = () => {
      if (!dentro || parado()) return;
      const v = lis[cur].querySelector("video")!;
      if (v.paused && !lis[cur].dataset.mao) v.play().catch(() => {});
    };
    addEventListener("touchend", toque, { capture: true, passive: true });
    const io = new IntersectionObserver(
      (es) => {
        dentro = es[0].isIntersecting;
        pinta();
      },
      { threshold: 0.3 },
    );
    io.observe(raiz);
    const vis = () => {
      if (document.hidden) lis[cur].querySelector("video")!.pause();
      else pinta();
    };
    document.addEventListener("visibilitychange", vis);
    mq.addEventListener("change", pinta);
    pinta();

    return () => {
      io.disconnect();
      calaOutro();
      clearTimeout(tAcum);
      removeEventListener("pointerup", solta);
      removeEventListener("touchend", toque, { capture: true });
      document.removeEventListener("visibilitychange", vis);
      mq.removeEventListener("change", pinta);
      btAnt.removeEventListener("click", ant);
      btSeg.removeEventListener("click", seg);
      btSom.removeEventListener("click", somClique);
      raiz.removeEventListener("keydown", teclas);
      raiz.removeEventListener("wheel", roda);
      raiz.removeEventListener("touchstart", tIni);
      raiz.removeEventListener("touchend", tFim);
      palco.removeEventListener("pointerdown", prime);
      lis.forEach((li) => {
        li.querySelector("video")!.pause();
        li.remove();
      });
    };
  }, [reels]);

  const n = String(reels.length).padStart(2, "0");
  return (
    <div ref={raizRef} data-leitor className="reels" aria-roledescription="carousel" aria-label={rotulo} tabIndex={0}>
      <ul className="reels-palco" data-reels-palco />
      <div className="reels-painel vidro">
        <button type="button" className="reels-seta" data-reels-ant aria-label="Previous reel">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </button>
        <span className="reels-num" data-reels-num aria-live="polite">
          01 / {n}
        </span>
        <button type="button" className="reels-seta" data-reels-seg aria-label="Next reel">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M9 5l7 7-7 7" />
          </svg>
        </button>
        <span className="reels-sep" aria-hidden="true" />
        <button type="button" className="reels-seta" data-reels-som aria-pressed="false" aria-label="Turn sound on" />
      </div>
    </div>
  );
}

/* ---------------- the technical drawing: page 1 of a contract at real A4 size ---------------- */
// seven-segment strokes for the clause numbers in the margin (4 x 7 units)
const SEG: Record<string, readonly [number, number, string]> = { a: [0, 0, "h4"], b: [4, 0, "v3.5"], c: [4, 3.5, "v3.5"], d: [0, 7, "h4"], e: [0, 3.5, "v3.5"], f: [0, 0, "v3.5"], g: [0, 3.5, "h4"] };
const DIGITOS = ["abcdef", "bc", "abged", "abgcd", "fgbc", "afgcd", "afgedc", "abc", "abcdefg", "abcdfg"];
const numero = (n: number, xDireita: number, yCentro: number) =>
  String(n)
    .split("")
    .reverse()
    .map((d, i) => {
      const x = xDireita - 4 - i * 6;
      const y = yCentro - 3.5;
      return DIGITOS[Number(d)]
        .split("")
        .map((s) => `M${x + SEG[s][0]} ${y + SEG[s][1]}${SEG[s][2]}`)
        .join("");
    })
    .join("");

const FIM_CLAUSULA = [398, 380, 398, 360, 392, 398, 372, 398, 386, 350, 398];
const CLAUSULAS =
  FIM_CLAUSULA.map((fim, i) => {
    const y = 198 + i * 18;
    return `M186 ${y}H${fim}${numero(i + 1, 174, y)}`;
  }).join("") + `M186 412H398M196 434H244M320 434H398${numero(12, 174, 412)}`;

// [delay in s, path]: the sheet first, then the dimensions, the content, clause 12.1 and the signatures
const TRACOS: ReadonlyArray<readonly [number, string]> = [
  [0, "M150 70H370L430 130V560H150Z"],
  [0.1, "M150 40H430M150 33V47M430 33V47"],
  [0.16, "M112 70V560M105 70H119M105 560H119"],
  [0.22, "M183 92H297A3 3 0 0 1 300 95V119A3 3 0 0 1 297 122H183A3 3 0 0 1 180 119V95A3 3 0 0 1 183 92ZM192 102H262M192 112H244"],
  [0.28, "M180 146H340M180 160H312M180 174H272"],
  [0.3, "M370 70V130H430"],
  [0.34, CLAUSULAS],
  [0.46, "M182 400H400A4 4 0 0 1 404 404V442A4 4 0 0 1 400 446H182A4 4 0 0 1 178 442V404A4 4 0 0 1 182 400Z"],
  [0.5, "M250 431h28v6h-28zM282 431h34v6h-34zM246 434H320M280 430l4-5 4 5M268 421H300"],
  [0.56, "M412 254V374M412 274h10M412 314h10M412 354h10M412 254h12l-4 5 4 5h-12"],
  [0.58, "M190 500H272M318 500H400M180 492l7 7M187 492l-7 7M306 492l7 7M313 492l-7 7"],
  [0.62, "M190 524H244M318 524H372"],
];
const GUIAS: ReadonlyArray<readonly [number, string]> = [
  [0.8, "M404 423H468"],
  [0.86, "M422 274H468"],
  [0.92, "M422 314H468"],
  [0.98, "M400 500H468"],
];
const ROTULOS: ReadonlyArray<readonly [string, string, number, number]> = [
  [".86s", "Clause 12.1", 476, 427],
  [".92s", "Notice date", 476, 278],
  [".98s", "Renewal", 476, 318],
  ["1.04s", "Signatures", 476, 504],
];

/**
 * The legalVector A4 contract drawing (copy deck 3.2). Draws itself when its table gets the class `pousou`.
 * Labels keep a rendered size of at least 12.5 px at any drawing width; below 900 px they are hidden.
 */
export function Planta() {
  const ref = useRef<SVGSVGElement>(null);
  const [fs, setFs] = useState(13);
  useEffect(() => {
    const el = ref.current!;
    const ro = new ResizeObserver(() => {
      const k = el.getBoundingClientRect().width / 560;
      if (k > 0) setFs(Math.max(13, Math.ceil((12.5 / k) * 10) / 10));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <svg ref={ref} viewBox="0 0 560 600" className="planta h-auto w-full" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {TRACOS.map(([t, d]) => (
        <path key={t} className="d" pathLength={1} style={{ "--t": `${t}s` } as React.CSSProperties} d={d} />
      ))}
      <circle className="planta-alvo" cx="291" cy="423" r="72" strokeDasharray="3 6" />
      <g className="planta-guias" strokeDasharray="2 5">
        {GUIAS.map(([t, d]) => (
          <path key={t} style={{ "--t": `${t}s` } as React.CSSProperties} d={d} />
        ))}
      </g>
      <rect className="planta-scan" x="184" y="192" width="216" height="2" rx="1" stroke="none" />
      <g className="planta-rotulos" fill="currentColor" stroke="none" fontFamily="Inter, sans-serif" fontSize={fs}>
        <text style={{ "--t": ".3s" } as React.CSSProperties} x="290" y="27" textAnchor="middle">
          210 mm
        </text>
        <text style={{ "--t": ".35s" } as React.CSSProperties} x="96" y="315" textAnchor="middle" transform="rotate(-90 96 315)">
          297 mm
        </text>
        {ROTULOS.map(([t, s, x, y]) => (
          <text key={s} style={{ "--t": t } as React.CSSProperties} x={x} y={y}>
            {s}
          </text>
        ))}
      </g>
    </svg>
  );
}

/** The drawing table: the contract traces itself when 25 % is in view, then the deck rises and the front reel plays. */
export function MesaReels({ className = "" }: { className?: string }) {
  const mesa = useRef<HTMLDivElement>(null);
  const pousou = useInView(mesa, { once: true, amount: 0.25 });
  return (
    <div ref={mesa} className={`mesa relative mx-auto max-w-7xl px-5 sm:px-8 ${pousou ? "pousou" : ""} ${className}`}>
      <div className="mesa-planta text-mint">
        <Planta />
      </div>
      <div className="mesa-reels">
        <Carrossel />
      </div>
    </div>
  );
}
