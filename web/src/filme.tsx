import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { A, chaveFilme, curva, movLigado, ouveSom, pedeSom, type Filme as FilmeT } from "./base";
import { filmeComSom } from "./rastreio";
import { Pausa, Play, Som, moldura, useCortina, useMov } from "./ui";

const mmss = (s: number) => {
  const t = Math.floor(s || 0);
  return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`;
};

// keys that only move around the page; they are not a choice to hear the film
const NAVEGA = new Set(["Tab", "Shift", "Control", "Alt", "Meta", "Escape", " ", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "PageUp", "PageDown", "Home", "End"]);

// call inside the gesture with no await before it: iOS refuses sound with NotAllowedError, then the film plays muted.
// An AbortError means a pause() won the race, so it does not play again over that pause
function tocar(v: HTMLVideoElement) {
  v.play().catch((e: unknown) => {
    if (v.muted || (e as Error)?.name === "AbortError") return;
    v.muted = true;
    v.play().catch(() => {});
  });
}

/**
 * The film player (Doxter EcraProduto).
 * modo "heroi": starts after the intro, the load and the largest paint; tries sound, else plays muted and the
 *   first tap or key anywhere restarts it with sound.
 * modo "vista": muted while in view, "Listen with sound" restarts it with sound.
 * Both: captions from the .vtt always on, pause off-screen, end returns to the start muted.
 * `salto`: a new value seeks there and plays (a tab that points at a moment of the film).
 */
export function Filme({
  filme,
  modo = "vista",
  atraso = 0,
  legenda,
  salto,
  className = "",
}: {
  filme: FilmeT;
  modo?: "heroi" | "vista";
  atraso?: number;
  legenda?: string;
  salto?: number;
  className?: string;
}) {
  const mov = useMov();
  const cortina = useCortina();
  const chave = chaveFilme(filme);
  const inicio = filme.inicio ?? 0;
  const video = useRef<HTMLVideoElement>(null);
  const barra = useRef<HTMLInputElement>(null);
  const relogio = useRef<HTMLSpanElement>(null);
  const visivel = useRef(false);
  const pronto = useRef(modo === "vista");
  const maoPausou = useRef(false);
  const escolheuSom = useRef(false);
  const esconde = useRef(0);
  const [som, setSom] = useState(false);
  const [toca, setToca] = useState(false);
  const [mostra, setMostra] = useState(false);
  const [cue, setCue] = useState("");
  // touch screens: while the film plays the native controls are on as well, which iOS Safari sometimes needs
  const [toque] = useState(() => matchMedia("(hover: none) and (pointer: coarse)").matches);
  const nativos = toque && toca;
  const [src] = useState(() => (filme.src1080 && innerWidth * (devicePixelRatio || 1) > 1400 ? filme.src1080 : filme.src720));

  // hero: wait for the intro, the load and the largest paint (or 3 s), then try with sound
  useEffect(() => {
    if (modo !== "heroi") return;
    const v = video.current!;
    if (!mov) {
      v.pause();
      return;
    }
    let vivo = true;
    const limpa: Array<() => void> = [];
    const gestos = ["pointerup", "keydown", "touchend"] as const;
    const tira = () => gestos.forEach((t) => removeEventListener(t, primeiro, true));
    function primeiro(e: Event) {
      if (e instanceof KeyboardEvent && NAVEGA.has(e.key)) return;
      tira();
      const alvo = e.target as Element | null;
      if (escolheuSom.current || alvo?.closest?.("[data-leitor]")) return;
      // a seek before the metadata can break the first play on iOS
      if (inicio || v.readyState >= 1) v.currentTime = inicio;
      v.muted = false;
      if (visivel.current && !maoPausou.current) tocar(v);
    }
    const arranca = () => {
      if (!vivo) return;
      pronto.current = true;
      if (!visivel.current) {
        gestos.forEach((t) => addEventListener(t, primeiro, true));
        return;
      }
      v.muted = false;
      v.play().catch(() => {
        v.muted = true;
        v.play().catch(() => {});
        gestos.forEach((t) => addEventListener(t, primeiro, true));
      });
    };
    const html = document.documentElement;
    const semAbertura = new Promise<void>((ok) => {
      if (!html.classList.contains("abre")) return ok();
      const mo = new MutationObserver(() => {
        if (html.classList.contains("abre")) return;
        mo.disconnect();
        ok();
      });
      mo.observe(html, { attributes: true, attributeFilter: ["class"] });
      limpa.push(() => mo.disconnect());
    });
    const carregou = new Promise<void>((ok) => {
      if (document.readyState === "complete") return ok();
      addEventListener("load", () => ok(), { once: true });
    });
    const pintou = () =>
      new Promise<void>((ok) => {
        const t = setTimeout(ok, 3000);
        limpa.push(() => clearTimeout(t));
        try {
          const po = new PerformanceObserver((l) => {
            if (!l.getEntries().length) return;
            po.disconnect();
            ok();
          });
          po.observe({ type: "largest-contentful-paint", buffered: true });
          limpa.push(() => po.disconnect());
        } catch {
          ok();
        }
      });
    Promise.all([semAbertura, carregou.then(pintou)]).then(arranca);
    return () => {
      vivo = false;
      limpa.forEach((f) => f());
      tira();
    };
  }, [modo, mov, inicio]);

  // view mode with motion off: stays on the poster until the person presses play
  useEffect(() => {
    if (modo === "vista" && !mov) video.current?.pause();
  }, [modo, mov]);

  // off-screen it pauses; back on screen it resumes unless paused by hand
  useEffect(() => {
    const v = video.current!;
    const io = new IntersectionObserver(
      ([e]) => {
        visivel.current = e.isIntersecting;
        if (!e.isIntersecting) {
          if (!v.paused) v.pause();
        } else if (v.paused && pronto.current && !maoPausou.current && movLigado()) tocar(v);
      },
      { threshold: 0.25 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  // another player took the sound
  useEffect(
    () =>
      ouveSom(chave, () => {
        const v = video.current;
        if (v && !v.muted) {
          v.muted = true;
          escolheuSom.current = true;
        }
      }),
    [chave],
  );

  // captions: the .vtt drives a caption bar of our own, on by default
  useEffect(() => {
    const v = video.current!;
    const t = v.textTracks[0];
    if (!t) return;
    t.mode = "hidden";
    const f = () => {
      const c = t.activeCues;
      setCue(c && c.length ? Array.from(c, (x) => (x as VTTCue).text).join(" ") : "");
    };
    t.addEventListener("cuechange", f);
    return () => t.removeEventListener("cuechange", f);
  }, []);

  useEffect(() => {
    const v = video.current!;
    let raf = 0;
    const desenha = () => {
      const d = v.duration || 0;
      const p = d ? v.currentTime / d : 0;
      if (barra.current) {
        barra.current.value = String(Math.round(p * 1000));
        barra.current.style.setProperty("--p", `${(p * 100).toFixed(2)}%`);
      }
      if (relogio.current) relogio.current.textContent = `${mmss(v.currentTime)} / ${mmss(d)}`;
    };
    const ciclo = () => {
      desenha();
      raf = requestAnimationFrame(ciclo);
    };
    const ouve = () => {
      const comSom = !v.muted && !v.paused;
      setSom(!v.muted);
      if (comSom) {
        pedeSom(chave);
        filmeComSom(chave);
      }
    };
    const liga = () => {
      setToca(true);
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(ciclo);
      ouve();
    };
    const para = () => {
      setToca(false);
      cancelAnimationFrame(raf);
      desenha();
    };
    const fim = () => {
      v.muted = true;
      v.currentTime = inicio;
      if (visivel.current && movLigado() && !maoPausou.current) v.play().catch(() => {});
    };
    v.addEventListener("play", liga);
    v.addEventListener("pause", para);
    v.addEventListener("ended", fim);
    const comeco = () => {
      if (inicio && v.currentTime < inicio) v.currentTime = inicio;
      desenha();
    };
    v.addEventListener("loadedmetadata", comeco);
    v.addEventListener("seeked", desenha);
    v.addEventListener("volumechange", ouve);
    if (v.readyState >= 1) comeco();
    if (!v.paused) liga();
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(esconde.current);
      v.removeEventListener("play", liga);
      v.removeEventListener("pause", para);
      v.removeEventListener("ended", fim);
      v.removeEventListener("loadedmetadata", comeco);
      v.removeEventListener("seeked", desenha);
      v.removeEventListener("volumechange", ouve);
    };
  }, [chave, inicio]);

  // a tab points at a moment of the film: seek there and play while motion is on
  const saltoVisto = useRef(salto);
  useEffect(() => {
    if (salto === undefined || salto === saltoVisto.current) return;
    saltoVisto.current = salto;
    const v = video.current!;
    v.currentTime = Math.max(inicio, salto);
    if (movLigado() && visivel.current) {
      maoPausou.current = false;
      pronto.current = true;
      v.play().catch(() => {});
    }
  }, [salto, inicio]);

  function alternarSom() {
    const v = video.current!;
    escolheuSom.current = true;
    v.muted = !v.muted;
    if (!v.muted && v.paused) {
      maoPausou.current = false;
      pronto.current = true;
      tocar(v);
    }
  }

  function alternarPlay() {
    const v = video.current!;
    if (v.paused) {
      maoPausou.current = false;
      pronto.current = true;
      tocar(v);
    } else {
      maoPausou.current = true;
      v.pause();
    }
  }

  function comSomDoInicio() {
    const v = video.current!;
    if (inicio || v.readyState >= 1) v.currentTime = inicio;
    escolheuSom.current = true;
    v.muted = false;
    maoPausou.current = false;
    pronto.current = true;
    tocar(v);
  }

  // the centre button: play() runs inside the tap itself, which iOS needs (also in Low Power Mode).
  // load() only queues the fetch, so the play() after it still comes from the same tap
  function playCentro(e: React.MouseEvent) {
    e.stopPropagation();
    const v = video.current!;
    maoPausou.current = false;
    pronto.current = true;
    if (v.error || v.networkState === v.NETWORK_NO_SOURCE) v.load();
    if (!escolheuSom.current) {
      escolheuSom.current = true;
      v.muted = false;
    }
    tocar(v);
  }

  // first tap on a muted film turns the sound on; after that a tap pauses and resumes, except under the native
  // touch controls, which own play and pause there
  function tocaVideo() {
    if (video.current!.muted && !escolheuSom.current) comSomDoInicio();
    else if (!nativos) alternarPlay();
  }

  // touch has no hover: a tap on the running film shows the bar for a few seconds. While stopped the bar stays
  // hidden, so the tap meant for the centre button changes nothing on screen before its click (iOS drops a click then)
  function revela(e: React.PointerEvent) {
    if (e.pointerType === "mouse" || !toca) return;
    setMostra(true);
    clearTimeout(esconde.current);
    esconde.current = window.setTimeout(() => setMostra(false), 3000);
  }

  function procura(e: React.FormEvent<HTMLInputElement>) {
    const v = video.current!;
    const el = e.currentTarget;
    if (v.duration) v.currentTime = Math.max(inicio, (Number(el.value) / 1000) * v.duration);
    el.style.setProperty("--p", `${Number(el.value) / 10}%`);
  }

  const botao = "grid h-10 w-10 shrink-0 place-items-center rounded-full text-white transition hover:bg-white/15";
  const visto = mostra && toca && !nativos;
  const heroi = modo === "heroi";
  return (
    <div className={`relative ${className}`}>
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-12 bottom-0 top-12 rounded-[40px] bg-glow/25 blur-[90px]" />
      <motion.div
        initial={heroi ? { y: 20, filter: "blur(8px)" } : false}
        // after the entrance the filter goes away entirely: a filtered ancestor can stop WebKit painting the video frames
        animate={heroi ? (cortina ? { y: 0, filter: "blur(0px)", transitionEnd: { filter: "none" } } : { y: 20, filter: "blur(8px)" }) : undefined}
        transition={{ duration: 0.6, delay: atraso, ease: curva }}
      >
        <div className={heroi ? `${moldura} p-2 sm:p-3` : ""}>
          <div
            data-leitor
            onPointerDown={revela}
            className={`group relative aspect-video overflow-hidden bg-night ${heroi ? "rounded-xl ring-1 ring-white/10" : "rounded-2xl shadow-[0_30px_90px_-30px_rgba(20,184,166,.6)] ring-1 ring-white/[.12]"}`}
          >
            <video
              ref={video}
              src={A(src)}
              poster={A(filme.poster)}
              muted
              playsInline
              webkit-playsinline="true"
              controls={nativos}
              preload="metadata"
              width="1280"
              height="720"
              onClick={tocaVideo}
              aria-label={filme.label}
              data-film={chave}
              data-live=""
              className="h-full w-full cursor-pointer object-cover"
            >
              <track kind="captions" src={A(filme.vtt)} srcLang="en" label="English" default />
            </video>

            {cue && !filme.legendasQueimadas && (
              <p
                aria-hidden="true"
                className={`pointer-events-none absolute left-1/2 hidden w-max max-w-[92%] -translate-x-1/2 rounded-lg bg-[rgba(11,21,20,.8)] px-3 py-1.5 text-center text-[15px] font-medium leading-snug text-white ring-1 ring-white/10 backdrop-blur-md transition-[bottom] duration-300 sm:block ${visto ? "bottom-14" : "bottom-3 group-hover:bottom-14 group-focus-within:bottom-14"}`}
              >
                {cue}
              </p>
            )}

            {!toca && (
              <button
                type="button"
                onClick={playCentro}
                aria-label="Play the video"
                data-play-centro=""
                className="absolute left-1/2 top-1/2 z-20 grid h-[72px] w-[72px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[rgba(11,21,20,.72)] text-white shadow-[0_18px_40px_-16px_rgba(0,0,0,.7)] ring-1 ring-white/25 backdrop-blur-md transition hover:scale-105 hover:bg-[rgba(20,43,41,.9)] sm:h-24 sm:w-24"
              >
                <Play className="ml-1 h-8 w-8 sm:h-10 sm:w-10" />
              </button>
            )}

            {toca && !som && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  comSomDoInicio();
                }}
                className="absolute right-2 top-2 flex items-center gap-1.5 whitespace-nowrap rounded-full bg-[rgba(11,21,20,.8)] px-3 py-1.5 text-[12px] font-medium text-white shadow-[0_18px_40px_-16px_rgba(0,0,0,.7)] ring-1 ring-white/15 backdrop-blur-md transition hover:bg-[rgba(20,43,41,.9)] sm:left-1/2 sm:right-auto sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:gap-2 sm:px-5 sm:py-3 sm:text-sm"
              >
                <Som ligado={false} className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
                Listen with sound
              </button>
            )}

            <div
              className={`absolute inset-x-0 bottom-0 z-10 flex items-center gap-2 bg-gradient-to-t from-[rgba(11,21,20,.9)] via-[rgba(11,21,20,.45)] to-transparent px-2 pb-2 pt-12 transition-opacity duration-300 group-focus-within:pointer-events-auto group-focus-within:opacity-100 group-hover:pointer-events-auto group-hover:opacity-100 sm:gap-3 sm:px-3 ${nativos ? "hidden" : visto ? "opacity-100" : "pointer-events-none opacity-0"}`}
            >
              <button type="button" onClick={alternarPlay} aria-label={toca ? "Pause the video" : "Play the video"} className={botao}>
                {toca ? <Pausa className="h-4 w-4" /> : <Play className="ml-0.5 h-4 w-4" />}
              </button>
              <input ref={barra} type="range" min="0" max="1000" step="1" defaultValue="0" onInput={procura} aria-label="Video position" className="barra-video min-w-0 flex-1" />
              <span ref={relogio} className="shrink-0 text-xs tabular-nums text-white/80">
                0:00 / 0:00
              </span>
              <button type="button" onClick={alternarSom} aria-pressed={som} aria-label={som ? "Turn sound off" : "Turn sound on"} className={botao}>
                <Som ligado={som} className="h-[18px] w-[18px]" />
              </button>
            </div>
          </div>
        </div>
        {/* phones: the caption sits under the frame, so the small film stays clear */}
        <p aria-hidden="true" className="relative mt-2 min-h-[2.75em] text-pretty px-1 text-center text-[13px] font-medium leading-snug text-soft sm:hidden">
          {cue}
        </p>
      </motion.div>
      {legenda && <p className="relative mt-1 text-center text-[13px] text-mute sm:mt-3">{legenda}</p>}
    </div>
  );
}
