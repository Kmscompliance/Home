# Pre-launch review — open concerns & decisions needed

A running log of things worth deciding on together before this goes near
real users, real investment conversations, or "live" infrastructure —
not a to-do list to be silently worked through. Everything here is a
flag, not a fix already applied. Add to it as new concerns come up rather
than starting a second list elsewhere.

**How to use this:** work through a section when you're ready to make
that category of decision (e.g. "let's resolve everything under Cost &
operations before connecting a real API key"). Each item says what it
is, why it matters, and its current status — nothing has been silently
patched around any of these.

Kept on this branch (`claude/wizardly-faraday-isq27i`), alongside
`ARCHITECTURE.md` and `COMPLIANCE_REVIEW.md` rather than a separate
branch — say if you'd rather it lived somewhere else (its own branch or
PR, for instance) and I'll move it.

---

## Cost & operations

- **The chat assistant needs a real, billed Anthropic API key to do
  anything beyond its offline fallback.** This is the one you raised
  directly: no `ANTHROPIC_API_KEY` means every Claude call — classification,
  the assistant's conversation, nudges, explanations — falls back to a
  generic template or apology. That's by design (the app should never
  hard-fail without a key), but it means the "fully functional LLM bot"
  experience specifically requires Anthropic billing to be set up first.
  Not started, per your call to hold off tonight.
- **Rate limiting throttles bursts; it does not cap total spend.**
  `src/lib/claudeGuard.ts` limits each client IP to a rolling window
  (20 requests/minute by default) — a determined script could still run
  continuously, staying just under that limit, indefinitely. There is no
  daily or monthly spend ceiling, and no automatic alert if usage spikes
  — someone has to look at the `/admin` "Claude API usage" card. Worth
  deciding whether a hard spend cap (e.g. via the Anthropic Console's own
  spend limits) is wanted as a backstop before a real key goes in.
- **The rate limiter is per-instance, not global.** It's an in-memory
  `Map` (see `src/lib/rateLimit.ts`). On a real multi-instance Vercel
  deployment, each serverless instance gets its own counters — so the
  *effective* limit under real traffic is "N times however many
  instances happen to be warm," not a hard N. Closing this needs a
  shared store (e.g. Upstash Redis) before it's a real production
  control, not just a local-demo one.
- **No environment separation is actually configured yet** beyond what
  Vercel provides automatically once connected (see
  `ARCHITECTURE.md` → *Environments: sandbox/test/live*). Model choice,
  rate limits, and the quote provider could all differ between
  sandbox/test/live, but nobody's decided what those differences should
  be yet.

## Security

- **Assistant guardrails are prompt-only, with no independent check on
  the model's actual output.** (Flagged in detail in
  `COMPLIANCE_REVIEW.md` § 5 — repeated here because it's as much a
  security/reliability question as a compliance one.) The system prompt
  instructs Claude not to give advice, not to invent coverage details,
  and it followed those instructions correctly in testing — but nothing
  downstream would catch it if a response ever drifted. There's no
  content filter or moderation pass on chat replies or explanations
  before they reach the user.
- **No bot/abuse protection beyond rate limiting** on any public
  endpoint — `/api/quote`, `/api/classify`, `/api/assistant/chat`,
  `/api/lead/capture`, etc. all accept unauthenticated requests from
  anyone, by design (a visitor needs to be able to get a quote without
  logging in). No CAPTCHA, no bot detection. Combined with the two
  points above, this is the real-world path to an unexpected bill or a
  polluted lead list.
- **Admin login uses a plain string comparison, not constant-time.**
  `body.password !== adminPassword` in
  `src/app/api/admin/login/route.ts` is a timing-attack-theoretical
  weakness — very low practical risk for a single shared demo password
  behind a 10-attempts/15-minutes limit, but worth a one-line fix
  (`crypto.timingSafeEqual`) before this is a real credential.
- **No email verification on lead capture.** Anyone can submit any name
  and any email address — nothing confirms the person entering it owns
  it. Not a security hole, but a data-quality and potential-abuse gap
  (someone could submit someone else's real email).
- **CSRF is mitigated but not explicitly designed for.** The admin
  session cookie is `SameSite=Lax` + `httpOnly`, which does stop the
  classic cross-site POST attack against `/api/admin/*` — but that's a
  browser-default side effect, not a deliberate CSRF token scheme. Worth
  a conscious decision that this is sufficient, rather than an assumed
  one.

## Architecture constraints

- **Nothing persists reliably in a real Vercel deployment — this is the
  single biggest constraint to resolve before "live."** Every data store
  in the app — `quote-log.jsonl`, `lead-log.jsonl`,
  `assistant-events.jsonl`, `api-usage.jsonl`, and the in-memory rate
  limiter — is a local file or process memory. On Vercel's serverless
  functions, that's ephemeral: a cold start gets an empty slate, so
  admin metrics, captured leads, and rate limits can all silently reset
  or go missing. This has been flagged at every stage it was built
  (`ARCHITECTURE.md` → *Logging and data*), but it's worth stating
  plainly here as the one item that blocks *everything else* in this
  document from mattering in production — a real datastore (Postgres,
  Supabase, Vercel KV, etc.) needs to land before any of the admin
  numbers, lead data, or rate limits can be trusted live.
- **No automated test suite exists.** `.github/workflows/ci.yml` runs
  lint and `next build` only — there are no unit or integration tests
  checked into the repo. Everything has been verified manually with
  curl and ad hoc Playwright scripts during each build stage (then
  deleted, since they weren't meant to be permanent fixtures) rather
  than a standing suite that runs on every future change. A regression
  in, say, the pricing multipliers or the quote-provider swap would not
  be caught automatically today.
- **Switching the quote provider (`QUOTE_PROVIDER`) needs a redeploy.**
  Not runtime-switchable — fine for now, but worth knowing if you ever
  want to A/B test insurers or flip providers without a deploy cycle.
- **The pricing/underwriting rate tables have no version history.**
  Change a multiplier in `src/lib/pricing/trades.ts` today, and there's
  no record of what a quote would have been under the old numbers —
  only the final price is logged. Fine for a demo; a real insurance
  business would need actuarial rate versioning and an audit trail.

## Customer experience

- **The chat assistant's total-failure fallback is weak.** When Claude
  is unavailable (as you hit tonight), every message gets the same
  generic "having trouble thinking" apology, with no escalation path
  beyond "try the form instead." That's honest and doesn't pretend to
  work, but it's not a graceful recovery experience for a real customer
  hitting it unexpectedly.
- **Mobile testing has been emulated, not done on real devices.** The
  Stage 3 mobile pass checked for layout overflow at a fixed Chromium
  viewport — real iOS Safari (virtual keyboard covering inputs) and
  Android Chrome behaviour haven't been tested on actual hardware.
- **Accessibility hasn't been systematically audited.** A handful of
  `aria-label`s exist on icon-only buttons (the assistant widget's
  open/close/send/dismiss controls), but there's been no screen-reader
  pass, no systematic ARIA review, and no colour-contrast check against
  WCAG. Worth a dedicated pass before this is customer-facing.
- **Demo/test data has no "is this real" flag.** Every quote you and I
  ran while building and testing is sitting in the same log files a
  real customer's data would land in, with nothing distinguishing them.
  There's no "clear all data" control in `/admin` either — today that
  means manually deleting the `data/` folder. Worth wiping it (or adding
  a real distinction) before any real customer data starts arriving, so
  the two don't get mixed.
- **Referred/declined outcomes and lead-capture copy promise a human
  follow-up that doesn't exist yet** (also flagged in
  `COMPLIANCE_REVIEW.md` § 4) — no email is actually sent, no underwriter
  workflow exists. Worth deciding whether that's clear enough to a real
  visitor, independent of the regulatory question.

## Compliance

Everything here is covered in detail in `COMPLIANCE_REVIEW.md` — not
duplicated, just cross-referenced:

- The trading name itself using "Insurance."
- How prominent the "illustrative, not real" framing is relative to how
  real the rest of the product is designed to look.
- Specific copy lines that assert unqualified coverage behaviour
  ("your policy would pay out...").
- The prompt-only guardrail gap (also listed under Security above).

---

**Not yet reviewed at all, worth naming rather than pretending isn't a
gap:** load/performance testing under real concurrent traffic, a formal
threat model, and legal review of the Anthropic sub-processor
relationship (data processing agreement, if needed).
