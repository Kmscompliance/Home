# BeesKnee's Insurance — quote engine POC

A working prototype for a "5-minute quote" insurance demo (Simply Business-style),
covering two verticals: trades (public liability) and consultants/freelancers
(professional indemnity). **All pricing is simulated — this is an investor-facing
demo, not a real insurance product.**

## Stage 0 — foundations

Next.js (App Router) + TypeScript + Tailwind skeleton: a small design system
(`Button`, `Card`, `ProgressBar` in `src/components/ui/`), the permanent
"working prototype" disclaimer shown on every page
(`src/components/DemoDisclaimer.tsx`), and a homepage.

## Stage 1 — the quote engine

Two verticals, `/quote`:

- **Trades** (public liability) — `src/lib/pricing/trades.ts`
- **Consultants/freelancers** (professional indemnity) — `src/lib/pricing/consultants.ts`

Architecture is hybrid by design — pricing is never calculated by the LLM:

- **Pricing** (`src/lib/pricing/*.ts`) is plain, deterministic, commented
  TypeScript — a base rate per vertical multiplied by named risk factors.
  This is the file a real insurer's rating engine would eventually replace.
- **Claude** (`src/lib/anthropic/client.ts`, `src/app/api/*/route.ts`) is
  used only for: classifying a free-text answer ("I fix boilers...") into a
  structured category via a forced tool call, deciding whether an optional
  question can be skipped based on earlier answers, and writing the 2-3
  sentence plain-English "why this price" explanation. None of these calls
  ever produce a number that affects the price.
- Every Claude call has a deterministic, offline fallback (keyword-based
  classification, "always ask" for skip decisions, a template explanation)
  so the demo still works without an API key or if a call fails.
- Completed quotes are logged anonymised (no name/email) to
  `data/quote-log.jsonl` via `src/lib/store/quoteLog.ts` — **local/dev only**,
  see the note in that file about Vercel's ephemeral filesystem.

## Stage 2 — the support assistant

A floating chat widget on `/quote` (`src/components/assistant/`) that
proactively rescues moments where someone might stall or leave — an
inactivity nudge on the current question, help when free text won't
classify cleanly or reads as confused/wanting to skip, a one-time
save-and-resume offer on extended inactivity or an attempt to leave, and
a proactive offer to help once a quote completes. It can also complete an
entire quote through open conversation (`POST /api/assistant/chat`,
Claude tool calls into the **same** `calculateTradesPremium` /
`calculateConsultantsPremium` functions Stage 1 built — chat and
click-through always produce identical prices for identical answers).
Every trigger fire/dismissal is logged (`data/assistant-events.jsonl`) for
a future "how many stalls did the assistant recover" metric. See
[ARCHITECTURE.md](./ARCHITECTURE.md#stage-2--the-support-assistant) for
the full design.

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

See [ARCHITECTURE.md](./ARCHITECTURE.md) for the system design, the request
flow for a quote, where to change the pricing numbers or the model, and how
sandbox/test/live environments map onto Vercel.

## Project structure

- `src/app/` — routes (App Router)
- `src/components/ui/` — reusable design-system primitives
- `src/components/` — layout-level components (header, disclaimer)
- `.github/workflows/ci.yml` — lint + build check on every push/PR
