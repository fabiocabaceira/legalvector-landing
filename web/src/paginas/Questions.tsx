import { useRef, type ReactNode, type SVGProps } from "react";
import { motion, useInView, useScroll } from "framer-motion";
import { curva, type Linhas } from "../base";
import { Cartao, DuasLinhas, IcAlvo, IcCadeado, IcCamadas, IcPessoa, IcSeguinte, Marca, Surge, moldura } from "../ui";
import { CabecaLarga } from "./questions/Cabeca";

type Resposta = { q: string; a: string } | { q: string; corpo: ReactNode };
interface Grupo {
  id: string;
  titulo: Linhas;
  Icone: (p: SVGProps<SVGSVGElement>) => JSX.Element;
  itens: readonly Resposta[];
}

/* Copy deck 6.3 step-through card, listed plainly for "How does a rollout go?" */
const LANCAMENTO: ReadonlyArray<readonly [string, string]> = [
  ["Connect.", "Point legalVector at your repository. Users sign in with their own accounts."],
  ["Set up Legal.", "Preview and apply the Legal model, then set the team, routing and contract types."],
  ["Pilot.", "Run real requests from one or two departments on the embedded engine."],
  ["Production.", "Approve the rule sets and switch on AI screening. Optionally move to the repository’s own engine."],
  ["Roll out.", "Open the front door to every department, each in its own language."],
];

function Lancamento() {
  const ref = useRef<HTMLOListElement>(null);
  const ver = useInView(ref, { once: true, margin: "-80px" });
  return (
    <>
      <ol ref={ref} className="relative mt-5 grid gap-5">
        {LANCAMENTO.map(([t, p], i) => (
          <motion.li
            key={t}
            initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
            animate={ver ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
            transition={{ duration: 0.55, delay: 0.15 + i * 0.12, ease: curva }}
            className="relative grid list-none grid-cols-[32px_1fr] items-start gap-4"
          >
            {i < LANCAMENTO.length - 1 && (
              <span aria-hidden="true" className="absolute -bottom-5 left-[15.5px] top-8 w-px bg-white/10">
                <motion.span
                  className="block h-full w-full origin-top bg-gradient-to-b from-mint to-glow shadow-[0_0_10px_rgba(94,234,212,.7)]"
                  initial={{ scaleY: 0 }}
                  animate={ver ? { scaleY: 1 } : {}}
                  transition={{ duration: 0.4, delay: 0.35 + i * 0.12, ease: curva }}
                />
              </span>
            )}
            <span className="relative z-10 grid h-8 w-8 place-items-center rounded-full border border-glow/60 bg-ink text-[13px] font-semibold text-mint shadow-[0_0_18px_-4px_rgba(20,184,166,.9)]">
              {i + 1}
            </span>
            <p className="pt-1 text-pretty text-[15px] leading-relaxed text-mute sm:text-base">
              <strong className="font-semibold text-white">{t}</strong> {p}
            </p>
          </motion.li>
        ))}
      </ol>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={ver ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.95, ease: curva }}
        className="mt-6 border-t border-white/10 pt-5 text-[15px] font-medium leading-relaxed text-white sm:text-base"
      >
        The AI proposes. <span className="texto-grad">The lawyer decides.</span> At every step.
      </motion.p>
    </>
  );
}

const GRUPOS: readonly Grupo[] = [
  {
    id: "data",
    titulo: ["Your", "data"],
    Icone: IcCadeado,
    itens: [
      {
        q: "Is our data safe?",
        a: "Your contracts stay in your repository. legalVector uses the repository’s official APIs, and every call runs as the signed-in user, with no super user and no parallel permissions. Visibility is applied on the server, and secrets stay on the server. The audit trail is mirrored as comments in the repository.",
      },
      {
        q: "Where is our data stored?",
        a: "In your repository. Documents, versions, metadata, permissions and key dates are stored, secured and audited by your repository. legalVector keeps only its own working state, such as Legal timelines and settings.",
      },
    ],
  },
  {
    id: "systems",
    titulo: ["Your", "systems"],
    Icone: IcCamadas,
    itens: [
      {
        q: "Which repositories does legalVector run on?",
        a: "Today, fully supported: Doxis 4 and Alfresco Content Services. One setting chooses the repository. The Legal desk works the same on both: requests, review, redlines, approval gate, key dates, analytics and rulebook. Every supported repository passes the same 124 end to end checks.",
      },
      {
        q: "Does it fit the systems we already run?",
        a: "Yes. It runs on Alfresco Content Services or Doxis 4. Changes come out as genuine Word tracked changes. Notifications go by email, and key dates export to your calendar. There is no data migration and no second repository.",
      },
      {
        q: "Does legalVector replace our repository’s own clients?",
        a: "No. The repository’s own clients stay in place and work on the same documents and permissions. legalVector adds the front door and the review desk around them, and writes every result back to the repository.",
      },
      {
        q: "Which workflow engine does it use?",
        a: "An embedded engine runs the Legal process as standard BPMN. On Alfresco, that same process can run on Alfresco Process Services. On Doxis, document reviews can use Doxis BPM & Insights, and the Legal request process stays on the embedded engine. The Legal screens stay the same.",
      },
      {
        q: "Does it need changes to our repository?",
        a: "Only what the Legal desk needs. Set up Legal previews every step, the Legal model, where requests are filed and the permissions, and creates only what is missing.",
      },
    ],
  },
  {
    id: "ai",
    titulo: ["The", "AI"],
    Icone: IcAlvo,
    itens: [
      {
        q: "How does the AI handle our contracts?",
        a: "TexterAgent is called from the legalVector server only. The key never reaches the browser. It reviews against your playbook, proposes wording and records which rule set version judged each document. Lawyers decide.",
      },
      {
        q: "Can we ask it questions?",
        a: "Yes, in plain words and in your language. Ask Legal answers with a count, how it read the question and the matching list. Counts, filters and lists. Not open legal advice.",
      },
    ],
  },
  {
    id: "people",
    titulo: ["Your", "people"],
    Icone: IcPessoa,
    itens: [
      {
        q: "Will the business actually use it?",
        a: "That is the point of the front door. Raising a request from a Word document takes about a minute, and the form fills itself from the document. It works in five languages, including Arabic right to left, in light and dark mode.",
      },
      {
        q: "Which languages does it speak?",
        a: "English, Spanish, Portuguese, French and Arabic: every screen, process label, date and number, with a right to left layout for Arabic. Each person picks their own. Ask Legal understands questions, and contracts can be read side by side with an AI translation, in all five.",
      },
    ],
  },
  {
    id: "start",
    titulo: ["Getting", "started"],
    Icone: IcSeguinte,
    itens: [
      {
        q: "What does it take to get started?",
        a: "Connect your repository, preview and apply the Legal setup, then pilot with one or two departments before you roll out. Nothing to migrate, and nothing to unwind.",
      },
      { q: "How does a rollout go?", corpo: <Lancamento /> },
      {
        q: "What happens in the demo?",
        a: "We walk you through the front door, the review and approval, the notifications and the dashboards, on the repository you already use. Bring your own case.",
      },
    ],
  },
];

/** The first sentence reads in white, the rest in the quiet tone, so a long answer scans in one look. */
function Texto({ a }: { a: string }) {
  const m = /^(.+?[.?!])\s+([\s\S]*)$/.exec(a);
  const [lead, resto] = m ? [m[1], m[2]] : [a, ""];
  return (
    <p className="mt-3 text-pretty text-[15px] leading-relaxed text-mute sm:text-base">
      <span className="text-white/90">{lead}</span>
      {resto && " " + resto}
    </p>
  );
}

/** An answer spans both columns when it holds the rollout steps, or when it would sit alone in its row. */
function largas(itens: readonly Resposta[]) {
  const out: boolean[] = [];
  let col = 0;
  itens.forEach((r, i) => {
    const prox = itens[i + 1];
    const larga = !("a" in r) || (col === 0 && (!prox || !("a" in prox)));
    out.push(larga);
    col = larga ? 0 : (col + 1) % 2;
  });
  return out;
}

function UmGrupo({ g }: { g: Grupo }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.6", "end 0.6"] });
  const larga = largas(g.itens);
  return (
    <section ref={ref} id={g.id} aria-labelledby={`t-${g.id}`} className="grid gap-6 border-t border-white/10 py-10 sm:py-12 lg:grid-cols-[240px_1fr] lg:gap-12">
      <div className="lg:sticky lg:top-28 lg:self-start">
        <Surge>
          <span aria-hidden="true" className="mb-4 grid h-10 w-10 place-items-center rounded-xl border border-glow/30 bg-glow/10 text-mint shadow-[0_0_28px_-8px_rgba(20,184,166,.9)]">
            <g.Icone className="h-6 w-6" />
          </span>
          <h2 id={`t-${g.id}`} className="text-3xl font-[650] leading-[1.04] tracking-[-0.04em] text-white lg:text-4xl">
            <DuasLinhas l={g.titulo} />
          </h2>
        </Surge>
        <div aria-hidden="true" className="mt-7 hidden h-28 w-px bg-white/10 lg:block">
          <motion.div style={{ scaleY: scrollYProgress, originY: 0 }} className="h-full w-full bg-gradient-to-b from-glow via-mint to-glow shadow-[0_0_12px_1px_rgba(94,234,212,.8)]" />
        </div>
      </div>
      <ul className="grid gap-3 sm:gap-4 xl:grid-cols-2">
        {g.itens.map((r, i) => (
          <Surge key={r.q} as="li" atraso={(i % 2) * 0.06} className={`list-none ${larga[i] ? "xl:col-span-2" : ""}`}>
            <Cartao className="h-full p-5 sm:p-7">
              <h3 className="text-pretty text-lg font-semibold leading-snug tracking-[-0.015em] text-white sm:text-xl">{r.q}</h3>
              {"a" in r ? <Texto a={r.a} /> : r.corpo}
            </Cartao>
          </Surge>
        ))}
      </ul>
    </section>
  );
}

const DESTAQUE = [
  "The AI reviews against Legal’s playbook and proposes.",
  "A lawyer always decides.",
  "Approval waits while must-fix findings are open, unless a lawyer overrides them with a written reason, recorded on the timeline.",
  "Every approved contract comes with its reasons.",
];

/** Featured card (Doxter Novidades "latest note"): the first answer a General Counsel looks for. */
function Destaque() {
  const entra = (k: number) => ({
    initial: { opacity: 0, filter: "blur(6px)" },
    animate: { opacity: 1, filter: "blur(0px)" },
    transition: { duration: 0.55, delay: 0.95 + k * 0.12, ease: curva },
  });
  return (
    <div className="relative">
      <div aria-hidden="true" className="pointer-events-none absolute -inset-8 rounded-[48px] bg-glow/15 blur-[90px]" />
      <article aria-labelledby="t-destaque" className={`${moldura} relative p-7 sm:p-9`}>
        <span className="relative grid h-12 w-12 place-items-center">
          <span className="onda absolute inset-0 rounded-2xl border border-glow/60" />
          <Marca className="relative h-12 w-12" />
        </span>
        <h2 id="t-destaque" className="mt-7 text-balance text-2xl font-[650] leading-[1.12] tracking-[-0.03em] text-white sm:text-3xl">
          <DuasLinhas l={["Does the AI approve", "contracts on its own?"]} />
        </h2>
        <motion.p {...entra(0)} className="mt-6 text-5xl font-[650] leading-none tracking-[-0.04em] text-white">
          <span className="texto-grad pb-[0.08em]">No.</span>
        </motion.p>
        <motion.span
          aria-hidden="true"
          className="mt-5 block h-px w-full origin-left bg-gradient-to-r from-mint via-mint/40 to-transparent"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 1.1, ease: curva }}
        />
        <p className="mt-5 text-pretty text-[15px] leading-relaxed text-mute sm:text-base">
          {DESTAQUE.map((f, k) => (
            <motion.span key={k} {...entra(k + 1)} className={`inline ${k === 1 ? "font-medium text-white" : ""}`}>
              {f}
              {k < DESTAQUE.length - 1 ? " " : ""}
            </motion.span>
          ))}
        </p>
      </article>
    </div>
  );
}

/** Questions (copy deck 7): the Doxter Novidades layout, groups with a pinned label and open answers. */
export default function Questions() {
  return (
    <>
      <CabecaLarga titulo={["Questions General Counsel", "ask us."]} texto="Anything else, ask us in the demo. We answer plainly." visual={<Destaque />} />
      <div className="mx-auto max-w-7xl px-5 pb-12 sm:px-8">
        {GRUPOS.map((g) => (
          <UmGrupo key={g.id} g={g} />
        ))}
      </div>
    </>
  );
}
