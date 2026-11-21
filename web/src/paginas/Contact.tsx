import { motion } from "framer-motion";
import { CTA, FALAR, PRIVACIDADE, TELEFONE, TEL_HREF, curva } from "../base";
import { WA_HREF, urlProduto } from "../rastreio";
import { Cabeca, IcCalendario, IcGlobo, Seta, TituloBloco, WhatsApp } from "../ui";
import type { Ic } from "./integrations/comum";

type Acao = { titulo: string; texto: string; href: string; Icone: Ic; cta?: string; evento?: string; fora?: boolean; feixe?: boolean };

function Acoes() {
  const acoes: Acao[] = [
    { titulo: CTA, texto: "We confirm the time by email within one business day.", href: "#demo", Icone: IcCalendario, cta: "contact", feixe: true },
    { titulo: FALAR, texto: `WhatsApp ${TELEFONE}`, href: WA_HREF, Icone: WhatsApp, cta: "whatsapp", fora: true },
    { titulo: "See the full product", texto: "legal.texter.ai", href: urlProduto(), Icone: IcGlobo, evento: "main-site" },
  ];
  return (
    <ul className="grid gap-3">
      {acoes.map(({ titulo, texto, href, Icone, cta, evento, fora, feixe }, i) => (
        <motion.li key={titulo} className="list-none" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.55 + i * 0.12, ease: curva }}>
          <a
            href={href}
            data-cta={cta}
            data-event={evento}
            target={fora ? "_blank" : undefined}
            rel={href.startsWith("http") ? "noopener" : undefined}
            className={`group flex items-center gap-5 rounded-2xl border p-5 transition sm:p-6 ${
              feixe ? "feixe border-glow/30 bg-glow/[.08] hover:bg-glow/[.14]" : "border-white/[.08] bg-deep/70 hover:border-white/20 hover:bg-deep"
            }`}
          >
            <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border ${fora ? "border-wa/35 bg-wa/10 text-wa" : "border-glow/30 bg-glow/10 text-mint"}`}>
              <Icone className="h-6 w-6" />
            </span>
            <span className="min-w-0">
              <span className="block text-lg font-semibold tracking-[-0.01em] text-white sm:text-xl">{titulo}</span>
              <span className="mt-0.5 block text-pretty text-sm leading-snug text-mute sm:text-[15px]">{texto}</span>
            </span>
            <Seta className="ml-auto h-5 w-5 shrink-0 text-mint/70 transition group-hover:translate-x-1 group-hover:text-white" />
          </a>
        </motion.li>
      ))}
    </ul>
  );
}

const ligacao = "-my-2.5 inline-block py-2.5 text-mint underline decoration-mint/30 underline-offset-4 hover:decoration-mint";

const DADOS: ReadonlyArray<readonly [string, React.ReactNode]> = [
  ["Company", "Texter Blue, Lda"],
  ["Tax ID", "514754877"],
  ["Address", "Rua da Criatividade, Parque Tecnológico de Óbidos, Edifícios Centrais, 2510-216 Óbidos, Portugal"],
  [
    "Phone",
    <a href={TEL_HREF} className={ligacao}>
      {TELEFONE}
    </a>,
  ],
  [
    "Privacy",
    <a href={PRIVACIDADE} rel="noopener" className={ligacao}>
      texter.ai/privacy
    </a>,
  ],
];

export default function Contact() {
  return (
    <>
      <Cabeca
        titulo={["Talk to us.", "We answer plainly."]}
        texto="legalVector is a TexterBlue product. Texter Blue, Lda is based in the Óbidos Technology Park, Portugal. Message us on WhatsApp, or book a demo at the end of this page."
        acoes={false}
        visual={<Acoes />}
      />
      <section aria-labelledby="t-quem" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
        <TituloBloco id="t-quem" titulo={["Who is", "behind legalVector?"]} />
        <dl className="mt-12 grid gap-x-12 sm:grid-cols-2">
          {DADOS.map(([k, v], i) => (
            <motion.div
              key={k}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.06, ease: curva }}
              className={`border-t border-white/15 py-6 ${k === "Address" ? "sm:col-span-2" : ""}`}
            >
              <dt className="text-sm text-mute">{k}</dt>
              <dd className="mt-1.5 text-pretty text-lg font-medium text-white">{v}</dd>
            </motion.div>
          ))}
        </dl>
      </section>
    </>
  );
}
