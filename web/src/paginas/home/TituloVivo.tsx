import { useRef } from "react";
import { useInView } from "framer-motion";
import type { Linhas } from "../../base";
import { TextoDesfocado } from "../../ui";

/** An h2 whose words rise out of a 12 px blur one by one when it enters the viewport (line 2 in the accent gradient). */
export function TituloVivo({ id, titulo, className }: { id: string; titulo: Linhas; className: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const ver = useInView(ref, { once: true, margin: "-80px" });
  return (
    <h2 ref={ref} id={id} className={className}>
      <TextoDesfocado linhas={titulo} ativo={ver} passo={0.06} />
    </h2>
  );
}
