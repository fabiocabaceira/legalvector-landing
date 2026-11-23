import { motion } from "framer-motion";
import { CTA, HERO_FILM, PAGINA, curva, type Linhas } from "../../base";
import { Filme } from "../../filme";
import { BotaoFantasma, BotaoPrincipal, LogoParceiro, TextoDesfocado, useCortina, useMov } from "../../ui";

const H1: Linhas = PAGINA === "ask" ? ["Stop emailing Legal.", "Start asking Legal."] : ["Make Legal the fastest team", "in the building."];
// the home line 1 is 12.42 em wide: these sizes keep it on one row from a 360 px phone to the 1360 px column
const TAMANHO =
  PAGINA === "ask"
    ? "text-[1.875rem] sm:text-5xl lg:text-[clamp(2.4rem,3.65vw,3.25rem)]"
    : "text-[length:min(1.875rem,calc((100vw_-_2.5rem)/12.8))] sm:text-[length:clamp(2.2rem,7vw,3rem)] lg:text-[length:clamp(2.2rem,3.3vw,2.95rem)]";

/** Copy deck 3.1: the pain in the h1, the real product film beside it with captions on, one CTA. */
export default function Heroi() {
  const aberta = useCortina();
  const mov = useMov();
  const entra = (atraso: number) => ({
    initial: mov ? { opacity: 0, y: 12, filter: "blur(6px)" } : false,
    animate: aberta ? { opacity: 1, y: 0, filter: "blur(0px)" } : undefined,
    transition: { duration: 0.55, delay: atraso, ease: curva },
  });

  return (
    <section id="top" aria-labelledby="t-topo" className="relative flex min-h-[100svh] flex-col overflow-hidden pt-24 sm:pt-28">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="grade-fundo absolute inset-0" />
        <div className="absolute right-[-10%] top-[-260px] h-[620px] w-[1000px] rounded-full bg-[radial-gradient(closest-side,rgba(20,184,166,.28),transparent)]" />
        <div className="absolute bottom-[-180px] left-[-12%] h-[420px] w-[760px] rounded-full bg-[radial-gradient(closest-side,rgba(15,118,110,.22),transparent)]" />
      </div>

      {/* text first in the DOM (reading and focus order); the film moves above it on phones only */}
      <div className="relative mx-auto my-auto grid w-full max-w-[1360px] items-center gap-8 px-5 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-12 xl:grid-cols-[minmax(0,0.94fr)_minmax(0,1fr)]">
        <div className="min-w-0">
          <h1 id="t-topo" className={`text-balance font-[650] leading-[1.05] tracking-[-0.045em] text-white ${TAMANHO}`}>
            <TextoDesfocado linhas={H1} ativo={aberta} atraso={0.1} />
          </h1>

          <motion.p {...entra(0.45)} className="mt-5 max-w-md text-pretty text-base leading-relaxed text-mute sm:text-lg">
            One front door to Legal. Everyone sees where their request stands.
          </motion.p>

          <motion.div {...entra(0.6)} className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
            <BotaoPrincipal href="#demo" data-cta="hero">
              {CTA}
            </BotaoPrincipal>
            <BotaoFantasma href="#features">See how it works</BotaoFantasma>
          </motion.div>
        </div>

        <div className="order-first min-w-0 lg:order-none">
          <Filme filme={HERO_FILM} modo="heroi" atraso={0.05} />
        </div>
      </div>

      <motion.div
        initial={mov ? { opacity: 0, y: 10, filter: "blur(4px)" } : false}
        animate={aberta ? { opacity: 1, y: 0, filter: "blur(0px)" } : undefined}
        transition={{ duration: 0.6, delay: 0.8, ease: curva }}
        className="relative mx-auto flex w-fit items-center justify-center gap-2.5 px-4 pb-8 pt-10 text-sm leading-tight text-white/70 sm:px-8 sm:pb-10"
      >
        <span className="vidro grid h-10 w-10 shrink-0 place-items-center rounded-full">
          <LogoParceiro marca="doxis" className="h-6 w-6" />
        </span>
        <span>
          <span className="text-white/55">Runs inside</span> <span className="font-medium text-white">Doxis 4</span>
        </span>
      </motion.div>
    </section>
  );
}
