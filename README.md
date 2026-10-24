# Maison Sumac — ميزون سماق

Concept one-page website for a fictional specialty café & brunch spot in
Gemmayzeh, Beirut. Portfolio project — bilingual (EN/AR) with full RTL mirroring.

## Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS 4 + shadcn/ui
- Fonts via `next/font`: Fraunces (display), DM Sans (body), Cairo (Arabic)

## Run locally

```bash
bun install
bun run dev
```

## Structure

```
src/
  lib/
    config.ts        # WhatsApp number, address, socials — edit here first
    translations.ts  # ALL copy, EN + AR, in one object
    menu-data.ts     # bilingual menu items & prices
    images.ts        # Unsplash photo registry (swap URLs here)
  components/        # one file per section + language provider / reveal
  app/               # layout (fonts, SEO/OG) + page assembly
```

## Features

- EN | AR toggle → flips `dir="rtl"`, swaps fonts to Cairo, persists choice
- All WhatsApp buttons (reserve + per-category order) share one config constant
- Scroll fade-ups that respect `prefers-reduced-motion`
- Mobile-first, accessible (semantic HTML, focus states, aria labels)

Photography via Unsplash placeholders — replace entries in `src/lib/images.ts`.

Concept design by Mawqe3 Studio.
