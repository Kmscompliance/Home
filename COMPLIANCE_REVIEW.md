# Compliance review — flags for FCA review

**This is not legal or regulatory advice.** It's a plain-English list of
places in the current copy and product design that could plausibly be
read as regulated financial advice or a financial promotion, or that
otherwise seem worth your and Marc's judgement against FCA requirements.
I haven't made any calls on whether these are actually problems, and I
haven't reworded any of the guardrail language myself — that's a decision
for you, not something to make silently. Everything below is a flag, not
a verdict.

Last reviewed against the codebase: 20 September 2026 (Stage 4).

## 1. Structural point: how "illustrative" the demo actually reads

This is the one worth weighing above the individual lines below. The
whole product is built to feel like a real quote — a quote reference
number, an insurer name, a validity date, an Insurance Premium Tax
breakdown, and referred/declined outcomes that mirror how a real
insurer's API responds (`src/lib/mockInsurer/underwriting.ts`,
`src/components/quote/ResultScreen.tsx`). That realism was a deliberate
design goal for the demo. Financial promotion rules generally look at
the *overall impression* a communication creates, not just whether a
disclaimer exists somewhere on the page — so it's worth deciding
deliberately how prominent the "illustrative, not real" framing needs to
be relative to how real everything else is designed to look, rather than
treating the footer disclaimer as sufficient by default.

**Where the disclaimer currently lives:** a persistent footer strip on
every page (`src/components/DemoDisclaimer.tsx`) reading "Working
prototype · Illustrative prices only · No real insurance or payments",
plus one line directly under the price on the result screen
(`ResultScreen.tsx`). It does **not** appear above the fold on the
homepage, next to the headline/CTA.

## 2. The trading name itself

"BeesKnee's Insurance" uses the word "Insurance" in the name of an entity
that isn't an authorised insurer. The FCA (and Companies House) restrict
the use of certain words — including "insurance", "insurer", and
"assurance" — in a firm's name; whether that restriction applies here
depends on how the name is actually used/registered, which is outside
what I can determine from the codebase. Worth checking explicitly rather
than assuming the "(demo)" framing elsewhere is sufficient.

## 3. Specific copy to review

| Where | Text | Why it's flagged |
|---|---|---|
| `src/app/page.tsx:13` | "Business insurance in minutes, without the jargon." (homepage headline, above the fold, no disclaimer nearby) | Reads as an invitation to obtain real business insurance. Combine with point 1 above — this is the least-qualified moment in the whole app. |
| `src/components/quote/QuoteWizard.tsx:265` | Trades liability-limit helpText: "This is the most **your policy** would pay out if a claim against your business succeeds." | Uses possessive "your policy" language describing a real policy's behaviour, when no real policy exists yet at this point in the flow. |
| `src/components/quote/QuoteWizard.tsx:388` | Consultants PI-limit helpText: "Professional indemnity cover pays out if a client claims your advice or work caused them a financial loss." | A factual/generic definition, lower risk than the line above, but still asserts unqualified coverage behaviour rather than "typically" or "in general" phrasing. |
| `src/components/quote/ResultScreen.tsx` (referred card) | "In a real broker set-up, this is exactly the kind of case that would go to a human underwriter rather than being declined outright." | Describes "a real broker set-up" in a way that could imply this demo has that capability. It doesn't — see point 4. |
| `src/components/quote/ResultScreen.tsx` (referred/declined cards) | "Leave your details below and we can follow up once it's been reviewed" / "if you'd like us to check with others" | See point 4 — these are promises the system has no way to keep today. |
| `src/lib/assistant/systemPrompt.ts` | The assistant's own explanatory text (Claude-generated, not fixed copy) for a completed quote | Free-form model output, not reviewed or filtered before being shown — see point 5. |

## 4. Promises the system can't currently keep

The referred/declined outcomes, and the "save and resume" / post-quote
lead capture (`src/components/quote/LeadCaptureCard.tsx`,
`src/components/assistant/SaveAndResumeForm.tsx`), all describe or imply
a human follow-up: an underwriter reviewing a referred case, someone
checking with other insurers, an email with a resume link. None of that
is actually built — there's no email provider wired up
(`src/app/api/lead/capture/route.ts` says so honestly in a comment), and
no real underwriter workflow exists. The UI copy is honest about the
"no real email sent" part in the save-and-resume confirmation message,
but less explicit about it at the point the promise is first made
(the referred/declined cards, and the initial lead-capture prompt).
Worth deciding whether that's clear enough, independent of the FCA
questions above — an unmet promise is a trust problem even where it
isn't a regulatory one.

## 5. A gap worth knowing about: guardrails are prompt-only

The assistant's system prompt (`src/lib/assistant/systemPrompt.ts`)
explicitly instructs Claude not to give regulated advice, not to invent
coverage details, and to say plainly when something is out of scope —
and in testing during this build, it followed those instructions
correctly. But that's the only line of defence: there is no independent,
deterministic check on the assistant's actual output (the chat replies,
or the "why this price" explanation text) before it reaches the user. If
the model ever drifted from its instructions — which is possible for any
LLM, not specific to this one — nothing downstream would catch it. Worth
deciding whether that residual risk is acceptable for a demo audience, or
whether it needs some form of output-side check before this goes in
front of real customers.

## What this review did not do

- It didn't check the Privacy Policy or Terms of Use drafts
  (`src/app/privacy/page.tsx`, `src/app/terms/page.tsx`) against FCA
  rules specifically — those need the same compliance-professional review
  called out in their own "where this needs work" sections.
- It didn't attempt to classify anything against the FCA's actual
  financial promotion exemptions (e.g. whether a sufficiently prominent
  "for illustration only, not a real offer" framing would exempt this
  under existing guidance) — that determination needs someone qualified
  to make it, not an inference from the code.
