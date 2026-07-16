# Linear Docs & Changelog — Design-Spec Addendum

**Audience:** engineers building docs.advizr.ca and the public patch-notes surface in Linear's image with **original assets**, on the locked Instrument Grade / Paper & Signal doctrine (dark band #0F0E0C + paper light mode, coral `--signal`, Geist/Geist Mono, zero radius).
**Method note:** this is an **addendum** to the admin-console briefing at `advizr-admin-p5/docs/design/linear-spec.md` — it covers Linear's **public docs (linear.app/docs) and changelog (linear.app/changelog)**, surfaces the console spec does not touch. Console canon is referenced, never duplicated (motion: linear-spec.md §5; app-shell tokens: §3; component grammar: §6). Values are tagged **[VERIFIED]** (shipped CSS bundles at static.linear.app — bundle names cited — live WebFetch, or live Playwright probes run 2026-07-16) or **[EST]** (screenshot/teardown triangulation). Mobile values probed live at 390×844 are tagged **[VERIFIED mobile 390px]**. Contradictions with the console spec are resolved in `⚖ CONFLICT` blocks.

---

## 1) What the docs surface adds to "the Linear feel" (ranked by impact)

1. **Docs run the app's literal token sheet.** linear.app/docs is not a separate docs product — it ships the same `--color-*`, `--font-*`, `--speed-*` custom properties as the product [VERIFIED, Providers.qSrgnk7B + Prose.BC_PATR6 bundles]. The chrome around every screenshot matches the screenshot. This is the single biggest reason the docs "feel Linear," and the cheapest to copy: docs.advizr.ca must run the portals' paper/ink/hairline/`--signal` variables verbatim.
2. **Two-step ink hierarchy.** Body prose is set in `--color-text-secondary` (#d0d6e0 dark), **not** primary ink; only headings, links, and chrome get full-contrast #f7f8f8 [VERIFIED bundle + live probe: computed body color rgb(208,214,224)]. Calm page, crisp headings — and it substitutes for weight hierarchy where weights are rationed (§6).
3. **Tiny component vocabulary.** ONE neutral callout (no severity rainbow), real `<kbd>` chips, docs-home cards with icon headers and border-top footers [VERIFIED bundles: KBD.ByHmXOx_, Grid.Cds8fjKR]. Restriction *is* the aesthetic.
4. **LLM-native plumbing.** "Copy page" split button → "Copy page as Markdown for LLMs" + "View as Markdown ↗" [VERIFIED live 2026-07-16, menu forced open: CopyPageButton.BwCUeWi3], plus an open-in-Claude action and per-block "Copy code" with Shiki highlighting [VERIFIED]. Mintlify reports ~half of docs traffic is now agents — for an AI-transformation brand this is table stakes.
5. **The changelog as public execution heartbeat.** One entry per week, machine-readable full archive, dates in the URLs. Karri Saarinen's "Startups, write changelogs": a changelog that hasn't updated in six weeks implies an inactive product [VERIFIED, linear.app/now/startups-write-changelogs]. For clients on a monthly retainer, this page is the receipts (§4).

---

## 2) Docs IA & layout spec

### 2.1 Frame: three regions
- The 2025–26 convergent standard: fixed left sidebar / center prose column / sticky right TOC. Teardowns flag Linear's *early* missing right rail as its one defect — since fixed.
- **Sidebar:** fixed **280px**, 1px border-right, its **own 64px header** (logo + wordmark) [VERIFIED bundle].
  - Note: this is the *docs* sidebar — the app sidebar is 244px (linear-spec.md §2.1). Different surfaces, different widths; do not conflate.
- **Measure:** `--prose-max-width: 624px` inside `--page-max-width: 1024px`, `--content-gap: 76px` [VERIFIED, shipped custom properties].
- Header carries: logo/wordmark · "Search ⌘K" chip · Sign up / Open app [VERIFIED live desktop].

### 2.2 Right TOC — the instrument needle [VERIFIED, TableOfContents.DujvFjqV]
- Sticky, **max 250px**, 13px text, H2/H3 anchors.
- A **2px full-height rail** in border-primary carries a second **2px active segment** in text-primary.
- The segment's `height` and `translateY` animate at **.25s** to track the active heading — a scroll-spy that reads as a needle on a gauge.
- Gated by `prefers-reduced-motion` [VERIFIED bundle].
- Already dimension-line vocabulary; adopt directly: #E2DDD3 hairline rail + `--signal` segment, zero radius.

### 2.3 Sidebar IA — ordered by user mental model, not feature tree [VERIFIED live]
- Getting started → Account → AI → Your sidebar → Teams → Issues → Issue properties → Projects → Initiatives → Cycles → Views → Find and filter → Linear Asks → Integrations → Analytics → Administration.
- Groups are collapsible accordion buttons; current page at full ink, siblings muted.
- Advizr order: Getting started → daily surfaces (portal, email, briefs) → integrations → administration.

### 2.4 Component vocabulary (complete list — resist additions)
- **Callout:** single neutral variant — bg-secondary, 1px translucent border, **12px 16px padding** [VERIFIED bundle]. No blue/orange/purple severity tints, ever.
- **Kbd chips:** real `<kbd>`; ~20px min box, weight 510, flat, desktop [VERIFIED bundle]; **12px text / min-width 24px / 5px radius** at mobile [VERIFIED mobile 390px]. Set in Inter, not mono (ours: Geist Mono, §6).
- **Cards (docs home):** icon header → title → one verb-led sentence → **border-top footer** [VERIFIED bundle Grid.Cds8fjKR]. No hover shadows — hairline/background shift only.
- **Search:** header chip "Search ⌘K" opening a command-palette dialog [VERIFIED live desktop]. Palette internals were not examined by the research sweep — spec the dialog from the console palette (linear-spec.md §4.3) rather than inventing docs-specific chrome [EST: docs palette matches the cmdk visual spec].
- **Copy page:** split button; menu = "Copy page / Copy page as Markdown for LLMs" + "View as Markdown ↗" [VERIFIED live, forced open]. Per-block "Copy code" with Shiki highlighting [VERIFIED].

---

## 3) Typography & color on docs

### 3.1 Type
- **Family:** Inter Variable, `font-feature-settings "cv01","ss03"`; Berkeley Mono for code; Tiempos Headline loaded but unused in docs [VERIFIED bundles].
- **Weights:** fractional **400 / 510 / 590 / 680** [VERIFIED bundles + live probe: docs H1 computed `font-weight: 590`].
- **Body:** 15px (0.9375rem), line-height 24px, in `--color-text-secondary` [VERIFIED bundle + live probe].
- **Title scale:** 17 / 20 / 24 / 32 / 40px; article H1 = **40px/44px @590, letter-spacing −0.015em** [VERIFIED bundle].
- Compare the app's 13px-workhorse scale (linear-spec.md §3.2) — docs are a reading surface, one notch more generous throughout.

⚖ **CONFLICT — weight family vs console spec:** linear-spec.md §3.2 resolved app UI = **450/500/600** (compiled `Root-*.css`) and demoted 400/510/590/680 to "marketing only." Both are right: the docs surface **is** in the marketing weight family — the live probe confirms 590 on docs H1s, and the docs bundles carry 510/590 tokens. **Resolution: app chrome takes the console values; docs/changelog prose takes 400/510/590/680.** Two surface families, one brand.

### 3.2 Color
- **Dark default** (`data-theme="dark"`, SSR): canvas **#08090a — never #000** [VERIFIED bundle + live probe: body background rgb(8,9,10)].
- **Ink ladder:** #f7f8f8 → #d0d6e0 → #8a8f98 → #62666d [VERIFIED bundles].
- **Borders:** translucent whites **#ffffff14 / #ffffff1f**, not solid grays [VERIFIED bundles].
- **Light theme:** #fff canvas, #282a30 text, #e9e8ea borders [VERIFIED bundle].
- **Accent:** #5e6ad2; dark-mode hover **#7070ff** [VERIFIED bundle] — links and accents only; all other color is data.
- **Hairline:** `--border-hairline` resolves to **0.5px on hi-DPI** [VERIFIED bundle].
- **Shadows:** the brand "resists drop shadows on dark almost entirely"; the glass theme **nulls every shadow to `--shadow-none`** [VERIFIED bundle] — hierarchy is hairlines + surface steps.

⚖ **CONFLICT — canvas family vs console spec:** linear-spec.md §3.1 anchored the **app shell** at #0f0f11 content / #090909 sidebar [its app-shell inline CSS extraction] and labeled #08090a a "marketing" canvas. The docs demonstrably run the **#08090a family** [VERIFIED: Prose.BC_PATR6 / Providers.qSrgnk7B bundles + live probe]. **Resolution: no contradiction — two different surface families.** App shell (console spec) ≠ marketing/docs canvas (this spec). Product screenshots *inside* docs pages show #0f0f11 chrome sitting on an #08090a page, and Linear does not flinch at the mismatch. Advizr equivalent: portals run the app tokens; docs/patch-notes run the band/paper tokens.

### 3.3 Contrast receipts (computed 2026-07-16 — closes a gap the research sweep flagged)
- Body #d0d6e0 on #08090a = **13.6:1** (AAA).
- Muted #8a8f98 on #08090a = **6.1:1** (AA at any size).
- Headings #f7f8f8 on #08090a = **18.7:1**.
- Light theme #282a30 on #fff = **14.3:1**.
- The two-step ink hierarchy is comfortably compliant — but the Advizr transposition must re-validate its secondary ink on paper #FAF8F5 at ≥4.5:1 before adoption (§6.1).

### 3.4 Motion
- Canon: **see linear-spec.md §5** — nothing docs-specific beyond the TOC needle (.25s, §2.2) and the asymmetric hover (`--speed-highlightFadeIn: 0s` in / `.15s` out), both already in the console token sheet.

---

## 4) Changelog anatomy (exhaustive — the model for our patch-notes page)

### 4.1 Location & plumbing
- A tab of the **"Now" hub** — tabs: All | Changelog | Community | News | Craft | AI | Practices | Press [VERIFIED live fetch 2026-07-16] — but keeps its own `<title>`, meta description, and canonical `/changelog` URL.
- **Feeds:** RSS 2.0 at `/rss/changelog.xml` **and** a JSON Feed, both carrying the **full 243-entry archive with full content** [VERIFIED, feeds fetched by the research sweep].
- Full-content feeds are trust plumbing; the anti-pattern is a hidden titles-only feed (Notion). Ship both, full-content, plus llms.txt.
- **Pagination:** 10 full entries per index page, one "Older updates" link → `/changelog/page/2` [VERIFIED live].
- **Cadence:** weekly, **Thursdays**. Live fetch 2026-07-16: Jul 2 · Jun 18 · Jun 11 · Jun 4 · May 28 · May 21 — all Thursdays, one skipped week (Jun 25) [VERIFIED]. The rhythm is the feature; a fixed slot beats a bigger, later post.

### 4.2 Index grid [VERIFIED bundles ChangelogList.CTu9TqjF + Grid.Cds8fjKR]
- **12 columns, 32px gap**, grid-areas `a a a / b b b b b b / c c c` — 3-col left rail, 6-col content well, 3 cols empty.
- **The rail:** 1px vertical hairline, border-primary at **0.6 opacity**, one **6px circular node** per entry; newest node orange **#fc7840**.
- **Dates:** "July 2, 2026" — text-small, **tabular-nums**, **sticky**, following you down long entries [VERIFIED desktop; stickiness removed at mobile — §5].

### 4.3 Entry structure, in order [VERIFIED live entries + bundles]
1. Linked **2rem @590 H2** title (→ permalink).
2. Hero media: screenshot (Sanity CDN, `?q=95&auto=format&dpr=2`, **8px radius**) or click-to-play looping video.
3. One intro paragraph + **bolded bullets** (bold lead-in phrase, plain sentence tail).
4. **"Learn more in the docs"** link — the changelog→docs flow is one-directional in every entry checked.
5. 1–3 secondary H2 features, same shape.
6. **The folded ledger:** Radix collapsibles [VERIFIED bundle Collapsibles.CKjyh1cv], fixed order — **Fixes · Improvements · MCP server · API · Keyboard shortcuts** — all **collapsed by default** [VERIFIED live]. The decisive trick: ten complete entries per page stay scannable because ~80% of the words sit behind chevrons.

### 4.4 Area chips [VERIFIED bundle]
- Every ledger bullet is prefixed by a **25px pill chip** (radius 9999px): **9px colored dot** + product-area label.
- Verified area colors: Agents **#4cb782** · API **#5e6ad2** · GitHub **#f2994a** · Comments **#eb5757**.

### 4.5 Citability [VERIFIED]
- **Slugs encode the date:** `/changelog/2026-07-02-initiative-properties`.
- H2s get **hover-reveal permalink icons** and a **3s `:target` highlight** [VERIFIED bundle].
- **Permalink page chrome** [VERIFIED live, desktop + 390px]: "← Changelog" back link → row of date-as-self-link + quiet **Share** button over a 1px hairline → title → same body. The rail is dropped.

### 4.6 Deliberate absences [VERIFIED live]
- **No authors. No reactions. No tags-on-entries. No prev/next.**
- The stream is the unit; the company is the voice. Adopt the austerity verbatim.

---

## 5) Mobile & responsive behavior [VERIFIED mobile 390px]

Live Playwright probes at 390×844 (iPhone UA, DPR 2), 2026-07-16: docs home, docs article, changelog index, entry permalink. The research sweep left this gap open; every value below is from the live probe unless tagged otherwise.

### 5.1 The compliance headline
- **Zero horizontal scroll on all four surfaces** — `document.scrollWidth` = 390 everywhere.
- Kbd chips wrap inline mid-sentence without overflow.
- No table overflow encountered (probed pages contained no tables) — table handling remains [EST]: wrap tables in their own `overflow-x: auto` container.

### 5.2 Docs at 390px
- **Sidebar collapses behind a hamburger** (Radix trigger) in a **64px static header**: logo + "Docs" wordmark left; Sign-up pill + hamburger right.
- The full category accordion stays in the DOM, hidden until opened; drawer interior styling untested — trigger rejected synthetic clicks [EST: full-screen sheet].
- **Everything else in the chrome simply disappears:** the "Search ⌘K" chip (no visible search affordance at all), the Copy-page split button, and the right TOC.
- The TOC `<aside>` keeps `position: sticky` but renders zero-width — hidden, not restyled. Linear ships **no mobile TOC substitute**; do the same (drop it, don't invent a disclosure widget).
- **Type reflow:** article H1 steps **40px → 32px/36px, still @590**, ls −0.704px (−0.022em); body stays **15px/24px #d0d6e0** — the two-step ink hierarchy survives mobile untouched.
- **Gutters 24px** each side → 342px prose column.
- Kbd chips: 12px, Inter, 5px radius, min-width 24px.
- Hero media: full content width, radius retained.

### 5.3 Changelog at 390px
- The 12-col grid collapses to **one column**: date above title, everything full-width (342px).
- **The hairline rail and circular nodes are removed entirely** — no 1–2px-wide tall element renders in the DOM.
- **Dates lose stickiness:** computed `position: static`, no sticky ancestor; 13px tabular-nums retained.
- The hub tab strip becomes a **horizontal scroller**: `overflow-x: auto`, scrollWidth 498 vs clientWidth 390 — "Practices / Press" clipped offscreen.
- Ledger collapsibles become **56px full-content-width tap rows**, 15px labels, right chevrons, hairline-separated, still collapsed by default.
- Hero media keeps its 8px radius at 342px width.
- The marketing header persists on scroll; entry permalink keeps the "← Changelog" / date + Share / hairline stack.

### 5.4 Surface-by-surface reflow summary

| Element | Desktop [VERIFIED] | At 390px [VERIFIED mobile 390px] |
|---|---|---|
| Docs sidebar | fixed 280px, own 64px header | hidden → hamburger; accordion stays in DOM |
| Search | "Search ⌘K" header chip | removed entirely — no affordance |
| Right TOC | sticky ≤250px, needle scroll-spy | zero-width (keeps `position:sticky`), no substitute |
| Copy page | split button on H1 | hidden |
| Article H1 | 40px/44px @590 | 32px/36px @590, −0.022em |
| Body prose | 15px/24px text-secondary, 624px measure | identical type, 342px measure, 24px gutters |
| Changelog grid | 12-col, 32px gap, a/b/c areas | single column, date above title |
| Rail + nodes | 1px hairline @0.6, 6px nodes, #fc7840 head | removed entirely |
| Dates | sticky, tabular-nums | static, 13px tabular-nums retained |
| Hub tabs | inline row | horizontal scroller (scrollWidth 498 vs 390) |
| Ledger collapsibles | folded rows in content well | 56px full-width tap rows, chevrons |
| Hero media | 8px radius, 6-col well | 8px radius, 342px full-width |

### 5.5 Advizr directives from the probe
- One breakpoint (~768px) is enough. Below it:
  - sidebar → hamburger sheet;
  - right TOC → dropped;
  - patch-notes dimension-line rail → dropped, date block above each title (keep Geist Mono tabular figures);
  - area tabs → horizontal scroller, no visible scrollbar chrome;
  - ledger rows ≥48px tap targets (theirs are 56px).
- Never let the 390px view scroll horizontally — that is the whole compliance test.

---

## 6) Deliberate deviations for Advizr docs

The locked context: dark-first **band #0F0E0C** world + paper #FAF8F5 light mode, coral `--signal`, **Geist 400/500 + Geist Mono**, **zero radius / 2px controls**, hairlines never shadows.

### 6.1 Weight mapping — Inter 510/590 → Geist 500 + size/space
- **What's lost:** the fractional mid-weights that let Linear whisper hierarchy without size changes (510 vs 400 body emphasis; 590 headings that don't shout).
- **Compensations:**
  1. The **two-step ink hierarchy becomes THE emphasis tool** — body one ink step down, headings/links/strong at full ink. Validate the secondary ink on paper #FAF8F5 at **≥4.5:1** at build time — Linear's ladder passes at 13.6:1 (§3.3); ours must prove it, not assume it.
  2. Size + tracking steps carry what 590-vs-510 carried.
  3. **Geist Mono labels mark structure** — figure refs, area labels, dates, ref codes — a register Inter-everywhere Linear doesn't have.

### 6.2 Shape translation table

| Linear pattern [VERIFIED above] | Advizr substitute |
|---|---|
| 8px-radius hero media frames | **0-radius FIG frames** with corner ticks + mono captions; dark screenshots in `.band`-scoped strips |
| 25px pill area-chips, 9px circular dot | **Square Geist Mono chips**, hairline border, 9px **square** dot |
| 6px circular rail nodes, newest #fc7840 | **Square/diamond status glyphs on an #E2DDD3 dimension line** — square = standard release, diamond = major — **newest filled `--signal`** |
| 5px-radius Inter kbd chips | Square hairline kbd chips in **Geist Mono** |
| Rounded search chip "Search ⌘K" | Square hairline field, same label, kbd chip hint |
| 4–24px radii + 9999px pills elsewhere | Zero radius on structure; 2px on controls only |

### 6.3 Hairlines never shadows
- Linear's docs already mostly comply: shadows are "resisted almost entirely" on dark, and the **glass theme nulls every shadow to `--shadow-none`** [VERIFIED bundle] — first-party proof the system works at zero shadows.
- We make the exception rate 0%: hover = hairline-weight or background shift, never elevation.

### 6.4 Keep, unmodified
- Three-region layout with ~624px measure (§2.1); the TOC needle (§2.2); the single neutral callout (§2.4).
- The folded-ledger changelog skeleton, fixed section order, collapsed-by-default (§4.3).
- Full-content RSS 2.0 + JSON Feed + llms.txt; date-encoded slugs; hover-reveal permalinks + `:target` highlight (§4.1, §4.5).
- Weekly cadence; no-authors / no-reactions austerity (§4.6).
- The mobile collapse pattern wholesale (§5.4).

### 6.5 Docs-surface token sketch (Linear's shape, our values)

```css
:root {
  /* layout — Linear's verified geometry, kept */
  --docs-sidebar-width: 280px;
  --docs-header-height: 64px;
  --page-max-width: 1024px;
  --prose-max-width: 624px;   /* consider 640px to align with portal forms */
  --content-gap: 76px;
  --toc-max-width: 250px;
  /* the two-step ink hierarchy — THE emphasis tool (§6.1) */
  --docs-ink: var(--ink);              /* headings, links, strong, chrome */
  --docs-ink-body: var(--ink-secondary); /* body prose — validate ≥4.5:1 on paper */
  --docs-hairline: var(--hairline);    /* #E2DDD3 on paper; band variant in .band */
  /* instrument needle (§2.2) */
  --toc-rail: var(--hairline);
  --toc-needle: var(--signal);
  --toc-needle-speed: .25s;            /* gate with prefers-reduced-motion */
  /* patch-notes rail (§6.2) */
  --rail-line: var(--hairline);
  --rail-glyph-size: 6px;              /* square/diamond, not circle */
  --rail-glyph-newest: var(--signal);
  /* radii — the doctrine, not theirs */
  --radius-structure: 0;
  --radius-control: 2px;
}
```

### 6.6 Patch-notes page assembly (fusing §4 with the doctrine)
1. **Page:** single stream on paper #FAF8F5, ~1024px page / ~640px content measure; each entry opens with a 1px #E2DDD3 top hairline; generous inter-entry gap.
2. **Left rail:** 1px dimension line, square/diamond glyphs per §6.2, newest filled `--signal`; date in Geist Mono tabular figures, sticky below the header (desktop only — §5).
3. **Identity:** mono ref code (`REL-0042`), square-cornered Geist Mono — in place of tags and version badges; slug `/patch-notes/2026-07-16-<kebab-title>`, date-encoded like theirs.
4. **Body:** H2 title (Geist 500, links to permalink) → FIG-framed hero (0 radius, corner ticks, mono caption; `.band` strip when the screenshot is dark UI) → 1–3 benefit-led paragraphs → "Learn more in the docs" link per feature.
5. **Folded ledger:** collapsed-by-default sections, fixed order **Fixes · Improvements · areas** — rendered as ledger tables: square glyph + area mono chip (PORTAL / ADMIN / EMAIL) + one plain sentence per row. Receipts, filterable by the surface the client pays for.
6. **Citability:** hover-reveal permalink marks, ~3s `:target` highlight; permalink pages get "← Patch notes", date-as-self-link, quiet Share. No authors, no reactions, no prev/next.
7. **Plumbing:** full-content RSS 2.0 + JSON Feed, llms.txt, generated OG images, 10 entries/page + "Older updates".
8. **Cadence:** a fixed weekly (or biweekly) slot — for retainer clients this page is the execution heartbeat; the ledger rows are the receipts.

---

## 7) Key Sources

**Primary (Linear, live):** linear.app/docs · /docs/creating-issues · linear.app/changelog (+ /changelog/page/2) · /changelog/2026-07-02-initiative-properties · /changelog/2026-06-11-coding-sessions · /changelog/2026-03-12-ui-refresh · /rss/changelog.xml · /rss/changelog.json · linear.app/now · linear.app/now/startups-write-changelogs (Karri Saarinen) · linear.app/method · linear.app/brand · linear.app/blog/how-we-redesigned-the-linear-ui.
**Shipped-CSS bundle extractions (highest-fidelity numbers), static.linear.app:** Providers.qSrgnk7B · TableOfContents.DujvFjqV · CopyPageButton.BwCUeWi3 · ChangelogList.CTu9TqjF · Prose.BC_PATR6 · DefaultRenderer.DJc-J-pv · Collapsibles.CKjyh1cv · Grid.Cds8fjKR · ShareButton.Blq4ZW3W · KBD.ByHmXOx_ · index.BGg4XGWg (+ ~45 more grepped for tokens).
**Live probes (this addendum, 2026-07-16):** Playwright/chromium at 390×844 — computed styles, sticky/overflow audits, forced-open Copy-page menu, 10 screenshots; WebFetch of /changelog for cadence, tabs, collapsible order, pagination; WCAG contrast ratios computed from probed hexes.
**Third-party:** frontend.horse "The Linear Look" · blog.logrocket.com Linear design critique · docsio.co Linear docs teardown · 925studios.co Linear breakdown · design.withfudge.com/tokens/linear.app · voltagent/awesome-design-md linear.app DESIGN.md.
**Contrast corpus (what Linear was measured against):** notion.com/help · notion.com/releases · developers.notion.com · docs.stripe.com · vercel.com/changelog · vercel.com/design.md · mintlify.com/docs + 2025 year-in-review (agent-traffic stat).
**Console-spec canon referenced, not duplicated:** `advizr-admin-p5/docs/design/linear-spec.md` — §2.1 app sidebar, §3 app tokens + weight/canvas conflict blocks, §4.3 palette visual spec, §5 motion, §6 component grammar.

---

**Known-unverified items (implement anyway, flagged):** docs mobile drawer interior styling (trigger rejected synthetic clicks — [EST] full-screen sheet); mobile table overflow handling (no table on probed pages); docs search-palette internals (spec from console §4.3); docs-home card grid columns at tablet widths; whether the docs sidebar is user-collapsible at desktop widths.
