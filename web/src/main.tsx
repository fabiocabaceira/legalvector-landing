import { StrictMode, type ComponentType } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { PAGINA, type Linhas, type Pagina } from "./base";
import { iniciarRastreio } from "./rastreio";
import Casca from "./casca";
import Home from "./paginas/Home";
import Product from "./paginas/Product";
import Alfresco from "./paginas/Alfresco";
import Doxis from "./paginas/Doxis";
import Questions from "./paginas/Questions";
import Contact from "./paginas/Contact";

const PAGINAS: Record<Exclude<Pagina, "lab">, ComponentType<{ mov: boolean }>> = {
  home: Home,
  ask: Home,
  product: Product,
  alfresco: Alfresco,
  doxis: Doxis,
  questions: Questions,
  contact: Contact,
};

const PEDIDO: Linhas = PAGINA === "home" || PAGINA === "ask" ? ["Bring a contract.", "Watch it get reviewed."] : ["Still have questions?", "Book a demo."];
const Pagina = PAGINAS[PAGINA as Exclude<Pagina, "lab">] ?? Home;

iniciarRastreio();
createRoot(document.getElementById("raiz")!).render(
  <StrictMode>
    <Casca pedidoTitulo={PEDIDO}>{(mov) => <Pagina mov={mov} />}</Casca>
  </StrictMode>,
);
