@AGENTS.md

# ТЕПЕ bite Website

## Overview

Single-page marketing website for **ТЕПЕ bite** — a salted caramel snack bar from Plovdiv, Bulgaria. Built with Next.js 15 App Router, React 19, TailwindCSS 4, and Jotai for state management.

## Tech Stack

- **Framework**: Next.js 15 (App Router, `src/` layout)
- **UI**: React 19
- **Styling**: TailwindCSS 4 with custom CSS variables in `src/app/globals.css`
- **State**: Jotai — language atom at `src/store/lang.ts`
- **Fonts**: Playfair Display (headings, with Cyrillic subset) + DM Sans (body), loaded via `next/font/google`
- **Images**: `next/image` with assets in `public/`

## Commands

```bash
npm run dev     # start dev server at http://localhost:3000
npm run build   # production build
npm run lint    # ESLint check
```

## Design System

All design tokens are CSS custom properties in `src/app/globals.css`:

| Token | Value | Usage |
|-------|-------|-------|
| `--plum` | `oklch(32% 0.09 315)` | Primary brand colour (dark purple) |
| `--caramel` | `oklch(66% 0.16 52)` | Accent colour (warm orange) |
| `--bg` | `oklch(97% 0.015 80)` | Page background |
| `--surface` | `oklch(99% 0.008 75)` | Card/section background |
| `--font-head` | Playfair Display | Headings |
| `--font-body` | DM Sans | Body text |

### Utility classes

- `.heading-xl`, `.heading-lg`, `.heading-md` — typographic scale
- `.label-tag` — uppercase caramel eyebrow labels
- `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-caramel`, `.btn-ghost` — button variants
- `.card`, `.card-hover` — card shell + hover lift effect
- `.section-spacing`, `.section-inner` — section padding + max-width container
- `.section-divider` — caramel decorative divider line
- `.animate-float`, `.animate-pulse-dot` — product float + active badge pulse

## Project Structure

```
src/
  app/
    layout.tsx         # Root layout — fonts, metadata
    page.tsx           # Home page — composes all sections
    globals.css        # Design tokens, base styles, utility classes
  components/
    Providers.tsx      # Jotai Provider wrapper
    Nav.tsx            # Fixed top navigation with lang switcher + mobile menu
    Hero.tsx           # Full-height hero with product image + stat badges
    WhySection.tsx     # Mission section + manufacturing photo + pillar cards
    ProductSection.tsx # Product detail — image, nutrition table, highlights
    InitiativesPromo.tsx # Dark plum CTA section for initiatives
    FirstInitiative.tsx  # Active initiative detail + progress card
    HowItHelps.tsx     # 3-step "how it works" flow
    TrustSection.tsx   # Quality & trust cards
    OrderCTA.tsx       # Order call-to-action section
    Community.tsx      # Social media links
    Footer.tsx         # Full footer with navigation, legal, contact
    icons/
      index.tsx        # All SVG icon components
  store/
    lang.ts            # Jotai atom — 'bg' | 'en' language state
public/
  bar-product.png      # Product bar photo
  logo-nav.png         # Small logo (nav + faded hero backdrop)
  logo-full.png        # Full logo (footer)
  manufacturing.jpg    # Production facility photo (WhySection strip)
```

## Bilingual Support

Language is `'bg'` (Bulgarian, default) or `'en'` (English), stored in `langAtom` from `src/store/lang.ts`. Every component reads this atom with `useAtomValue(langAtom)`. The Nav component has a language toggle that writes to it with `useAtom`.

Content strings are defined as plain objects keyed by `lang` inside each component — no i18n library.

## Responsive Breakpoints

- `< 768px` — mobile: hamburger nav, single-column layouts, full-bleed manufacturing photo
- `< 900px` — tablet: hero/product/initiative grids collapse to single column
- `≥ 900px` — desktop: multi-column grids, visible desktop nav links

## Assets

| File | Description |
|------|-------------|
| `public/bar-product.png` | Hero + product section bar image |
| `public/logo-nav.png` | Nav logo + faded hero backdrop |
| `public/logo-full.png` | Footer logo (inverted white) |
| `public/manufacturing.jpg` | WhySection atmospheric strip |
