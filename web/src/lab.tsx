import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { A, FILME_REVIEW, HERO_FILM } from "./base";
import { iniciarRastreio } from "./rastreio";
import Casca from "./casca";
import { Comparacao } from "./comparacao";
import { Etapas, type Etapa } from "./etapas";
import { Filme } from "./filme";
import { MesaReels } from "./reels";
import { BotaoFantasma, BotaoPrincipal, Celula, IcDocumento, IcEscudo, Quadro, Secao, TextoDesfocado, Titulo, TituloBloco, moldura } from "./ui";

/* Every shared block on one page, for the foundation check. Built only with LV_LAB=1; served by `npm run dev` at /lab/. */
const ETAPAS: readonly Etapa[] = [
  {
    id: "lab-1",
    titulo: ["How does", "legalVector work?"],
    texto: "We show you legalVector on the system you already use, with a contract you bring.",
    itens: [
      ["Alfresco", "Supported today, with 124 end to end checks.", IcDocumento],
      ["Doxis", "Supported today, and it works beside Doxis Legal.", IcEscudo],
    ],
    visual: <Filme filme={FILME_REVIEW} />,
    links: [["legalVector on Alfresco", "integrations/alfresco/"]],
  },
  {
    id: "lab-2",
    titulo: ["Still have questions?", "Book a demo."],
    texto: "We confirm the time by email within one business day.",
    itens: [["Doxis", "Supported today, and it works beside Doxis Legal."]],
    visual: (
      <Quadro>
        <img src={A("img/v4/approval-1200.webp")} alt="The real product: the approval screen" className="h-full w-full object-cover object-top" />
      </Quadro>
    ),
  },
];

function Lab() {
  return (
    <>
      <section id="top" aria-labelledby="t-topo" className="relative px-5 pb-16 pt-28 sm:px-8 sm:pt-36">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.82fr_1fr]">
          <div>
            <h1 id="t-topo" className="text-balance text-[2.5rem] font-[650] leading-[1.02] tracking-[-0.045em] text-white sm:text-6xl">
              <TextoDesfocado linhas={["Make Legal the fastest team", "in the building."]} />
            </h1>
            <div className="mt-8 flex flex-wrap gap-3">
              <BotaoPrincipal href="#demo" data-cta="hero">
                Book a demo
              </BotaoPrincipal>
              <BotaoFantasma href="#features">See how it works</BotaoFantasma>
            </div>
          </div>
          <div className={`${moldura} p-2`}>
            <Filme filme={HERO_FILM} modo="heroi" />
          </div>
        </div>
      </section>
      <section id="pain" aria-label="legalVector reels" className="py-16">
        <MesaReels />
      </section>
      <Secao id="features" rotulo="t-features">
        <TituloBloco id="t-features" titulo={["How does", "legalVector work?"]} texto="One front door to Legal. Everyone sees where their request stands." />
        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          <Celula titulo="Alfresco" texto="Supported today, with 124 end to end checks.">
            <img src={A("img/v4/front-door-1200.webp")} alt="The real product: the front door" className="h-full w-full object-cover object-top" />
          </Celula>
          <Celula titulo="Doxis" texto="Supported today, and it works beside Doxis Legal." atraso={0.1}>
            <img src={A("img/v4/key-dates-1200.webp")} alt="The real product: key dates" className="h-full w-full object-cover object-top" />
          </Celula>
        </div>
      </Secao>
      <Comparacao />
      <Titulo id="t-lab" titulo={["How does", "legalVector work?"]} texto="Anything else, ask us in the demo. We answer plainly." />
      <Etapas etapas={ETAPAS} />
    </>
  );
}

iniciarRastreio();
createRoot(document.getElementById("raiz")!).render(
  <StrictMode>
    <Casca pedidoTitulo={["Bring a contract.", "Watch it get reviewed."]}>{() => <Lab />}</Casca>
  </StrictMode>,
);
