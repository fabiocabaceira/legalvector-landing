import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { A, LEGENDA, curva } from "../../base";
import { Cartao } from "../../ui";

// Centres of the step-count badges on process-1200.webp (1200 x 635), in process order: intake 5, review 12, revise 2, close 1.
const CONTAS: ReadonlyArray<readonly [number, number]> = [
  [25.17, 26.14],
  [51.17, 26.14],
  [63.67, 53.07],
  [77.25, 26.14],
];

/** Copy deck 5.3: the real process screen; the step counts glow mint one by one. */
export function Processo() {
  const ref = useRef<HTMLDivElement>(null);
  const ver = useInView(ref, { once: true, margin: "-80px" });
  return (
    <figure className="m-0">
      <Cartao className="overflow-hidden p-2 sm:p-3">
        <div ref={ref} className="relative overflow-hidden rounded-2xl bg-white">
          <img
            src={A("img/v4/process-1200.webp")}
            srcSet={`${A("img/v4/process-640.webp")} 640w, ${A("img/v4/process-1200.webp")} 1200w`}
            sizes="(min-width: 1024px) 600px, 92vw"
            width="1200"
            height="635"
            loading="lazy"
            decoding="async"
            alt="Where requests are now. Open requests waiting at each step of the Legal process, on a process map."
            className="block h-auto w-full"
          />
          <motion.span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-[rgba(94,234,212,.18)] to-transparent"
            initial={{ left: "-35%" }}
            animate={ver ? { left: "105%" } : {}}
            transition={{ duration: 1.4, delay: 0.25, ease: curva }}
          />
          {CONTAS.map(([x, y], i) => (
            <span key={i} aria-hidden="true" className="pointer-events-none absolute aspect-square w-[3.6%] -translate-x-1/2 -translate-y-1/2" style={{ left: `${x}%`, top: `${y}%` }}>
              <motion.span
                className="absolute inset-0 rounded-full ring-2 ring-mint"
                initial={{ opacity: 0, scale: 0.4, boxShadow: "0 0 0px 0px rgba(94,234,212,0)" }}
                animate={ver ? { opacity: 1, scale: 1, boxShadow: "0 0 18px 5px rgba(94,234,212,.75)" } : {}}
                transition={{ type: "spring", stiffness: 380, damping: 17, delay: 0.9 + i * 0.4 }}
              />
              {ver && <span className="onda absolute inset-0 rounded-full opacity-0 ring-2 ring-mint/70" style={{ animationDelay: `${1.3 + i * 0.4}s` }} />}
            </span>
          ))}
        </div>
      </Cartao>
      <figcaption className="mt-3 text-center text-[13px] text-mute">{LEGENDA}</figcaption>
    </figure>
  );
}
