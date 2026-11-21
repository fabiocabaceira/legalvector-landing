import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { curva } from "../../base";
import { IcDocumento, IcPasta, IcPorta, Marca, moldura, useMov } from "../../ui";
import { DadosExemplo } from "./comum";

// live-front-door.vtt cue 11: "It is now a Legal Request in Doxis: descriptors, file, and a number."
const LINHAS = ["Descriptors", "File", "Number"] as const;
const LARGURAS = ["w-[62%]", "w-[44%]", "w-[30%]"];

const voo = { type: "spring", stiffness: 210, damping: 26 } as const;

function Ficha({ chegou }: { chegou: boolean }) {
  return (
    <motion.div
      layoutId="lv-pedido-doxis"
      initial={chegou ? false : { opacity: 0, scale: 0.8, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={voo}
      className={`relative flex items-center gap-3 rounded-xl border px-3.5 py-3 ${
        chegou ? "border-glow/50 bg-glow/[.12] shadow-[0_0_36px_-10px_rgba(94,234,212,.95)]" : "border-white/12 bg-white/[.06] shadow-[0_18px_40px_-18px_rgba(0,0,0,.8)]"
      }`}
    >
      <motion.span layout="position" className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${chegou ? "bg-mint/15 text-mint" : "bg-white/[.07] text-white/80"}`}>
        <IcDocumento className="h-5 w-5" />
      </motion.span>
      {chegou ? (
        <motion.span
          key="nome"
          initial={{ opacity: 0, x: 6, filter: "blur(4px)" }}
          animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.45, delay: 0.25, ease: curva }}
          className="min-w-0 flex-1 truncate text-[15px] font-semibold text-white"
        >
          Legal Request
        </motion.span>
      ) : (
        <span className="grid min-w-0 flex-1 gap-1.5">
          <span className="h-1.5 w-[80%] rounded-full bg-white/25" />
          <span className="h-1.5 w-[52%] rounded-full bg-white/15" />
        </span>
      )}
      <motion.span
        layout="position"
        className={`h-2.5 w-2.5 shrink-0 rounded-full transition-colors duration-500 ${chegou ? "bg-mint shadow-[0_0_12px_2px_rgba(94,234,212,.8)]" : "bg-amber shadow-[0_0_12px_2px_rgba(245,158,11,.7)]"}`}
      />
    </motion.div>
  );
}

/** Copy deck 6.1: a request leaves the legalVector front door and lands in Doxis as a Legal Request. */
export function ChegaDoxis() {
  const ref = useRef<HTMLDivElement>(null);
  const ver = useInView(ref, { once: true, margin: "-40px" });
  const mov = useMov();
  const [fase, setFase] = useState(0);

  useEffect(() => {
    if (!ver) return;
    if (!mov) {
      setFase(2);
      return;
    }
    const t1 = setTimeout(() => setFase(1), 650);
    const t2 = setTimeout(() => setFase(2), 2100);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [ver, mov]);

  const chegou = fase >= 2;
  return (
    <div ref={ref} aria-hidden="true" className={`${moldura} p-5 sm:p-7`}>
      <div className="grid gap-3 sm:grid-cols-[minmax(0,.9fr)_44px_minmax(0,1.25fr)] sm:items-center sm:gap-0">
        {/* the front door */}
        <motion.div
          initial={{ opacity: 0, x: -18 }}
          animate={ver ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2, ease: curva }}
          className="rounded-2xl border border-white/[.08] bg-white/[.03] p-3.5 sm:p-4"
        >
          <div className="flex items-center gap-2.5">
            <Marca className="h-7 w-7 shrink-0" />
            <span className="text-[15px] font-[650] tracking-[-0.02em] text-white">
              legal<span className="text-mint">Vector</span>
            </span>
            <IcPorta className="ml-auto h-5 w-5 shrink-0 text-mint/80" />
          </div>
          <div className="relative mt-3.5 min-h-[62px] rounded-xl border border-dashed border-white/12 p-1.5">
            {fase === 1 && <Ficha chegou={false} />}
            {fase === 2 && (
              <motion.div
                initial={mov ? { opacity: 0, y: 10, scale: 0.94 } : false}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 24, delay: 0.9 }}
                className="flex items-center gap-3 rounded-xl border border-white/12 bg-white/[.06] px-3.5 py-3"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[.07] text-white/80">
                  <IcDocumento className="h-5 w-5" />
                </span>
                <span className="grid min-w-0 flex-1 gap-1.5">
                  <span className="h-1.5 w-[72%] rounded-full bg-white/25" />
                  <span className="h-1.5 w-[46%] rounded-full bg-white/15" />
                </span>
                <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-amber shadow-[0_0_12px_2px_rgba(245,158,11,.7)]" />
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* the path between them */}
        <div className="relative h-10 sm:h-full sm:min-h-10">
          <motion.span
            initial={{ scaleX: 0, scaleY: 0 }}
            animate={ver ? { scaleX: 1, scaleY: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.7, ease: curva }}
            className="absolute left-1/2 top-0 block h-full w-0.5 origin-top -translate-x-1/2 bg-gradient-to-b from-mint/20 via-mint to-mint/20 shadow-[0_0_10px_1px_rgba(94,234,212,.6)] sm:left-0 sm:top-1/2 sm:h-0.5 sm:w-full sm:origin-left sm:translate-x-0 sm:-translate-y-1/2 sm:bg-gradient-to-r"
          />
          {ver && mov && (
            <span className="absolute inset-0 overflow-hidden">
              <motion.span
                className="absolute left-1/2 top-0 block h-4 w-1 -translate-x-1/2 rounded-full bg-white shadow-[0_0_12px_3px_rgba(94,234,212,.9)] sm:hidden"
                animate={{ y: [-16, 40], opacity: [0, 1, 1, 0] }}
                transition={{ duration: 1.3, delay: 1.4, repeat: Infinity, repeatDelay: 1, ease: "easeInOut" }}
              />
              <motion.span
                className="absolute left-0 top-1/2 hidden h-1 w-4 -translate-y-1/2 rounded-full bg-white shadow-[0_0_12px_3px_rgba(94,234,212,.9)] sm:block"
                animate={{ x: [-16, 48], opacity: [0, 1, 1, 0] }}
                transition={{ duration: 1.3, delay: 1.4, repeat: Infinity, repeatDelay: 1, ease: "easeInOut" }}
              />
            </span>
          )}
        </div>

        {/* the Doxis panel */}
        <motion.div
          initial={{ opacity: 0, x: 18 }}
          animate={ver ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.35, ease: curva }}
          className="rounded-2xl border border-white/[.08] bg-night/60 p-3.5 sm:p-4"
        >
          <div className="flex items-center gap-2.5 border-b border-white/[.07] pb-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-glow/30 bg-glow/10 text-mint">
              <IcPasta className="h-4 w-4" />
            </span>
            <span className="text-[15px] font-semibold text-white">Doxis</span>
          </div>
          <div className="mt-3 min-h-[62px] rounded-xl border border-dashed border-white/10 p-1.5">{chegou && <Ficha chegou />}</div>
          <ul className="mt-2 grid gap-1.5">
            {LINHAS.map((l, i) => (
              <motion.li
                key={l}
                initial={{ opacity: 0, y: 10, scale: 0.94 }}
                animate={chegou ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ type: "spring", stiffness: 420, damping: 24, delay: 0.55 + i * 0.18 }}
                className="flex list-none items-center gap-3 rounded-lg border border-white/[.06] bg-white/[.03] px-3 py-2.5"
              >
                <span className="w-[5.6rem] shrink-0 text-[13px] font-medium text-soft">{l}</span>
                <span className={`h-1.5 rounded-full bg-white/15 ${LARGURAS[i]}`} />
                <motion.span
                  initial={{ scale: 0 }}
                  animate={chegou ? { scale: 1 } : {}}
                  transition={{ type: "spring", stiffness: 500, damping: 18, delay: 0.8 + i * 0.18 }}
                  className="ml-auto h-2.5 w-2.5 shrink-0 rounded-full bg-mint shadow-[0_0_10px_2px_rgba(94,234,212,.7)]"
                />
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={ver ? { opacity: 1 } : {}}
        transition={{ delay: 2.6, duration: 0.6 }}
        className="mt-6 flex items-center gap-2 border-t border-white/[.07] pt-4"
      >
        <DadosExemplo className="ml-auto" />
      </motion.div>
    </div>
  );
}
