# legalVector web: handoff for page builders

This folder holds the new legalVector site. It copies the Doxter structure, UI and motion with the legalVector brand.
The foundation (shell, shared components, routes, gate) is complete. Each page is a placeholder that shows only its h1.
Your job is to build one or more pages from `copy-deck.md`.

## 1. Rules for page builders

1. Change only `src/paginas/<YourPage>.tsx` and files in a new folder `src/paginas/<your-page>/`.
2. Do not change any other file. This includes `src/*.ts(x)`, `index.css`, the HTML entries, `vite.config.ts` and `scripts/`.
3. If a shared component does not do what you need, write a local wrapper or a local component in `src/paginas/<your-page>/`.
4. Do not ask questions. If the deck is not clear, choose, and write your choice in your report.
5. Every visible string comes from `copy-deck.md`. If a string is not in the deck, do not write it.
6. Do not use check marks, pills, eyebrow labels above titles, accordions or cream backgrounds.
7. Do not write invented numbers, clients, quotes or logos.
8. Titles have two lines. Line 2 is the accent gradient. Use `Linhas` tuples, `DuasLinhas`, `Titulo` or `TituloBloco`.
9. Do not put an em dash, an en dash or a spaced hyphen between phrases. The gate fails on them, also in `alt` and `aria-label`.
10. Do not wrap the page h1 in an element that changes opacity. The gate fails if the h1 opacity goes below 1 at any time.
11. Every `img` has `alt`. Every `video` has `aria-label`. Every `svg` has `aria-hidden="true"` or a label.
12. Text is 12 px or larger at 390 px and at 1440 px, after transforms. The gate measures the rendered size.
13. Do not use `demo-en.mp4` anywhere. The gate fails if the name `demo-en` is in the build.
14. Use `A("path")` for media and `R("route/")` for links to other pages. Do not write `/` or `../` paths.
15. Do not add a second demo wording. The CTA is `CTA` ("Book a demo") and the demo target is `#demo`.
16. Never commit and never push.

## 2. Run, build and check your page

All commands run in `C:\Users\Fabio\dev\legalvector-landing\web`.

| Task | Command |
|---|---|
| Dev server (hot reload, all pages, also `/lab/`) | `npx vite --port 4791` |
| Build into your own folder | `npx vite build --outDir .build/4791` |
| Serve your build | `node scripts/serve.mjs --dir .build/4791 --port 4791` |
| Check your pages only | `node scripts/check.mjs --dir .build/4791 --routes product/,questions/` |
| Full gate (integrator) | `npm run gate` |

- Ports: integrator 4790, page builders 4791, 4792 and 4793. Stop your server when you finish.
- `check.mjs` starts its own server on a free port. It does not need your server.
- In Git Bash, write routes without the first slash (`product/`, not `/product/`). Git Bash changes `/product/` into a Windows path.
- Write `--routes ,` to check the home only. Add `,r/LV-0001` and `,ask/r/LV-0001` if you build the home.
- The build always contains all pages. If the build fails in a file that is not yours, wait and try again. Do not change that file.
- The gate is `tsc --noEmit`, then `vite build`, then `node scripts/check.mjs`. A red gate blocks new work.

### What the check does

- Each route must answer 200. The routes are `/`, `/ask/`, `/product/`, `/integrations/alfresco/`, `/integrations/doxis/`, `/questions/`, `/contact/`, `/r/LV-0001` and `/ask/r/LV-0001`.
- It opens each route at 390x844 (touch) and at 1440x900, scrolls to the bottom and measures.
- It fails on: a console error, a failed request or an HTTP error (except `/lv/t`, `/lv/v` and the Umami script), horizontal overflow at 390, visible text under 12 px, an h1 opacity under 1, media without `alt` or a name, a dash between phrases, and an internal link that does not answer 200.
- It also tests: the intro lifts on the home, reduced motion stops the intro, the footer motion toggle writes `lv-calm`, in-page links keep the `/r/LV-####` path, the form sends the v4 body and shows the real error with WhatsApp, and the same build under the sub-path `/legalvector-landing/`.
- Build names that start with `_` or `.` fail, because desk.texter.ai answers 404 for them.

## 3. How a page is assembled

`src/main.tsx` reads `data-pagina` from `#raiz` and renders the page component in the shell:

```tsx
<Casca pedidoTitulo={PEDIDO}>{(mov) => <Pagina mov={mov} />}</Casca>
```

- `Casca` draws the sky, the header, `<main id="conteudo">`, the demo form (`section#demo`), the footer and the fixed bar.
- Your component returns only the sections between the header and the form. Do not add a form, a footer or a header.
- Your component gets `mov: boolean` (true while motion is allowed). You can also call `useMov()`.
- The form title is "Bring a contract. / Watch it get reviewed." on the home and `/ask/`, and "Still have questions? / Book a demo." on every other page.

| Page key | Route | File | Placeholder now |
|---|---|---|---|
| `home`, `ask` | `/`, `/ask/` | `src/paginas/Home.tsx` | `Abertura` + `section#top` with the h1 (`PAGINA === "ask"` changes the h1) |
| `product` | `product/` | `src/paginas/Product.tsx` | `Cabeca` with the h1 |
| `alfresco` | `integrations/alfresco/` | `src/paginas/Alfresco.tsx` | `Cabeca` with the h1 |
| `doxis` | `integrations/doxis/` | `src/paginas/Doxis.tsx` | `Cabeca` with the h1 |
| `questions` | `questions/` | `src/paginas/Questions.tsx` | `Cabeca` with the h1 |
| `contact` | `contact/` | `src/paginas/Contact.tsx` | `Cabeca` with the h1 |

### Home and ask

- Keep `<Abertura />` as the first child. It is the intro of copy deck 3.0.
- Keep the hero as `section#top` and the h1 as `<TextoDesfocado linhas={H1} ativo={useCortina()} />`. Then the words rise when the intro lifts.
- The hero film is `<Filme filme={HERO_FILM} modo="heroi" />`. Do not use another film in the hero. To change the film, change only `src/filme-heroi.ts`.
- Use the section ids of the visit tracker: `#top`, `#pain`, `#features`, `#why`, `#rule`. `#demo` comes from the shell.
- `<MesaReels />` is the reels on the drawing (copy deck 3.2). Put it in `section#pain`.
- `<Comparacao />` is `section#why` with the link to Product. On Product use `<Comparacao link={false} />`.
- Each CTA has `data-cta` from the deck: `hero`, `cabeca`, `contact` and so on.

### Inner pages

- Start with `<Cabeca titulo={[l1, l2]} texto="..." visual={...} />`. It holds the h1 (`#t-cabeca`) and the "Book a demo" button (`data-cta="cabeca"`).
- Contact uses `acoes={false}` (no CTA in the head).

## 4. Shared files

| File | What it holds |
|---|---|
| `index.html`, `ask/`, `product/`, `integrations/alfresco/`, `integrations/doxis/`, `questions/`, `contact/` | One HTML entry for each route: SEO head from copy deck §9, share card, canonical, motion script, noscript, `#raiz` |
| `lab/index.html` + `src/lab.tsx` | All shared blocks on one page. Only `npx vite` serves it. `LV_LAB=1 npx vite build` builds it |
| `src/main.tsx` | Page map and the shell |
| `src/base.ts` | Constants and helpers (section 5) |
| `src/filme-heroi.ts` | The `HERO_FILM` record, the one place to change the hero film |
| `src/rastreio.ts` | v4 tracking: origin and UTMs, LV code, dataLayer, Umami, WhatsApp link, visit tracker |
| `src/index.css` | Tokens, Doxter utilities, reels, drawing and intro CSS, motion kill switch |
| `src/ui.tsx` | Reveal, titles, sections, cards, buttons, brand, icons (section 6) |
| `src/casca.tsx` | Shell: sky, header, form `Pedido`, footer, fixed bar, motion state |
| `src/filme.tsx` | Film player `Filme` |
| `src/reels.tsx` | Reels deck `Carrossel`, drawing `Planta`, `MesaReels` |
| `src/comparacao.tsx` | Comparison table |
| `src/etapas.tsx` | Steps with the scroll rail |
| `src/abertura.tsx` | Home intro |
| `src/paginas/*.tsx` | The pages (yours) |
| `public/` | Media at the v4 paths: `campaign/film/`, `img/v4/`, `brand/`, `fonts/`, `ask/og-v4.jpg`, `og-v6.jpg`, `robots.txt` |
| `scripts/serve.mjs` | Static server like desk.texter.ai (`/r/LV-####`, `/ask/r/LV-####`, sub-path, `POST /lv/t` = 405) |
| `scripts/check.mjs` | The browser check of the gate |
| `scripts/og.mjs` | Renders `public/og-v6.jpg` (`npm run og`) |

### Media in `public/`

| File | Use (copy deck §10) |
|---|---|
| `campaign/film/live-front-door.{mp4,webp,vtt}` | Home hero (`HERO_FILM`) |
| `campaign/film/reel-{intake,review,deadlines}.{mp4,webp}` | Home reels 1 to 3 (`REELS`) |
| `campaign/film/legalVector-reel-{1-round-two,2-counterparties,3-dashboard}.{mp4,webp}` | Home reels 4 to 6 (`REELS`) |
| `campaign/film/live-ai-review.{mp4,webp,vtt}` | Product step 2 (`FILME_REVIEW`) |
| `campaign/film/live-decision.{mp4,webp,vtt}` | Doxis 6.2 (`FILME_DECISAO`) |
| `img/v4/{front-door,inbox,approval,key-dates,command-centre,process}-{1200,640}.webp` | See copy deck §10 |

`img/v4/landscape-1200.webp` and `notify-1200.webp` are not copied. The Alfresco head diagram is coded from the deck labels.

## 5. `src/base.ts`

| Name | Value or use |
|---|---|
| `PAGINA` | Page key from `data-pagina` |
| `EH_HOME` | True on home and ask |
| `A(p)` | Media path from the site root, for example `A("img/v4/inbox-1200.webp")` |
| `R(p)` | Link to a route, for example `R("product/")`. On desk.texter.ai it adds `index.html` to folder routes |
| `ROTAS`, `NAV` | Route of each page key, header links |
| `curva` | The only easing: `[0.2, 0.7, 0.1, 1]` |
| `CTA`, `FALAR` | "Book a demo", "Talk to us" |
| `TELEFONE`, `TEL_HREF`, `WA_NUMERO` | +351 916 868 318 |
| `PRIVACIDADE`, `SITE_PRODUTO` | Privacy URL, full product site URL |
| `PAGINA_FORM`, `VARIANTE` | `desk` or `ask`; `review` or `requests` |
| `UMAMI`, `EVENTOS`, `CHAVES` | Umami ids, event names, storage keys (lv-facts 9) |
| `HERO_FILM`, `FILME_REVIEW`, `FILME_DECISAO` | Film records: `{ src720, src1080?, poster, vtt, label, seconds }` |
| `pedeSom(dono)`, `ouveSom(dono, calar)` | One sound at a time between players |
| `ABRE`, `abreCortina()`, `cortinaAberta()` | Intro state |
| `Linhas` | Type of a two-line title: `readonly [string, string]` |

From `src/rastreio.ts` use only `WA_HREF` (WhatsApp link with the prefill and the Ref), `urlProduto()` (product site with UTMs) and `track(name, extra)` if the deck asks for an event.

## 6. Shared components

### `src/ui.tsx`

| Component | Props | Use |
|---|---|---|
| `Surge` | `children`, `className?`, `atraso?` (s), `y?` (px, 24), `as?` (`"div"`, `"li"`) | Rises out of a 6 px blur when it comes into view. Never around an h1 |
| `TextoDesfocado` | `linhas`, `atraso?`, `ativo?` (true), `passo?` (0.05 s) | h1 words rise out of a 12 px blur. Translate and blur only, no opacity |
| `DuasLinhas` | `l: Linhas` | Line 1 white, line 2 gradient, inside your own heading |
| `Titulo` | `id`, `titulo: Linhas`, `texto?`, `className?` | Centred h2 + sub. `id` goes on the h2 |
| `TituloBloco` | `id`, `titulo`, `texto?`, `className?` (`max-w-3xl`) | Left h2 + sub |
| `tituloH2` | class string | The h2 style |
| `Secao` | `id?`, `rotulo` (id of its h2), `children`, `largura?` (`max-w-7xl`), `className?`, `divisor?` | Section with house padding |
| `Cartao` | `div` props | Card with the mouse light |
| `moldura` | class string | Glass frame with the running beam |
| `Quadro` | `children`, `alto?` (`h-72 sm:h-80`) | Card of fixed height for a visual |
| `Celula` | `titulo`, `texto`, `children` (visual), `atraso?`, `alto?`, `className?` | Bento cell: visual on top, h3 and text below |
| `Itens` | `itens: Item[]`, `className?`, `Tag?` (`"h3"`, `"h4"`) | Titled items with a hairline. `Item = [title, text, Icon?]` |
| `Conta` | `ate`, `ver`, `atraso?` | Counts up to `ate` when `ver` is true |
| `Cabeca` | `titulo`, `texto?`, `antes?`, `depois?`, `visual?`, `acoes?` (true) | Inner-page hero with the h1 |
| `BotaoPrincipal`, `BotaoFantasma`, `Ligacao` | `a` props | White CTA with arrow, ghost button, mint text link with arrow |
| `Marca`, `Logotipo` | `svg` props; `className?`, `topo?` | Mark; mark + wordmark ("legal" white + "Vector" mint) |
| `ic(body)` | SVG body | Makes a 24 px line icon. Icons: `Seta`, `Som`, `Play`, `Pausa`, `WhatsApp`, `IcPorta`, `IcDocumento`, `IcEscudo`, `IcLupa`, `IcRelogio`, `IcCalendario`, `IcEnvelope`, `IcPasta`, `IcCamadas`, `IcCadeado`, `IcPessoa`, `IcGlobo`, `IcGrafico`, `IcCaneta`, `IcLigacao`, `IcEngrenagem`, `IcPergunta`, `IcTelefone`, `IcAlvo`, `IcSeguinte` |
| `useMov()`, `useCortina()` | | Motion allowed; intro has lifted |

### Other shared components

| Component | Props | Use |
|---|---|---|
| `Filme` (`filme.tsx`) | `filme`, `modo?` (`"vista"`, `"heroi"`), `atraso?`, `legenda?`, `className?` | Film player. Hero mode starts after the intro and the largest paint, tries sound, else plays muted and the first tap restarts it with sound. View mode plays muted in view. Captions from the `.vtt` are always visible. "Listen with sound" button while muted. Control bar, position, sound. Pauses off screen |
| `Carrossel` (`reels.tsx`) | `reels?` (`REELS`), `rotulo?` | Fanned 9:16 reels: drag, swipe, wheel, arrows, keys, lazy video, own sound button that mutes the other players |
| `Planta` (`reels.tsx`) | none | The A4 contract drawing of copy deck 3.2. Draws itself inside a `.mesa.pousou`. Labels are hidden below 900 px, because they would be under 12 px |
| `MesaReels` (`reels.tsx`) | `className?` | Drawing + reels deck. Draws when 25 % is in view |
| `Comparacao` (`comparacao.tsx`) | `link?` (true) | `section#why` with the rows of copy deck 3.4 |
| `Ponto` (`comparacao.tsx`) | `tipo` (`"sim"`, `"nao"`, `"mao"`), `aceso?`, `atraso?` | Lit mint dot, hollow ring, or the words "By hand" |
| `Etapas` (`etapas.tsx`) | `etapas: Etapa[]` | Numbered steps; the rail fills mint with the scroll |
| `Etapa` type | `id`, `titulo`, `texto`, `itens`, `visual`, `links?` (`[text, route][]`) | One step |
| `Abertura` (`abertura.tsx`) | none | Home intro. Runs only when the head script set `html.abre` |
| `Pedido` (`casca.tsx`) | `titulo` | The demo form. The shell renders it; do not render it again |

## 7. Tokens (`src/index.css`)

| Token | Value | Tailwind |
|---|---|---|
| ink | `#0E1A19` | `bg-ink` (page background) |
| night | `#0B1514` | `bg-night` |
| deep | `#142B29` | `bg-deep` |
| line | `#26403D` | `border-line` |
| mint | `#5EEAD4` | `text-mint` (accent) |
| glow | `#14B8A6` | `bg-glow` |
| teal | `#0F766E` | `text-teal` |
| amber | `#F59E0B` | `bg-amber` (the request dot, errors) |
| mute | `#8FA3A0` | `text-mute` (sub text) |
| soft | `#B9C6C3` | `text-soft` |
| texto | `#E8EFEE` | body text |
| wa | `#25D366` | WhatsApp button only |

Font: Inter variable from `public/fonts/inter.woff2`, with a metric fallback.

CSS classes: `texto-grad` (white to mint text), `vidro` (glass), `feixe` (mint beam round a card), `cartao` (mouse light), `grade-fundo` (grid), `fita`, `traco`, `varrer`, `onda` (loops), `desenha` (draws an SVG path with `pathLength={1}` and `--t` delay), `barra-video`, `hp` (honeypot).

Motion: the head script sets `html[data-mov]` from `lv-calm` and `prefers-reduced-motion`. `[data-mov="off"]` stops every CSS animation and transition. `MotionConfig` stops framer-motion. The footer button "Reduce motion" writes `lv-calm`.

## 8. Things to know

1. **The `/r/LV-####` routes.** desk.texter.ai serves the home HTML at `/r/LV-####` and the ask HTML at `/ask/r/LV-####`. A head script sets `<base>` to the real folder. A build plugin writes the asset tags of these two pages with `document.write` after that script, so that no request goes to a wrong folder. The shell catches clicks on `#` links, because `<base>` breaks them. Do not add static asset tags to the home or ask head.
2. **`R()` on desk.texter.ai.** The desk server answers only files, so `R("product/")` gives `product/index.html` there. Always use `R()`.
3. **Horizontal overflow.** `main` has `overflow-x: clip`. Wide visuals are cut at the screen edge, not scrolled. `position: sticky` still works.
4. **The form on GitHub Pages.** `POST /lv/t` answers 405 there. The form shows "We couldn’t send your request..." with WhatsApp and phone links. Never fake a success.
5. **WhatsApp text.** The prefill keeps the v4 spelling "LegalVector" (lv-facts 9). The deck writes "legalVector". The server reads the v4 text, so it stays.
6. **Film button text.** The centre button says "Listen with sound" (copy deck 2.5).
7. **Hero film.** `HERO_FILM` is the interim `live-front-door.mp4`. A new film changes only `src/filme-heroi.ts`.
8. **Share cards.** Home and inner pages use `og-v6.jpg` ("Make Legal the fastest team / in the building."). `/ask/` uses `ask/og-v4.jpg`. If the owner picks the fallback h1 (OPEN RISKS 2), change the text in `scripts/og.mjs` and run `npm run og`.
9. **Visit tracker keys.** Only `topo`, `problema` and `demo` are on the live server list (OPEN RISKS 11).
10. **Open risks.** Read OPEN RISKS in `copy-deck.md`. Do not show a demo length (1). Do not render "Watch the full tour · 3:38" (5). Do not show Teams or Slack (8). Code only the four visuals of risk 9.
