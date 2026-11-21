import Abertura from "../abertura";
import { Comparacao } from "../comparacao";
import Bento from "./home/Bento";
import Dores from "./home/Dores";
import Heroi from "./home/Heroi";
import Regra from "./home/Regra";

/** Home and /ask/ (copy deck 3; only the h1 changes on /ask/). The shell adds the form, footer and fixed bar. */
export default function Home({ mov }: { mov: boolean }) {
  return (
    <>
      <Abertura />
      <Heroi />
      <Dores />
      <Bento mov={mov} />
      <Comparacao />
      <Regra />
    </>
  );
}
