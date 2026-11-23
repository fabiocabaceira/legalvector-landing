import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { curva } from "../../base";
import { useMov } from "../../ui";

const FASES = [
  ["Before a lawyer opens it", "The moment it is sent, the draft is checked against your playbook."],
  ["When a clause fails", "Approval stays blocked until it is fixed, or a lawyer records why."],
  ["After approval", "Every approved contract keeps its reasons, and the requester hears back by email."],
] as const;

// L1 rises, the gate line draws, L2 lands, then the hairline runs over the three phases. The first phase is sharp about 0.6 s after the trigger.
const L1 = 0;
const PORTAO = 0.12;
const L2 = 0.22;
const LINHA = 0.28;
const FASE = LINHA + 0.04;
const PASSO = 0.06;

/** Copy deck 3.5: the house rule in the case-study slot. No quote, no person: the AI never approves alone. */
export default function Regra() {
  const titulo = useRef<HTMLHeadingElement>(null);
  const ver = useInView(titulo, { once: true, margin: "0px 0px 40px 0px" });
  const mov = useMov();
  const de = <T,>(v: T) => (mov ? v : false);
  return (
    <section id="rule" aria-labelledby="t-rule" className="relative overflow-hidden px-5 py-20 sm:px-8 sm:py-28">
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-16 h-[460px] w-[960px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(20,184,166,.2),transparent)]" />

      <h2 ref={titulo} id="t-rule" className="relative mx-auto max-w-4xl text-balance text-center text-[2.2rem] font-[650] leading-[1.06] tracking-[-0.04em] text-white sm:text-5xl lg:text-[3.4rem]">
        <motion.span
          className="block"
          initial={de({ opacity: 0, y: 16, filter: "blur(8px)" })}
          animate={ver ? { opacity: 1, y: 0, filter: "blur(0px)" } : undefined}
          transition={{ duration: 0.45, delay: L1, ease: curva }}
        >
          The AI proposes.
        </motion.span>
        <motion.span
          aria-hidden="true"
          className="mx-auto my-4 block h-px w-24 origin-center bg-gradient-to-r from-transparent via-mint to-transparent shadow-[0_0_14px_rgba(94,234,212,.9)] sm:my-5 sm:w-36"
          initial={de({ scaleX: 0, opacity: 0 })}
          animate={ver ? { scaleX: 1, opacity: 1 } : undefined}
          transition={{ duration: 0.35, delay: PORTAO, ease: curva }}
        />
        <motion.span
          className="texto-grad block pb-[0.08em]"
          initial={de({ opacity: 0, y: -14, filter: "blur(8px)" })}
          animate={ver ? { opacity: 1, y: 0, filter: "blur(0px)" } : undefined}
          transition={{ duration: 0.45, delay: L2, ease: curva }}
        >
          The lawyer decides.
        </motion.span>
      </h2>

      <ol className="relative mx-auto mt-14 grid max-w-5xl gap-8 sm:mt-16 sm:grid-cols-3 sm:gap-6">
        <span aria-hidden="true" className="absolute inset-x-0 top-0 hidden h-px bg-white/10 sm:block" />
        <motion.span
          aria-hidden="true"
          className="absolute inset-x-0 top-0 hidden h-px origin-left bg-gradient-to-r from-mint via-mint/60 to-mint/15 shadow-[0_0_10px_rgba(94,234,212,.5)] sm:block"
          initial={de({ scaleX: 0 })}
          animate={ver ? { scaleX: 1 } : undefined}
          transition={{ duration: 0.45, delay: LINHA, ease: curva }}
        />
        {FASES.map(([t, p], i) => (
          <motion.li
            key={t}
            initial={de({ opacity: 0, y: 14, filter: "blur(3px)" })}
            animate={ver ? { opacity: 1, y: 0, filter: "blur(0px)" } : undefined}
            transition={{ duration: 0.4, delay: FASE + i * PASSO, ease: curva }}
            className="relative list-none border-t border-white/15 pt-5 sm:border-t-0 sm:pt-6"
          >
            <motion.span
              aria-hidden="true"
              className="absolute inset-x-0 -top-px h-px origin-left bg-mint sm:hidden"
              initial={de({ scaleX: 0 })}
              animate={ver ? { scaleX: 1 } : undefined}
              transition={{ duration: 0.4, delay: LINHA + i * PASSO, ease: curva }}
            />
            <motion.span
              aria-hidden="true"
              className="absolute -top-[4px] left-0 h-[7px] w-[7px] rounded-full bg-mint shadow-[0_0_12px_2px_rgba(94,234,212,.8)]"
              initial={de({ scale: 0 })}
              animate={ver ? { scale: 1 } : undefined}
              transition={{ type: "spring", stiffness: 500, damping: 22, delay: FASE + i * PASSO }}
            />
            <h3 className="text-sm font-semibold text-mint">{t}</h3>
            <p className="mt-2 text-pretty text-[15px] leading-relaxed text-white/75">{p}</p>
          </motion.li>
        ))}
      </ol>
    </section>
  );
}
