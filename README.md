# BeesKnee's Insurance — quote engine POC

A working prototype for a "5-minute quote" insurance demo (Simply Business-style),
covering two verticals: trades (public liability) and consultants/freelancers
(professional indemnity). **All pricing is simulated — this is an investor-facing
demo, not a real insurance product.**

## Stage 0 — foundations

This stage sets up the skeleton only: Next.js (App Router) + TypeScript +
Tailwind, a small design system (`Button`, `Card`, `ProgressBar` in
`src/components/ui/`), the permanent "working prototype" disclaimer shown on
every page (`src/components/DemoDisclaimer.tsx`), a homepage, and a
placeholder `/quote` route. No quote logic or LLM calls yet — that starts in
Stage 1.

## Getting started

```bash
npm install
cp .env.local.example .env.local   # then add your ANTHROPIC_API_KEY
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploying to Vercel

This is a standard Next.js App Router project, so it deploys to Vercel with
zero extra config:

1. Push this repo to GitHub (already done if you're reading this from there).
2. In the [Vercel dashboard](https://vercel.com/new), import the repo.
3. Add the `ANTHROPIC_API_KEY` environment variable under
   **Project Settings → Environment Variables** — never commit it to the repo.
4. Deploy. Every push to `main` will auto-deploy from then on.

## Project structure

- `src/app/` — routes (App Router)
- `src/components/ui/` — reusable design-system primitives
- `src/components/` — layout-level components (header, disclaimer)
- `.github/workflows/ci.yml` — lint + build check on every push/PR
