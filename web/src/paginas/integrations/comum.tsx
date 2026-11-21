import type { ComponentType, SVGProps } from "react";
import { motion } from "framer-motion";
import { curva } from "../../base";
import { ic } from "../../ui";

export type Ic = ComponentType<SVGProps<SVGSVGElement>>;

/** Four-point spark for the AI layer. */
export const IcFaisca = ic(<path d="M12 3.5c.7 4.3 3.2 6.8 7.5 7.5-4.3.7-6.8 3.2-7.5 7.5-.7-4.3-3.2-6.8-7.5-7.5 4.3-.7 6.8-3.2 7.5-7.5z" />);
export const IcComentario = ic(<path d="M5 5.5h14a1.5 1.5 0 0 1 1.5 1.5v8.5A1.5 1.5 0 0 1 19 17h-8l-4.5 3.5V17H5a1.5 1.5 0 0 1-1.5-1.5V7A1.5 1.5 0 0 1 5 5.5z" />);

/** The label every coded visual carries. */
export function DadosExemplo({ className = "" }: { className?: string }) {
  return <span className={`text-[13px] text-white/40 ${className}`}>Demo data</span>;
}

/** 48 px icon tile with the mint glow; pulses once when it comes into view. */
export function Azulejo({ Icone, atraso = 0, className = "h-12 w-12" }: { Icone: Ic; atraso?: number; className?: string }) {
  return (
    <span className={`relative flex shrink-0 items-center justify-center rounded-xl border border-glow/30 bg-glow/10 text-mint shadow-[0_0_28px_-8px_rgba(20,184,166,.9)] ${className}`}>
      <motion.span
        aria-hidden="true"
        className="absolute inset-0 rounded-xl ring-1 ring-mint/70"
        initial={{ opacity: 0, scale: 1 }}
        whileInView={{ opacity: [0, 0.9, 0], scale: [1, 1, 1.55] }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 1.1, delay: 0.35 + atraso, ease: curva, times: [0, 0.15, 1] }}
      />
      <Icone className="relative h-6 w-6" />
    </span>
  );
}
