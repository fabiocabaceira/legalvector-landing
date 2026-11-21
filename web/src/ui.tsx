import { createContext, useContext, useEffect, useId, useState, type ComponentProps, type ComponentType, type ReactNode, type SVGProps } from "react";
import { motion } from "framer-motion";
import { A, CTA, abreCortina, cortinaAberta, curva, type Linhas } from "./base";

/* ---------------- motion state ---------------- */
export const MovContexto = createContext(true);
/** true while motion is allowed (footer toggle and OS preference). */
export const useMov = () => useContext(MovContexto);

/** true once the home intro starts to lift (at once on every other page and when the intro is skipped). */
export function useCortina() {
  const [aberta, setAberta] = useState(cortinaAberta);
  useEffect(() => {
    if (aberta) return;
    const f = () => setAberta(true);
    addEventListener("lv-cortina", f);
    const seguro = setTimeout(() => {
      abreCortina();
      setAberta(true);
    }, 4600);
    return () => {
      removeEventListener("lv-cortina", f);
      clearTimeout(seguro);
    };
  }, [aberta]);
  return aberta;
}

/* ---------------- reveal ---------------- */
/** Section reveal: rises out of a 6 px blur when it enters the viewport. Never use it around a hero h1. */
export function Surge({ children, className = "", atraso = 0, y = 24, as = "div" }: { children: ReactNode; className?: string; atraso?: number; y?: number; as?: "div" | "li" }) {
  const M = as === "li" ? motion.li : motion.div;
  const mov = useMov();
  return (
    <M
      className={className}
      initial={mov ? { opacity: 0, y, filter: "blur(6px)" } : false}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, delay: atraso, ease: curva }}
    >
      {children}
    </M>
  );
}

/**
 * Per-word blur-up for titles. Translate + blur only, never opacity, so a hero h1 is always painted.
 * Line 2 carries the accent gradient. `ativo` holds the words blurred until it turns true.
 */
export function TextoDesfocado({ linhas, atraso = 0, ativo = true, passo = 0.05 }: { linhas: Linhas; atraso?: number; ativo?: boolean; passo?: number }) {
  const mov = useMov();
  let n = 0;
  return (
    <>
      <span className="sr-only">{linhas.join(" ")}</span>
      {linhas.map((linha, l) => (
        <span key={l} aria-hidden="true" className="block">
          {linha.split(" ").map((p, i, todas) => {
            const k = n++;
            return (
              <motion.span
                key={i}
                className={`inline-block whitespace-pre pb-[0.08em] ${l === 1 ? "texto-grad" : ""}`}
                initial={mov ? { filter: "blur(12px)", y: 18 } : false}
                animate={ativo ? { filter: "blur(0px)", y: 0 } : { filter: "blur(12px)", y: 18 }}
                transition={{ duration: 0.55, delay: atraso + k * passo, ease: curva }}
              >
                {p + (i < todas.length - 1 ? " " : "")}
              </motion.span>
            );
          })}
        </span>
      ))}
    </>
  );
}

/** A two-line title: line 1 white, line 2 the accent gradient (cloned per row, so a wrapped line 2 never turns white). */
export function DuasLinhas({ l }: { l: Linhas }) {
  return (
    <>
      <span className="block">{l[0]}</span>
      <span className="block">
        <span className="texto-grad pb-[0.08em] [-webkit-box-decoration-break:clone] [box-decoration-break:clone]">{l[1]}</span>
      </span>
    </>
  );
}

export const tituloH2 = "text-balance text-[1.6rem] font-[650] leading-[1.08] tracking-[-0.035em] text-white sm:text-4xl lg:text-[2.75rem]";

/** Centred h2 + sub (Doxter Titulo). */
export function Titulo({ id, titulo, texto, className = "" }: { id: string; titulo: Linhas; texto?: string; className?: string }) {
  return (
    <div className={`mx-auto max-w-3xl text-center ${className}`}>
      <Surge>
        <h2 id={id} className={tituloH2}>
          <DuasLinhas l={titulo} />
        </h2>
      </Surge>
      {texto && (
        <Surge atraso={0.1}>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-base leading-relaxed text-mute sm:text-lg">{texto}</p>
        </Surge>
      )}
    </div>
  );
}

/** Left-aligned h2 + sub (Doxter TituloBloco). */
export function TituloBloco({ id, titulo, texto, className = "max-w-3xl", h2Classe = tituloH2 }: { id: string; titulo: Linhas; texto?: string; className?: string; h2Classe?: string }) {
  return (
    <div className={className}>
      <Surge>
        <h2 id={id} className={h2Classe}>
          <DuasLinhas l={titulo} />
        </h2>
      </Surge>
      {texto && (
        <Surge atraso={0.08}>
          <p className="mt-4 text-pretty text-base leading-relaxed text-mute sm:text-lg">{texto}</p>
        </Surge>
      )}
    </div>
  );
}

/** Section wrapper: id, labelled by its h2, house padding. */
export function Secao({ id, rotulo, children, largura = "max-w-7xl", className = "", divisor = false }: { id?: string; rotulo: string; children: ReactNode; largura?: string; className?: string; divisor?: boolean }) {
  return (
    <section id={id} aria-labelledby={rotulo} className={`relative mx-auto ${largura} px-5 py-20 sm:px-8 sm:py-24 ${className}`}>
      {divisor && <div aria-hidden="true" className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-mint/40 to-transparent" />}
      {children}
    </section>
  );
}

/* ---------------- cards ---------------- */
export function Cartao({ className = "", children, ...p }: ComponentProps<"div">) {
  function mexe(e: React.MouseEvent<HTMLDivElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--x", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--y", `${e.clientY - r.top}px`);
  }
  return (
    <div onMouseMove={mexe} className={`cartao rounded-3xl border border-white/[.08] bg-gradient-to-b from-deep/80 to-ink/80 ${className}`} {...p}>
      {children}
    </div>
  );
}

/** Glass frame with the running beam (Doxter moldura). */
export const moldura = "feixe rounded-3xl border border-white/10 bg-deep/85 shadow-[0_40px_120px_-40px_rgba(20,184,166,.7)] backdrop-blur-xl";

/** Fixed-height card that holds a visual (Doxter Quadro). */
export function Quadro({ children, alto = "h-72 sm:h-80" }: { children: ReactNode; alto?: string }) {
  return (
    <Cartao className="overflow-hidden">
      <div className={`relative ${alto}`}>{children}</div>
    </Cartao>
  );
}

/** Bento cell: visual box on top, h3 + paragraph below (Doxter Celula). */
export function Celula({ className = "", titulo, texto, nota, atraso = 0, children, alto = "h-64 sm:h-72" }: { className?: string; titulo: string; texto: string; nota?: string; atraso?: number; children: ReactNode; alto?: string }) {
  return (
    <Surge atraso={atraso} className={className}>
      <Cartao className="flex h-full flex-col overflow-hidden">
        <div className={`relative ${alto}`}>{children}</div>
        <div className="px-6 pb-7 pt-3 sm:px-8 sm:pb-8">
          <h3 className="text-lg font-semibold tracking-[-0.015em] text-white">{titulo}</h3>
          <p className="mt-2 max-w-md text-pretty text-[15px] leading-relaxed text-mute">{texto}</p>
          {nota && <p className="mt-3 text-xs text-mute/80">{nota}</p>}
        </div>
      </Cartao>
    </Surge>
  );
}

export type Item = readonly [string, string, ComponentType<SVGProps<SVGSVGElement>>?];

/** List of titled items with a top hairline (Doxter Itens). */
export function Itens({ itens, className = "grid gap-x-10 gap-y-9 sm:grid-cols-2", Tag = "h3" }: { itens: readonly Item[]; className?: string; Tag?: "h3" | "h4" }) {
  const mov = useMov();
  return (
    <ul className={className}>
      {itens.map(([t, p, Icone], i) => (
        <motion.li
          key={t}
          initial={mov ? { opacity: 0, y: 18 } : false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: i * 0.05, ease: curva }}
          className="list-none border-t border-white/15 pt-5"
        >
          <Tag className="flex items-center gap-2.5 text-lg font-semibold tracking-[-0.01em] text-white">
            {Icone && <Icone className="h-5 w-5 shrink-0 text-mint" />}
            {t}
          </Tag>
          <p className="mt-2 text-pretty text-[15px] leading-relaxed text-mute">{p}</p>
        </motion.li>
      ))}
    </ul>
  );
}

/** Counts up to `ate` once `ver` is true (easeOutCubic, 0.9 s). Jumps to the value with motion off. */
export function Conta({ ate, ver, atraso = 0 }: { ate: number; ver: boolean; atraso?: number }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!ver) return;
    if (document.documentElement.dataset.mov === "off") {
      setN(ate);
      return;
    }
    let raf = 0;
    let t0: number | undefined;
    const passo = (t: number) => {
      t0 ??= t;
      const p = Math.min(1, Math.max(0, (t - t0) / 1000 - atraso) / 0.9);
      setN(Math.round(ate * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(passo);
    };
    raf = requestAnimationFrame(passo);
    return () => cancelAnimationFrame(raf);
  }, [ver, ate, atraso]);
  return <>{n}</>;
}

/* ---------------- inner-page hero ---------------- */
/** Inner-page hero (Doxter Cabeca): 2-line h1, sub, optional slots, one CTA, optional animated visual. */
export function Cabeca({ titulo, texto, antes, depois, visual, acoes = true }: { titulo: Linhas; texto?: string; antes?: ReactNode; depois?: ReactNode; visual?: ReactNode; acoes?: boolean }) {
  const mov = useMov();
  return (
    <section className="relative overflow-hidden pb-16 pt-28 sm:pb-20 sm:pt-36" aria-labelledby="t-cabeca">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="grade-fundo absolute inset-0" />
        <div className="absolute -top-72 left-[-15%] h-[680px] w-[980px] rounded-full bg-[radial-gradient(closest-side,rgba(20,184,166,.24),transparent)]" />
      </div>
      <div className={`relative mx-auto grid max-w-7xl items-center gap-14 px-5 sm:px-8 ${visual ? "lg:grid-cols-[1.02fr_1fr] lg:gap-16" : ""}`}>
        <div className="max-w-3xl">
          {antes}
          <h1 id="t-cabeca" className="text-balance text-[2.2rem] font-[650] leading-[1.05] tracking-[-0.04em] text-white sm:text-5xl lg:text-[3.25rem]">
            <TextoDesfocado linhas={titulo} />
          </h1>
          {texto && (
            <motion.p
              initial={mov ? { y: 14, filter: "blur(6px)" } : false}
              animate={{ y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.55, delay: 0.45, ease: curva }}
              className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-mute sm:text-lg"
            >
              {texto}
            </motion.p>
          )}
          {depois}
          {acoes && (
            <motion.div initial={mov ? { opacity: 0, y: 14 } : false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.6, ease: curva }} className="mt-9">
              <BotaoPrincipal href="#demo" data-cta="cabeca">
                {CTA}
              </BotaoPrincipal>
            </motion.div>
          )}
        </div>
        {visual && (
          <motion.div initial={mov ? { opacity: 0, y: 40 } : false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, delay: 0.5, ease: curva }} className="min-w-0">
            {visual}
          </motion.div>
        )}
      </div>
    </section>
  );
}

/* ---------------- buttons and links ---------------- */
export function BotaoPrincipal({ children, className = "", ...p }: ComponentProps<"a">) {
  return (
    <a
      className={`group relative inline-flex h-12 items-center justify-center gap-2 overflow-hidden rounded-xl bg-white px-7 text-[15px] font-semibold text-ink shadow-[0_0_0_1px_rgba(255,255,255,.3),0_8px_40px_-8px_rgba(20,184,166,.75)] transition hover:shadow-[0_0_0_1px_rgba(255,255,255,.5),0_8px_50px_-6px_rgba(94,234,212,.95)] ${className}`}
      {...p}
    >
      <span aria-hidden="true" className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-mint/60 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
      <span className="relative">{children}</span>
      <Seta className="relative h-4 w-4 transition-transform group-hover:translate-x-0.5" />
    </a>
  );
}

export function BotaoFantasma({ children, className = "", ...p }: ComponentProps<"a">) {
  return (
    <a
      className={`inline-flex h-12 items-center justify-center rounded-xl border border-white/15 bg-white/[.03] px-7 text-[15px] font-medium text-white backdrop-blur transition hover:border-white/30 hover:bg-white/[.07] ${className}`}
      {...p}
    >
      {children}
    </a>
  );
}

/** Text link with the arrow icon that nudges on hover. */
export function Ligacao({ children, className = "", ...p }: ComponentProps<"a">) {
  return (
    <a className={`group inline-flex min-h-11 items-center gap-2 text-[15px] font-medium text-mint transition hover:text-white ${className}`} {...p}>
      {children}
      <Seta className="h-4 w-4 transition group-hover:translate-x-0.5" />
    </a>
  );
}

/* ---------------- brand ---------------- */
/** The legalVector mark, inline. */
export function Marca({ className = "h-[30px] w-[30px]", ...p }: SVGProps<SVGSVGElement>) {
  const g = "lv-g" + useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true" {...p}>
      <defs>
        <linearGradient id={g} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#14B8A6" />
          <stop offset="1" stopColor="#0F766E" />
        </linearGradient>
      </defs>
      <rect x="4" y="4" width="56" height="56" rx="16" fill={`url(#${g})`} />
      <path d="M17 21l14 25 15-28" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M37 17.5l9.5 .5 .5 9.5" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="17" cy="21" r="4.5" fill="#F59E0B" />
    </svg>
  );
}

/** Mark + wordmark "legal" white + "Vector" mint, at the header size (mark 30 px, text 18 px). */
export function Logotipo({ className = "", topo = false }: { className?: string; topo?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`} {...(topo ? { "data-logo-topo": "" } : {})}>
      <img src={A("brand/legalvector-mark.svg")} alt="" width="30" height="30" className="h-[30px] w-[30px]" />
      <span className="text-[18px] font-[650] leading-none tracking-[-0.02em] text-white">
        legal<span className="text-mint">Vector</span>
      </span>
    </span>
  );
}

/* ---------------- icons ---------------- */
type Icone = (p: SVGProps<SVGSVGElement>) => JSX.Element;

/** Factory for 24 px line icons (stroke 1.6). */
export const ic =
  (corpo: ReactNode): Icone =>
  (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...p}>
      {corpo}
    </svg>
  );

export const Seta: Icone = (p) => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...p}>
    <path d="M3 8h10M9 4l4 4-4 4" />
  </svg>
);
export const Som = ({ ligado, ...p }: SVGProps<SVGSVGElement> & { ligado: boolean }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true" {...p}>
    <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor" stroke="none" />
    {ligado ? <path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a7.5 7.5 0 0 1 0 11" /> : <path d="M16.5 9.5l5 5M21.5 9.5l-5 5" />}
  </svg>
);
export const Play: Icone = (p) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
    <path d="M7 4.5v15l12.5-7.5z" />
  </svg>
);
export const Pausa: Icone = (p) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
    <rect x="6" y="5" width="4" height="14" rx="1" />
    <rect x="14" y="5" width="4" height="14" rx="1" />
  </svg>
);
export const WhatsApp: Icone = (p) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
  </svg>
);

export const IcPorta = ic(<><path d="M5 20.5V4.5a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v16" /><path d="M3 20.5h18M14.5 12.5v.01" /></>);
export const IcDocumento = ic(<><path d="M7 3.5h7l4 4v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-15a1 1 0 0 1 1-1z" /><path d="M14 3.5V8h4M9 13h6M9 16.5h4" /></>);
export const IcEscudo = ic(<><path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z" /><path d="M12 8v5M12 16v.01" /></>);
export const IcLupa = ic(<><circle cx="11" cy="11" r="6" /><path d="M20 20l-4.5-4.5" /></>);
export const IcRelogio = ic(<><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></>);
export const IcCalendario = ic(<><rect x="3.5" y="5" width="17" height="15.5" rx="2" /><path d="M3.5 10h17M8 3v4M16 3v4" /></>);
export const IcEnvelope = ic(<><rect x="3" y="5.5" width="18" height="13" rx="2" /><path d="M3.5 7l8.5 6 8.5-6" /></>);
export const IcPasta = ic(<path d="M3 7a2 2 0 0 1 2-2h4l2 2.5h8a2 2 0 0 1 2 2V17a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />);
export const IcCamadas = ic(<><path d="M12 3.5l8.5 4.5L12 12.5 3.5 8z" /><path d="M3.5 12l8.5 4.5 8.5-4.5M3.5 16l8.5 4.5 8.5-4.5" /></>);
export const IcCadeado = ic(<><rect x="5" y="10.5" width="14" height="10" rx="2" /><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" /></>);
export const IcPessoa = ic(<><circle cx="12" cy="8" r="3.5" /><path d="M5 20.5a7 7 0 0 1 14 0" /></>);
export const IcGlobo = ic(<><circle cx="12" cy="12" r="8.5" /><path d="M3.5 12h17M12 3.5c2.5 2.5 3.5 5.5 3.5 8.5s-1 6-3.5 8.5c-2.5-2.5-3.5-5.5-3.5-8.5s1-6 3.5-8.5z" /></>);
export const IcGrafico = ic(<path d="M4 20V10M10 20V4M16 20v-7M21 20H3" />);
export const IcCaneta = ic(<><path d="M15.5 4.5l4 4L9 19H5v-4z" /><path d="M13 7l4 4" /></>);
export const IcLigacao = ic(<><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" /><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" /></>);
export const IcEngrenagem = ic(<><circle cx="12" cy="12" r="3" /><path d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M5.6 18.4l1.8-1.8M16.6 7.4l1.8-1.8" /></>);
export const IcPergunta = ic(<><circle cx="12" cy="12" r="8.5" /><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6v.6M12 17v.01" /></>);
export const IcTelefone = ic(<path d="M5 4h3.5l1.5 4-2 1.5a11 11 0 0 0 6.5 6.5l1.5-2 4 1.5V19a1.5 1.5 0 0 1-1.5 1.5A16 16 0 0 1 3.5 5.5 1.5 1.5 0 0 1 5 4z" />);
export const IcAlvo = ic(<><circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="4.5" /><circle cx="12" cy="12" r=".5" /></>);
export const IcSeguinte = ic(<path d="M4 6l6 6-6 6M12 6l6 6-6 6" />);
