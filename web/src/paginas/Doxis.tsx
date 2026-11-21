import { Cabeca } from "../ui";
import { Arranque } from "./integrations/Arranque";
import { ChegaDoxis } from "./integrations/ChegaDoxis";
import { Separador } from "./integrations/Separador";

export default function Doxis() {
  return (
    <>
      <Cabeca
        titulo={["legalVector on", "Doxis 4"]}
        texto="Doxis Legal runs the legal file. legalVector opens the front door to it, on the Doxis 4 you already run, as the signed-in user."
        visual={<ChegaDoxis />}
      />
      <Separador />
      <Arranque />
    </>
  );
}
