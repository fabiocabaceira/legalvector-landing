import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { curva } from "../../base";
import { IcAlvo, IcCamadas, IcDocumento, IcEngrenagem, IcEscudo, IcGlobo, IcGrafico, IcLigacao, IcSeguinte, Itens, Surge, TituloBloco, moldura, tituloH2, type Item } from "../../ui";
import { type Ic } from "./comum";

const ITENS: readonly Item[] = [
  ["Set up Legal", "Set up Legal previews every step, the Legal model, where requests are filed and the permissions, and creates only what is missing. Safe to run again.", IcEngrenagem],
  ["Embedded engine", "An embedded engine runs the Legal process as standard BPMN 2.0. It ships with legalVector and is open source.", IcCamadas],
  ["Doxis BPM & Insights", "Document reviews can run on Doxis BPM & Insights. The Legal request process stays on the embedded engine.", IcGrafico],
  ["The same Legal screens", "Switch the engine and no Legal screen changes. Lawyers and requesters keep working the same way.", IcDocumento],
];

const PASSOS: ReadonlyArray<readonly [string, string, Ic]> = [
  ["Connect.", "Point legalVector at your repository. Users sign in with their own accounts.", IcLigacao],
  ["Set up Legal.", "Preview and apply the Legal model, then set the team, routing and contract types.", IcEngrenagem],
  ["Pilot.", "Run real requests from one or two departments on the embedded engine.", IcAlvo],
  ["Production.", "Approve the rule sets and switch on AI screening. Optionally move to the repository’s own engine.", IcEscudo],
  ["Roll out.", "Open the front door to every department, each in its own language.", IcGlobo],
];

/** The sticky step-through card (Doxter Fila): Next slides the card out left and the next in from the right. */
function Percurso() {
  const [i, setI] = useState(0);
  const fim = i >= PASSOS.length;
  const faltam = PASSOS.length - i;
  return (
    <div className="relative isolate">
      {!fim &&
        [2, 1]
          .filter((k) => k < faltam)
          .map((k) => (
            <div
              key={k}
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-full rounded-3xl border border-white/[.06] bg-deep/60 transition-transform duration-500"
              style={{ transform: `translateY(${k * 12}px) scale(${1 - k * 0.04})`, transformOrigin: "50% 100%", zIndex: -k }}
            />
          ))}
      <div className={`${moldura} relative p-6 sm:p-8`}>
        <div className="flex items-center gap-1.5" aria-hidden="true">
          {PASSOS.map((_, k) => (
            <span key={k} className={`h-1 flex-1 rounded-full transition-colors duration-500 ${k <= i ? "bg-mint shadow-[0_0_10px_rgba(94,234,212,.7)]" : "bg-white/15"}`} />
          ))}
        </div>
        <p className="sr-only" aria-live="polite">
          {fim ? "The AI proposes. The lawyer decides. At every step." : `Step ${i + 1} of ${PASSOS.length}`}
        </p>
        <div className="relative -mx-4 mt-5 min-h-[246px] overflow-hidden px-4 pt-2 sm:min-h-[230px]">
          <AnimatePresence mode="popLayout" initial={false}>
            {fim ? (
              <motion.div
                key="fim"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: curva }}
                className="flex min-h-[230px] flex-col items-center justify-center text-center sm:min-h-[214px]"
              >
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-glow/20 text-white shadow-[0_0_34px_-4px_rgba(94,234,212,.9)]">
                  <svg viewBox="0 0 64 64" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path className="desenha" pathLength={1} d="M17 21l14 25 15-28" style={{ "--t": ".15s" } as React.CSSProperties} />
                    <path className="desenha" pathLength={1} d="M37 17.5l9.5 .5 .5 9.5" style={{ "--t": ".7s" } as React.CSSProperties} />
                  </svg>
                </span>
                <p className="mt-6 text-balance text-xl font-semibold leading-snug tracking-[-0.02em] text-white sm:text-2xl">
                  The AI proposes. The lawyer decides. <span className="texto-grad">At every step.</span>
                </p>
              </motion.div>
            ) : (
              <motion.div key={i} initial={{ opacity: 0, x: 70 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -70 }} transition={{ duration: 0.4, ease: curva }}>
                <Passo n={i} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <button
          type="button"
          onClick={() => setI(fim ? 0 : i + 1)}
          className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-white font-semibold text-ink shadow-[0_8px_40px_-8px_rgba(20,184,166,.8)] transition hover:bg-[#d7fbf5]"
        >
          {fim ? "Start again" : "Next"}
          {!fim && <IcSeguinte className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}

function Passo({ n }: { n: number }) {
  const [t, p, Icone] = PASSOS[n];
  return (
    <div className="pt-3">
      <div className="flex items-center gap-4">
        <span className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-glow/40 bg-glow/10 text-mint shadow-[0_0_22px_-8px_rgba(94,234,212,.9)]">
          <Icone className="h-7 w-7" />
          <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-mint text-[13px] font-bold text-ink">{n + 1}</span>
        </span>
        <p className="text-2xl font-semibold tracking-[-0.02em] text-white sm:text-[1.7rem]">{t}</p>
      </div>
      <p className="mt-6 max-w-md text-pretty text-base leading-relaxed text-soft sm:text-lg">{p}</p>
    </div>
  );
}

/** Copy deck 6.3 (Doxter Lancar): 2x2 items + the sticky step-through card. */
export function Arranque() {
  return (
    <section aria-labelledby="t-arranque" className="mx-auto max-w-7xl px-5 pb-16 pt-8 sm:px-8">
      <TituloBloco
        id="t-arranque"
        titulo={["Start small.", "Grow on the platform you own."]}
        // the longest line 2 on the site: one step smaller on phones so it stays one row
        h2Classe={tituloH2.replace("text-[1.6rem]", "text-[1.5rem]")}
        texto="You pilot with real requests from one or two departments, then open the front door to everyone."
      />
      <div className="mt-14 grid items-start gap-14 lg:grid-cols-2 lg:gap-20">
        <Itens itens={ITENS} className="grid gap-x-8 gap-y-9 sm:grid-cols-2" />
        <Surge atraso={0.1} className="lg:sticky lg:top-28">
          <Percurso />
        </Surge>
      </div>
    </section>
  );
}
