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
  ├─ all 8 answered ──► POST /api/quote ──► getQuoteProvider().getQuote()
  │                      the ONE call that turns finished answers into an
  │                      actual quote — see "Insurer integration seam"
  │                      below for what's behind it and why it's a
  │                      network call rather than a local function now
  │
  └─ result screen (status: quoted) ──► POST /api/explain ──► Claude writes
                           │              2–3 sentence "why this price" summary
                           └─ on any failure ─► offline template
                                                (src/lib/pricing/explainFallback.ts)
```

Whichever provider answers `/api/quote`, the pricing calculation itself
never touches Claude — it's a deterministic function of the answers given.
Claude only ever sees the *inputs* (free text, a finished breakdown) —
never produces a price itself. Every quote decision (quoted, referred, or
declined) is logged once, by `/api/quote` itself
(`src/lib/quoteProvider/logResult.ts`), not by `/api/explain`.

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
  explain.ts              the Claude call for "why this price" text
  explainFallback.ts      offline version of the same, if Claude fails

src/lib/quoteProvider/    the insurer integration seam — see below
  types.ts                 QuoteProvider interface + result shapes
  ipt.ts                    illustrative UK Insurance Premium Tax helper
  localProvider.ts          wraps src/lib/pricing/* as a QuoteProvider
  mockActurisProvider.ts    wraps the mock insurer as a QuoteProvider
  logResult.ts              the one place a quote decision gets logged
  index.ts                  getQuoteProvider() — reads QUOTE_PROVIDER

src/lib/mockInsurer/
  underwriting.ts          a fictional demo insurer's own independent
                          rates + decline/refer rules

src/lib/anthropic/
  client.ts               the one place the Anthropic SDK is constructed;
                          CLAUDE_MODEL env var lives here (default
                          claude-sonnet-5)

src/lib/classify/
  fallback.ts             offline keyword classifier, used only if the
                          Claude call in /api/classify fails

src/lib/store/
  quoteLog.ts             appends one line per quote decision (quoted,
                          referred or declined) to data/quote-log.jsonl

src/app/api/
  classify/route.ts       free text → category (forced Claude tool call)
  skip-check/route.ts     "skip this optional question?" (forced tool call)
  quote/route.ts          the ONE route the frontend calls for a quote —
                          delegates to getQuoteProvider()
  explain/route.ts        writes the "why this price" text — no side
                          effects, doesn't log anything itself
  mock-insurer/quote/route.ts   the fictional demo insurer's own,
                          independently callable endpoint

src/components/quote/     the wizard UI (one file per screen "shape":
                          RadioStep, FreeTextClassifyStep, HeadcountStep,
                          OptionalStep, ResultScreen, LeadCaptureCard) +
                          QuoteWizard.tsx, which is the state machine
                          wiring them together

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

## Insurer integration seam (Acturis-ready)

This app doesn't talk to any real insurer or broker platform — every
price is either our own pricing engine or a fictional demo insurer, both
running locally. But it's built so that plugging in a real one later
(Acturis or otherwise) is a **config change, not a rewrite**.

### The contract

Every quote decision — however it's actually produced — implements the
same interface (`src/lib/quoteProvider/types.ts`):

```ts
interface QuoteProvider {
  id: string;
  displayName: string;
  getQuote(request: QuoteProviderRequest): Promise<QuoteProviderResult>;
}
```

`QuoteProviderResult` is a three-way union, deliberately modelled on how a
real insurer's API would actually respond — not just a price:

- **`quoted`** — a price, with a quote reference, an insurer name, a
  validity date, and an illustrative UK Insurance Premium Tax breakdown
  (`src/lib/quoteProvider/ipt.ts` — a simplified 12% figure, **not tax
  advice**; real IPT treatment varies by product and needs confirming
  with a real insurer before it means anything outside this demo).
- **`referred`** — the risk needs a human underwriter, with a plain-English
  reason. Real insurer APIs genuinely have this state; it's not something
  we invented for realism's sake.
- **`declined`** — this insurer won't cover this risk, with a reason —
  doesn't mean no insurer would, just that this one's appetite doesn't
  stretch that far.

### Two providers exist today

| Provider | `QUOTE_PROVIDER` value | What it does |
|---|---|---|
| `localProvider` (`src/lib/quoteProvider/localProvider.ts`) | `local` (default) | Wraps BeesKnee's own deterministic pricing engine (`src/lib/pricing/*.ts`). Always returns `quoted` — it has no concept of underwriting appetite. |
| `mockActurisProvider` (`src/lib/quoteProvider/mockActurisProvider.ts`) | `mock-acturis` | Calls a fictional demo insurer — "Acturis Test Insurance Company" (`src/lib/mockInsurer/underwriting.ts`) — with its **own independent rates** (deliberately different numbers from our own engine) and its own decline/refer rules for edge-case risk profiles. **Named after Acturis on purpose, as the demo narrative — it is not a real Acturis product or affiliated with Acturis**; the "(fictional placeholder...)" qualifier on its display name is there so nobody mistakes it for one. |

Both are picked by `getQuoteProvider()` (`src/lib/quoteProvider/index.ts`),
reading the `QUOTE_PROVIDER` env var. `POST /api/quote` — the one route
the frontend calls — never knows or cares which provider answered it.

The fictional insurer is also exposed as its own, independently callable
endpoint, `POST /api/mock-insurer/quote`, so it can be demoed and tested
as a standalone "external system" in its own right — try it directly:

```bash
curl -X POST http://localhost:3000/api/mock-insurer/quote \
  -H "Content-Type: application/json" \
  -d '{"vertical":"trades","answers":{"tradeCategory":"roofing","turnoverBand":"25k_50k","hasEmployees":false,"yearsTradingBand":"3_to_10","claimsBand":"two_plus","highRiskWork":true,"liabilityLimit":"1m"}}'
```

(`mockActurisProvider` calls the same underwriting functions in-process
rather than fetching that route over HTTP itself — simpler, no latency,
no URL/env plumbing for a self-call. The route exists for exactly the
demo/testing purpose above, and is where a real HTTP call to Acturis
would eventually replace it.)

### What a real Acturis integration would actually take

This is genuinely separate work, not a small tweak — flagged here rather
than overclaimed:

1. **A commercial relationship with Acturis** — API/integration access is
   provisioned to Acturis customers/partners, not something obtainable
   from this codebase alone.
2. **One new file**, `src/lib/quoteProvider/acturisProvider.ts`,
   implementing the same `QuoteProvider` interface — its `getQuote()`
   would make a real HTTP call to Acturis's API (auth, their request/
   response shapes, error handling) instead of running local logic.
3. **One line added** to the `PROVIDERS` map in
   `src/lib/quoteProvider/index.ts`, and `QUOTE_PROVIDER=acturis` set as
   the env var.
4. **Nothing else changes** — not the form, not the assistant, not
   `ResultScreen`, not the admin dashboard, not the lead capture. They
   all already speak the `QuoteProviderResult` shape.
5. **Separately**: real insurer/MGA integration brings its own
   data-security and audit-trail requirements that don't exist yet in
   this codebase — worth scoping deliberately once Acturis's actual
   integration surface (auth model, data formats, e-trading interfaces)
   is known, not folded into this seam silently.

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

## Stage 2 — the support assistant

A floating chat widget (`src/components/assistant/AssistantWidget.tsx`) sits
on the `/quote` page alongside the step-by-step form, backed by a React
context (`AssistantProvider.tsx`) that owns the message thread, a
one-nudge-at-a-time dedupe set, and a handful of timers/listeners. It has
two jobs: rescue moments where someone might stall or leave, and
optionally complete an entire quote through open conversation.

### Rescue triggers

| Trigger | How it's detected | Where |
|---|---|---|
| Inactivity on a question | 20s timer reset on every step change, one nudge per question per session | `QuoteWizard` calls `reportStep()` on each step |
| Free text that won't classify cleanly | Classification returns a catch-all `other_*` category, or the user rejects a classification a second time | `FreeTextClassifyStep` calls `reportClassifyStruggle()` |
| "Not sure" / "doesn't apply" / "skip" typed anywhere | A regex match on the free-text answer, checked before it's ever sent for classification | `FreeTextClassifyStep` calls `reportConfusion()` |
| Extended inactivity or an attempt to leave | Global idle timer (45s) + `visibilitychange` (tab hidden) + a desktop exit-intent listener (`mouseout` at `clientY <= 0`) — offered once per session | `AssistantProvider`'s own page-level effect |
| Quote just completed | Fires once, right after the price is shown | `QuoteWizard` calls `reportQuoteCompleted()` |

Each nudge's text comes from `POST /api/assistant/nudge` (a short Claude
call per trigger kind, each with its own offline fallback template) and is
pushed into the same message thread as an assistant message — there's no
separate "nudge" UI, just messages that happen to be dismissible and that
the provider is careful never to repeat once shown for a given
question/trigger.

Every trigger firing (and every dismissal) is logged via
`POST /api/assistant/event` to `data/assistant-events.jsonl`
(`src/lib/store/assistantEventLog.ts`), keyed by a client-generated
`sessionId`, so Stage 3's admin view can later compute things like "how
many inactivity nudges led to a completed quote vs. an abandoned one."

### Completing a quote entirely by chat

Clicking "Prefer to just chat instead?" (or just typing into the widget at
any point) opens a conversation backed by `POST /api/assistant/chat`. This
route runs one Claude call per turn with two kinds of tools:

- `select_vertical` — once Claude is confident whether the person is a
  tradesperson or a consultant/freelancer.
- `submit_trades_quote_answers` / `submit_consultants_quote_answers` —
  called once Claude has gathered everything the step-by-step form would
  have asked. Both tools use `strict: true` with enum-constrained fields,
  so Claude can only submit values that are actually valid — the server
  re-validates defensively anyway (`src/lib/assistant/tools.ts`), since
  this is a public endpoint.

When a submit tool is called, the route runs the **exact same**
`calculateTradesPremium` / `calculateConsultantsPremium` functions the
form uses, then the same `explainPremium()` helper — so a quote finished
by chat and a quote finished by clicking through produce identical prices
for identical answers, by construction, not by coincidence. The result
flows back to `QuoteWizard` (`AssistantProvider`'s `chatQuoteResult`),
which renders it through the same `ResultScreen` component either way.

The assistant's persona and guardrails
(`src/lib/assistant/systemPrompt.ts`) are explicit that it is not a
licensed adviser, never invents coverage/exclusion details, and never
implies a real, bindable quote or payment.

### Save and resume — a real data-collection point

The "leave intent" offer captures an email
(`POST /api/lead/capture` → `src/lib/store/leadLog.ts`,
`data/lead-log.jsonl`). This is the one piece of genuinely real personal
data the app collects from Stage 2 onward, even though everything else is
a demo — worth treating with the same care Stage 4 describes, starting
now rather than waiting for Stage 4 to formally arrive. **No email is
actually sent** — there's no email provider wired up yet, and the UI says
so honestly rather than pretending a link was delivered. (Stage 3 below
extends this into a single, shared lead record.)

## Stage 3 — investor-demo polish

### One shared lead record

Stage 2's save-and-resume offer and Stage 3's new post-quote "want us to
follow up?" card (`src/components/quote/LeadCaptureCard.tsx`, shown on
`ResultScreen`) both write to the same endpoint,
`POST /api/lead/capture` → `src/lib/store/leadLog.ts`
(`data/lead-log.jsonl`) — one `LeadLogEntry` shape with a `source` field
(`"save_and_resume"` or `"quote_complete"`) rather than two separate
capture systems, per the product decision to treat every contact point
as the same kind of record. It already has a `name` field alongside
`email`, ready for the planned phone-number step (see "Planned / not yet
built" below) to extend the same record rather than start a third one.

### Admin dashboard

`/admin` (`src/app/admin/page.tsx`) is a server component that reads
`quoteLog` and `assistantEventLog` directly (no API round-trip needed —
Server Components can just call the server-only lib functions) via
`src/lib/admin/metrics.ts`, and shows: quotes completed today/total, split
by vertical, average simulated premium, underwriting decisions (quoted vs.
referred vs. declined, and a straight-through rate — whichever quote
provider is active, see "Insurer integration seam" above), and the
assistant's recovery rate
— how many sessions that got a rescue nudge (inactivity, clarify,
confusion, or leave-intent) went on to complete a quote vs. were left
incomplete. That last number comes from grouping `assistant-events.jsonl`
by the client-generated `sessionId` and checking whether a completion
signal (`post_quote_offer` or `chat_quote_completed`) appears in the same
session as a rescue nudge — no separate tracking needed, it falls out of
the Stage 2 event log for free.

It's gated by `src/proxy.ts`: plain HTTP Basic Auth against a single
`ADMIN_PASSWORD` env var (any username works), which is deliberately not
a real per-admin login — Stage 4 replaces this with proper authentication
(e.g. NextAuth) before any real user data goes near it. If
`ADMIN_PASSWORD` isn't set, `/admin` refuses to load at all (503) rather
than defaulting to open.

### Reset demo / About this demo

`ResetDemoButton` (in `SiteHeader`, on every page) clears browser storage
and does a hard navigation back to `/`, so the same laptop can be handed
to the next person with a completely fresh client-side state — it does
**not** touch the server-side logs, since those are the point of the
admin dashboard and should accumulate across a whole demo day, not reset
per visitor.

`/about` is a plain page (linked from `SiteHeader`) spelling out, for a
non-technical audience, what's real (the LLM classification, skip-logic,
explanations, and full conversational quote-taking) vs. simulated (the
price itself) — the long-form version of the disclaimer that's on every
page in short form.

## Stage 4 — security & compliance hardening

### Real admin authentication

`/admin` is gated by a session, not the browser's Basic Auth popup:
`src/app/admin/login/page.tsx` posts to `POST /api/admin/login`, which
checks the password against `ADMIN_PASSWORD` and, on success, issues a
signed, expiring cookie (`src/lib/adminAuth.ts`, HMAC-SHA256 via the
**separate** `AUTH_SECRET` env var, 12-hour expiry). `src/proxy.ts`
verifies that cookie on every request to `/admin/:path*` (except the
login page itself) and redirects to `/admin/login` if it's missing or
invalid; `/admin` also has a **Log out** button
(`POST /api/admin/logout`) clearing the cookie. Both `ADMIN_PASSWORD`
and `AUTH_SECRET` must be set or `/admin` refuses to load at all (503),
the same fail-closed pattern as before.

**Why not NextAuth**, which the original build guide suggested: for a
single shared admin account, NextAuth's provider/adapter machinery buys
little, and it's a heavier, faster-moving dependency to carry through a
Next.js 16 / React 19 setup than the ~80 lines in `adminAuth.ts`. If
there's ever more than one admin, or real SSO is needed, that file (and
the two routes that call it) is exactly what to replace — nothing else
in the app knows how a session is represented.

### Rate limiting + usage visibility

Every route that calls Claude — `classify`, `skip-check`, `nudge`,
`explain`, `assistant-chat` — is guarded by
`guardClaudeCall()` (`src/lib/claudeGuard.ts`): an in-memory, per-client-IP,
fixed-window rate limit (`RATE_LIMIT_MAX` / `RATE_LIMIT_WINDOW_MS`, 20
per 60s by default) that returns `429` once exceeded, and logs every
attempt either way to `data/api-usage.jsonl`
(`src/lib/store/apiUsageLog.ts`). The admin login route has its own,
stricter limit (10 attempts per 15 minutes per IP) as brute-force
protection. `/admin`'s new "Claude API usage" card surfaces calls
today/total and how many were rate-limited — the direct answer to "is
something calling Claude more than it should be" before real spend is
on the line.

Same limitation as every other local store: in-memory and file-based,
fine for local dev or a single long-running server, **not** shared
across Vercel serverless instances — a real production deployment needs
a shared store (e.g. Upstash Redis) for the limiter to hold across cold
starts.

### Privacy Policy, Terms of Use, and the compliance review

`/privacy` and `/terms` (`src/app/privacy/page.tsx`,
`src/app/terms/page.tsx`) are draft copy describing what this app
*actually* collects and does today, each carrying a prominent "this is a
draft, not a final legal document" banner
(`src/components/legal/LegalPageShell.tsx`) and linked from the footer
disclaimer on every page. They are not reviewed by a lawyer or
compliance professional, and say so.

`COMPLIANCE_REVIEW.md` (repo root) is a separate, plain-English list of
places in the current copy and product design that could plausibly read
as regulated financial advice or a financial promotion under FCA rules —
written as flags with file references, not verdicts, and not acted on
unilaterally. It's meant to be read alongside this file, not folded into
it, since it needs a different kind of review (yours and Marc's FCA
judgement, not engineering).

### Secrets audit

Confirmed, not assumed: `ANTHROPIC_API_KEY`, `ADMIN_PASSWORD`, and
`AUTH_SECRET` never reach the client bundle. Verified by building with
real (test) values set and grepping the entire `.next/static` output for
both the env var names and the literal secret values — zero matches
either way. Every module that reads these lives behind either
`import "server-only"` or is itself inherently server-only (a Route
Handler or `src/proxy.ts`), and no client component (`"use client"`)
imports any of them outside a type-only import (which TypeScript erases
at compile time and never ships any code).

## Logging and data — current limitation

Four local JSONL files, all under the same limitation:

- `data/quote-log.jsonl` (`src/lib/store/quoteLog.ts`) — every quote decision (quoted/referred/declined), anonymised
- `data/assistant-events.jsonl` (`src/lib/store/assistantEventLog.ts`) — every rescue trigger fired/dismissed
- `data/lead-log.jsonl` (`src/lib/store/leadLog.ts`) — the shared lead record (name/email, save-and-resume or post-quote), real contact data
- `data/api-usage.jsonl` (`src/lib/store/apiUsageLog.ts`) — every attempted Claude call, rate-limited or not

This works for local development and for a single long-running server, but
**Vercel's serverless functions have an ephemeral, mostly read-only
filesystem**, so in a real Vercel deployment these writes will not
reliably persist between invocations — and the in-memory rate limiter
(`src/lib/rateLimit.ts`) has the same limitation, resetting on every cold
start. If someone asks "where's this data stored" in a backend demo, the
honest answer today is: nowhere durable yet on Vercel — swapping in a
real datastore (Vercel KV, Postgres, Supabase, or Upstash Redis for the
rate limiter specifically) before any of this needs to hold up in
production is real work still ahead, Stage 4's admin-auth and
rate-limiting additions notwithstanding. This matters most for
`lead-log.jsonl`, the one file holding real personal data.

## Planned / not yet built

- **Phone-contact capture as a final questionnaire step.** Ask for name,
  email, and phone number as the last step of the quote flow itself (not
  just the optional captures that exist today — Stage 2's leave-intent
  offer and Stage 3's post-quote card, both email-only), so that if
  someone drops off before finishing, there's a real phone number to
  follow up on. Would extend the same `LeadLogEntry` shape
  (`src/lib/store/leadLog.ts`) with a `phone` field and a third `source`
  value, rather than a new store. Deliberately deferred — noted here so
  it isn't lost, not yet implemented.
- ~~Middleware → proxy rename~~ — done (`src/proxy.ts`, migrated via
  `npx @next/codemod@canary middleware-to-proxy .`).
