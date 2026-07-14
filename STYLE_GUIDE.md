# ТЕПЕ bite — Style Guide

Source of truth for public-facing UI. Read before any UI work (`CLAUDE.md`).
Feeling: local, premium, warm, human — "Барчето на Пловдив". Warm cream canvas,
plum + caramel, sky-blue = transparency/Impact signal, serif display + clean sans,
soft rounded glowing geometry, recurring Plovdiv-hills mark.

## Authoring

- Tokens = CSS vars in `globals.css` `:root`. Reference them (`var(--plum)`), never
  duplicate a token as a literal. Colours are **OKLCH**, stay in existing hue families.
- Reusable primitives = utility classes in `globals.css` (`heading-*`, `label-tag`,
  `btn*`, `card`, `card-hover`, `section-inner/-spacing/-divider`, `impact-chip`,
  `nutr-table`, `progress-track/-fill`, `hero-blob`). Reuse first.
- Everything else = inline `style={{}}` referencing tokens (dominant pattern).
- Tailwind only for layout helpers/responsive tweaks (`flex`, `grid`, `max-lg:grow`,
  `text-[clamp()]`, `whitespace-nowrap`).
- Responsive: component-scoped `<style>{`@media`}` block at end of component for grid
  collapses. Prefer `clamp()` for type/padding/image over hard breakpoints.

## Colour tokens (OKLCH)

Surfaces: `--bg 96.5% .022 82` (page, warm off-white) · `--surface 99% .01 78`
(cards/light sections) · `--surface2 95.5% .026 80` (recessed fills) ·
`--border 90% .02 80`. Sections alternate `--surface` ↔ `--bg`.

Plum (primary — headings, primary btn, footer, dark panels): `--plum 32% .09 315` ·
`--plum-mid 48% .09 315` · `--plum-lt 88% .04 315` (tints/chips).

Caramel (accent — `label-tag`, dividers, active-nav underline, key numbers, links):
`--caramel 66% .16 52` · `--caramel-lt 93% .06 70` (callout panels/badges).

Sky (**only** transparency/Impact-fund meaning): `--sky 74% .1 230` ·
`--sky-mid 58% .12 235` (btn) · `--sky-dk 46% .11 240` (text) · `--sky-lt 95% .035 230`.

Espresso (deep salted-caramel neutral, reserved): `--espresso 31% .045 55` `-mid 44%` `-lt 90%`.

Text: `--text 18% .04 315` · `--text-mid 42% .05 310` (default `p`) · `--text-soft 62% .04 295` (muted).

Shadows: `--shadow 0 2px 16px oklch(20% .04 310 /.08)` · `--shadow-lg 0 8px 40px …/.12`.
Product photos use plum drop-shadow `drop-shadow(0 24px 56px oklch(32% .09 315 /.28))`.

Status/finance semantics (`impactUi.tsx`, `PhaseBreakdown.tsx`) — keep these hues out of decorative use:
| meaning | fill | accent |
|---|---|---|
| planned | `--sky-lt` | `--sky-dk` |
| in_progress | `--caramel-lt` | `oklch(42% .12 52)` |
| done / available-funds | `oklch(93% .04 150)` | `oklch(34% .1 150)` / `oklch(52% .13 150)` (green) |
| frozen | `oklch(93% .035 235)` | `oklch(40% .09 240)` |
| arranged-funds | — | `--caramel` |

## Typography

Fonts: `--font-head` = Playfair Display (serif, incl. Cyrillic; 400/600/700/900),
`--font-body` = DM Sans. Body 16px/1.65, `p` 1.72 + `--text-mid`. All headings serif.

| class | clamp | wt | colour | notes |
|---|---|---|---|---|
| `heading-xl` | 2→3.2rem | 900 | plum | H1; `-0.02em`, balance. On dark: override white |
| `heading-lg` | 1.75→2.8rem | 600 | plum | section H2 |
| `heading-md` | 1.25→1.7rem | 600 | plum | H3 / big-stat labels |
| `label-tag` | 0.72rem | 600 | caramel | eyebrow; `.12em` uppercase; recolour to theme section |

Big numeric display (totals, kcal, macros): `--font-head` 700–800, plum/caramel, tight.
Hero headlines pin per-line sizing via `text-[clamp()]!` + `whitespace-nowrap`, sized
differently BG vs EN — preserve when editing copy. Flavour name = italic caramel.

## Spacing & shape

Radii: `--r-sm 12` (callouts/tooltips) · `--r-md 20` (tiles) · `--r-lg 32` (**cards**,
strips, hero panels, CTAs) · `--r-xl 48` (product stage) · `100px` pill (btn/chip/badge).

`.section-inner` max 1180 centred · `.section-spacing` `clamp(64,8vw,120) clamp(20,5vw,80)`
(→ `60 20` below 1120) · `.section-divider` 56×3 caramel pill · gutters `clamp(20,5vw,80)`.
Card grids `repeat(auto-fill, minmax(300px,1fr))` gap 24.

## Buttons

`.btn`: pill, `14px 28px`, 0.95rem/600, gap 8, hover `translateY(-1px)` + coloured shadow.
`btn-primary` plum · `btn-caramel` caramel (warm conversion / on dark) · `btn-secondary`
2px plum outline (hover fills `--plum-lt`) · `btn-sky` (impact context) · `btn-ghost`
white+shadow (on busy bg). Text links: caramel/plum 600, no underline, trailing `→`;
external → `↗` + `rel="noopener noreferrer"`.

## Cards

`.card` = `--surface` + `--r-lg` + `--shadow` + `1px --border`. `.card-hover` adds
`-4px` + `--shadow-lg` (clickable cards). Top accent = 3–4px bar via `borderTop` or
`box-shadow: inset 0 4px 0 <c>` (follows radius). Left accent = 3–4px caramel `borderLeft`
on `--caramel-lt` (ingredients/notes). "Coming soon" = dashed border on plum→caramel gradient.

## Signature motifs (reuse, don't reinvent)

- **Impact pledge** (`ImpactPledge` + `PledgeHeart`): fixed **0.15 €**/bar → "ТЕПЕ bite
  Impact". Amount lives once: `PLEDGE_EUR = 0.15`. Never hardcode/vary it. Variants:
  `chip` (hero/footer), `tag` (near price, sky), `total` (cart ×count).
- **Section header stack**: `section-divider` → `label-tag` → `heading-lg` → intro `p`.
  Centred on marketing, left on data (`SectionHeader`).
- **Hill silhouette**: reuse the same SVG path
  `M0 200 L0 140 Q150 60 300 100 Q450 140 600 80 Q750 20 900 70 Q1050 120 1200 60 L1200 200 Z`
  at opacity ~0.06 along a section bottom.
- **Hero blobs** (`.hero-blob`): large `blur(80px)` circles opacity ~.35 in plum/sky/caramel;
  radial glow + faint desaturated logo watermark behind product photo.
- **Badges** (`impactUi.tsx`): uppercase pills 0.68rem/700 `.06em`. `in_progress` has
  pulsing dot (`animate-pulse-dot`). Category = plum on `--plum-lt`. Star = caramel + `IconStar`.
- **Progress**: `.progress-track` (8px `--border`) + `.progress-fill` (caramel). Timeline
  circles: caramel=done, plum=current, outlined=upcoming.
- **Phase visuals** (`PhaseBreakdown`/`PhaseBarMini`/`FundingSplitBar`): green=available,
  caramel=arranged, sky=planned. Must read honestly — never blur the three.
- **Nutrition** (`.nutr-table`): row dividers, right-aligned bold plum values, indented
  italic sub-rows, highlighted key macros.
- **Nav**: fixed 72px; transparent over hero → frosted `oklch(99% .008 75 /.96)` + `blur(16px)`
  once scrolled/on data+legal pages; active link plum 700 + caramel underline; pill BG/EN
  switcher; hamburger < 1120px.
- **Footer**: plum bg, tinted text, 4→2→1 col; carries pledge chip + manufacturer credit + socials.

## Icons

`src/components/icons/index.tsx`. `viewBox 0 0 24 24`, size 16–20, `fill:none`,
`stroke:currentColor`, width 2 (2.5 small arrows), round caps/joins. Colour via parent
`currentColor`. Filled only for emblems (`IconStar`, `PledgeHeart`). New icons match this.
Emoji OK in playful product/ingredient cards only, not core controls.

## Imagery

`next/image`, assets in `public/`. Product bar: `animate-float`, slight rotate, plum
drop-shadow over radial glow. Photo strips / covers: overlay plum scrim for white-text
legibility (darker top+bottom, lighter middle); mobile often bleeds edge-to-edge (neg
margins, radius removed). No cover → plum→caramel gradient + hill SVG placeholder.

## Motion

`transition all .2–.3s ease`. Keyframes: `pulse-dot`, `float-bar`. Page transitions =
View Transitions `.page-switch` fade/scale (0.2s), header pinned. Reduced-motion already
zeroed — keep new motion behind that guard.

## Bilingual (BG primary / EN)

`langAtom` (Jotai, `store/lang.ts`), cookie-persisted, SSR-hydrated. `useAtomValue(langAtom)`;
`pick(lang, bg, en)` for data. Every public string needs natural EN (not MT). BG runs longer
— test both, nothing may break. Wordmark always **"ТЕПЕ bite"** (Cyrillic + Latin), fund
**"ТЕПЕ bite Impact"**, even in EN.

## Breakpoints

Verify 390 / 768 / 1440. Component `<style>` collapses:
| ≤ | change |
|---|---|
| 1350/1120/1100 | strips step 6→3, 5→3, 4→2; nav→hamburger; `section-spacing` shrinks (@1120) |
| 1000/970/900 | 2-col heroes/grids → 1 col; image above copy (`order:-1`) |
| 760/768 | detail grids 1-col; hero funds panel below; strips bleed; footer 4→2 |
| 640/650 | dense grids → 2; pledge chip centres |
| 540/480/420 | remaining grids/footer → 1 col |

## Integrity

Never invent product facts, nutrition/health claims, prices, donations, partners,
approvals, or initiative progress — verify or ask. Pledge is fixed 0.15 €; don't imply
variable/different. Fund phases (available/arranged/planned) stay visually distinct.
