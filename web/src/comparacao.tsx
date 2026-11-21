import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { R } from "./base";
import { Ligacao, Marca, Surge, Titulo } from "./ui";

export type Marcador = "sim" | "nao" | "mao";

/** Rows of copy deck 3.4: [what it does, the email-and-spreadsheets mark]. legalVector is "sim" on every row. */
export const LINHAS_COMPARACAO: ReadonlyArray<readonly [string, Marcador]> = [
  ["One front door for every department", "nao"],
  ["Fills the request in from the Word file", "nao"],
  ["Checks each draft against your playbook first", "nao"],
  ["Shows every requester where their request stands", "mao"],
  ["Holds approval while a clause fails, unless a lawyer records why", "nao"],
  ["Reads notice deadlines and renewals from each contract", "mao"],
  ["Shows who is overloaded and who has room", "mao"],
];

/** Lit mint dot = yes, hollow ring = no, the words "By hand" = only by hand. Never a check mark. */
export function Ponto({ tipo, aceso = true, atraso = 0 }: { tipo: Marcador; aceso?: boolean; atraso?: number }) {
  if (tipo === "mao")
    return (
      <span role="img" aria-label="Only by hand" className="text-[13px] font-medium text-soft">
        <span aria-hidden="true">By hand</span>
      </span>
    );
  if (tipo === "nao") return <span role="img" aria-label="No" className="inline-block h-3 w-3 rounded-full ring-[1.5px] ring-inset ring-white/30" />;
  return (
    <motion.span
      role="img"
      aria-label="Yes"
      className="inline-block h-3 w-3 rounded-full bg-mint"
      initial={{ scale: 0.4, opacity: 0.25, boxShadow: "0 0 0px 0px rgba(94,234,212,0)" }}
      animate={aceso ? { scale: 1, opacity: 1, boxShadow: "0 0 14px 2px rgba(94,234,212,.75)" } : undefined}
      transition={{ delay: atraso, type: "spring", stiffness: 420, damping: 20 }}
    />
  );
}

/** Comparison table (section#why). Same copy on Home and Product; the link under it is home only. */
export function Comparacao({ link = true }: { link?: boolean }) {
  const tabela = useRef<HTMLDivElement>(null);
  const ver = useInView(tabela, { once: true, margin: "-120px" });
  return (
    <section id="why" className="relative mx-auto max-w-5xl px-4 py-20 sm:px-8 sm:py-24" aria-labelledby="t-why">
      <Titulo id="t-why" titulo={["What your inbox", "will never do."]} texto="Most Legal work still runs on email, attachments and spreadsheets." />
      <Surge className="mt-12">
        <div ref={tabela} className="overflow-hidden rounded-3xl border border-white/[.08] bg-gradient-to-b from-deep/70 to-ink/70 backdrop-blur-sm">
          <table className="w-full table-fixed text-left">
            <caption className="sr-only">legalVector compared with email and spreadsheets</caption>
            <thead>
              <tr>
                <th scope="col" className="px-3 py-4 sm:px-8 sm:py-5">
                  <span className="sr-only">What it does</span>
                </th>
                <th scope="col" className="w-[64px] bg-glow/[.1] px-1 py-4 text-center sm:w-44 sm:px-2 sm:py-5">
                  <span className="inline-flex items-center gap-2">
                    <Marca className="h-7 w-7" />
                    <span className="sr-only text-base font-[650] tracking-[-0.02em] text-white sm:not-sr-only">
                      legal<span className="text-mint">Vector</span>
                    </span>
                  </span>
                </th>
                <th scope="col" className="w-[92px] px-1 py-4 text-center text-[12px] font-medium leading-snug text-mute sm:w-44 sm:px-2 sm:py-5 sm:text-sm">
                  Email and spreadsheets
                </th>
              </tr>
            </thead>
            <tbody>
              {LINHAS_COMPARACAO.map(([t, outro], i) => (
                <tr key={t} className="border-t border-white/[.06]">
                  <th scope="row" className="px-3 py-3.5 text-[14px] font-normal leading-snug text-white/85 sm:px-8 sm:py-5 sm:text-base">
                    {t}
                  </th>
                  <td className="bg-glow/[.1] text-center">
                    <Ponto tipo="sim" aceso={ver} atraso={0.35 + i * 0.06} />
                  </td>
                  <td className="px-2 text-center">
                    <Ponto tipo={outro} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Surge>
      {link && (
        <Surge className="mt-8 text-center">
          <Ligacao href={R("product/")}>See how legalVector works</Ligacao>
        </Surge>
      )}
    </section>
  );
}
