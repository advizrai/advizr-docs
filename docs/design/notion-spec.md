# Notion-Grade Documentation & Release Surfaces — Authoritative Design-Spec Briefing

**Audience:** engineers rebuilding docs.advizr.ca (help center + public patch-notes) in the Instrument Grade / Paper & Signal doctrine, with **original assets** (no copied illustrations, fonts we license, our own glyph set).
**Method note:** sources are Notion's live shipped CSS bundles (notion.com/_next/static/css/*, mintcdn assets) fetched July 2026, first-party pages (notion.com/help, /releases, developers.notion.com — several re-fetched live for this briefing), and third-party teardowns. Values are tagged **[VERIFIED]** (shipped CSS or first-party page) or **[EST]** (screenshot/triangulation). §5 closes the mobile gap with a live Playwright pass at 390×844, iPhone UA, July 2026 — those observations are tagged **[VERIFIED mobile 390px]**. Contradictions are resolved inline in `⚖ CONFLICT` blocks.

---

## 1) The Notion Feel — what actually produces it (ranked by impact)

1. **Product-mirroring block vocabulary.** The docs feel like Notion because they reuse the product's own blocks — callouts, toggles, emoji, lightbox screenshots — and its exact palette, so the chrome around every screenshot matches the screenshot. This is the Notion equivalent of Linear shipping its token sheet into its docs: parity with the product is the identity.
2. **Warm, never cold.** Every gray carries a brown undertone: ramp #f9f9f8 → #f6f5f4 → #dfdcd9 → #a39e98 → #615d59 → #191918 on white [VERIFIED shipped CSS]. Interaction states are alpha tints of the ink (#37352f0a hover) rather than new grays [VERIFIED]. Nothing blue-gray anywhere.
3. **One committed light world.** Help and marketing bundles ship **zero** `prefers-color-scheme: dark` rules [VERIFIED shipped CSS] — a single warm-light world, no toggle, no half-committed dark variant. Only the developer docs carry a dark mode (§3.4).
4. **Hover-only depth.** Resting state is flat: 1px hairlines, no shadows. Depth exists solely as a hover event — a four-layer soft shadow that arrives over .2s and leaves with the cursor (§3.3) [VERIFIED].
5. **Benefit-led editorial voice.** Second person, outcome first, feature second: "Your agent just got new calendar tools"; "Your ideas don't wait for the perfect moment." [VERIFIED first-party, /releases fetched 2026-07]. No fix inventories, no version bureaucracy on the consumer surface.
6. **Craft-as-correctness doctrine.** Ivan Zhao's operating belief: visual harmony is treated as *correctness*, not preference — a misaligned margin is a bug, not a taste dispute [VERIFIED first-party interviews/teardown corpus]. This is why the surfaces stay coherent across a help center, a marketing releases page, and a third-party docs platform.
7. **Annotated-override discipline.** The developer docs are Mintlify re-skinned by an "NDS" override layer where **every deviation from the platform default is documented with a reason**: "Mintlify uses border-gray-100 (cool) — swap to NDS warm-brown tokens"; "Drop the text-shadow fake-bold and use the real 600 cut"; "rounded-xl reads too soft at this size" [VERIFIED, override layer teardown]. The doctrine survives because deviations are written down, not remembered.
8. **Generosity as hierarchy.** Where Linear de-emphasizes to earn density, Notion spends space: 804px measure, 128px entry gaps, 60px feedback padding [VERIFIED §3.4]. Air does the work that heavier weights or tint blocks would otherwise do — the trick that matters most for a two-weight face like Geist.

---

## 2) Docs IA & Layout Spec

### 2.1 Help-center shell
- Sticky **280px** left sidebar (`flex: 0 0 280px`), 1px hairline border-right, ~13 collapsible product-area categories [VERIFIED shipped CSS].
- Article region: **804px** content column beside a sticky right TOC (§2.2).
- Home page: hero title stepping **42→54px** [VERIFIED], a **56px-tall full-pill search field** (200px radius, §3.3) [VERIFIED], quick-link chips, then six topic cards on #f6f5f4 tiles aligned with CSS subgrid (`grid-row: span 3`) so headings/blurbs/icons rule up across cards [VERIFIED].

⚖ **CONFLICT — help column width:** one extraction reports an **804px content column**; another describes a **12-column article grid** with prose in columns 1–7, TOC in 10–12, and columns 8–9 empty. Both come from the same shipped bundles and **compose rather than contradict**: the 12-col grid is the article page's layout mechanism (placement), and 804px is the max-width cap on the content region (measure) — at common desktop widths columns 1–7 render ≈ the 804px cap. **Adopt: 12-col placement grid + an explicit ~640–804px prose measure cap**; never let span math alone set the measure.

### 2.2 TOC — the active tick on a hairline
- Plain link list set against a **1px hairline left rule**; the active item overlays a **2px link-blue left border at `margin-inline-start: -1px`** [VERIFIED shipped CSS] — a tick riding a drawn line, not a highlighted pill. 13px text [EST].
- Sticky in grid columns 10–12; labeled by an eyebrow ("IN THIS HELP DOC") [VERIFIED first-party + confirmed live].
- This is already dimension-line vocabulary — it transfers to Instrument Grade almost unmodified (§6).

### 2.3 Article anatomy (top → bottom)
1. **Breadcrumbs**, "›" separators [VERIFIED first-party].
2. **H1 26px bold** [VERIFIED] → **20px standfirst** [VERIFIED]. Standfirsts routinely close with an inline emoji (🗃 on the databases intro, live at 390px too [VERIFIED mobile 390px]) — a product-mirroring flourish, rejected for Advizr (§6).
3. **Hero media** in a 6px-radius hairline frame [VERIFIED]; screenshots open in a lightbox.
4. **15px/1.6 numbered steps** with inline lightbox screenshots [VERIFIED].
5. **Tinted callout triads** — gray/blue/orange/purple background+text+border sets [VERIFIED] (rejected for Advizr, §6).
6. **Feedback block:** 11px uppercase "GIVE FEEDBACK" eyebrow → centered "Was this resource helpful?" → 👍 👎 emoji buttons at 48px [VERIFIED] separated by a **drawn vertical hairline divider** [VERIFIED, confirmed live at 390px]; 60px block padding [VERIFIED].
7. **"Up next"** — exactly one continuation card (label + title + excerpt + "Read more →" outline button), never a related-articles grid [VERIFIED first-party].

### 2.4 Search & wayfinding
- **Help:** search is the hero — the 56px full-pill field on home [VERIFIED], repeated full-width above article titles at narrow widths [VERIFIED mobile 390px]. Quick-link chips under the hero field (Billing / Data sources / Restoring content / Adding members) act as zero-typing entry points [VERIFIED first-party].
- **Dev docs:** a header "Search" chip with a ⌘K hint opening a palette dialog (Trieve-backed) [VERIFIED first-party]; collapses to a 32px icon at phone width [VERIFIED mobile 390px].
- **Breadcrumbs** are the only upward wayfinding inside articles; there is **no prev/next pagination** on help articles — "Up next" (one forward link) is the whole continuation model [VERIFIED first-party].
- Palette internals (row heights, grouping, empty state) were not extractable from shipped CSS — flagged in Known-unverified. Spec Advizr's from the Linear briefing's cmdk values (`docs/design/linear-spec.md` §4.3); do not invent Notion numbers.

### 2.5 Developer docs (Mintlify + NDS overrides)
- **56px navbar** [VERIFIED, re-confirmed live: 32px controls at y=12] with logo, search chip, ask-AI, theme controls.
- **Surface tabs** under the navbar: Guides / API Reference / CLI / Workers / Admin API / Changelog / Examples — underline active state, no pills [VERIFIED first-party].
- **288px** left sidebar [VERIFIED shipped CSS]; content column + **sticky code column** with status-code tabs (200/400/401…) on reference pages [VERIFIED].
- **"Copy page" split button** on every H1 (copy as markdown + open-in-AI actions) [VERIFIED, still present at 390px]; **⌘I ask-AI** affordance; published **llms.txt** index [VERIFIED].
- Everything above is default-Mintlify *except* where the NDS layer overrides it with a written reason (§1.7) — the platform supplies structure, the override layer supplies identity.

### 2.6 Quick reference — component dimensions (one-glance lookup)

| Component | Value | Tag |
|---|---|---|
| Help sidebar | 280px sticky, 1px hairline border-right | [VERIFIED] |
| Dev sidebar | 288px | [VERIFIED] |
| Content column | 804px cap; 12-col grid, prose 1–7, TOC 10–12 | [VERIFIED, §2.1 conflict] |
| TOC rail | 1px hairline rule; 2px active tick at `margin-inline-start:-1px` | [VERIFIED] |
| Article H1 / standfirst | 26px bold / 20px | [VERIFIED] |
| Body | 15px/1.6, −0.011em | [VERIFIED] |
| Hero search (help home) | 56px tall, 200px-radius pill | [VERIFIED] |
| Dev navbar | 56px; +56px mobile breadcrumb bar | [VERIFIED / VERIFIED mobile 390px] |
| Feedback buttons | 48px, emoji, hairline divider between; 60px block padding | [VERIFIED] |
| Topic tiles | #f6f5f4, 16px radius, 24px padding, subgrid-aligned | [VERIFIED] |
| Release entry gap / opener | 8rem (128px) / 1px top hairline | [VERIFIED] |
| Release grid | `minmax(0,1fr) / minmax(0,2fr)`; date sticky `top: calc(header + 1.75rem)` | [VERIFIED] |

---

## 3) Visual Language Spec

### 3.1 Color
- **Ink:** #37352f — the classic app ink — on the dev docs; #191918 terminal step on help/marketing [VERIFIED].
- **Warm gray ramp:** #f9f9f8 / #f6f5f4 / #dfdcd9 / #a39e98 / #615d59 / #191918 [VERIFIED].
- **Hairlines:** universal `rgb(0 0 0 / 8%)`; dev docs solid #e6e5e3 [VERIFIED].
- **Hover:** alpha ink tints (#37352f0a), never a new gray [VERIFIED].
- **Accent rationing:** one blue, **#0075de**, reserved for CTAs, method badges, the Try-it button, and the TOC active tick. **Body links deliberately drop it** — ink text with a soft gray underline [VERIFIED shipped CSS]. Restraint with the accent *is* the accent.

⚖ **CONFLICT — accent monogamy:** the corpus says "one accent — Notion blue #0075de," but the live 390px pass shows the help article's "Up next" label rendered in a warm red [VERIFIED mobile 390px], ≈ Notion brand red #eb5757 [EST]. **Resolution:** blue monogamy holds for *chrome* (controls, active states, CTAs); editorial labels admit a second brand-red family on content surfaces. For Advizr both roles collapse into the single `--signal` token — adopt the rationing rule, not the two-accent exception.

### 3.2 Typography
- **NotionInter** — a custom-cut Inter — in Regular/Medium/SemiBold/Bold across help and dev docs [VERIFIED @font-face in shipped CSS].
- **Body: 15px/1.6, letter-spacing −0.011em** [VERIFIED]. Scale: 12/14/15/16/18/20/22/26/32/42/54/64px [VERIFIED]. Article H1 26px bold; help hero 42→54px [VERIFIED].
- **iA Writer Mono** for code [VERIFIED]. **Lyon Text** (serif) is loaded with a full scale but shows zero uses outside marketing/releases display titles [VERIFIED shipped CSS].

⚖ **CONFLICT — font naming:** third-party articles say Notion "uses Inter"; the shipped bundles declare `NotionInter`; older teardowns cite Lyon Text as a docs face. **Shipped CSS wins:** NotionInter (licensed custom Inter cut) is the working face; "Inter" is the civilian approximation; Lyon is display-only inventory, loaded-but-unused in docs. Lesson for Advizr: one committed text face (Geist), no dormant serif payload.

### 3.3 Shape & depth
- **Radii inventory:** 4px chips / 5–6px callouts + buttons / 8px inputs / 12px tiles / 16px cards / **200px search pill** [VERIFIED]. Roundness is a core Notion signal — and the axis on which Advizr diverges completely (§6).
- **Resting = flat.** Hairlines only. **Hover = a four-layer soft shadow** ending `0 4px 18px rgb(0 0 0 / 4%)`, transitioned over .2s [VERIFIED]. Depth is an event, not a state.
- **Dark mode exists only on the dev docs:** background **#0f0f0f**, accents forced to neutral white, and the card hover shadows are **removed** — annotated as reading "muddy" on dark — replaced by border-brightening [VERIFIED NDS layer]. Their own dark mode concedes the Advizr rule: on dark surfaces, hairlines beat shadows.

### 3.4 Density & motion
- Generous: 804px column, 24px card padding, 60px feedback padding, 128px between release entries [VERIFIED].
- Motion is minimal and stateful: 100–200ms transitions on color/border/shadow only [VERIFIED]; nothing ambient, nothing on scroll.

### 3.5 Adoptable token mapping (Notion evidence → Advizr docs tokens)
Every Notion value below is the *evidence*; the Advizr column is what ships. Deviations carry their reason inline — the §1.7 discipline applied to ourselves.

```css
:root { /* paper (light) world — docs.advizr.ca default */
  --paper:        #FAF8F5;  /* Notion #f9f9f8 [VERIFIED] — ours, warmer, already locked */
  --paper-2:      #F4F1EC;  /* card/tile step; Notion #f6f5f4 [VERIFIED] */
  --ink:          #14130F;  /* Notion #37352f / #191918 [VERIFIED]; ours is darker for AA headroom */
  --ink-2:        color-mix(in oklab, var(--ink) 72%, var(--paper));  /* body one step down; verify ≥4.5:1 at 15px in CI */
  --hairline:     #E2DDD3;  /* Notion #e6e5e3 solid / rgb(0 0 0/8%) alpha [VERIFIED] */
  --signal:       var(--advizr-signal);  /* coral; does BOTH Notion jobs — chrome blue #0075de + editorial red (§3.1 conflict) */
  --hover-wash:   rgb(20 19 15 / 0.04);  /* Notion #37352f0a [VERIFIED] — alpha ink, never a new gray */
}
.band { /* dark strips: hero, dark-UI screenshots, patch-notes header */
  --paper: #0F0E0C;  /* Notion dev-dark #0f0f0f [VERIFIED]; shadows deleted there as "muddy" [VERIFIED NDS] — hairlines only */
  --hairline: rgb(250 248 245 / 0.12);
}
/* type — Geist replaces NotionInter; keep their metrics where they earn it */
--text-body: 15px/1.6;          /* [VERIFIED] adopt verbatim */
--tracking-body: -0.011em;      /* [VERIFIED] adopt verbatim */
--text-h1: 26px;                /* [VERIFIED] adopt; weight 500 not bold (Geist 400/500 only) */
--radius-structure: 0;          /* rejects Notion 4–16px inventory [VERIFIED] */
--radius-control: 2px;          /* doctrine cap */
--transition-state: 150ms;      /* inside Notion's 100–200ms band [VERIFIED] */
```

---

## 4) Releases-Page Anatomy (exhaustive)

### 4.1 /releases — "What's New" (consumer pole)
- **Hero:** illustration, "What's New" title, deck, and the subscribe affordance (below) [VERIFIED first-party, fetched 2026-07].
- **Entry grid:** `minmax(0,1fr) / minmax(0,2fr)` [VERIFIED shipped CSS] — a left meta rail beside a content column.
- **Sticky date rail:** `<time>` in muted gray, pinned at `top: calc(header + 1.75rem)` so the date tracks you down long entries [VERIFIED]. An **outline badge chip ("3.6")** appears on numbered releases only [VERIFIED, confirmed live fetch].
- **Entry openers:** 1px hairline top border; entries separated by **8rem (128px)** [VERIFIED].
- **Two entry sizes** [VERIFIED first-party, live fetch 2026-07]:
  - *Minor drops* ~60–250 words: paragraph, 16:9 video, "Try asking" bullets, one arrow CTA, availability stated in prose.
  - *Numbered releases* ~1,200–1,400 words: ~7 H3 sections, closing **"And a few more…"** bullet list.
- **Permalinks:** H2 titles link to **date-slug pages** — `/releases/2026-07-16` [VERIFIED live fetch]. Full bodies render inline on the index; pagination via `/releases/page/2`.
- **Tone:** second-person, benefit-led ("Your agent just got new calendar tools") [VERIFIED]. No authors, no tags, no filters, no anchors, no reactions.
- **Cadence:** irregular but dense — the live index shows entries on July 16, 9, 8, and 1 [VERIFIED live fetch 2026-07]. Unlike Linear's fixed Thursday slot, Notion posts when things ship; the page still reads alive because gaps never exceed ~2 weeks. The trust signal is recency, not rhythm.
- **The weak plumbing — flagged anti-pattern:** RSS exists at `/releases/rss.xml` but is **hidden and titles-only**; the visible subscribe affordance is **"Follow @NotionHQ ↗"** [VERIFIED live fetch]. A social follow is not a feed. Advizr ships the opposite: visible, full-content RSS 2.0 + JSON Feed (Linear ships its complete archive; that is the standard to meet).

### 4.2 developers.notion.com/page/changelog (engineering pole)
- Built from Mintlify **`<Update>` components**, `label="July 15, 2026"` per entry [VERIFIED live fetch].
- **Date chips deliberately demoted** to quiet timestamps: #f7f6f3 background, #5f5e59 text [VERIFIED shipped CSS].
- Multiple H3 feature headlines per date, inline code chips; **no media, no tags, no feed** [VERIFIED live fetch].
- The right TOC becomes a **pure date index** [VERIFIED shipped CSS].

⚖ **CONFLICT — dev-changelog TOC:** the shipped-CSS extraction shows the right TOC as a date index, while a live fetch of the page surfaces no TOC at all. **Resolution:** both true at different widths — the TOC is desktop-only and its "On this page" control computes `display:none` at 390px [VERIFIED mobile 390px]; fetch pipelines also strip the aside. Spec the date-index TOC as a ≥lg feature.

The two poles are the finding: same company, one changelog optimized for persuasion (media, air, benefit copy, weak plumbing), one for record-keeping (dates, density, zero media). Advizr's patch-notes page must be **one surface doing both**: benefit-led entry bodies on Linear-grade plumbing.

### 4.3 Adopt: the Advizr patch-notes fusion (concrete)
- **Page:** single stream on paper #FAF8F5, ~1024px page [EST, field convention], ~640px content measure. Entry opener = 1px #E2DDD3 top hairline (their 1px opener [VERIFIED]); inter-entry gap 96–128px (their 8rem [VERIFIED], tightened to taste).
- **Grid:** `minmax(0,1fr) / minmax(0,2fr)` verbatim [VERIFIED] — left meta rail, right content. Collapses to one column below ~1024px per §5.2 evidence.
- **Rail:** date in Geist Mono tabular figures, sticky at `top: calc(var(--header-h) + 1.75rem)` [VERIFIED offset, adopted verbatim] on desktop, static stacked label on mobile [VERIFIED mobile 390px]. Identity chip = square hairline-bordered **REL-####** in Geist Mono, replacing their "3.6" outline pill [VERIFIED].
- **Body:** H2 title (Geist 500, links to `/patch-notes/2026-07-16-<kebab>` — their date-slug scheme [VERIFIED]) → FIG-framed media (0 radius, corner ticks, mono caption; `.band`-scoped when the screenshot is dark UI) → 1–3 benefit-led paragraphs in their tone [VERIFIED] → "Learn more in the docs" link.
- **The folded ledger** (what Notion's consumer page lacks and its dev page proves): collapsed-by-default Fixes / Improvements sections, rows = square glyph + mono area label (PORTAL / ADMIN / EMAIL) + one plain sentence. Collapsed-by-default is also the mobile-correct state (§5.4).
- **Plumbing:** visible full-content RSS 2.0 + JSON Feed, llms.txt inclusion, hover-reveal anchors, generated per-entry OG images, ten entries per index page + one "Older updates" link. Every item Notion's /releases hides or omits [VERIFIED], shipped in the open.
- **Cadence:** fixed weekly or biweekly slots — take Linear's rhythm over Notion's recency model (§4.1); for retainer clients the page is the execution heartbeat, and a fixed slot makes silence visible.

---

## 5) Mobile & Responsive Behavior [VERIFIED mobile 390px]

Live Playwright pass, 390×844 iPhone viewport, July 2026. `document.scrollWidth` = 390 on every surface tested — **zero horizontal overflow anywhere**. Computed-style probe summary:

| Surface | Sidebar | TOC | Content col | Gutters | Date rail |
|---|---|---|---|---|---|
| /help home | removed → global hamburger 44×44 | — | full width | 24px | — |
| /help article | removed (see 5.1) | dropped; eyebrow survives inline | 342px | 24px | — |
| /releases | — | — | 358px, grid → 1 track | 16px | `position: static` (sticky lost) |
| developers.notion.com | 288px → drawer via breadcrumb bar | `display:none` | 350px | 20px | — |

### 5.1 Help center
- **Sidebar collapse:** the 280px docs sidebar is **removed entirely**, not drawered. The only menu is the global marketing hamburger (44×44 target, top-right) which opens a **full-screen takeover** — main content computes to width 0 — whose contents are pure *marketing* nav: three tinted product tiles (Capture / Find / Automate), Solutions/Resources/Developers/Enterprise/Pricing rows, and full-width Download app / Log in buttons, **with no docs categories anywhere in it**. Docs wayfinding at phone width is a single **"← Databases" parent back-link** (breadcrumbs collapse to one level) plus a full-width search pill injected under it. Flagged anti-pattern: search becomes the only real nav. Advizr's drawer must carry the docs tree.
- **TOC placement:** the right-rail TOC disappears; the "IN THIS HELP DOC" eyebrow survives inline above the standfirst, with no floating TOC affordance.
- **Column:** 342px content = 390 − 2×24px gutters. Lightbox screenshots scale to full column width (342px).
- **Feedback + Up next survive intact:** centered heading, two bordered emoji buttons with the vertical hairline divider between them; "Up next" label (warm red), title, excerpt, "Read more →" outline button.

### 5.2 /releases
- The `1fr/2fr` grid **collapses to a single column** (computed `grid-template-columns: 358px`, one track) at 16px gutters.
- **Dates lose stickiness:** the `<time>` parent computes `position: static` — the date becomes a plain label stacked above each H2 and scrolls away. The sticky rail is a ≥desktop behavior; spec it behind a breakpoint, don't fight for it on phones.
- Hero illustration centers above the title; entry media runs full column width; pagination renders as a plain nav at page bottom.

### 5.3 Developer docs
- **Two stacked 56px bars:** the navbar (logo, search collapsed to a 32px icon, ask-AI, overflow kebab) plus a second 56px bar of hamburger + breadcrumb ("Get started › Overview") that opens the 288px sidebar as a drawer. Combined top offset before content: 144px including breathing room (computed main padding-top).
- **TOC has no mobile presence:** the "On this page" control computes `display:none` at 390px.
- **Copy-page split button is retained** on phones; the ask-AI affordance becomes a **bottom-docked "Ask a question…" pill** with a round submit button.
- Content gutters 20px; media `max-width: 100%`.

### 5.4 Adopt for Advizr mobile
1. **One breakpoint band, ~1024px [EST].** Notion's endpoints were probed at 390px and desktop only; don't invent intermediate states — collapse everything at one threshold and let the grid handle the range between.
2. **Sidebar → drawer containing the docs tree** — fixing §5.1's anti-pattern. The drawer trigger is a hamburger + current-location breadcrumb bar, 56px tall, directly under the header (the dev-docs pattern [VERIFIED mobile 390px], which is correct; the help-center takeover is not).
3. **TOC → collapsed `<details>` ledger under the H1**, labeled with the same eyebrow the desktop rail uses — Notion keeps the eyebrow and drops the links [VERIFIED mobile 390px]; we keep both, folded.
4. **Releases date rail → static stacked date label** above each entry title (exactly what Notion does [VERIFIED mobile 390px]); the REL-#### chip sits inline beside it.
5. **Media:** all FIG frames `max-width: 100%`, full column width; gutters 16–24px (Notion ships 16/20/24 across its three surfaces [VERIFIED mobile 390px]).
6. **Tap targets ≥44px** — Notion's hamburger is exactly 44×44 [VERIFIED mobile 390px].
7. **Ledgers stay folded at all widths.** The collapsed Fixes/Improvements sections (§4.3) are already the mobile-correct pattern; no width-conditional behavior needed.
8. **Zero horizontal overflow is the acceptance test:** `document.scrollWidth === innerWidth` at 390px on every page, in CI via the same Playwright harness used for this briefing.

---

## 6) Deliberate Deviations for Advizr

Notion validates Advizr's **climate** almost token-for-token — #37352f ≈ ink #14130F, #e6e5e3 ≈ hairline #E2DDD3, #0f0f0f ≈ band #0F0E0C, the warm ramp ≈ paper #FAF8F5. What it does not supply is the **schematic structure**: that stays Instrument Grade (dark-first band world with paper light mode, coral `--signal`, Geist 400/500 + Geist Mono, zero-radius structure / 2px controls, hairlines never shadows).

**Transfers (adopt as-is):**
1. **Warm-palette conviction.** Their shipped values are near-isomorphic to ours — treat this as external confirmation that a warm neutral system reads premium, and never let a cool gray in.
2. **Sticky date rail** on the patch-notes page (desktop only, per §5.2), date in Geist Mono tabular figures.
3. **Annotated-override discipline** (§1.7): every deviation from a default — Tailwind, shadcn, Mintlify, anything — gets a written reason in the token file. Pair with the existing CI bans.
4. **Editorial voice** for release entries: second person, benefit first, ~250-word minor drops, long numbered releases with a closing "And a few more…" ledger.
5. **One committed world per surface** (§1.3): no half-dark modes. Ours inverts theirs — band-dark first, paper light — but the commitment logic is identical.
6. **TOC as active-tick-on-hairline** (§2.2): 1px #E2DDD3 rule, 2px `--signal` tick at `margin-inline-start: -1px`, zero radius. Already dimension-line grammar.
7. **Feedback block skeleton**: eyebrow + centered prompt + two controls split by a **drawn hairline divider** — keep the divider, it is the best detail in the component.
8. **LLM plumbing** from the dev docs: Copy-page-as-markdown split button, llms.txt, per-block copy.
9. **Subgrid-aligned card ledgers** (§2.1): topic cards sharing row tracks so headings, blurbs, and glyphs rule up across the set — engineering rigor Notion applies even to soft tiles [VERIFIED]. On zero-radius Advizr cards the alignment reads as a drafting table.
10. **Lightbox on every dense screenshot** [VERIFIED first-party]: portal screenshots are unreadable at a 640px measure without it; Notion proves it survives to 390px unchanged.

**Contrast obligations (closing a gap the corpus never checked):** Notion's ink values were never contrast-audited in the research. Before shipping the two-step ink hierarchy, CI must verify: `--ink-2` ≥ 4.5:1 on #FAF8F5 *and* #F4F1EC at 15px; the 2px `--signal` TOC tick ≥ 3:1 against paper (non-text); band-mode equivalents re-checked separately. If the derived `--ink-2` fails, darken it — never shrink the step by lightening `--ink`. All motion (TOC needle, hover states, drawer) behind `prefers-reduced-motion`.

**Schematic substitutes (reject the skin, keep the job):**

| Notion pattern | Instrument Grade substitute |
|---|---|
| Radii 4–16px + 200px search pill [VERIFIED] | 0px structure, 2px controls; square hairline search field |
| Hover 4-layer shadow (§3.3) | Hairline-weight shift + one background step, same .2s/hover-only timing; their own dark mode already concedes this (§3.3) |
| 👍 👎 emoji feedback buttons | Square glyphs (▲/▽ or ✓/✕ from the house set), hairline-bordered, divider kept |
| "3.6" outline version badge → pill | Square Geist Mono **REL-####** chip, hairline border |
| Tinted callout triads (gray/blue/orange/purple) | One neutral callout: paper-secondary bg, 1px #E2DDD3, 12px 16px padding; emphasis via a `--signal` rule only |
| Mascot illustrations, emoji-in-prose | FIG-frame schematics: 0-radius, corner ticks, mono figure captions |
| NotionInter weights + dormant Lyon serif | Geist 400/500 only; hierarchy from size, space, tracking, mono labels |
| "Follow @NotionHQ" as subscribe; hidden titles-only RSS | Visible full-content RSS 2.0 + JSON Feed link in the page header |
| Marketing hamburger takeover on docs (§5.1) | Docs-scoped drawer carrying the full docs tree + search |
| Blue #0075de + editorial red (§3.1 conflict) | Single `--signal` token for both roles, rationed exactly as they ration blue — body links stay ink |
| Rounded quick-link chips under hero search [VERIFIED] | Square hairline chips, Geist Mono labels — keep the zero-typing entry-point job |
| Emoji closing standfirsts, emoji callout icons | Nothing, or a house mono glyph; prose carries its own warmth |

---

## 7) Key Sources

**First-party (Notion):** notion.com/help · /help/intro-to-databases · /help/category/databases · /help/guides (+ design category) · notion.com/releases (**re-fetched live 2026-07 for this briefing**) · /releases/2026-07-16 · /releases/2026-07-01 · /releases/page/2 · /releases/rss.xml · developers.notion.com · /docs/getting-started · /reference/intro · /reference/post-search · developers.notion.com/page/changelog (**re-fetched live 2026-07**).
**Shipped CSS bundles (highest-fidelity numbers):** notion.com/_next/static/css/ — 503c33c034c09deb, 746c656b1bdd1967, a13c7d025df717a4, a7c5c8a97d62b5e1, aff630c1a4360f93, c1a047bc54de5ae3, dc358a1a21c8e760, f4e38bb5eb844a37 — plus mintcdn.com asset chunks for developers.notion.com (NDS override layer, `<Update>` components, Trieve search, llms.txt).
**Live mobile pass (this briefing):** Playwright/Chromium, 390×844 iPhone UA, July 2026 — computed-style probes + screenshots of /help, /help/intro-to-databases, /releases, developers.notion.com/docs/getting-started, including nav-open takeover states.
**Teardowns & context:** VoltAgent awesome-design-md Notion DESIGN.md · designyourway.net Notion font analysis · designerfounders.substack.com Ivan Zhao profile · Figma blog "Design on a deadline: how Notion pulled itself back from the brink" · Sequoia "The Refounder" podcast · NotionHQ on X.
**Comparative baseline:** the Linear briefing at `docs/design/linear-spec.md` (this repo) and its source corpus — the two specs are designed to be read together; §4's two-pole analysis and §6's substitutes assume Linear's plumbing standard as the floor.

---

**Known-unverified items (implement anyway, flagged):** exact TOC text size (13px [EST]); "Up next" red hex (≈#eb5757 [EST]); help sidebar collapse breakpoint between 390px and desktop (only the endpoints were probed — assume ~1024px [EST]); tablet-width (768px) intermediate states for the releases grid [EST]; search-palette internals (§2.4 — spec from the Linear briefing, not from Notion); breadcrumb truncation rules at intermediate widths (390px shows a single parent back-link [VERIFIED mobile 390px]; where the collapse happens is unprobed); 404 and footer anatomy (unexamined in the corpus — design from house doctrine, don't imitate).
