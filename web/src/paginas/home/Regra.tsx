import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { curva } from "../../base";
import { useMov } from "../../ui";

const FASES = [
  ["Before a lawyer opens it", "The moment it is sent, the draft is checked against your playbook."],
  ["When a clause fails", "Approval stays blocked until it is fixed, or a lawyer records why."],
  ["After approval", "Every approved contract keeps its reasons, and the requester hears back by email."],
] as const;

// L1 rises, the gate line draws and holds 400 ms, then L2 lands; then the hairline runs over the three phases.
const L1 = 0;
const PORTAO = 0.45;
const L2 = PORTAO + 0.5 + 0.4;
const LINHA = L2 + 0.5;

/** Copy deck 3.5: the house rule in the case-study slot. No quote, no person: the AI never approves alone. */
export default function Regra() {
  const titulo = useRef<HTMLHeadingElement>(null);
  const ver = useInView(titulo, { once: true, margin: "-100px" });
  const mov = useMov();
  const de = <T,>(v: T) => (mov ? v : false);
  return (
    <section id="rule" aria-labelledby="t-rule" className="relative overflow-hidden px-5 py-20 sm:px-8 sm:py-28">
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-16 h-[460px] w-[960px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(20,184,166,.2),transparent)]" />

      <h2 ref={titulo} id="t-rule" className="relative mx-auto max-w-4xl text-balance text-center text-[2.2rem] font-[650] leading-[1.06] tracking-[-0.04em] text-white sm:text-5xl lg:text-[3.4rem]">
        <motion.span
          className="block"
          initial={de({ opacity: 0, y: 22, filter: "blur(10px)" })}
          animate={ver ? { opacity: 1, y: 0, filter: "blur(0px)" } : undefined}
          transition={{ duration: 0.6, delay: L1, ease: curva }}
        >
          The AI proposes.
        </motion.span>
        <motion.span
          aria-hidden="true"
          className="mx-auto my-4 block h-px w-24 origin-center bg-gradient-to-r from-transparent via-mint to-transparent shadow-[0_0_14px_rgba(94,234,212,.9)] sm:my-5 sm:w-36"
          initial={de({ scaleX: 0, opacity: 0 })}
          animate={ver ? { scaleX: 1, opacity: 1 } : undefined}
          transition={{ duration: 0.5, delay: PORTAO, ease: curva }}
        />
        <motion.span
          className="texto-grad block pb-[0.08em]"
          initial={de({ opacity: 0, y: -18, filter: "blur(10px)" })}
          animate={ver ? { opacity: 1, y: 0, filter: "blur(0px)" } : undefined}
          transition={{ duration: 0.6, delay: L2, ease: curva }}
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
          transition={{ duration: 0.5, delay: LINHA, ease: curva }}
        />
        {FASES.map(([t, p], i) => (
          <motion.li
            key={t}
            initial={de({ opacity: 0, y: 24, filter: "blur(6px)" })}
            animate={ver ? { opacity: 1, y: 0, filter: "blur(0px)" } : undefined}
            transition={{ duration: 0.55, delay: LINHA + 0.1 + i * 0.08, ease: curva }}
            className="relative list-none border-t border-white/15 pt-5 sm:border-t-0 sm:pt-6"
          >
            <motion.span
              aria-hidden="true"
              className="absolute inset-x-0 -top-px h-px origin-left bg-mint sm:hidden"
              initial={de({ scaleX: 0 })}
              animate={ver ? { scaleX: 1 } : undefined}
              transition={{ duration: 0.5, delay: LINHA + i * 0.08, ease: curva }}
            />
            <motion.span
              aria-hidden="true"
              className="absolute -top-[4px] left-0 h-[7px] w-[7px] rounded-full bg-mint shadow-[0_0_12px_2px_rgba(94,234,212,.8)]"
              initial={de({ scale: 0 })}
              animate={ver ? { scale: 1 } : undefined}
              transition={{ type: "spring", stiffness: 500, damping: 22, delay: LINHA + 0.1 + i * 0.08 }}
            />
            <h3 className="text-sm font-semibold text-mint">{t}</h3>
            <p className="mt-2 text-pretty text-[15px] leading-relaxed text-white/75">{p}</p>
          </motion.li>
        ))}
      </ol>
    </section>
  );
}
