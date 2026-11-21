import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ABRE, abreCortina } from "./base";

/*
 * Home intro (copy deck 3.0), built only from the mark's own strokes.
 * The amber dot arrives (a request), the V draws down to its point and up again (it goes through Legal), the
 * arrowhead snaps on (the decision goes out), the square fills from the bottom, "legal" + "Vector" wipes in.
 * At 1.65 s the logo flies to [data-logo-topo] and the curtain lifts. A tap or a key skips it.
 * It only runs with html.abre (set in the head: no hash, motion on, not a bot).
 */
export default function Abertura() {
  const [ativa, setAtiva] = useState(ABRE);
  const caixa = useRef<HTMLDivElement>(null);
  const logo = useRef<HTMLDivElement>(null);
  const marca = useRef<SVGSVGElement>(null);

  // the mark starts alone in the centre; the whole logo slides to the centre as the name writes itself
  useLayoutEffect(() => {
    if (!ativa || !logo.current || !marca.current) return;
    const l = logo.current.getBoundingClientRect().width;
    const m = marca.current.getBoundingClientRect().width;
    logo.current.style.setProperty("--desvio", `${(l - m) / 2}px`);
  }, [ativa]);

  useEffect(() => {
    if (!ativa) return;
    const html = document.documentElement;
    let fim = 0;
    let foi = false;
    const voa = (rapido: boolean) => {
      if (foi) return;
      foi = true;
      tira();
      const alvo = document.querySelector("[data-logo-topo]");
      const el = logo.current;
      if (alvo && el) {
        const de = el.getBoundingClientRect();
        const para = alvo.getBoundingClientRect();
        el.animate(
          [{ transform: "translate(0, 0) scale(1)" }, { transform: `translate(${para.left - de.left}px, ${para.top - de.top}px) scale(${para.width / de.width})` }],
          { duration: rapido ? 380 : 650, easing: "cubic-bezier(.65, 0, .35, 1)", fill: "forwards" },
        );
      }
      caixa.current?.classList.add("sai");
      abreCortina();
      fim = window.setTimeout(
        () => {
          html.classList.remove("abre");
          setAtiva(false);
        },
        rapido ? 640 : 680,
      );
    };
    const salta = () => {
      caixa.current?.classList.add("salta");
      requestAnimationFrame(() => voa(true));
    };
    const gestos = ["pointerdown", "keydown"] as const;
    const tira = () => gestos.forEach((t) => removeEventListener(t, salta, true));
    gestos.forEach((t) => addEventListener(t, salta, true));
    const t = window.setTimeout(() => voa(false), 1650);
    return () => {
      clearTimeout(t);
      clearTimeout(fim);
      tira();
    };
  }, [ativa]);

  if (!ativa) return null;
  return (
    <div ref={caixa} className="abertura" aria-hidden="true">
      <div className="abertura-fundo" />
      <span className="abertura-corte" />
      <div ref={logo} className="abertura-logo">
        <svg ref={marca} viewBox="0 0 64 64" className="abertura-marca">
          <defs>
            <linearGradient id="ab-g" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#14B8A6" />
              <stop offset="1" stopColor="#0F766E" />
            </linearGradient>
          </defs>
          <rect className="ab-fundo" x="4" y="4" width="56" height="56" rx="16" fill="url(#ab-g)" />
          <rect className="ab-borda" x="4.7" y="4.7" width="54.6" height="54.6" rx="15.3" pathLength={1} />
          <path className="ab-v" d="M17 21l14 25 15-28" pathLength={1} fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          <path className="ab-seta" d="M37 17.5l9.5 .5 .5 9.5" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          <circle className="ab-onda" cx="17" cy="21" r="4.5" />
          <circle className="ab-ponto" cx="17" cy="21" r="4.5" fill="#F59E0B" />
        </svg>
        <span className="abertura-nomecx">
          <span className="abertura-nome">
            legal<b>Vector</b>
          </span>
          <span className="abertura-feixe" />
        </span>
      </div>
    </div>
  );
}
