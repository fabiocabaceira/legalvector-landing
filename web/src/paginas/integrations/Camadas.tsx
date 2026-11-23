import { useRef, type ReactNode } from "react";
import { motion, useInView } from "framer-motion";
import { curva } from "../../base";
import { LogoParceiro, Marca, moldura, useMov } from "../../ui";
import { DadosExemplo, IcFaisca } from "./comum";

const mola = { type: "spring", stiffness: 240, damping: 21 } as const;

function Camada({ ver, de, atraso, destaque = false, icone, children }: { ver: boolean; de: number; atraso: number; destaque?: boolean; icone: ReactNode; children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: de }}
      animate={ver ? { opacity: 1, x: 0 } : {}}
      transition={{ ...mola, delay: atraso, opacity: { duration: 0.4, delay: atraso } }}
      className={`relative flex items-center gap-4 rounded-2xl border p-4 sm:p-5 ${
        destaque ? "border-glow/45 bg-glow/[.09] shadow-[0_0_44px_-14px_rgba(20,184,166,.95)]" : "border-white/[.08] bg-white/[.04]"
      }`}
    >
      {icone}
      {children}
      {/* the "lock": a ring that flashes once the layer has settled */}
      <motion.span
        className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-mint/60"
        initial={{ opacity: 0 }}
        animate={ver ? { opacity: [0, 0.85, 0] } : {}}
        transition={{ duration: 0.9, delay: atraso + 0.45, times: [0, 0.2, 1] }}
      />
    </motion.div>
  );
}

const azulejo = "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border";

/** Copy deck 5.1: TexterAgent AI on top, legalVector in the middle, Alfresco Content Services at the base. */
export function Camadas() {
  const ref = useRef<HTMLDivElement>(null);
  const ver = useInView(ref, { once: true, margin: "-40px" });
  const mov = useMov();
  return (
    <div ref={ref} aria-hidden="true" className={`${moldura} p-5 sm:p-7`}>
      <Camada ver={ver} de={-28} atraso={0.25} icone={<span className={`${azulejo} border-white/10 bg-white/[.05] text-mint`}><IcFaisca className="h-5 w-5" /></span>}>
        <span className="text-[15px] font-semibold text-white sm:text-base">TexterAgent AI</span>
      </Camada>

      {/* faint link between the AI and legalVector */}
      <div className="relative h-8 sm:h-9">
        <motion.span
          initial={{ scaleY: 0 }}
          animate={ver ? { scaleY: 1 } : {}}
          transition={{ duration: 0.45, delay: 0.95, ease: curva }}
          style={{ originY: 0 }}
          className="absolute inset-y-0 left-[38px] block w-px border-l border-dashed border-white/25 sm:left-[42px]"
        />
      </div>

      <Camada ver={ver} de={28} atraso={0.45} destaque icone={<Marca className="h-11 w-11 shrink-0" />}>
        <span className="text-[17px] font-[650] tracking-[-0.02em] text-white sm:text-lg">
          legal<span className="text-mint">Vector</span>
        </span>
      </Camada>

      {/* the connector: official APIs, as the signed-in user */}
      <div className="relative h-[88px] sm:h-24">
        <motion.span
          initial={{ scaleY: 0 }}
          animate={ver ? { scaleY: 1 } : {}}
          transition={{ duration: 0.6, delay: 1.15, ease: curva }}
          style={{ originY: 0 }}
          className="absolute inset-y-0 left-[38px] block w-0.5 -translate-x-1/2 rounded bg-gradient-to-b from-mint via-glow to-mint shadow-[0_0_12px_1px_rgba(94,234,212,.7)] sm:left-[42px]"
        />
        {ver && mov && (
          <motion.span
            className="absolute left-[38px] top-0 block h-5 w-1 -translate-x-1/2 rounded-full bg-white shadow-[0_0_14px_3px_rgba(94,234,212,.9)] sm:left-[42px]"
            initial={{ y: 0, opacity: 0 }}
            animate={{ y: [0, 66], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 1.7, delay: 2.1, repeat: Infinity, repeatDelay: 0.8, ease: "easeInOut" }}
          />
        )}
        {[0, 1].map((k) => (
          <motion.span
            key={k}
            initial={{ scale: 0 }}
            animate={ver ? { scale: 1 } : {}}
            transition={{ type: "spring", stiffness: 420, damping: 16, delay: 1.75 + k * 0.12 }}
            className={`absolute left-[38px] -ml-[5px] block h-2.5 w-2.5 rounded-full bg-mint shadow-[0_0_12px_2px_rgba(94,234,212,.85)] sm:left-[42px] ${k ? "-bottom-[5px]" : "-top-[5px]"}`}
          />
        ))}
        <motion.span
          initial={{ opacity: 0, x: -8, filter: "blur(4px)" }}
          animate={ver ? { opacity: 1, x: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 0.5, delay: 1.45, ease: curva }}
          className="absolute inset-y-0 left-[64px] flex items-center text-[13px] font-medium text-mint sm:left-[72px] sm:text-sm"
        >
          Official APIs · signed-in user
        </motion.span>
      </div>

      <Camada ver={ver} de={-28} atraso={0.65} icone={<span className={`${azulejo} border-white/10 bg-white/[.05]`}><LogoParceiro marca="alfresco" className="h-6 w-6" /></span>}>
        <span className="text-[15px] font-semibold text-white sm:text-base">Alfresco Content Services</span>
      </Camada>

      <motion.div
        initial={{ opacity: 0 }}
        animate={ver ? { opacity: 1 } : {}}
        transition={{ delay: 2.2, duration: 0.6 }}
        className="mt-6 flex justify-end border-t border-white/[.07] pt-4"
      >
        <DadosExemplo />
      </motion.div>
    </div>
  );
}
