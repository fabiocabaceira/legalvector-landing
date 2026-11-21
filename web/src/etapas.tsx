import { useRef, type ReactNode } from "react";
import { motion, useScroll } from "framer-motion";
import { R, type Linhas } from "./base";
import { DuasLinhas, Itens, Ligacao, Surge, type Item } from "./ui";

export interface Etapa {
  id: string;
  titulo: Linhas;
  texto: string;
  itens: readonly Item[];
  /** the sticky visual on the right (a Quadro, a Filme, a framed screen) */
  visual: ReactNode;
  /** [text, route] links under the items, e.g. ["legalVector on Alfresco", "integrations/alfresco/"] */
  links?: ReadonlyArray<readonly [string, string]>;
}

function UmaEtapa({ e, i }: { e: Etapa; i: number }) {
  return (
    <section id={e.id} aria-labelledby={`t-${e.id}`} className="relative grid gap-5 py-14 sm:grid-cols-[48px_1fr] sm:gap-8 sm:py-20">
      <span className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border border-glow/60 bg-ink text-sm font-semibold text-mint shadow-[0_0_24px_-4px_rgba(20,184,166,.9)] sm:h-12 sm:w-12 sm:text-base">
        {i + 1}
      </span>
      <div className="grid min-w-0 items-start gap-10 lg:grid-cols-2 lg:gap-14">
        <div>
          <Surge>
            <h2 id={`t-${e.id}`} className="text-balance text-[1.75rem] font-[650] leading-[1.1] tracking-[-0.03em] text-white sm:text-4xl">
              <DuasLinhas l={e.titulo} />
            </h2>
          </Surge>
          <Surge atraso={0.08}>
            <p className="mt-4 text-pretty text-lg leading-relaxed text-mute">{e.texto}</p>
          </Surge>
          <Itens itens={e.itens} className="mt-10 grid gap-7" />
          {e.links && (
            <div className="mt-9 flex flex-col gap-1 sm:flex-row sm:gap-8">
              {e.links.map(([t, h]) => (
                <Ligacao key={h} href={R(h)}>
                  {t}
                </Ligacao>
              ))}
            </div>
          )}
        </div>
        <Surge atraso={0.1} className="min-w-0 lg:sticky lg:top-28">
          {e.visual}
        </Surge>
      </div>
    </section>
  );
}

/** Numbered steps with a rail that fills mint as the reader scrolls (the only scroll-scrubbed motion). */
export function Etapas({ etapas }: { etapas: readonly Etapa[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.55", "end 0.55"] });
  return (
    <div ref={ref} className="relative mx-auto max-w-7xl px-5 sm:px-8">
      <div aria-hidden="true" className="absolute bottom-24 left-[55.5px] top-[120px] hidden w-px bg-white/10 sm:block">
        <motion.div style={{ scaleY: scrollYProgress, originY: 0 }} className="h-full w-full bg-gradient-to-b from-glow via-mint to-glow shadow-[0_0_12px_1px_rgba(94,234,212,.8)]" />
      </div>
      {etapas.map((e, i) => (
        <UmaEtapa key={e.id} e={e} i={i} />
      ))}
    </div>
  );
}
