import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { A, LEGENDA, curva } from "../../base";
import { IcDocumento, IcGlobo, Marca, useMov } from "../../ui";

/* ---------- step 1: six departments, one door (Doxter VisualEmail, departments from REELS:22) ---------- */
const DEPARTAMENTOS = ["Procurement", "Sales", "HR", "Finance", "Operations", "IT"];
const PASSO_Y = 43;
const Y0 = 22;
const HUB_Y = Y0 + (PASSO_Y * (DEPARTAMENTOS.length - 1)) / 2;
const CICLO = 2.6;

function Feixe({ d, atraso }: { d: string; atraso: number }) {
  return (
    <>
      <path d={d} stroke="rgba(94,234,212,.15)" strokeWidth="1.5" fill="none" />
      <path d={d} className="traco" style={{ animationDelay: `${atraso}s` }} stroke="#5EEAD4" strokeWidth="2" fill="none" strokeLinecap="round" />
    </>
  );
}

export function Departamentos() {
  const mov = useMov();
  const ref = useRef<HTMLDivElement>(null);
  const ver = useInView(ref, { once: true, margin: "-60px" });
  return (
    <div ref={ref} className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
      <div aria-hidden="true" className="absolute right-[8%] top-1/2 h-56 w-56 -translate-y-1/2 rounded-full bg-glow/15 blur-3xl" />
      <div className="relative h-[260px] w-[306px] sm:scale-110">
        <svg viewBox="0 0 306 260" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
          {DEPARTAMENTOS.map((_, i) => {
            const y = Y0 + i * PASSO_Y;
            return <Feixe key={i} d={`M134 ${y} C190 ${y} 186 ${HUB_Y} 240 ${HUB_Y}`} atraso={(i * CICLO) / DEPARTAMENTOS.length} />;
          })}
        </svg>
        {DEPARTAMENTOS.map((n, i) => (
          <motion.div
            key={n}
            initial={{ opacity: 0, x: -14 }}
            animate={ver ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 + i * 0.07, ease: curva }}
            className="absolute left-0"
            style={{ top: Y0 + i * PASSO_Y - 17 }}
          >
            <motion.span
              className="flex h-[34px] w-[134px] items-center gap-2 whitespace-nowrap rounded-xl border border-white/10 bg-deep px-3 text-[13px] text-white/85"
              animate={mov && ver ? { borderColor: ["rgba(94,234,212,.55)", "rgba(255,255,255,.1)", "rgba(255,255,255,.1)"], boxShadow: ["0 0 18px -4px rgba(94,234,212,.7)", "0 0 0px 0px rgba(94,234,212,0)", "0 0 0px 0px rgba(94,234,212,0)"] } : {}}
              transition={{ duration: CICLO, delay: (i * CICLO) / DEPARTAMENTOS.length, repeat: Infinity, times: [0, 0.35, 1], ease: "easeOut" }}
            >
              <IcDocumento className="h-4 w-4 shrink-0 text-mute" />
              {n}
            </motion.span>
          </motion.div>
        ))}
        <div className="absolute left-[242px] flex h-16 w-16 items-center justify-center rounded-2xl border border-white/15 bg-gradient-to-b from-deep to-night shadow-[0_0_44px_-4px_rgba(20,184,166,.85)]" style={{ top: HUB_Y - 32 }}>
          <span className="onda absolute inset-0 rounded-2xl border border-glow/60" />
          <span className="onda absolute inset-0 rounded-2xl border border-mint/40" style={{ animationDelay: "1.3s" }} />
          <Marca className="h-10 w-10" />
        </div>
      </div>
    </div>
  );
}

/* ---------- step 3: the real approval window, a mint ring on the blocked banner ---------- */
export function Aprovacao() {
  const mov = useMov();
  // the red banner on approval-1200.webp (1024 x 748): x 33 to 991, y 153 to 387
  const banner = { left: "3.2%", top: "20.4%", width: "93.6%", height: "31.4%" };
  return (
    <figure className="relative m-0">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-10 bottom-6 top-10 rounded-[40px] bg-glow/20 blur-[80px]" />
      <div className="relative overflow-hidden rounded-3xl border border-white/[.08] bg-gradient-to-b from-deep/90 to-night/90 p-4 sm:p-6">
        <div aria-hidden="true" className="grade-fundo absolute inset-0" />
        <div className="relative">
          <img
            src={A("img/v4/approval-1200.webp")}
            srcSet={`${A("img/v4/approval-640.webp")} 640w, ${A("img/v4/approval-1200.webp")} 1024w`}
            sizes="(min-width: 1024px) 560px, 92vw"
            width={1024}
            height={748}
            loading="lazy"
            decoding="async"
            alt="The real Approve window with demo data: approval blocked by the AI review while two failing clauses are open, and a lawyer can approve anyway with a written reason recorded on the timeline"
            className="block h-auto w-full rounded-xl shadow-[0_30px_80px_-30px_rgba(0,0,0,.85)]"
          />
          <span aria-hidden="true" className="pointer-events-none absolute" style={banner}>
            <span className="absolute -inset-1 rounded-[2.2%/8.5%] border-2 border-mint/80 shadow-[0_0_24px_2px_rgba(94,234,212,.45)]" />
            {mov && (
              <motion.span
                className="absolute -inset-1 rounded-[2.2%/8.5%] border-2 border-mint"
                initial={{ opacity: 0.8, scale: 1 }}
                animate={{ opacity: [0.8, 0], scale: [1, 1.06] }}
                transition={{ duration: 2.6, repeat: Infinity, ease: "easeOut", repeatDelay: 0.4 }}
              />
            )}
          </span>
        </div>
      </div>
      <figcaption className="mt-3 text-center text-[13px] text-mute">{LEGENDA}</figcaption>
    </figure>
  );
}

/* ---------- bento big cell: the real key-dates screen, a mint band walks the three groups ---------- */
// crop of key-dates-1200.webp (1200 x 750): x 20 to 1180, y 250 to 655
const CORTE = { x: 20, y: 250, w: 1160, h: 405 };
const pct = (v: number, de: number) => `${((v / de) * 100).toFixed(3)}%`;
const GRUPOS_X = [33, 414, 796].map((x) => (x - CORTE.x) / CORTE.w);
const GRUPO = { w: 371 / CORTE.w, top: (300 - CORTE.y) / CORTE.h, h: 85 / CORTE.h };
const EXPORTAR = { x: (1012 - CORTE.x) / CORTE.w, w: 154 / CORTE.w, top: (260 - CORTE.y) / CORTE.h, h: 23 / CORTE.h };
const VOLTA = 5.2;
const MIN_TELA = 640;

export function DatasChave() {
  const mov = useMov();
  const caixa = useRef<HTMLDivElement>(null);
  const ver = useInView(caixa, { margin: "-80px" });
  const [cw, setCw] = useState(0);
  useEffect(() => {
    const el = caixa.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setCw(el.clientWidth));
    ro.observe(el);
    setCw(el.clientWidth);
    return () => ro.disconnect();
  }, []);
  const largura = Math.max(cw, MIN_TELA);
  const folga = Math.max(0, largura - cw);
  // on a phone the screen is wider than the cell: the view follows the band, then drifts back
  const centro = (f: number) => -Math.min(folga, Math.max(0, f * largura - cw / 2));
  const xs = GRUPOS_X.map((x) => centro(x + GRUPO.w / 2));
  const xe = centro(EXPORTAR.x + EXPORTAR.w / 2);
  const t = (s: number) => s / VOLTA;
  const corre = mov && ver && cw > 0;

  return (
    <div className="relative mx-3 mt-6 sm:mx-8 sm:mt-8">
      <div
        ref={caixa}
        className="overflow-hidden rounded-t-2xl border border-b-0 border-white/10 bg-night shadow-[0_-20px_80px_-30px_rgba(20,184,166,.5)] [mask-image:linear-gradient(#000_72%,transparent)]"
      >
        <motion.div
          className="relative"
          style={{ width: largura, aspectRatio: `${CORTE.w} / ${CORTE.h}` }}
          animate={corre ? { x: [xs[0], xs[0], xs[1], xs[2], xe, xe, xs[0]] } : { x: 0 }}
          transition={corre ? { duration: VOLTA, repeat: Infinity, times: [0, t(0.35), t(0.57), t(0.79), t(1.5), t(2.6), t(4.4)], ease: curva } : { duration: 0 }}
        >
          <img
            src={A("img/v4/key-dates-1200.webp")}
            srcSet={`${A("img/v4/key-dates-640.webp")} 640w, ${A("img/v4/key-dates-1200.webp")} 1200w`}
            sizes="(min-width: 1024px) 1200px, 680px"
            width={1200}
            height={750}
            loading="lazy"
            decoding="async"
            alt="The real Key dates screen with demo data: one notice deadline passed, two notice deadlines within 30 days, two contracts ending within 60 days, the needs action list and Export to calendar"
            className="absolute max-w-none"
            style={{ width: pct(1200, CORTE.w), left: pct(-CORTE.x, CORTE.w), top: pct(-CORTE.y, CORTE.h) }}
          />
          {corre && (
            <>
              <motion.span
                aria-hidden="true"
                className="pointer-events-none absolute rounded-[10px] bg-mint/[.12] ring-2 ring-mint/80 shadow-[0_0_30px_4px_rgba(94,234,212,.45)]"
                style={{ width: pct(GRUPO.w, 1), top: pct(GRUPO.top, 1), height: pct(GRUPO.h, 1) }}
                initial={{ left: pct(GRUPOS_X[0], 1), opacity: 0 }}
                animate={{
                  left: [GRUPOS_X[0], GRUPOS_X[0], GRUPOS_X[0], GRUPOS_X[1], GRUPOS_X[2], GRUPOS_X[2], GRUPOS_X[2], GRUPOS_X[0]].map((x) => pct(x, 1)),
                  opacity: [0, 0, 1, 1, 1, 1, 0, 0],
                }}
                transition={{
                  left: { duration: VOLTA, repeat: Infinity, times: [0, t(0.2), t(0.35), t(0.57), t(0.79), t(1.35), t(1.65), 1], ease: curva },
                  // opacity runs on WAAPI, where an easing applies to the whole loop: keep it linear so each step keeps its time
                  opacity: { duration: VOLTA, repeat: Infinity, times: [0, t(0.2), t(0.35), t(0.57), t(0.79), t(1.35), t(1.65), 1], ease: "linear" },
                }}
              />
              <motion.span
                aria-hidden="true"
                className="pointer-events-none absolute rounded-md ring-2 ring-mint shadow-[0_0_26px_6px_rgba(94,234,212,.6)]"
                style={{ left: pct(EXPORTAR.x, 1), width: pct(EXPORTAR.w, 1), top: pct(EXPORTAR.top, 1), height: pct(EXPORTAR.h, 1) }}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0, 1, 1, 0, 0], scale: [1, 1, 1.08, 1, 1, 1] }}
                transition={{ duration: VOLTA, repeat: Infinity, times: [0, t(1.5), t(1.75), t(2.2), t(2.7), 1], ease: "linear" }}
              />
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}

/* ---------- bento small cell 1: the real command centre and a coded 30 s refresh ring ---------- */
const RAIO = 19;
const VOLTA_ANEL = 2 * Math.PI * RAIO;

function Anel() {
  const mov = useMov();
  const ref = useRef<HTMLDivElement>(null);
  const ver = useInView(ref);
  const [s, setS] = useState(30);
  useEffect(() => {
    if (!mov || !ver) return;
    const id = setInterval(() => setS((v) => (v <= 1 ? 30 : v - 1)), 1000);
    return () => clearInterval(id);
  }, [mov, ver]);
  return (
    <div ref={ref} aria-hidden="true" className="vidro absolute right-3 top-3 z-10 grid h-14 w-14 place-items-center rounded-full sm:right-4 sm:top-4">
      <svg viewBox="0 0 48 48" className="absolute inset-0 h-full w-full -rotate-90" aria-hidden="true">
        <circle cx="24" cy="24" r={RAIO} fill="none" stroke="rgba(255,255,255,.12)" strokeWidth="3" />
        <circle
          cx="24"
          cy="24"
          r={RAIO}
          fill="none"
          stroke="#5EEAD4"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={VOLTA_ANEL}
          strokeDashoffset={VOLTA_ANEL * (1 - s / 30)}
          style={{ transition: s === 30 ? "stroke-dashoffset .6s cubic-bezier(.2,.7,.1,1)" : "stroke-dashoffset 1s linear", filter: "drop-shadow(0 0 4px rgba(94,234,212,.8))" }}
        />
      </svg>
      <span className="relative text-[12px] font-semibold tabular-nums text-white">{s} s</span>
    </div>
  );
}

export function CentroComando() {
  return (
    <div className="absolute inset-x-3 bottom-0 top-6 sm:inset-x-7 sm:top-7">
      <div className="relative h-full overflow-hidden rounded-t-2xl border border-b-0 border-white/10 bg-night shadow-[0_-20px_80px_-30px_rgba(20,184,166,.5)] [mask-image:linear-gradient(#000_70%,transparent)]">
        <img
          src={A("img/v4/command-centre-1200.webp")}
          srcSet={`${A("img/v4/command-centre-640.webp")} 640w, ${A("img/v4/command-centre-1200.webp")} 1200w`}
          sizes="(min-width: 1024px) 600px, 92vw"
          width={1200}
          height={750}
          loading="lazy"
          decoding="async"
          alt="The real Legal command centre with demo data: open, awaiting intake, overdue, high risk and notice deadline counts, where Legal is working and live activity"
          className="block h-auto w-[170%] max-w-none sm:w-[150%] lg:w-[135%]"
        />
      </div>
      <Anel />
    </div>
  );
}

/* ---------- bento small cell 2: the five languages, each in its own language ---------- */
const LINGUAS: ReadonlyArray<readonly [string, string]> = [
  ["English", "en"],
  ["Español", "es"],
  ["Português", "pt"],
  ["Français", "fr"],
  ["العربية", "ar"],
];

export function Linguas() {
  return (
    <div className="absolute inset-0 flex flex-col justify-center gap-3 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_14%,#000_86%,transparent)]" aria-hidden="true">
      <div aria-hidden="true" className="absolute left-1/2 top-1/2 h-40 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-glow/10 blur-3xl" />
      {[0, 1].map((r) => (
        <div key={r} className="fita relative flex w-max gap-3" style={{ animationDirection: r ? "reverse" : "normal", animationDuration: "44s", marginLeft: r ? -64 : 0 }}>
          {[...LINGUAS, ...LINGUAS, ...LINGUAS, ...LINGUAS].map(([n, l], j) => (
            <span
              key={j}
              lang={l}
              dir={l === "ar" ? "rtl" : "ltr"}
              className={`inline-flex items-center gap-2 whitespace-nowrap rounded-xl border px-4 py-2.5 text-[15px] ${
                l === "ar" ? "border-mint/30 bg-mint/[.07] text-white" : "border-white/[.08] bg-white/[.04] text-white/85"
              }`}
            >
              <IcGlobo className="h-4 w-4 shrink-0 text-mute" />
              {n}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}
