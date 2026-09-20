# Architecture

Technical reference for how BeesKnee's Insurance is built — written to be
readable in a demo where someone asks "okay, how does this actually work
under the hood?" as well as by whoever picks this codebase up next.

## In one sentence

A Next.js app where the price is always calculated by plain, deterministic
TypeScript you can read and edit — Claude is only ever used for the
language parts around it (understanding free text, deciding what to ask,
and explaining the result in plain English).

## Request flow for one quote

```
Browser (QuoteWizard — src/components/quote/QuoteWizard.tsx, all client-side)
  │
  ├─ Q1 (free text) ──► POST /api/classify ──► Claude, forced tool call
  │                        │                     returns one enum value
  │                        └─ on any failure ──► offline keyword fallback
  │                                               (src/lib/classify/fallback.ts)
  │
  ├─ Q2–Q7 (single choice) — no network calls, pure UI state
  │
  ├─ Q8 (optional add-on) ─► POST /api/skip-check ─► Claude, forced tool call
  │      on mount               │                     "skip this or not?"
  │                             └─ on any failure ──► always ask (safe default)
  │
  ├─ all 8 answered ──► calculateTradesPremium() / calculateConsultantsPremium()
  │                      runs entirely in the browser, no network call,
  │                      no LLM — src/lib/pricing/{trades,consultants}.ts
  │
  └─ result screen ──► POST /api/explain ──► Claude writes 2–3 sentence
                           │                   "why this price" summary
                           ├─ on any failure ─► offline template
                           │                    (src/lib/pricing/explainFallback.ts)
                           └─ also appends one anonymised line to the
                              quote log (src/lib/store/quoteLog.ts)
```

The pricing calculation never leaves the browser and never touches Claude —
it's a pure function of the answers you gave. Claude only ever sees the
*inputs* (free text, the finished breakdown) — never produces the price
itself.

## Why split it this way (rules vs. LLM)

An LLM is good at understanding language and bad at being a reliable
calculator — ask it the same pricing question twice and you can get two
different numbers, which is not what you want from an insurance quote,
even a simulated one. So the two jobs are kept strictly separate:

| | Does it | Doesn't do |
|---|---|---|
| **Pricing rules** (`src/lib/pricing/*.ts`) | Multiply named, commented constants together | Call the network, call Claude, or vary between runs |
| **Claude** (`src/lib/anthropic/client.ts`, `src/app/api/*/route.ts`) | Classify text, decide on skip logic, write the explanation | Ever output or influence a number that reaches the price |

This also happens to be the story you'd tell a regulator later: the
pricing logic is a transparent, inspectable rule set, not a black box.

## File map

```
src/lib/pricing/
  types.ts              shared types (BreakdownFactor, PremiumResult)
  trades.ts              the trades rating engine — every multiplier/base
                          rate is a named, commented constant
  consultants.ts          same, for the consultants/freelancers vertical
  explainFallback.ts      offline "why this price" text if Claude fails

src/lib/anthropic/
  client.ts               the one place the Anthropic SDK is constructed;
                          CLAUDE_MODEL env var lives here (default
                          claude-sonnet-5)

src/lib/classify/
  fallback.ts             offline keyword classifier, used only if the
                          Claude call in /api/classify fails

src/lib/store/
  quoteLog.ts             appends one anonymised line per completed quote
                          to data/quote-log.jsonl (see caveat below)

src/app/api/
  classify/route.ts       free text → category (forced Claude tool call)
  skip-check/route.ts     "skip this optional question?" (forced tool call)
  explain/route.ts        writes the explanation + logs the completed quote
                          — the only three server routes that call Claude

src/components/quote/     the wizard UI (one file per screen "shape":
                          RadioStep, FreeTextClassifyStep, HeadcountStep,
                          OptionalStep, ResultScreen) + QuoteWizard.tsx,
                          which is the state machine wiring them together

src/components/ui/        design-system primitives (Button, Card,
                          ProgressBar) — brand-agnostic, reused everywhere

src/components/           layout-level pieces: SiteHeader, DemoDisclaimer
                          (the permanent "working prototype" notice)
```

## How to change the numbers

Open `src/lib/pricing/trades.ts` or `consultants.ts`. Every multiplier and
base rate is a named constant with a one-line comment explaining what it
represents and why it's set where it is — e.g.:

```ts
// Working at height is the highest-risk factor here
roofing: 1.35,
```

Edit the number, save, commit, push. No LLM is involved in this file at
all, so the change takes effect exactly as written, every time — nothing
to test for consistency. Vercel redeploys automatically on push
(typically live within a minute).

## How to change the model

`CLAUDE_MODEL` in `.env.local` (falls back to `claude-sonnet-5` if unset —
see `src/lib/anthropic/client.ts`). Because Vercel lets you set environment
variables per environment (see below), this can differ between sandbox,
test and live without touching code — e.g. a cheaper/faster model while
iterating, a specific pinned version once you're happy with it.
**Environment variable changes need a redeploy to take effect** — Vercel's
serverless functions don't pick up a changed env var on an already-running
deployment.

## Environments: sandbox / test / live

This maps directly onto how Vercel works once the repo is connected there
— nothing extra to build:

- **Live** = your chosen production branch (commonly `main`) → the stable
  production URL.
- **Sandbox** = every other branch or pull request automatically gets its
  own disposable preview URL the moment it's pushed — this is what this
  Claude Code branch already gets for free.
- **Test** = optionally, designate one specific long-lived branch (e.g.
  `staging`) so you have a fixed, shareable URL that isn't production but
  isn't a one-off preview either.
- Each of these is a separate "Environment" in Vercel's Project Settings →
  Environment Variables, so `ANTHROPIC_API_KEY` and `CLAUDE_MODEL` (and any
  future secret) can be set independently per environment.

## What's real vs. simulated (for demo framing)

- **Real**: the LLM-driven classification of free text, the skip-question
  logic, the plain-English explanations, and the full quote flow/logic.
- **Simulated**: the price itself — there is no real insurer or
  underwriting data behind it anywhere in this codebase. This is stated
  on every screen via the permanent disclaimer
  (`src/components/DemoDisclaimer.tsx`), and worth restating out loud in
  any demo.

## Logging and data — current limitation

Completed quotes are logged to `data/quote-log.jsonl`, a local
append-only file (`src/lib/store/quoteLog.ts`). This works for local
development and for a single long-running server, but **Vercel's
serverless functions have an ephemeral, mostly read-only filesystem**, so
in a real Vercel deployment these writes will not reliably persist between
invocations. If someone asks "where's this data stored" in a backend demo,
the honest answer today is: nowhere durable yet on Vercel — that's flagged
as Stage 3/4 work (swapping in a real datastore such as Vercel KV,
Postgres, or Supabase) before the admin dashboard or any real lead data
can rely on it.
