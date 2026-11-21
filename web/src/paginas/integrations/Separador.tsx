import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FILME_DECISAO, LEGENDA } from "../../base";
import { Filme } from "../../filme";
import { Cartao, IcCamadas, IcEnvelope, IcRelogio, TituloBloco } from "../../ui";
import { IcComentario, type Ic } from "./comum";

const OPCOES: ReadonlyArray<readonly [string, string, Ic]> = [
  ["Descriptors", "The decision is written to the document’s descriptors in Doxis, next to the contract itself.", IcCamadas],
  ["Timeline", "The decision and any override reason are recorded on the request’s timeline.", IcRelogio],
  ["Doxis comment", "A comment on the document in Doxis mirrors the audit trail.", IcComentario],
  ["Requester email", "The requester gets an email with the decision and a link back to the request.", IcEnvelope],
];

// live-decision.vtt: cue 3 (5.02 to 10.54 s) names the descriptors, the timeline and the Doxis comment in that order; cue 4 the requester email
const SALTOS = [5.02, 7.2, 8.2, 10.54];

/** Copy deck 6.2 (Doxter Separador): four tabs, arrow keys move, the selected background slides on a spring. */
export function Separador() {
  const [sel, setSel] = useState(0);
  const botoes = useRef<Array<HTMLButtonElement | null>>([]);

  function tecla(e: React.KeyboardEvent, i: number) {
    const passo = ({ ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 } as Record<string, number>)[e.key];
    const fim = e.key === "Home" ? 0 : e.key === "End" ? OPCOES.length - 1 : null;
    if (!passo && fim === null) return;
    e.preventDefault();
    const j = fim ?? (i + passo + OPCOES.length) % OPCOES.length;
    setSel(j);
    botoes.current[j]?.focus();
  }

  return (
    <section aria-labelledby="t-separador" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24">
      <TituloBloco id="t-separador" titulo={["Where does each decision", "go in Doxis?"]} texto="Four places, written by legalVector the moment a lawyer decides." />
      <div className="mt-14 grid items-start gap-6 lg:grid-cols-[320px_1fr] lg:gap-10">
        <div role="tablist" aria-orientation="vertical" aria-labelledby="t-separador" className="grid grid-cols-2 gap-2 lg:sticky lg:top-28 lg:grid-cols-1">
          {OPCOES.map(([t, , Icone], i) => (
            <button
              key={t}
              ref={(el) => {
                botoes.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`sep-${i}`}
              aria-selected={sel === i}
              aria-controls="sep-painel"
              tabIndex={sel === i ? 0 : -1}
              onClick={() => setSel(i)}
              onKeyDown={(e) => tecla(e, i)}
              className={`relative min-h-14 rounded-2xl border border-white/[.07] px-4 py-3 text-left transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint sm:px-5 sm:py-4 ${sel === i ? "text-white" : "text-white/55 hover:border-white/15 hover:text-white/85"}`}
            >
              {sel === i && (
                <motion.span
                  layoutId="sep-fundo-doxis"
                  className="absolute inset-0 rounded-2xl border border-glow/50 bg-glow/10 shadow-[0_0_34px_-10px_rgba(94,234,212,.9)]"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <span className="relative flex items-center gap-3">
                <Icone className={`hidden h-5 w-5 shrink-0 transition-colors sm:block ${sel === i ? "text-mint" : "text-white/40"}`} />
                <span className="text-[15px] font-semibold leading-tight sm:text-lg">{t}</span>
              </span>
            </button>
          ))}
        </div>

        <Cartao className="p-4 sm:p-7">
          <div role="tabpanel" id="sep-painel" aria-labelledby={`sep-${sel}`} className="flex items-start gap-4">
            <span aria-hidden="true" className="relative grid h-12 w-12 shrink-0 place-items-center">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={sel}
                  initial={{ opacity: 0, scale: 0.55, rotate: -12 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.55, rotate: 12 }}
                  transition={{ type: "spring", stiffness: 420, damping: 24 }}
                  className="absolute inset-0 grid place-items-center rounded-xl border border-glow/40 bg-glow/10 text-mint shadow-[0_0_28px_-6px_rgba(20,184,166,.9)]"
                >
                  {(() => {
                    const Icone = OPCOES[sel][2];
                    return <Icone className="h-6 w-6" />;
                  })()}
                  <motion.span
                    className="absolute inset-0 rounded-xl ring-1 ring-mint"
                    initial={{ opacity: 0.9, scale: 1 }}
                    animate={{ opacity: 0, scale: 1.6 }}
                    transition={{ duration: 0.9, ease: "easeOut" }}
                  />
                </motion.span>
              </AnimatePresence>
            </span>
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={sel}
                initial={{ opacity: 0, y: 6, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -6, filter: "blur(4px)" }}
                transition={{ duration: 0.25 }}
                className="min-h-[3.5rem] max-w-2xl text-pretty pt-0.5 text-[15px] leading-relaxed text-soft sm:pt-2 sm:text-lg"
              >
                {OPCOES[sel][1]}
              </motion.p>
            </AnimatePresence>
          </div>
          <Filme filme={FILME_DECISAO} legenda={LEGENDA} salto={SALTOS[sel]} className="mt-6" />
        </Cartao>
      </div>
    </section>
  );
}
