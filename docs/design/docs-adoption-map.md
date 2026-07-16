# Advizr Docs Rebuild — Binding Adoption Ruling

**Audience:** engineers building docs.advizr.ca (docs + public patch-notes) under the locked Instrument Grade / Paper & Signal doctrine.
**Method note:** this is the ruling layer over `notion-spec.md`, `linear-docs-spec.md`, and `linear-spec.md`; every adoption is a decision, tagged **[ADOPT]** / **[ADAPT]** / **[REJECT]**, with verification tags on computed values. Evidence tiers: **[VERIFIED-COMPUTED]** = contrast math run for this ruling (script shown in §3); **[VERIFIED-LIVE]** = shipped CSS fetched from linear.app / notion.com on 2026-07-16 for this ruling; **[VERIFIED]** = primary extraction cited in the deep-dive report or `linear-spec.md`; **[LOCKED]** = programme decision, quoted as given, not relitigated here. Where the two source systems disagree, a `⚖ CONFLICT` block picks. The deep-dive report's §4 adopt / §5 reject / §6 patch-notes sections are the skeleton; its three named research gaps (responsive, AA verification, search-palette anatomy) are closed in §6, §3, and §5 of this document respectively.

**The locked world [LOCKED]:** dark-first band world default — band `#0F0E0C`, band-card `#181612`, band-hairline `#2A2722` — with paper light mode (paper `#FAF8F5`, ink `#14130F`, hairline `#E2DDD3`). Coral signal: dark world `--signal: 12 95% 66%` ≈ `#FB7756`; light world `--signal: 8 88% 59%` `#F2543B` with `--signal-text: 8 88% 45%`. Geist 400/500 + Geist Mono 400. Zero radius on structure, 2px on controls (this overrides template master's newer 6/8px drift). Hairlines never shadows. No pills, glass, glow, or gradient (CI-enforced). Schematic vocabulary: FigureFrame with corner ticks, DimensionLine, RefCode mono chips, StatusGlyph (square/diamond), Eyebrow, LedgerTable, port-dot. Layout: `--sidebar-width: 244px`, topbar 48px, `--content-max: 46.5rem`, `--toc-width: clamp(200px, 18vw, 260px)`, controls 24/28/32px. Motion: 0s in / .15s out, ceiling .35s, ease-out only, 0ms on keyboard-initiated actions.

---

## 1. The ruling in one table

Source column: L = Linear, N = Notion. Citations: R§n = deep-dive report section; sibling detail lives in `linear-docs-spec.md` (L) and `notion-spec.md` (N).

| # | Pattern | Source | Verdict | Advizr expression | Citation |
|---|---|---|---|---|---|
| 1 | Docs run the product's literal token sheet | L | **[ADOPT]** | Same `--paper/--ink/--band/--signal/--hairline` variables as the portals; chrome matches screenshots | R§4.1, `linear-docs-spec.md` |
| 2 | Three-region shell (sidebar / prose / TOC) | L+N | **[ADAPT]** | 244px sidebar · `--content-max` 46.5rem · `--toc-width` clamp — ruled in §2 | R§4.2, §2 below |
| 3 | TOC as instrument needle | L+N | **[ADAPT]** | Notion tick geometry + Linear .25s animation, `--signal` tick on band-hairline rail | R§4.3, §2.3 below |
| 4 | Two-step ink hierarchy (secondary-ink body) | L | **[ADOPT]** | `--text-2` body, `--text-1` headings/links — AA-verified in §3 [VERIFIED-COMPUTED] | R§4.4, §3 below |
| 5 | One neutral callout, no severity rainbow | L | **[ADOPT]** | Card-surface band, 1px hairline, 12/16px, optional signal edge — §4.1 | R§4.5 |
| 6 | Real `<kbd>` chips | L | **[ADAPT]** | Geist Mono, 1px hairline, 2px radius (control class), 20px min box | R§4.6, §4.2 below |
| 7 | ⌘K search chip + command-palette dialog | L | **[ADAPT]** | Full anatomy ruled in §5, Pagefind-powered | R§4.7, `linear-spec.md` §4.3 |
| 8 | LLM-native plumbing (copy-as-markdown, llms.txt, .md negotiation) | L, N-dev | **[ADOPT]** | Copy-page split button, per-block copy, llms.txt, per-page `.md` | R§4.8 |
| 9 | Asymmetric hover (instant on, fade off) | L | **[ADOPT]** | Already locked: 0s in / .15s out; expressed as background/hairline shifts only | R§4.9, `linear-spec.md` §5 |
| 10 | 3-variable LCH/OKLCH theme derivation | L | **[ADAPT]** | Blueprint for deriving per-client `--signal` ramps from one brand color; docs itself ships the two fixed worlds | R§4.10 |
| 11 | Dark as scoped token swap | L (via Vercel) | **[ADAPT]** | Band world is the *default* [LOCKED]; `.band` class re-scopes tokens for dark strips inside paper mode | R§4.11 |
| 12 | Editorial discipline (verb-led descriptions, mental-model sidebar order) | N+L | **[ADOPT]** | Sidebar ordered Getting started → daily surfaces → administration; one-line verb-led card copy | R§4.12 |
| 13 | Annotated override discipline (every deviation has a written reason) | N | **[ADOPT]** | This document is that layer; pairs with the existing CI bans | R§4.13 |
| 14 | 8–16px radii on cards/callouts, 6px buttons | L+N | **[REJECT]** | Zero radius structure, 2px controls [LOCKED] | R§5 |
| 15 | Pills (9999px chips, 200px search pill, CTA pills) | L+N | **[REJECT]** | Square RefCode mono chips; square hairline search field | R§5 |
| 16 | Hover shadows / shadow tokens on panes | N (L partial) | **[REJECT]** | Hairline-weight or background shift; one sanctioned exception ruled in §5.2 | R§5 |
| 17 | 6px circular timeline nodes, orange `#fc7840` head | L | **[REJECT]** | Square/diamond StatusGlyph on a DimensionLine; newest glyph filled `--signal` | R§5, §7 below |
| 18 | Emoji as UI (👍👎 feedback, callout icons) | N | **[REJECT]** | Square glyphs; the drawn hairline divider between feedback controls survives (§4.6) | R§5 |
| 19 | Tinted callout triads (blue/orange/purple) | N | **[REJECT]** | One neutral callout + signal edge for warn/danger | R§5 |
| 20 | Dark-glow theatre (glows, gradient headings, glass, bento) | L-marketing | **[REJECT]** | Already CI-banned | R§5 |
| 21 | Mascot illustration / doodles | N | **[REJECT]** | FigureFrame schematics, corner ticks, mono captions | R§5 |
| 22 | Rounded hero media (8px / 0.75rem) | L+N | **[REJECT]** | 0-radius FigureFrame, corner ticks, mono figure refs | R§5, §4.3 below |
| 23 | Inter fractional weights (510/590/680), Lyon serif display | L, N | **[REJECT]** | Geist 400/500; hierarchy from size, space, ink step, mono labels | R§5 |
| 24 | Sans inline-code chips | N | **[REJECT]** | Geist Mono, always | R§5 |
| 25 | Availability-in-prose, hidden titles-only RSS | N | **[REJECT]** | Explicit glyphs + full-content feeds (§7) | R§5, R§6 |
| 26 | Weekly changelog cadence as trust heartbeat | L | **[ADOPT]** | Weekly patch-notes slot; the ledger rows are the receipts (§7.9) | R§6 |
| 27 | Folded fix ledgers (80% of words behind chevrons) | L | **[ADAPT]** | `## Fixes` / `## Improvements` → collapsed LedgerTable sections (§7.6) | R§6 |
| 28 | Sticky-date two-column release grid | N | **[ADOPT]** | `minmax(0,1fr) / minmax(0,2fr)`, sticky mono dates ≥md (§7.1) [VERIFIED-LIVE] | R§6 |
| 29 | Date-encoded slugs, hover permalinks, `:target` highlight | L | **[ADOPT]** | `/patch-notes/2026-07-16-<kebab>`, ~3s highlight (§7.7) | R§6 |
| 30 | Single "Up next" card | N | **[REJECT]** | Prev/next pagination pair instead (§4.5) — docs are a sequence, not a funnel | R§2 |

---

## 2. Layout constitution

### 2.1 The shell

Three regions on a fixed grid: `[sidebar 244px] [main: minmax(0, 1fr)]`, main containing a 48px topbar and a content region of `minmax(0, var(--content-max))` prose + `var(--toc-width)` TOC, gutters absorbing the rest. Sidebar carries a 1px border-right in the world's hairline token. Sidebar is the dimmer surface, content the lit stage (band world: sidebar one lightness step below band; paper world: one warm step below paper) — Linear's verified polarity rule [VERIFIED, `linear-spec.md` §2.1].

**⚖ CONFLICT — sidebar width: Linear docs ship 280px; the console spec ships 244px.** Ruled: **244px**. The console value is [VERIFIED] from Linear's live app-shell CSS (`--sidebar-width: 244px`, `linear-spec.md` §2.1 conflict block), and adoption item 1 makes token parity with the product the prime directive — docs.advizr.ca must share the portal shell so screenshots match their chrome. Linear's own docs/product width split (280 vs 244) is a fork we refuse. `--sidebar-width: 244px` [LOCKED].

**⚖ CONFLICT — measure: Linear docs cap prose at 624px; Notion at 804px.** Ruled: **`--content-max: 46.5rem`** (744px @ 16px root) [LOCKED]. Justification beyond the lock: 624px optimizes pure 15px prose but starves LedgerTables and FigureFrame media, which are first-class citizens here; 804px (Notion) drifts past comfortable line length for continuous reading. 744px is the estate-wide token — a docs-only measure would fork the token sheet, violating ruling #1. Long-form prose inside the region self-limits via 15px/1.7 set solid; wide elements (tables, figures) take the full region.

The shell as tokens (the implementation contract, not a suggestion):

```css
.docs-shell {
  display: grid;
  grid-template-columns: var(--sidebar-width) minmax(0, 1fr); /* 244px | main */
}
.docs-main {
  display: grid;
  grid-template-columns:
    minmax(24px, 1fr)                 /* left gutter                    */
    minmax(0, var(--content-max))     /* prose region, 46.5rem          */
    var(--toc-width)                  /* clamp(200px, 18vw, 260px)      */
    minmax(24px, 1fr);                /* right gutter                   */
  column-gap: 48px;
}
```

- Article grid row starts below the 48px topbar; the TOC is `position: sticky; top: calc(48px + 32px)`.
- The prose region hosts wide children (LedgerTable, FigureFrame `data-wide`) at full region width; paragraphs never exceed it.
- Sidebar interior: 13px rows, 32px height, group headings as Eyebrows, active item = `--text-1` + 2px `--signal` left tick (the same tick vocabulary as the TOC — one selection grammar shell-wide).
- No drag-resize, no collapse toggle on desktop (that is app furniture; docs sidebars are stable wayfinding).

### 2.2 Topbar

48px [LOCKED] (vs Linear docs' 64px — rejected; 48px is the portal token). Contents: breadcrumb (§4.4), spacer, search chip "Search ⌘K" (§5), theme toggle. 1px hairline-bottom, no shadow. The skip-link ("Skip to content") is the first focusable element, styled as a mono chip that appears on focus — Linear ships one [VERIFIED-LIVE, `LSqk9q_root` in Layout CSS]; we keep the pattern, restyled square.

### 2.3 TOC as instrument needle

**[ADAPT]** — the merged component, and the page's signature instrument:

- Rail: 1px vertical hairline in the world's hairline token (`#2A2722` band / `#E2DDD3` paper), full height of the item list.
- Active tick: a 2px segment in `--signal`, overlaid at `margin-inline-start: -1px` — Notion's active-tick-on-a-hairline geometry [VERIFIED, report §2].
- Animation: tick `height` and `translateY` transition at `--speed-regularTransition` (.25s), ease-out, gated by `prefers-reduced-motion` — Linear's exact mechanism, re-verified today in shipped CSS: `TableOfContents.DujvFjqV.css` puts `transition-property: transform, height` under `@media (prefers-reduced-motion: no-preference)` [VERIFIED-LIVE].
- Items: 13px, `--text-3`, active item `--text-1`; H2 flush, H3 indented 12px. Width `--toc-width: clamp(200px, 18vw, 260px)` [LOCKED]. Heading "ON THIS PAGE" as an Eyebrow (11px Geist Mono uppercase, `--text-3`).
- This is DimensionLine vocabulary: the rail is a dimension line, the tick is its live reading.

---

## 3. The two-step ink hierarchy — AA-VERIFIED

The report adopted Linear's secondary-ink body without checking contrast (its own flagged gap ②). Closed here. Method: template text-ramp anchors (HSL triples) converted to sRGB hex, WCAG 2.1 relative-luminance contrast computed against both world backgrounds via a python script (colorsys HSL→RGB, standard 2.4-gamma luminance, `(L1+0.05)/(L2+0.05)`). 15px regular Geist is **normal text** under WCAG (large starts at 18.66px bold / 24px regular), so the threshold is **4.5:1**; non-text UI graphics need **3:1**.

The verification script (run 2026-07-16; reproduce any time the ramp anchors move):

```python
import colorsys

def hsl_to_rgb(h, s, l):
    r, g, b = colorsys.hls_to_rgb(h/360, l/100, s/100)
    return tuple(round(c * 255) for c in (r, g, b))

def rel_lum(rgb):
    ch = [c/255/12.92 if c/255 <= 0.04045 else ((c/255 + 0.055)/1.055)**2.4
          for c in rgb]
    return 0.2126*ch[0] + 0.7152*ch[1] + 0.0722*ch[2]

def ratio(fg, bg):
    l1, l2 = rel_lum(fg), rel_lum(bg)
    return (max(l1, l2) + 0.05) / (min(l1, l2) + 0.05)

band, card, paper = (15,14,12), (24,22,18), (250,248,245)   # 0F0E0C / 181612 / FAF8F5
print(ratio(hsl_to_rgb(40, 8, 75.3),   band))   # dark --text-2 → 10.85
print(ratio(hsl_to_rgb(36.1, 6.8, 25.4), paper)) # light --text-2 → 9.44
print(ratio(hsl_to_rgb(8, 88, 59),     paper))   # light --signal → 3.26  FAIL as text
print(ratio(hsl_to_rgb(8, 88, 45),     paper))   # light --signal-text → 4.67
```

### 3.1 Computed ratios [VERIFIED-COMPUTED]

| Token (HSL anchor) | Hex | vs band `#0F0E0C` | vs band-card `#181612` | vs paper `#FAF8F5` | AA 4.5:1 |
|---|---|---|---|---|---|
| dark `--text-2` (40 8% 75.3%) | `#C5C2BB` | **10.85:1** | **10.16:1** | — | PASS, wide margin |
| dark `--text-3` (40 3.8% 51.2%) | `#87847E` | **5.17:1** | **4.85:1** | — | PASS, thin margin |
| light `--text-1` = ink | `#14130F` | — | — | **17.53:1** | PASS |
| light `--text-2` (36.1 6.8% 25.4%) | `#45423C` | — | — | **9.44:1** | PASS, wide margin |
| light `--text-3` (36 4.6% 40.5%) | `#6C6863` | — | — | **5.22:1** | PASS, thin margin |
| dark `--signal` (12 95% 66%) | `#FB7756` | **7.24:1** | **6.78:1** | — | PASS as text |
| light `--signal` (8 88% 59%) | `#F2533A`¹ | — | — | **3.26:1** | **FAIL as text** (passes 3:1 non-text) |
| light `--signal-text` (8 88% 45%) | `#D8290E` | — | — | **4.67:1** | PASS as text |

¹ `hsl(8 88% 59%)` computes to `#F2533A`; the locked hex `#F2543B` is within 1 RGB unit (ratio 3.24:1) — same verdict. Treat the HSL triple as canonical.

### 3.2 The ruling

1. **Body prose uses `--text-2` in both worlds.** 10.85:1 on band and 9.44:1 on paper clear AA with more than 2× headroom — the two-step hierarchy is safe at 15px Geist 400. Adoption item 4 stands.
2. **Headings, links, and emphasized ink use `--text-1`** (ink `#14130F` on paper at 17.53:1; the dark-world `--text-1` sits above `--text-2` in the template ramp and passes a fortiori). This is what substitutes for the fractional weights Geist doesn't have.
3. **`--text-3` is metadata-only** — captions, dates, eyebrows, TOC resting state. It passes AA (5.17 / 4.85 / 5.22) but with margins too thin to bet paragraphs on, and on band-card it sits 0.35 above the line. Never body prose, never below 12px equivalent weight.
4. **Coral as text: world-asymmetric.** On the band world, raw `--signal` may color text (7.24:1 body-grade). On paper, raw `--signal` is **graphics-only** (ticks, glyphs, dimension lines, the 2px selection bar — 3.26:1 clears the 3:1 non-text bar); any signal-colored *text* on paper must use `--signal-text` (4.67:1). This is precisely why the light world carries a separate `--signal-text` token [LOCKED] — the CI ban to add: `color: hsl(var(--signal))` on text nodes in paper scope.
5. **Cross-world leakage is a hard error:** light `--text-2` on band-card measures 1.80:1 [VERIFIED-COMPUTED]. `.band` strips must re-scope the full text ramp, never inherit paper ink.

### 3.3 The rest of the accessibility floor

The report's gap ② also flagged unexamined focus, ARIA, and reduced-motion behavior. Ruled:

1. **Focus-visible:** 2px `--signal` outline, 2px offset, 0 radius, on every interactive element in both worlds (dark coral passes 3:1 non-text against band at 7.24:1; light coral against paper at 3.26:1 — both clear the 3:1 focus-indicator bar [VERIFIED-COMPUTED]). Never `outline: none` without this replacement; the console's deliberate 2px ring (`linear-spec.md` §8.10) applies here unchanged.
2. **Skip link** first in tab order (§2.2). Landmarks: `<nav>` (sidebar), `<main>` (article), `<aside>` (TOC), one `<h1>` per page.
3. **Collapsibles** (folded ledgers, TOC disclosure, mobile drawer) are native `<details>`/`<dialog>` — keyboard and ARIA semantics for free; no re-implemented Radix collapsibles in a mostly-static docs site.
4. **Scroll-spy TOC** is presentation-only: `aria-current="location"` on the active link, no live-region announcements, needle animation gated by `prefers-reduced-motion` exactly as Linear ships it [VERIFIED-LIVE].
5. **Reduced motion:** strip transform/height animation (needle, drawer slide, list-height), keep opacity/color fades so state changes stay legible. `:target` highlight (§7.7) is a fade — it survives.
6. **CI gate:** the token-pair contrast check in §3.1 runs at build time over the generated ramp (same harness as the console's axe run) — a ramp edit that breaks 4.5:1 fails the build, not the audit.

---

## 4. Component constitution

### 4.1 Callout — one variant

**[ADOPT]** Linear's single neutral callout, re-skinned: card-surface background (band-card `#181612` in band world, the paper-secondary step in paper world), 1px hairline border, **12px/16px padding**, 0 radius. No icon by default; an optional Eyebrow ("NOTE") in Geist Mono. **Warn/danger semantics get a 2px `--signal` left edge** — the signal-edge, not a tinted surface. No tinted triads, ever [REJECT #19]. Body text `--text-2`.

### 4.2 Kbd chips

**[ADAPT]** Square kbd chips: Geist Mono 400 at 11px, 1px hairline border, **2px radius** (a kbd is a control-class object — the one radius structure never gets), **20px min box**, 4px horizontal padding, `--text-2` on transparent. No fill, no shadow, no gradient bevel. Used in prose, palette footer hints, empty-state CTAs.

### 4.3 Ledger tables and FIG-framed media

- **LedgerTable**: 1px hairline row dividers only (no vertical rules, no zebra), 13px cells in `--text-2`, mono RefCode/date/numeric columns in Geist Mono with `tabular-nums`, header row as Eyebrow style (11px mono uppercase `--text-3`, hairline-bottom). Row height 40px. Hover = surface step, 0s in / .15s out. Always wrapped in an `overflow-x: auto` container (§6.4). No sort chrome unless a table is genuinely interactive — docs tables are ledgers, not data grids.
- **FigureFrame**: all screenshots/video sit in a 0-radius frame with **corner ticks** (four 1px L-marks in hairline token), a Geist Mono caption below (`FIG-04 — Portal action center`), `--text-3`. **Dark screenshots on paper pages sit in a `.band`-scoped strip** — the frame's interior re-declares the band tokens so dark UI never floats raw on paper (and per §3.2.5, the strip re-scopes the full ramp). Video = click-to-play, poster in the frame, no autoplay loops in article bodies (patch-notes heroes may loop, muted). No lightbox — the frame links to the full-resolution asset instead.

### 4.4 Breadcrumbs

Geist Mono, 11px, uppercase, `--text-3`, `/` separators, in the 48px topbar. The first crumb is the **section RefCode**: `PLT` (platform) / `SVC` (services) / `ACD` (academy) / `ARC` (architecture) / `RES` (resources) / `LGL` (legal). **Section hues die** — no per-section accent colors; the RefCode prefix is the wayfinding, `--signal` stays rationed.

### 4.5 Prev/next pagination

**[ADAPT]** — replaces Notion's single "Up next" card [REJECT #30]. Two hairline-bordered cells at article end (grid `1fr 1fr`, 1px gap via border), each: Eyebrow `← PREV` / `NEXT →` in mono + 13px `--text-1` title. Hover = background step, 0s in / .15s out. 0 radius, no arrows-as-icons beyond the mono glyphs.

### 4.6 Feedback block

**[ADAPT]** Notion's anatomy, de-emojified: Eyebrow "FEEDBACK" (11px mono uppercase), then two buttons — "Yes" and "No" with square StatusGlyphs (filled square / outline square), 13px — separated by Notion's **drawn vertical hairline divider** (the one detail of theirs worth keeping verbatim, in our hairline token). Sits below a 1px hairline above the pagination block.

### 4.7 404 page

Schematic empty state: mono ref **`ERR-404`** as an oversized RefCode chip (Geist Mono, hairline border, 0 radius), one sentence in `--text-2` ("This page doesn't exist or has moved."), one CTA — "Search the docs" with a `⌘K` kbd chip — plus a plain link home. Optional FigureFrame corner ticks framing the empty region. No illustration, no mascot [REJECT #21].

---

## 5. ⌘K search palette — full anatomy

Closes report gap ③. Adapted from the cmdk Linear theme spec in `linear-spec.md` §4.3 [VERIFIED there], re-ruled for docs and doctrine:

```
┌──────────────────────────────────────────────────┐ 640px, 0 radius,
│  Search the docs…                          18px  │ --shadow-dropdown
├──────────────────────────────────────────────────┤ 1px hairline-b (only rule on input)
│  PLT — PLATFORM                    eyebrow, 11px │
│ ▌ Portal action center                  PLT-014  │ 48px row, selected:
│   …approve actions from the queue…               │ 2px --signal bar + surface fill
│   Client provisioning                   PLT-006  │ 13px title / 12px excerpt
│  SVC — SERVICES                                  │
│   Email deliverability                  SVC-003  │
├──────────────────────────────────────────────────┤ hairline-t
│  [↑][↓] navigate   [↵] open   [esc] close        │ kbd chips, --text-3
└──────────────────────────────────────────────────┘ list max-h 400px
```

### 5.1 Panel

- **Trigger:** topbar chip "Search" + `⌘K` kbd chip; also `/`. Full-screen sheet on mobile (§6.5).
- **Panel:** max-width **640px**, upper-third of viewport, **0 radius** (⚖ cmdk ships 8px — doctrine overrides), background = world surface one step up (band-card / paper).
- **Shadow:** `--shadow-dropdown` — a 1px hairline ring + soft umbra. **⚖ CONFLICT — "hairlines never shadows" vs a floating overlay needing separation.** Ruled: hairlines-never-shadows governs *panes at rest*; floating layers get exactly ONE sanctioned shadow token, `--shadow-dropdown`, and nothing else ever does. Linear's own rule is the same shape (shadows only on floating layers, `linear-spec.md` §2.1).
- **Scrim:** plain `rgb(0 0 0 / 0.5)`, never blurred.

### 5.2 Input and rows

- **Input:** 18px Geist 400, 20px padding, **1px hairline-bottom only** — no box, no ring. Placeholder `--text-3`.
- **Result rows:** **48px**, 0 16px padding: 13px `--text-1` title + 12px `--text-3` excerpt (from Pagefind `sub_results` with highlighted terms), page RefCode chip right-aligned in mono.
- **Selected row:** neutral background fill (surface step, never signal tint) + **2px `--signal` left bar** (⚖ cmdk ships 3px accent — ruled 2px to match the TOC tick and selection-bar vocabulary; one tick width everywhere).
- **Group headings:** section Eyebrows — `PLT — PLATFORM` etc., 11px mono uppercase `--text-3`.
- **Footer:** hairline-top, kbd hints as chips: `↑` `↓` navigate · `↵` open · `esc` close.

### 5.3 Behavior

- **List height animates at 100ms ease** (`--cmdk-list-height`); max-height 400px.
- **NO entrance animation** on the panel — high-frequency surface [VERIFIED, `linear-spec.md` §4.3/§5.6].
- **0ms everywhere when keyboard-invoked** (`data-instant` threaded from the keydown path) [LOCKED motion rule].
- **Backend: Pagefind**, client JS API (`pagefind.search()` + `sub_results` for heading-level hits), index built at deploy. No server round-trip, no third-party search SaaS.
- **Empty states:** no-results = one `--text-3` sentence, 64px zone, no illustration. **Dev-mode empty state:** when the Pagefind bundle is absent (dev server), the palette renders a mono notice — `SEARCH INDEX BUILDS AT DEPLOY — run the build to test` — instead of silently failing.

---

## 6. Responsive constitution

Closes report gap ①. Breakpoints: the estate's standard set — **md 768px, lg 1024px, xl 1280px**.

| Region | ≥xl | lg–xl | md–lg | <md |
|---|---|---|---|---|
| Sidebar | 244px fixed | 244px fixed | drawer | drawer |
| Prose | 46.5rem max | 46.5rem max | full width − gutters | full width − gutters |
| TOC | rail + needle | disclosure | disclosure | disclosure |
| Patch-notes grid | 1fr / 2fr, sticky dates | 1fr / 2fr, sticky dates | 1fr / 2fr, sticky dates | single column, inline header |
| Search | 640px panel | 640px panel | 640px panel | full-screen sheet | Live evidence gathered for this ruling: Linear docs hide the TOC at `max-width: 1024px` (`display: none` on `_em0sW_toc`) and collapse the header into an animated mobile menu at 768px [VERIFIED-LIVE, shipped CSS 2026-07-16]; Notion's release grid applies its two-column `minmax(0,1fr) minmax(0,2fr)` layout and sticky date **only at `min-width: 840px`** — below that, entries are a single column with a static date header [VERIFIED-LIVE, `release_release__p2Jug` in shipped CSS 2026-07-16]. The sibling specs' 390px checks should land on the same facts; if they report otherwise, this section's evidence tags win.

1. **Sidebar `<lg`** → off-canvas **drawer** using a native `<dialog>`: full-height, 280px-wide panel from the left, plain scrim, **40px touch rows**, hairline border-right, 0 radius. Trigger = menu glyph in the topbar. Slide ≤ .25s ease-out, 0ms close per motion rules.
2. **TOC `<xl`** → **⚖ CONFLICT — Linear drops the TOC entirely below 1024px [VERIFIED-LIVE]; Notion keeps a rail longer.** Ruled: **collapse, don't drop** — the TOC becomes an "ON THIS PAGE" disclosure (native `<details>`, Eyebrow summary, hairline-boxed) above the article body at `<xl`. Justification: our articles are long, anchors are the citation surface for client conversations, and the disclosure costs one 40px row while `display:none` costs the whole map. The needle animation is desktop-only; the disclosure list is static.
3. **Patch-notes rail `<md`** → the two-column entry grid stacks to one column; the sticky mono date + StatusGlyph become an **inline header row per entry** (glyph · date · REL-chip on one line), and the vertical DimensionLine becomes a **horizontal rule segment** under that header (a short 32px 1px dash, not a full-width rule). This mirrors Notion's verified 840px collapse, ruled onto our 768px boundary — ⚖ 840 vs 768: ruled **768** to keep the estate's breakpoint set; a one-off 840 token buys nothing.
4. **Tables** → every LedgerTable ships inside an `overflow-x: auto` container with `min-width` on the table; the page body never scrolls horizontally.
5. **Search `<md`** → the palette becomes a **full-screen sheet**: input pinned top with hairline-bottom, rows stay 48px, footer kbd hints hidden (no hardware keys), close = explicit `✕` glyph 40px target. Still 0-radius, still no entrance animation.
6. **Touch targets ≥40px** on any coarse pointer (`@media (pointer: coarse)`): nav rows, disclosure summaries, pagination cells, feedback buttons, permalink glyphs (which render always-visible on touch — hover-reveal has no hover).
7. **Sticky elements**: patch-notes dates sticky ≥md only (Notion's exact behavior [VERIFIED-LIVE]); the TOC disclosure is never sticky; the topbar stays sticky at all widths.

---

## 7. Patch-notes page spec (binding)

Refines report §6 with the locked vocabulary. Linear's ledger skeleton in Notion's grid, Instrument Grade skin.

```
────────────────────────────────────────────────────────  1px hairline opens entry
│                                                          ┌ DimensionLine rail (1px)
■  JUL 16, 2026        ## Approvals land in the portal     ■ = StatusGlyph, newest
│  (Geist Mono,        ┌┐····················┌┐              filled --signal;
│   tabular, sticky)   │   FigureFrame       │  ← corner    ◆ = breaking
│                      │   (.band strip if   │    ticks
│  REL-0042            │    dark screenshot) │
│                      └┘····················└┘
│                      FIG-01 — Action queue at rest  (mono caption, --text-3)
│                      Benefit-led paragraph in --text-2 …
│                      Learn more in the docs →
│                      ▸ FIXES (6)            ← collapsed ledger <details>
│                        ■ PORTAL   Fixed stuck approval rows after …
│                        ■ EMAIL    Bounce handling no longer …
│                      ▸ IMPROVEMENTS (3)
│
│    ← 96px gap →      grid: minmax(0,1fr) / minmax(0,2fr)  (≥md)
```

1. **Entry grid:** `grid-template-columns: minmax(0,1fr) minmax(0,2fr)` ≥md [ADOPT #28, VERIFIED-LIVE at Notion]; entries open with a 1px hairline top border; inter-entry gap **96px** (Notion's 128px is magazine air — 96 keeps ledger density). Single stream, world-default band with paper mode like every docs page.
2. **Left rail:** a 1px vertical DimensionLine carrying one **StatusGlyph per entry — square = standard release, diamond = breaking change** — with the **newest glyph filled `--signal`** (Linear's orange head node, transposed [REJECT #17 → this]). Dates in **Geist Mono, `tabular-nums`, sticky** below the topbar ≥md. A square-cornered **`REL-####` RefCode chip** under the date (replaces Notion's version badge and Linear's absent tags).
3. **Anchors:** H2 title (Geist 500, `--text-1`) links to its permalink; slugs encode the date: `/patch-notes/2026-07-16-<kebab-title>` [ADOPT #29].
4. **Media:** FigureFrame — 0 radius, corner ticks, mono caption; dark product screenshots inside `.band`-scoped strips on paper pages (§4.3).
5. **Body:** 1–3 short benefit-led paragraphs in `--text-2` (Notion's tone, stripped of fluff), each feature closing with a **"Learn more in the docs →"** link in `--text-1` (paper world: `--signal-text` if colored).
6. **The folded ledger:** `## Fixes` and `## Improvements` headings in `body_md` render as **collapsed ledger sections** (native `<details>`, Eyebrow summary with row count). Each row: square StatusGlyph + **mono product-area label** — `PORTAL` / `ADMIN` / `EMAIL` / `CRM` / `SITE` / `INFRA` — + one plain sentence. This is Linear's decisive trick [ADAPT #27]: ten full entries per page stay scannable because the long tail sits behind chevrons.
7. **Citability:** hover-reveal permalink glyph on every H2/H3 (always visible on touch), and a **~3s `:target` highlight** — background tint of `--signal` at 6% alpha decaying over .35s after the hold. Permalink pages: date-as-self-link, quiet Share affordance, `← PATCH NOTES` mono back link. No authors, no reactions, no comments.
8. **Plumbing:** **full-content RSS 2.0 + JSON Feed** (Linear ships its complete archive; Notion's titles-only feed is the named anti-pattern [REJECT #25]); entries included in the llms output (llms.txt + per-entry `.md`); generated OG images; **10 entries per index page + one "Older updates" link**.
9. **Cadence:** a **weekly slot** — the rhythm is the trust signal ("a changelog that hasn't been updated in six weeks implies an inactive product"). For clients on a monthly retainer this page is the execution heartbeat; the ledger rows are the receipts. Biweekly is the floor; the slot is a publishing commitment, not an aspiration.

---

## 8. Key sources

- **`notion-spec.md`** (sibling, this directory) — Notion help / releases / developers anatomy detail; the source of the tick-on-hairline TOC geometry, the release grid, the drawn-hairline feedback divider.
- **`linear-docs-spec.md`** (sibling, this directory) — Linear docs / changelog anatomy detail; the source of the token-parity argument, the two-step ink move, the folded ledger, dates-in-URLs.
- **`/Users/james/Documents/Advizr Antigrav/advizr-admin-p5/docs/design/linear-spec.md`** — house exemplar; §2.1 shell + 244px sidebar [VERIFIED shipped CSS], §4.3 cmdk palette anatomy, §5 motion canon.
- **Deep-dive report** (synthesized Linear/Notion research, 12 agents) — §4 adopt / §5 reject / §6 patch-notes skeleton; primary extractions from static.linear.app CSS bundles (Providers, TableOfContents, ChangelogList, KBD, Prose), notion.com shipped CSS, linear.app/now essays ("How we redesigned the Linear UI", "Startups, write changelogs"), Notion NDS override layer, docs.stripe.com / vercel.com/design.md / Mintlify llms.txt practice.
- **Live verification for this ruling (2026-07-16):** `TableOfContents.DujvFjqV.css` (needle transition + reduced-motion gate), `DocsOverviewArticle.DnxnLuLk.css` (TOC `display:none` @1024px), `Header.*.css` (mobile menu @768px), notion.com `e413e7cb4e1f3453.css` (`release_release__p2Jug` grid + sticky meta gated at `min-width: 840px`); WCAG ratios computed from the template HSL anchors (script method in §3).
