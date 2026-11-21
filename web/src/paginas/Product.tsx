import { FILME_REVIEW, LEGENDA } from "../base";
import { Comparacao } from "../comparacao";
import { Etapas, type Etapa } from "../etapas";
import { Filme } from "../filme";
import { Cabeca, Celula, IcAlvo, IcCadeado, IcCamadas, IcCaneta, IcDocumento, IcEscudo, IcLupa, IcPasta, IcPorta, Quadro, Secao, TituloBloco } from "../ui";
import { Desk } from "./product/Desk";
import { Aprovacao, CentroComando, DatasChave, Departamentos, Linguas } from "./product/Visuais";

const ETAPAS: readonly Etapa[] = [
  {
    id: "intake",
    titulo: ["How do requests", "reach Legal?"],
    texto: "Through one front door that every department can use, so nothing waits in someone’s inbox.",
    itens: [
      ["Seven request types", "One form adapts to each request: contract review, drafting, NDA, bid or tender review, policy review, legal opinion or other.", IcPorta],
      ["Filled from the document", "Drop a Word contract and the empty fields fill themselves from the document, each one with Undo. An NDA takes four answers, from Legal’s approved template.", IcDocumento],
      ["Checked before a lawyer opens it", "On submit, the draft is checked against your playbook and country overlays. Nobody picks a lawyer: Legal assigns every request.", IcEscudo],
    ],
    visual: (
      <>
        <Quadro>
          <Departamentos />
        </Quadro>
        <p className="mt-3 text-center text-[13px] text-mute">Demo data</p>
      </>
    ),
  },
  {
    id: "review",
    titulo: ["How is each", "contract reviewed?"],
    texto: "TexterAgent reads every clause against your own playbook, explains each finding and proposes wording.",
    itens: [
      ["Anchored to the exact words", "Each finding points at the exact words in the contract. Red means missing, amber means it differs, green means it complies.", IcAlvo],
      ["Genuine Word redlines", "Apply a change and it becomes a real Word tracked change, lawyer as author, marked AI-assisted. Numbering, styles and signatures stay untouched.", IcCaneta],
      ["A playbook Legal owns", "Versioned rule sets with owners and a second approval. Change a rule in plain language and preview its impact. Only the Head of Legal approves.", IcCamadas],
    ],
    visual: <Filme filme={FILME_REVIEW} legenda={LEGENDA} />,
  },
  {
    id: "decision",
    titulo: ["Who decides,", "and how is it recorded?"],
    texto: "A lawyer always decides. The AI review can block approval, and the reason is kept.",
    itens: [
      ["The approval gate", "Approval waits while must-fix findings are open. A lawyer can override them with a written reason, recorded on the timeline.", IcCadeado],
      ["Kept on the document", "The decision and its reason stay on the document, with the audit trail as repository comments. The requester gets an email with a link back.", IcPasta],
      ["Visible at every step", "Every request follows a live process the whole team can see. Journey replay shows who held it and for how long.", IcLupa],
    ],
    links: [
      ["legalVector on Alfresco", "integrations/alfresco/"],
      ["legalVector on Doxis", "integrations/doxis/"],
    ],
    visual: <Aprovacao />,
  },
];

function Funcoes() {
  return (
    <Secao id="features" rotulo="t-features">
      <TituloBloco
        id="t-features"
        titulo={["Every key date", "and every number, in view."]}
        texto="legalVector reads the dates that matter from each contract and turns the whole Legal workload into numbers you can open."
      />
      <div className="mt-12 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Celula
          className="min-w-0 lg:col-span-2"
          alto=""
          titulo="Every key date on one screen"
          texto="Notice deadlines, renewals, expiry and value read from the contract, each with its source clause. Export them to your calendar."
          nota={LEGENDA}
        >
          <DatasChave />
        </Celula>
        <Celula
          className="min-w-0"
          alto="h-56 sm:h-64"
          titulo="Every number opens its list"
          texto="Dashboards, a daily brief, a command centre that refreshes every 30 seconds and a board pack in one click."
          nota={LEGENDA}
        >
          <CentroComando />
        </Celula>
        <Celula className="min-w-0" alto="h-56 sm:h-64" atraso={0.08} titulo="Five languages, one desk" texto="English, Spanish, Portuguese, French and Arabic, right to left. Each person picks their own, in light or dark.">
          <Linguas />
        </Celula>
      </div>
    </Secao>
  );
}

/** Product (copy deck 4): head with the Desk panel, steps on the scroll rail, product bento, comparison. */
export default function Product() {
  return (
    <>
      <Cabeca
        titulo={["How does", "legalVector work?"]}
        texto="Departments raise requests through one front door, the form fills itself from the document, TexterAgent checks them against your playbook, a lawyer reviews and decides, and the contract, with its key dates, stays in your Alfresco or Doxis repository."
        visual={<Desk />}
      />
      <Etapas etapas={ETAPAS} />
      <Funcoes />
      <Comparacao link={false} />
    </>
  );
}
