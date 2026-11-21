import { useRef } from "react";
import { useInView } from "framer-motion";
import { R } from "../base";
import { Cabeca, Cartao, Conta, IcDocumento, IcEscudo, IcPessoa, Ligacao, Surge, TituloBloco } from "../ui";
import { Camadas } from "./integrations/Camadas";
import { Processo } from "./integrations/Processo";
import { Azulejo, type Ic } from "./integrations/comum";

const ADICIONA: ReadonlyArray<readonly [string, string, Ic]> = [
  ["As the signed-in user", "Every call uses the official APIs as the signed-in user. No super user, no second permission model.", IcPessoa],
  ["Audit trail in Alfresco", "The audit trail is mirrored as comments in Alfresco. Nothing to migrate, nothing to unwind.", IcDocumento],
  ["124 end to end checks", "Alfresco Content Services passes the same 124 end to end checks as every supported repository.", IcEscudo],
];

function Verificacoes() {
  const ref = useRef<HTMLSpanElement>(null);
  const ver = useInView(ref, { once: true, margin: "-60px" });
  return (
    <span ref={ref}>
      <span aria-hidden="true" className="tabular-nums">
        <Conta ate={124} ver={ver} atraso={0.3} />
      </span>
      <span className="sr-only">124</span> end to end checks
    </span>
  );
}

function Adiciona() {
  return (
    <section aria-labelledby="t-adiciona" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24">
      <TituloBloco
        id="t-adiciona"
        titulo={["What does legalVector add", "to Alfresco?"]}
        texto="The front door and the Legal desk around your documents. Alfresco stays the system of record."
      />
      <ul className="mt-14 grid gap-4 md:grid-cols-3">
        {ADICIONA.map(([t, p, Icone], i) => (
          <li key={t} className="list-none">
            <Surge atraso={i * 0.1} className="h-full">
              <Cartao className="h-full p-7 sm:p-8">
                <div>
                  <Azulejo Icone={Icone} atraso={i * 0.1} />
                  <h3 className="mt-6 text-xl font-semibold tracking-[-0.02em] text-white">{i === 2 ? <Verificacoes /> : t}</h3>
                  <p className="mt-2 text-pretty text-[15px] leading-relaxed text-mute">{p}</p>
                </div>
              </Cartao>
            </Surge>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Motor() {
  return (
    <section aria-labelledby="t-motor" className="mx-auto grid max-w-7xl items-center gap-12 px-5 pb-16 pt-8 sm:px-8 lg:grid-cols-[minmax(0,.85fr)_minmax(0,1.25fr)] lg:gap-16">
      <div>
        <TituloBloco
          id="t-motor"
          titulo={["Which engine", "runs the process?"]}
          texto="An embedded engine runs the Legal process as standard BPMN. On Alfresco, the same process can run on Alfresco Process Services. The Legal screens stay the same."
        />
        <Surge atraso={0.12}>
          <Ligacao href={R("product/")} className="mt-8">
            How legalVector works
          </Ligacao>
        </Surge>
      </div>
      <Surge atraso={0.1} className="min-w-0">
        <Processo />
      </Surge>
    </section>
  );
}

export default function Alfresco() {
  return (
    <>
      {/* "Alfresco Content Services" is the longest h1 line of the site: a smaller size keeps the h1 on two lines */}
      <div className="[&_h1]:text-[1.8rem] sm:[&_h1]:text-5xl lg:[&_h1]:text-[2.35rem] xl:[&_h1]:text-[3rem]">
        <Cabeca
          titulo={["legalVector on", "Alfresco Content Services"]}
          texto="legalVector runs on the Alfresco you already have, through its official APIs and as the signed-in user. Your contracts, permissions and audit trail stay in Alfresco."
          visual={<Camadas />}
        />
      </div>
      <Adiciona />
      <Motor />
    </>
  );
}
