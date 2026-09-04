# Portfolio — Aditya Kalsariya

Next.js 16 + Tailwind 4. Dark, typographic, motion-led.

## Develop

```bash
npm run dev          # http://localhost:3000
npm run build
```

## Pulling work from Figma

Project covers come from the Figma file, not from the repo. Each Figma **page**
becomes a category; each top-level **frame** on that page becomes a project.

1. Create a token at figma.com → Settings → Security → Personal access tokens
   (scope: `file_content:read`).
2. `echo 'FIGMA_TOKEN=figd_...' > .env.local`
3. `npm run figma:import`

That exports every frame at 2x into `public/work/<page>/` and regenerates
`src/lib/work.generated.ts`. Re-run it whenever the Figma file changes; stale
exports are pruned. Until it has run, the site shows the four categories with
an "awaiting export" note.

Editorial copy for each category lives in `NOTES` in `src/lib/work.ts` — keyed
by the page's slug, so renaming a Figma page means updating the key there.

## Fonts

The site is set in **Saans** (Displaay), served from `src/fonts/` and committed
so a clean checkout builds — a host clones the repo, and `next/font/local`
fails the build on a missing file rather than falling back.

Two weights are carried, 400 and 500, which is all the design uses, plus a
400 italic for `<em>`. To swap in a different cut, keep the filenames or update
the `src` array in `src/app/layout.tsx`. The fallback stack is Inter, then
system sans, so the page stays readable if a face fails to load.

## Visual checks

```bash
npm run shot http://localhost:3000 out.png "#work"
```

Drives the installed Chrome via `puppeteer-core`; no browser download.

## Motion

One curve (`expo.out`) and one duration palette across the site. Lenis drives
scrolling off GSAP's ticker so ScrollTrigger never reads a stale position.
Entrance reveals use IntersectionObserver rather than ScrollTrigger — they only
need "is it on screen", and IO answers that correctly for elements already in
view on a deep link. Everything is gated on `prefers-reduced-motion`.
