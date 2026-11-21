import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { A, LEGENDA, R, curva } from "../../base";
import { Cartao, IcDocumento, IcEnvelope, Ligacao, Surge, useMov } from "../../ui";
import { TituloVivo } from "./TituloVivo";

/** Bento cell (shared Celula) with a caption line under the text. */
function Celula({ className = "", titulo, texto, nota, atraso = 0, children }: { className?: string; titulo: string; texto: string; nota?: string; atraso?: number; children: ReactNode }) {
  return (
    <Surge atraso={atraso} className={className}>
      <Cartao className="flex h-full flex-col overflow-hidden">
        <div className="relative h-64 sm:h-72">{children}</div>
        <div className="px-6 pb-7 pt-3 sm:px-8 sm:pb-8">
          <h3 className="text-lg font-semibold tracking-[-0.015em] text-white">{titulo}</h3>
          <p className="mt-2 max-w-md text-pretty text-[15px] leading-relaxed text-mute">{texto}</p>
          {nota && <p className="mt-3 text-xs text-mute/80">{nota}</p>}
        </div>
      </Cartao>
    </Surge>
  );
}

// Prefilled fields on front-door-1200.webp, in % of the screen: [left, top, width, height]. Only fields the crop shows.
const CAMPOS: ReadonlyArray<readonly [number, number, number, number]> = [
  [3.8, 83.5, 68.7, 3.9], // Title
  [38.7, 91.4, 33.8, 3.9], // Counterparty
];

/*
 * The window shows the screen from y 598 of 750 down: the Title row, department, counterparty and the contract type label.
 * Its height follows the image width (w-[k%] of the window, aspect 1 / (0.12667 k)), so the crop is the same at every width.
 * The card lands on the Title label row, over the screen's dictation and language buttons.
 */
const CAIXA = "absolute bottom-0 left-[-2%] aspect-[1200/750] w-[220%] sm:w-[145%] lg:w-[135%]";

/** Cell A: the real Ask Legal form; a contract.docx card drops onto it, then the fields it fills light one after another. */
function VisualPorta() {
  const ref = useRef<HTMLDivElement>(null);
  const ver = useInView(ref, { once: true, margin: "-60px" });
  const mov = useMov();
  return (
    <div ref={ref} className="absolute inset-0" aria-hidden="true">
      <div aria-hidden="true" className="absolute inset-x-10 bottom-0 h-2/3 rounded-full bg-glow/20 blur-[70px]" />
      <div className="absolute inset-x-4 bottom-0 aspect-[1/0.2787] sm:inset-x-8 sm:aspect-[1/0.1837] lg:aspect-[1/0.171]">
        <div className="absolute inset-0 overflow-hidden rounded-t-2xl border border-b-0 border-white/10 bg-white shadow-[0_-20px_80px_-30px_rgba(20,184,166,.55)]">
          <div className={CAIXA}>
            <img src={A("img/v4/front-door-1200.webp")} alt="" width="1200" height="750" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full" />
            {CAMPOS.map(([l, t, w, h], i) => (
              <motion.span
                key={i}
                className="absolute overflow-hidden rounded-md bg-mint/15 ring-2 ring-mint shadow-[0_0_22px_-2px_rgba(94,234,212,.9)]"
                style={{ left: `${l}%`, top: `${t}%`, width: `${w}%`, height: `${h}%` }}
                initial={mov ? { opacity: 0, scale: 0.96 } : false}
                animate={ver ? { opacity: 1, scale: 1 } : undefined}
                transition={{ delay: 0.85 + i * 0.22, duration: 0.45, ease: curva }}
              >
                <motion.span
                  className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-mint/70 to-transparent"
                  initial={{ x: "-110%" }}
                  animate={ver && mov ? { x: "230%" } : undefined}
                  transition={{ delay: 0.85 + i * 0.22, duration: 0.7, ease: "easeInOut" }}
                />
              </motion.span>
            ))}
          </div>
        </div>

        {/* same box as the image, not clipped, so the card can rise above the window */}
        <div className={`pointer-events-none ${CAIXA}`}>
          <motion.div
            className="absolute bottom-[16.8%] left-[16.5%] z-10 w-[122px] sm:w-[150px]"
            initial={mov ? { y: -70, rotate: -14, opacity: 0 } : { rotate: -4 }}
            animate={ver ? { y: 0, rotate: -4, opacity: 1 } : undefined}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.15 }}
          >
            <div className="rounded-xl bg-white p-3 shadow-[0_24px_70px_-18px_rgba(20,184,166,.85)] ring-1 ring-black/5 sm:p-4">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-teal text-white">
                <IcDocumento className="h-[18px] w-[18px]" />
              </span>
              <span className="mt-2 block text-[13px] font-semibold tracking-[-0.01em] text-ink">contract.docx</span>
              <div className="mt-2.5 space-y-1.5">
                <div className="h-1.5 w-full rounded bg-slate-200" />
                <div className="h-1.5 w-4/5 rounded bg-slate-200" />
                <div className="h-1.5 w-full rounded bg-slate-200" />
                <div className="h-1.5 w-3/5 rounded bg-slate-200" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// Event names from the 10 real types, request types and departments from the sourced lists (copy deck 3.3).
const AVISOS = [
  { t: "Assigned", d: "NDA · Procurement", cor: "bg-soft/60" },
  { t: "Changes requested", d: "Contract review · Sales", cor: "bg-amber shadow-[0_0_10px_rgba(245,158,11,.8)]" },
  { t: "Resubmitted", d: "Contract review · Operations", cor: "bg-soft/60" },
  { t: "Approved", d: "NDA · HR", cor: "bg-mint shadow-[0_0_10px_rgba(94,234,212,.9)]" },
  { t: "New request", d: "Policy review · Finance", cor: "bg-soft/60" },
] as const;

/** Cell B: the status emails the business receives, a new one on top every 2.1 s while in view (Doxter VisualAT). */
function VisualAvisos({ mov }: { mov: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const ver = useInView(ref);
  const [n, setN] = useState(3);
  useEffect(() => {
    if (!ver || !mov) return;
    const t = setInterval(() => setN((x) => x + 1), 2100);
    return () => clearInterval(t);
  }, [ver, mov]);
  const lista = [0, 1, 2, 3].map((i) => ({ ...AVISOS[(((n - i) % 5) + 5) % 5], id: n - i }));
  return (
    <div ref={ref} className="absolute inset-0" aria-hidden="true">
      <div className="absolute inset-0 overflow-hidden px-5 pt-5 [mask-image:linear-gradient(#000_55%,transparent_86%)] sm:px-6">
        <div className="mb-3 flex items-center gap-2.5 rounded-2xl border border-white/[.07] bg-white/[.03] px-3 py-2.5">
          <IcEnvelope className="h-[18px] w-[18px] text-mint" />
          <span className="text-[13px] font-medium text-white/85">What the business sees</span>
        </div>
        <ul className="space-y-2.5">
          <AnimatePresence initial={false} mode="popLayout">
            {lista.map((a) => (
              <motion.li
                key={a.id}
                layout
                initial={{ opacity: 0, y: -28, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 360, damping: 32 }}
                className="flex items-center gap-3 rounded-2xl border border-white/[.07] bg-white/[.045] p-3 backdrop-blur"
              >
                <span className="relative grid h-9 w-9 shrink-0 place-items-center rounded-full bg-glow/15 text-mint">
                  <IcEnvelope className="h-4 w-4" />
                  <span className={`absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-ink ${a.cor}`} />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium text-white">{a.t}</span>
                  <span className="block truncate text-[13px] text-mute">{a.d}</span>
                </span>
                <span className="ml-auto shrink-0 text-[13px] text-white/40">now</span>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </div>
      <p className="absolute bottom-3 right-5 text-xs text-mute/80 sm:right-6">Demo data</p>
    </div>
  );
}

/** Copy deck 3.3: two capabilities, each with a live proof. */
export default function Bento({ mov }: { mov: boolean }) {
  return (
    <section id="features" aria-labelledby="t-features" className="relative mx-auto max-w-7xl px-4 py-20 sm:px-8 sm:py-24">
      <div aria-hidden="true" className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-mint/40 to-transparent" />
      <div className="mx-auto max-w-3xl text-center">
        <TituloVivo
          id="t-features"
          titulo={["From request to decision,", "without the chase."]}
          className="text-balance text-3xl font-[650] leading-[1.08] tracking-[-0.035em] text-white sm:text-4xl lg:text-[2.75rem]"
        />
        <Surge atraso={0.1}>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-base leading-relaxed text-mute sm:text-lg">
            Every department asks in one place. Everyone sees who has it and what happens next.
          </p>
        </Surge>
      </div>
      <div className="mt-12 grid gap-4 lg:grid-cols-6">
        <Celula
          className="lg:col-span-4"
          titulo="Drop the contract. The form fills itself."
          texto="Seven request types, one form. A request from a Word file takes about a minute."
          nota={LEGENDA}
        >
          <VisualPorta />
        </Celula>
        <Celula
          className="lg:col-span-2"
          atraso={0.08}
          titulo="Answered before it’s asked"
          texto="An email at every step, from assigned to approved. Nobody has to ask where their contract is."
        >
          <VisualAvisos mov={mov} />
        </Celula>
      </div>
      <Surge className="mt-8">
        <Ligacao href={R("product/") + "#features"}>See every feature</Ligacao>
      </Surge>
    </section>
  );
}
