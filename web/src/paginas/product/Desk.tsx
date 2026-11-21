import { useRef, type ComponentType, type SVGProps } from "react";
import { motion, useInView } from "framer-motion";
import { curva } from "../../base";
import { Conta, IcCaneta, IcDocumento, IcEscudo, Marca, useMov } from "../../ui";

// Copied from the real inbox screen (img/v4/inbox-1200.webp in the repo root) only (copy deck 4.1): the four counters and the first words of three queue rows.
const CONTADORES: ReadonlyArray<readonly [string, number, string]> = [
  ["Awaiting intake", 5, "text-mint"],
  ["Open", 19, "text-white"],
  ["Overdue", 6, "text-amber"],
  ["With requesters", 2, "text-soft"],
];
const FILA: ReadonlyArray<readonly [string, string, string, ComponentType<SVGProps<SVGSVGElement>>]> = [
  ["Termination notice", "Operations", "Assign to Daniel", IcDocumento],
  ["Legal opinion", "Information Technology", "Accept & assign", IcEscudo],
  ["Consultancy agreement", "Finance", "Assign to Daniel", IcCaneta],
];

const ENTRA = 0.7;
const LINHAS = ENTRA + 0.55;
const CLIQUE = 2.55;

function Cursor() {
  return (
    <motion.span
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-1/2 z-20 block h-6 w-6 drop-shadow-[0_6px_10px_rgba(0,0,0,.55)]"
      initial={{ opacity: 0, x: 70, y: 110, scale: 1 }}
      animate={{ opacity: [0, 1, 1, 1, 1, 0], x: [70, 70, 4, 4, 4, 4], y: [110, 110, 2, 2, 2, 2], scale: [1, 1, 1, 0.82, 1, 1] }}
      transition={{ duration: 2.4, delay: CLIQUE - 1.1, times: [0, 0.08, 0.42, 0.47, 0.54, 1], ease: curva, opacity: { duration: 2.4, delay: CLIQUE - 1.1, times: [0, 0.08, 0.42, 0.47, 0.54, 1], ease: "linear" } }}
    >
      <svg viewBox="0 0 24 24" className="h-full w-full" aria-hidden="true">
        <path d="M5 3.2l13.6 7.4-6 1.5-2.9 5.7z" fill="#fff" stroke="#0E1A19" strokeWidth="1.3" strokeLinejoin="round" />
      </svg>
    </motion.span>
  );
}

/** Product head visual (copy deck 4.1): the Legal inbox drawn in code, its morning under control. */
export function Desk() {
  const ref = useRef<HTMLDivElement>(null);
  const ver = useInView(ref, { once: true, margin: "-40px" });
  const mov = useMov();
  const vivo = ver && mov;

  return (
    <div ref={ref} className="relative">
      <div aria-hidden="true" className="pointer-events-none absolute -inset-10 rounded-[48px] bg-glow/20 blur-[100px]" />
      <div
        role="img"
        aria-label="The legalVector Legal inbox with demo data: awaiting intake 5, open 19, overdue 6, with requesters 2, and three requests waiting for a lawyer"
        className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#132826] to-night shadow-[0_50px_140px_-40px_rgba(20,184,166,.6)] ring-1 ring-white/[.13]"
      >
        <div className="flex items-center gap-2.5 border-b border-white/[.06] bg-white/[.02] px-4 py-3 sm:px-5">
          <Marca className="h-6 w-6" />
          <span className="text-[13px] font-[650] leading-none tracking-[-0.02em] text-white">
            legal<span className="text-mint">Vector</span>
          </span>
          <span className="ml-auto hidden h-7 w-44 rounded-lg bg-white/[.05] ring-1 ring-inset ring-white/[.06] sm:block" />
          <span className="ml-auto h-7 w-7 rounded-full bg-gradient-to-br from-glow to-teal ring-2 ring-white/10 sm:ml-0" />
        </div>

        <div className="space-y-3 p-3 sm:space-y-3.5 sm:p-4">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-2.5">
            {CONTADORES.map(([t, n, cor], i) => (
              <motion.div
                key={t}
                initial={{ opacity: 0, y: 10 }}
                animate={ver ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: ENTRA - 0.2 + i * 0.08, ease: curva }}
                className="relative overflow-hidden rounded-xl border border-white/[.07] bg-white/[.035] px-3 py-2.5 sm:px-3.5 sm:py-3"
              >
                <span className={`block text-2xl font-semibold leading-none tracking-[-0.03em] tabular-nums sm:text-[28px] ${cor}`}>
                  <Conta ate={n} ver={ver} atraso={ENTRA + i * 0.12} />
                </span>
                <span className="mt-1.5 block truncate text-[12px] leading-tight text-mute">{t}</span>
                {i === 2 && <span aria-hidden="true" className="absolute right-3 top-3 h-1.5 w-1.5 rounded-full bg-amber shadow-[0_0_10px_2px_rgba(245,158,11,.6)]" />}
              </motion.div>
            ))}
          </div>

          <div className="overflow-hidden rounded-xl border border-white/[.07] bg-white/[.02]">
            {FILA.map(([titulo, dep, acao, Icone], i) => {
              const primeiro = i === 0;
              const cheio = acao.startsWith("Assign");
              return (
                <motion.div
                  key={titulo}
                  initial={{ opacity: 0, x: -18 }}
                  animate={ver ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.55, delay: LINHAS + i * 0.15, ease: curva }}
                  className={`relative flex items-center gap-3 border-b border-white/[.06] px-3 py-3 last:border-0 sm:px-4 ${primeiro ? "z-10" : ""}`}
                >
                  {primeiro && (
                    <>
                      <motion.span
                        aria-hidden="true"
                        className="absolute inset-0 bg-gradient-to-r from-mint/[.09] to-transparent"
                        initial={{ opacity: mov ? 0 : 1 }}
                        animate={vivo ? { opacity: 1 } : {}}
                        transition={{ duration: 0.6, delay: CLIQUE + 0.05 }}
                      />
                      <motion.span
                        aria-hidden="true"
                        className="absolute inset-y-0 left-0 w-[3px] origin-top bg-mint shadow-[0_0_12px_rgba(94,234,212,.9)]"
                        initial={{ scaleY: mov ? 0 : 1 }}
                        animate={vivo ? { scaleY: 1 } : {}}
                        transition={{ duration: 0.45, delay: CLIQUE + 0.05, ease: curva }}
                      />
                    </>
                  )}
                  <span className="relative hidden h-8 w-8 shrink-0 place-items-center rounded-full bg-white/[.05] text-mute ring-1 ring-inset ring-white/[.06] sm:grid">
                    <Icone className="h-4 w-4" />
                  </span>
                  <span className="relative min-w-0 flex-1">
                    <span className="flex items-center gap-1.5 text-[12px] font-medium leading-none text-mint">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-mint shadow-[0_0_8px_rgba(94,234,212,.8)]" />
                      Awaiting intake
                    </span>
                    <span className="mt-1.5 block truncate text-[14px] font-medium leading-tight text-white">{titulo}</span>
                    <span className="mt-0.5 block truncate text-[12px] leading-tight text-mute">{dep}</span>
                  </span>
                  <span className="relative shrink-0">
                    <motion.span
                      className={`relative inline-flex h-8 items-center whitespace-nowrap rounded-lg px-2.5 text-[12px] font-medium ${
                        cheio ? "bg-teal text-white shadow-[0_6px_18px_-8px_rgba(20,184,166,.9)]" : "border border-white/15 text-white/85"
                      }`}
                      animate={primeiro && vivo ? { scale: [1, 1, 0.9, 1], backgroundColor: ["#0F766E", "#0F766E", "#14B8A6", "#14B8A6"] } : {}}
                      transition={{ duration: 0.5, delay: CLIQUE - 0.2, times: [0, 0.4, 0.6, 1] }}
                    >
                      {acao}
                    </motion.span>
                    {primeiro && vivo && (
                      <>
                        <motion.span
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-0 rounded-lg border-2 border-mint"
                          initial={{ opacity: 0, scale: 1 }}
                          animate={{ opacity: [0, 0.9, 0], scale: [1, 1.05, 1.45] }}
                          transition={{ duration: 0.9, delay: CLIQUE, ease: "easeOut" }}
                        />
                        <Cursor />
                      </>
                    )}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
      <p className="relative mt-3 text-center text-[13px] text-mute">Demo data</p>
    </div>
  );
}
