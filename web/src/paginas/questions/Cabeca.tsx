import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { CTA, curva, type Linhas } from "../../base";
import { BotaoPrincipal, TextoDesfocado, useMov } from "../../ui";

/**
 * The shared Cabeca with a wider text column, so the long h1 "Questions General Counsel / ask us." keeps two lines at 1280 px and up.
 * Same markup, ids, motion and CTA as ui.tsx Cabeca.
 */
export function CabecaLarga({ titulo, texto, visual }: { titulo: Linhas; texto: string; visual: ReactNode }) {
  const mov = useMov();
  return (
    <section className="relative overflow-hidden pb-16 pt-28 sm:pb-20 sm:pt-36" aria-labelledby="t-cabeca">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="grade-fundo absolute inset-0" />
        <div className="absolute -top-72 left-[-15%] h-[680px] w-[980px] rounded-full bg-[radial-gradient(closest-side,rgba(20,184,166,.24),transparent)]" />
      </div>
      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
        <div>
          <h1 id="t-cabeca" className="text-balance text-[1.75rem] font-[650] leading-[1.05] tracking-[-0.04em] text-white sm:text-5xl lg:text-[3.25rem]">
            <TextoDesfocado linhas={titulo} />
          </h1>
          <motion.p
            initial={mov ? { y: 14, filter: "blur(6px)" } : false}
            animate={{ y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.55, delay: 0.45, ease: curva }}
            className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-mute sm:text-lg"
          >
            {texto}
          </motion.p>
          <motion.div initial={mov ? { opacity: 0, y: 14 } : false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.6, ease: curva }} className="mt-9">
            <BotaoPrincipal href="#demo" data-cta="cabeca">
              {CTA}
            </BotaoPrincipal>
          </motion.div>
        </div>
        <motion.div initial={mov ? { opacity: 0, y: 40 } : false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, delay: 0.5, ease: curva }} className="min-w-0">
          {visual}
        </motion.div>
      </div>
    </section>
  );
}
