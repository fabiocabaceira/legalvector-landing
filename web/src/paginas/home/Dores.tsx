import { MesaReels } from "../../reels";
import { Surge } from "../../ui";
import { TituloVivo } from "./TituloVivo";

/** Copy deck 3.2: who it is for, then the contract drawing traces itself and the six reels rise over it. */
export default function Dores() {
  return (
    <section id="pain" aria-labelledby="t-pain" className="relative overflow-x-clip py-16 sm:py-24">
      <div className="relative mx-auto grid max-w-7xl gap-8 px-5 sm:px-8 lg:grid-cols-2 lg:gap-20">
        <TituloVivo
          id="t-pain"
          titulo={["For the Legal team", "everyone chases."]}
          className="text-balance text-[2.4rem] font-[650] leading-[1.02] tracking-[-0.04em] text-white sm:text-5xl xl:text-[3.4rem]"
        />
        <Surge atraso={0.12} className="lg:pt-3">
          <p className="border-t border-white/15 pt-5 text-pretty text-base leading-relaxed text-white/80 sm:text-lg">
            Six moments Legal teams know too well, each about half a minute: the requests nobody counted, the clause nobody read and the notice date nobody watched, then the second draft, the counterparty call and the Monday report to the GC.
          </p>
        </Surge>
      </div>
      <MesaReels className="mt-10 lg:mt-12" />
    </section>
  );
}
