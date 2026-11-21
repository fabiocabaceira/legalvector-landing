import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, MotionConfig, MotionGlobalConfig } from "framer-motion";
import { CHAVES, CTA, EVENTOS, FALAR, FORM_URL, NAV, PAGINA, PAGINA_FORM, PRIVACIDADE, R, ROTAS, TELEFONE, TEL_HREF, curva, type Linhas } from "./base";
import { CODIGO, TESTE, WA_HREF, origem, track, ultimoCta, umami, urlProduto } from "./rastreio";
import { DuasLinhas, Logotipo, MovContexto, Seta, Surge, WhatsApp, tituloH2 } from "./ui";

/* ---------------- sky ---------------- */
function Ceu() {
  return (
    <div className="ceu" aria-hidden="true">
      <span className="ceu-luz l1" />
      <span className="ceu-luz l2" />
      <span className="ceu-luz l3" />
    </div>
  );
}

/* ---------------- header ---------------- */
const atual = (k: string) => (PAGINA === k ? ("page" as const) : undefined);

function Topo() {
  const [aberto, setAberto] = useState(false);
  const botao = useRef<HTMLButtonElement>(null);
  const cabeca = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!aberto) return;
    const tecla = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setAberto(false);
      botao.current?.focus();
    };
    const sai = (e: FocusEvent) => {
      if (!cabeca.current?.contains(e.relatedTarget as Node | null)) setAberto(false);
    };
    const h = cabeca.current;
    document.addEventListener("keydown", tecla);
    h?.addEventListener("focusout", sai);
    return () => {
      document.removeEventListener("keydown", tecla);
      h?.removeEventListener("focusout", sai);
    };
  }, [aberto]);

  return (
    <header ref={cabeca} className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5">
      <div className={`mx-auto max-w-[1240px] rounded-2xl border border-white/10 shadow-[0_14px_40px_-16px_rgba(0,0,0,.8)] backdrop-blur-xl transition-colors ${aberto ? "bg-night/95" : "bg-night/80"}`}>
        <div className="flex h-14 items-center gap-4 pl-3 pr-2">
          <a href={R("")} className="flex h-11 shrink-0 items-center">
            <Logotipo topo />
          </a>
          <nav aria-label="Main" className="hidden flex-1 items-center justify-center gap-1 lg:flex">
            {NAV.map(([t, k]) => (
              <a key={k} href={R(ROTAS[k])} aria-current={atual(k)} className="rounded-lg px-3.5 py-2 text-sm font-medium text-white/65 transition hover:text-white aria-[current=page]:bg-white/[.07] aria-[current=page]:text-white">
                {t}
              </a>
            ))}
          </nav>
          <a href="#demo" data-cta="header" className="hidden h-10 shrink-0 items-center rounded-xl bg-white px-4 text-sm font-semibold text-ink transition hover:bg-[#d7fbf5] lg:inline-flex">
            {CTA}
          </a>
          <button
            ref={botao}
            type="button"
            className="ml-auto inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[.03] lg:hidden"
            aria-expanded={aberto}
            aria-controls={aberto ? "menu-movel" : undefined}
            aria-label={aberto ? "Close menu" : "Open menu"}
            onClick={() => setAberto(!aberto)}
          >
            <span className="relative block h-3 w-4">
              <span className={`absolute left-0 h-[1.5px] w-4 bg-white transition ${aberto ? "top-1.5 rotate-45" : "top-0"}`} />
              <span className={`absolute left-0 h-[1.5px] w-4 bg-white transition ${aberto ? "top-1.5 -rotate-45" : "top-[10px]"}`} />
            </span>
          </button>
        </div>
        <AnimatePresence>
          {aberto && (
            <motion.nav
              id="menu-movel"
              aria-label="Menu"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: curva }}
              className="overflow-hidden border-t border-white/[.06] lg:hidden"
            >
              <div className="flex flex-col px-4 pb-4 pt-1">
                {NAV.map(([t, k]) => (
                  <a key={k} href={R(ROTAS[k])} aria-current={atual(k)} className="border-b border-white/[.06] py-3.5 text-lg font-medium tracking-[-0.02em] text-white aria-[current=page]:text-mint">
                    {t}
                  </a>
                ))}
                <a href="#demo" data-cta="menu" onClick={() => setAberto(false)} className="mt-4 flex h-12 items-center justify-center rounded-xl bg-white font-semibold text-ink">
                  {CTA}
                </a>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}

/* ---------------- demo form (2 steps, POST /lv/t) ---------------- */
const OPCOES: ReadonlyArray<readonly [string, string]> = [
  ["Alfresco", "Alfresco"],
  ["Doxis", "Doxis"],
  ["Other", "Somewhere else"],
  ["", "Not sure"],
];
const FRASES: Record<string, string> = {
  Alfresco: "Supported today, with 124 end to end checks.",
  Doxis: "Supported today, and it works beside Doxis Legal.",
  Other: "Today legalVector runs on Alfresco and Doxis. Tell us what you use.",
  "": "How it fits your landscape is part of the demo.",
};
const PRECISA: Record<string, string> = {
  name: "Please enter your name.",
  email: "Please enter your work email.",
  company: "Please enter your company.",
  consent: "Please agree to be contacted about this request.",
};
const EMAIL_INVALIDO = "Please enter a valid work email.";
const DEMASIADOS = "Too many requests. Please wait a few minutes and try again.";
const FALHOU = "We couldn’t send your request. Please try again, or reach us on WhatsApp or at +351 916 868 318.";
const PASSOS: ReadonlyArray<readonly [string, string]> = [
  ["Tell us where your contracts live.", "Alfresco, Doxis or somewhere else. We answer plainly."],
  ["Leave your details.", "Your name, work email and company are enough."],
  ["Get a confirmed time.", "We confirm the time by email within one business day."],
];

const campo =
  "h-12 w-full rounded-xl border border-white/10 bg-white/[.04] px-4 text-[15px] text-white outline-none transition placeholder:text-white/30 focus:border-glow focus:bg-white/[.06] focus:ring-4 focus:ring-glow/20 aria-[invalid=true]:border-amber";

/** The demo section (#demo) at the bottom of every page. */
export function Pedido({ titulo }: { titulo: Linhas }) {
  const form = useRef<HTMLFormElement>(null);
  const [passo, setPasso] = useState<1 | 2>(1);
  const [repo, setRepo] = useState<string | null>(null);
  const [erroRepo, setErroRepo] = useState(false);
  const [erro, setErro] = useState("");
  const [ocupado, setOcupado] = useState(false);
  const [feito, setFeito] = useState(false);
  const feitoRef = useRef<HTMLDivElement>(null);
  // what the visitor typed in step 2, so Back then Continue keeps it
  const valores = useRef<Record<string, string>>({});
  // the step that mounts next takes the focus (AnimatePresence mounts it after the old step leaves)
  const foco = useRef<"nome" | "repo" | null>(null);

  function aoMontar(el: HTMLFieldSetElement | null) {
    if (!el || !foco.current) return;
    const alvo =
      foco.current === "nome"
        ? el.querySelector<HTMLInputElement>('input[name="name"]')
        : (el.querySelector<HTMLInputElement>('input[name="repository"]:checked') ?? el.querySelector<HTMLInputElement>('input[name="repository"]'));
    foco.current = null;
    alvo?.focus();
  }

  function guarda(e: React.FormEvent<HTMLFormElement>) {
    const t = e.target as HTMLInputElement;
    if (!t.name || t.name === "repository" || t.name === "website") return;
    valores.current[t.name] = t.type === "checkbox" ? (t.checked ? "on" : "") : t.value;
  }

  function seguinte() {
    if (repo === null) {
      setErroRepo(true);
      return;
    }
    foco.current = "nome";
    setPasso(2);
  }

  function volta() {
    setErro("");
    foco.current = "repo";
    setPasso(1);
  }

  function falha(texto: string, nome?: string) {
    setErro(texto);
    const f = form.current;
    if (!f) return;
    f.querySelectorAll("[aria-invalid]").forEach((el) => el.removeAttribute("aria-invalid"));
    const el = nome ? (f.elements.namedItem(nome) as HTMLInputElement | null) : null;
    if (el && "focus" in el) {
      el.setAttribute("aria-invalid", "true");
      el.focus();
    }
  }

  async function enviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = form.current!;
    if (ocupado) return;
    if (!f.checkValidity()) {
      const primeiro = Array.from(f.elements).find((el): el is HTMLInputElement => el instanceof HTMLInputElement && !!el.name && !el.validity.valid);
      const n = primeiro?.name || "";
      falha(n === "email" && primeiro?.validity.typeMismatch ? EMAIL_INVALIDO : PRECISA[n] || PRECISA.name, n);
      return;
    }
    setErro("");
    f.querySelectorAll("[aria-invalid]").forEach((el) => el.removeAttribute("aria-invalid"));
    umami(EVENTOS.formSubmit);
    const dados = Object.fromEntries(new FormData(f)) as Record<string, string>;
    const corpo = Object.assign({}, origem, dados, { repository: repo ?? "" }, { evento: "form", lvteste: TESTE ? 1 : 0, consent: !!dados.consent, page: PAGINA_FORM, r: CODIGO, cta: ultimoCta() });
    track("lead", { cta: ultimoCta() });
    setOcupado(true);
    try {
      const r = await fetch(FORM_URL, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(corpo) });
      const j = (await r.json().catch(() => ({}))) as { ok?: boolean; mensagem?: string; campo?: string };
      if (r.ok && j.ok) {
        setFeito(true);
        setTimeout(() => feitoRef.current?.focus(), 60);
        return;
      }
      if (r.status === 400 && j.mensagem) falha(j.mensagem, j.campo);
      else if (r.status === 429) falha(j.mensagem || DEMASIADOS);
      else falha(FALHOU);
    } catch {
      falha(FALHOU);
    } finally {
      setOcupado(false);
    }
  }

  const barras = (
    <span aria-hidden="true" className="flex gap-1.5">
      <span className="h-1 w-10 rounded-full bg-mint shadow-[0_0_10px_rgba(94,234,212,.7)]" />
      <span className={`h-1 w-10 rounded-full transition-colors duration-500 ${passo === 2 ? "bg-mint shadow-[0_0_10px_rgba(94,234,212,.7)]" : "bg-white/15"}`} />
    </span>
  );

  return (
    <section id="demo" className="relative overflow-hidden px-4 py-20 sm:px-8 sm:py-24" aria-labelledby="t-demo">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="grade-fundo absolute inset-0 rotate-180" />
        <motion.div
          initial={{ y: 160, opacity: 0.4 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 1.4, ease: curva }}
          className="absolute bottom-[-300px] left-1/2 h-[700px] w-[1200px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(20,184,166,.3),transparent)]"
        />
      </div>
      <div className="relative mx-auto grid max-w-6xl items-start gap-14 lg:grid-cols-2 lg:gap-20">
        <Surge>
          <h2 id="t-demo" className={tituloH2}>
            <DuasLinhas l={titulo} />
          </h2>
          <p className="mt-5 max-w-md text-pretty text-lg leading-relaxed text-mute">We show you legalVector on the system you already use, with a contract you bring.</p>
          <ol className="mt-10 space-y-6">
            {PASSOS.map(([t, p], i) => (
              <li key={t} className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-glow/50 bg-glow/10 text-sm font-semibold text-mint">{i + 1}</span>
                <span>
                  <span className="block font-semibold text-white">{t}</span>
                  <span className="mt-1 block text-[15px] text-mute">{p}</span>
                </span>
              </li>
            ))}
          </ol>
          <p className="mt-10 text-[15px] text-white/60">
            Rather talk now?{" "}
            <a className="text-mint underline decoration-mint/30 underline-offset-4 hover:decoration-mint" href={WA_HREF} target="_blank" rel="noopener" data-cta="whatsapp">
              WhatsApp {TELEFONE}
            </a>
          </p>
        </Surge>

        <Surge atraso={0.1}>
          <form ref={form} onSubmit={enviar} onChange={guarda} noValidate className="feixe rounded-3xl border border-white/10 bg-deep/75 p-6 shadow-[0_40px_120px_-40px_rgba(20,184,166,.6)] backdrop-blur-xl sm:p-9">
            <AnimatePresence mode="wait" initial={false}>
              {feito ? (
                <motion.div key="feito" ref={feitoRef} tabIndex={-1} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} aria-live="polite" className="py-8 text-center outline-none">
                  <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-glow/20 text-white shadow-[0_0_34px_-4px_rgba(94,234,212,.9)]">
                    <svg viewBox="0 0 64 64" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path className="desenha" pathLength={1} d="M17 21l14 25 15-28" style={{ "--t": ".15s" } as React.CSSProperties} />
                      <path className="desenha" pathLength={1} d="M37 17.5l9.5 .5 .5 9.5" style={{ "--t": ".7s" } as React.CSSProperties} />
                    </svg>
                  </span>
                  <p className="mt-6 text-2xl font-semibold tracking-[-0.02em] text-white">Request received.</p>
                  <p className="mx-auto mt-2 max-w-sm text-mute">We’ll confirm the time by email within one business day.</p>
                </motion.div>
              ) : passo === 1 ? (
                <motion.fieldset key="p1" ref={aoMontar} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.3 }} className="m-0 min-w-0 border-0 p-0">
                  <legend className="p-0">
                    <span className="sr-only">Step 1 of 2</span>
                    {barras}
                    <span className="mt-4 block text-2xl font-semibold tracking-[-0.02em] text-white">Where do your contracts live?</span>
                  </legend>
                  <div className="mt-6 grid grid-cols-2 gap-3">
                    {OPCOES.map(([v, t]) => (
                      <label
                        key={t}
                        className="relative flex h-16 cursor-pointer items-center gap-3 rounded-2xl border border-white/10 bg-white/[.03] px-4 font-medium text-white transition hover:border-white/25 has-[:checked]:border-glow has-[:checked]:bg-glow/10 has-[:checked]:shadow-[0_0_30px_-8px_rgba(94,234,212,.8)] has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-mint sm:px-5"
                      >
                        <input
                          type="radio"
                          name="repository"
                          value={v}
                          checked={repo === v}
                          onChange={() => {
                            setRepo(v);
                            setErroRepo(false);
                          }}
                          className="sr-only"
                        />
                        <span
                          aria-hidden="true"
                          className={`h-3 w-3 shrink-0 rounded-full transition duration-300 ${repo === v ? "bg-mint shadow-[0_0_12px_2px_rgba(94,234,212,.75)]" : "ring-[1.5px] ring-inset ring-white/30"}`}
                        />
                        <span className="text-[15px] leading-tight">{t}</span>
                      </label>
                    ))}
                  </div>
                  <p className="mt-4 min-h-12 text-[15px] font-medium leading-snug text-mint sm:min-h-6" aria-live="polite">
                    {repo !== null ? FRASES[repo] : ""}
                  </p>
                  {erroRepo && (
                    <p role="alert" className="mt-2 text-[15px] font-medium text-amber">
                      Choose an option to continue.
                    </p>
                  )}
                  <button type="button" onClick={seguinte} className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-white font-semibold text-ink transition hover:bg-[#d7fbf5]">
                    Continue <Seta className="h-4 w-4" />
                  </button>
                </motion.fieldset>
              ) : (
                <motion.fieldset key="p2" ref={aoMontar} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }} transition={{ duration: 0.3 }} className="m-0 min-w-0 border-0 p-0">
                  <legend className="p-0">
                    <span className="sr-only">Step 2 of 2</span>
                    {barras}
                    <span className="mt-4 block text-2xl font-semibold tracking-[-0.02em] text-white">Where do we confirm the time?</span>
                  </legend>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <label className="grid gap-2 text-sm font-medium text-white/80">
                      Name
                      <input name="name" type="text" autoComplete="name" maxLength={120} required defaultValue={valores.current.name} className={campo} />
                    </label>
                    <label className="grid gap-2 text-sm font-medium text-white/80">
                      Work email
                      <input name="email" type="email" autoComplete="email" maxLength={200} required defaultValue={valores.current.email} className={campo} />
                    </label>
                    <label className="grid gap-2 text-sm font-medium text-white/80">
                      Company
                      <input name="company" type="text" autoComplete="organization" maxLength={160} required defaultValue={valores.current.company} className={campo} />
                    </label>
                    <label className="grid gap-2 text-sm font-medium text-white/80">
                      <span>
                        Role <span className="font-normal text-mute">(optional)</span>
                      </span>
                      <input name="role" type="text" autoComplete="organization-title" maxLength={120} defaultValue={valores.current.role} className={campo} />
                    </label>
                  </div>
                  <div className="hp" aria-hidden="true">
                    <label>
                      Website
                      <input type="text" name="website" tabIndex={-1} autoComplete="off" />
                    </label>
                  </div>
                  <label className="mt-5 flex items-start gap-3 text-sm leading-relaxed text-white/70">
                    <span className="relative mt-0.5 grid h-5 w-5 shrink-0 place-items-center">
                      <input
                        type="checkbox"
                        name="consent"
                        required
                        defaultChecked={!!valores.current.consent}
                        className="peer absolute inset-0 m-0 h-5 w-5 cursor-pointer appearance-none rounded-full bg-white/[.04] ring-[1.5px] ring-inset ring-white/35 transition checked:bg-glow/10 checked:ring-glow aria-[invalid=true]:ring-amber"
                      />
                      <span aria-hidden="true" className="pointer-events-none h-2.5 w-2.5 scale-50 rounded-full bg-mint opacity-0 shadow-[0_0_12px_2px_rgba(94,234,212,.75)] transition duration-300 peer-checked:scale-100 peer-checked:opacity-100" />
                    </span>
                    <span>
                      I agree that TexterBlue may contact me about this demo request.{" "}
                      <a href={PRIVACIDADE} target="_blank" rel="noopener" className="text-mint underline underline-offset-2">
                        Privacy
                      </a>
                    </span>
                  </label>
                  {erro && (
                    <p role="alert" className="mt-4 text-[15px] font-medium leading-relaxed text-amber">
                      {erro === FALHOU ? (
                        <>
                          We couldn’t send your request. Please try again, or reach us on{" "}
                          <a href={WA_HREF} target="_blank" rel="noopener" data-cta="whatsapp" className="underline underline-offset-4">
                            WhatsApp
                          </a>{" "}
                          or at{" "}
                          <a href={TEL_HREF} data-cta="call" className="whitespace-nowrap underline underline-offset-4">
                            {TELEFONE}
                          </a>
                          .
                        </>
                      ) : (
                        erro
                      )}
                    </p>
                  )}
                  <div className="mt-6 flex gap-3">
                    <button type="button" onClick={volta} className="inline-flex h-12 items-center justify-center rounded-xl border border-white/15 px-6 font-medium text-white transition hover:bg-white/[.06]">
                      Back
                    </button>
                    <button
                      type="submit"
                      data-cta="submit"
                      aria-disabled={ocupado || undefined}
                      className="inline-flex h-12 flex-1 items-center justify-center rounded-xl bg-white font-semibold text-ink shadow-[0_8px_40px_-8px_rgba(20,184,166,.8)] transition hover:bg-[#d7fbf5] aria-disabled:opacity-70"
                    >
                      {ocupado ? "Sending…" : CTA}
                    </button>
                  </div>
                </motion.fieldset>
              )}
            </AnimatePresence>
          </form>
        </Surge>
      </div>
    </section>
  );
}

/* ---------------- footer ---------------- */
function Rodape({ mov, setMov }: { mov: boolean; setMov: (v: boolean) => void }) {
  const link = "inline-flex min-h-10 items-center text-[13px] text-white/60 transition hover:text-white";
  return (
    <footer className="border-t border-white/[.06] bg-night/60 px-5 pb-32 pt-8 sm:px-8 lg:pb-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <a href={R("")} className="w-fit">
            <Logotipo />
          </a>
          <nav aria-label="Footer" className="flex flex-wrap gap-x-5">
            <a href={R(ROTAS.contact)} className={link}>
              Contact
            </a>
            <a href={urlProduto()} rel="noopener" data-event="main-site" className={link}>
              Full product site
            </a>
            <a href={PRIVACIDADE} rel="noopener" className={link}>
              Privacy
            </a>
            <button type="button" aria-pressed={!mov} onClick={() => setMov(!mov)} className={`${link} text-left`}>
              {mov ? "Reduce motion" : "Turn motion on"}
            </button>
          </nav>
        </div>
        <p className="mt-4 text-[13px] text-white/70">legalVector is a TexterBlue product.</p>
        <address className="mt-2 text-xs not-italic leading-relaxed text-white/50">
          Texter Blue, Lda · Tax ID 514754877 · Rua da Criatividade, Parque Tecnológico de Óbidos, Edifícios Centrais, 2510-216 Óbidos, Portugal ·{" "}
          <a href={TEL_HREF} data-cta="call-footer" className="whitespace-nowrap transition hover:text-white">
            {TELEFONE}
          </a>
        </address>
        <p className="mt-2 text-xs leading-relaxed text-white/50">Screens show the real product with demo data, invented people and companies.</p>
      </div>
    </footer>
  );
}

/* ---------------- fixed contact bar (every width) ---------------- */
function Fixo() {
  const [mostra, setMostra] = useState(false);
  useEffect(() => {
    const demo = document.getElementById("demo");
    const ctas = document.querySelectorAll('[data-cta="hero"],[data-cta="cabeca"],[data-cta="contact"]');
    const onde = new Map<Element, "dentro" | "acima" | "abaixo">();
    let perto = false;
    const passou = () => {
      const v = [...onde.values()];
      return v.includes("acima") && !v.includes("dentro");
    };
    const f = () => setMostra((window.scrollY > window.innerHeight * 0.7 || passou()) && !perto);
    const io = new IntersectionObserver(
      ([e]) => {
        perto = e.isIntersecting;
        f();
      },
      { threshold: 0.15 },
    );
    if (demo) io.observe(demo);
    const topo = Math.round(document.querySelector("header")?.getBoundingClientRect().bottom || 72);
    const ioCta = new IntersectionObserver(
      (es) => {
        for (const e of es) onde.set(e.target, e.isIntersecting ? "dentro" : e.boundingClientRect.bottom <= (e.rootBounds?.top ?? topo) ? "acima" : "abaixo");
        f();
      },
      { rootMargin: `-${topo}px 0px 0px 0px` },
    );
    ctas.forEach((c) => ioCta.observe(c));
    addEventListener("scroll", f, { passive: true });
    f();
    return () => {
      io.disconnect();
      ioCta.disconnect();
      removeEventListener("scroll", f);
    };
  }, []);
  return (
    <AnimatePresence>
      {mostra && (
        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-3 pb-3" style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}>
          <motion.div
            initial={{ y: 110 }}
            animate={{ y: 0 }}
            exit={{ y: 110 }}
            transition={{ duration: 0.45, ease: curva }}
            className="vidro pointer-events-auto flex w-full gap-2 rounded-2xl p-1.5 sm:w-auto"
          >
            <a
              href={WA_HREF}
              target="_blank"
              rel="noopener"
              data-cta="whatsapp-float"
              className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-wa px-5 text-[15px] font-semibold text-[#06210f] transition hover:brightness-110 sm:flex-none"
            >
              <WhatsApp className="h-5 w-5" />
              {FALAR}
            </a>
            <a
              href="#demo"
              data-cta="sticky-bar"
              className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-white px-5 text-[15px] font-semibold text-ink shadow-[0_8px_30px_-8px_rgba(94,234,212,.8)] transition hover:bg-[#d7fbf5] sm:flex-none"
            >
              {CTA}
            </a>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

/* ---------------- page ---------------- */
function guardaMov(mov: boolean) {
  document.documentElement.dataset.mov = mov ? "on" : "off";
  try {
    localStorage.setItem(CHAVES.calm, mov ? "0" : "1");
  } catch {
    /* no storage */
  }
}

/** The shell around every page: sky, header, page, demo form, footer, fixed bar, motion switch. */
export default function Casca({ children, pedidoTitulo }: { children: (mov: boolean) => ReactNode; pedidoTitulo: Linhas }) {
  const [mov, setMov] = useState(() => document.documentElement.dataset.mov !== "off");
  const primeira = useRef(true);
  MotionGlobalConfig.skipAnimations = !mov;

  useEffect(() => {
    if (primeira.current) {
      primeira.current = false;
      return;
    }
    guardaMov(mov);
  }, [mov]);

  // React draws after load, so the browser cannot find the anchor alone
  useEffect(() => {
    if (!location.hash) return;
    const alvo = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (alvo) requestAnimationFrame(() => alvo.scrollIntoView({ behavior: "instant" as ScrollBehavior }));
  }, []);

  // in-page links scroll here even when a <base> is set (the /r/LV-#### routes)
  useEffect(() => {
    const f = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.('a[href^="#"]');
      const h = a?.getAttribute("href");
      if (!h || h === "#") return;
      const alvo = document.getElementById(decodeURIComponent(h.slice(1)));
      if (!alvo) return;
      e.preventDefault();
      alvo.scrollIntoView({ behavior: document.documentElement.dataset.mov === "off" ? "auto" : "smooth" });
      history.pushState(null, "", location.pathname + location.search + h);
      const campo = alvo.id === "demo" ? alvo.querySelector<HTMLElement>('form input:not([tabindex="-1"]), form button') : null;
      const foco = campo ?? alvo;
      if (foco === alvo && !alvo.hasAttribute("tabindex")) alvo.setAttribute("tabindex", "-1");
      foco.focus({ preventScroll: true });
    };
    document.addEventListener("click", f);
    return () => document.removeEventListener("click", f);
  }, []);

  return (
    <MotionConfig reducedMotion={mov ? "never" : "always"}>
      <MovContexto.Provider value={mov}>
        <Ceu />
        <a href="#conteudo" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[90] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-ink">
          Skip to content
        </a>
        <Topo />
        <main id="conteudo" tabIndex={-1} className="overflow-x-clip outline-none">
          {children(mov)}
          <Pedido titulo={pedidoTitulo} />
        </main>
        <Rodape mov={mov} setMov={setMov} />
        <Fixo />
      </MovContexto.Provider>
    </MotionConfig>
  );
}
