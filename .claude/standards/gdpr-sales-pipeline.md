# GDPR — sales pipeline

**This is not legal advice.** It's a working standard for how agents in
this repo should handle personal data while sourcing leads, building the
CRM, and sending outreach — written to a sensible, defensible baseline,
not verified by a data protection solicitor. Given KMS advises other
firms on regulatory compliance, its own data protection practice should
be at least as careful as what it'd expect from a client — get this
document checked by a data protection professional (or the ICO's own
guidance for small businesses) before treating it as settled, and
definitely before volume scales up.

This sits alongside `advisory-standard.md` and
`client-research-protocol.md`. `CLAUDE.md` §7 already covers PECR
(the email-specific opt-out rules) — this document is broader: it
covers the personal data itself, not just the marketing email channel.

## Why this applies at all
A name, job title, or work email tied to an identifiable person is
personal data under UK GDPR, even when it comes from a public source
like Companies House or a company website, and even though the *company*
itself isn't a "data subject." Sourcing a director's name from Companies
House and adding it to the CRM is processing personal data — it needs a
lawful basis and fair handling like any other processing, not just a
PECR-compliant opt-out on the email.

## 1. Lawful basis: legitimate interests, not consent
For ordinary B2B marketing to a business contact, the usual lawful basis
is **legitimate interests** (UK GDPR Art. 6(1)(f)), not consent — cold
B2B outreach doesn't need prior consent the way direct consumer
marketing might. But legitimate interests isn't a free pass; it requires
being able to show:
- **Purpose test** — there's a genuine business reason (offering a
  relevant compliance service to a firm that appears to need it).
- **Necessity test** — processing this data (name, business email,
  company details) is a reasonably necessary way to achieve that.
- **Balancing test** — KMS's interest in reaching the firm doesn't
  override the individual's own rights and reasonable expectations
  (e.g. a named individual would reasonably expect their publicly-listed
  role at a trading company to result in some business contact — this
  gets weaker the more personal/less business-relevant the data point).

Keep this simple and written down once as a short legitimate interests
assessment (LIA) covering the sales-outreach agent's activity, rather
than re-deriving it per lead. **This doesn't exist yet — flag it as an
action item for Matthew/Marc rather than drafting it yourself; it should
be signed off by them, not generated and assumed correct.**

## 2. Right to be informed — Article 14
Because this data isn't collected *from* the individual directly (it's
sourced from Companies House / their company website), UK GDPR Article
14 requires telling them specific things, generally at first contact:
who KMS is, why they're being contacted, the lawful basis relied on,
roughly how long the data will be kept, their rights (including to
object), and — notably — **where the data came from**.

**Concretely: the first outreach email to a new contact should carry
more than the PECR opt-out line already required by `CLAUDE.md` §7.** It
should also say, briefly, how KMS found them (e.g. "via your company's
Companies House filing") and link to a fuller privacy notice. **Check
whether kmscompliance.com already has a privacy notice covering this —
if not, that's a prerequisite to build, not something `sales-outreach`
should improvise inline.** Until confirmed, `sales-outreach` should flag
this gap in its output rather than silently omitting the notice.

## 3. Data minimisation
Only bring into the CRM what's actually needed to run the pipeline:
business name, business contact details, role, and the regulated-activity
facts relevant to fit assessment. Don't pull in extra personal detail
Companies House exposes (full date of birth, residential address on
older filings, other directorships) just because it's available —
`client-research-protocol.md`'s business-profile step is about the
*company*, not building a personal dossier on an individual director.

## 4. Retention
Leads that go nowhere shouldn't sit in the CRM indefinitely.
- **Not Qualified / Lost** with no activity for a meaningful period
  (e.g. 12 months) should be reviewed for deletion, not kept "just in
  case." `pipeline-updater` should flag these for a retention decision
  as part of its hygiene pass — deleting isn't its call to make alone,
  but leaving stale personal data unreviewed indefinitely isn't
  compliant by default either.
- There's no fixed retention schedule agreed yet — that's a decision for
  Matthew/Marc, not something to invent.

## 5. The right to object and erasure requests
- Anyone can object to processing based on legitimate interests (UK
  GDPR Art. 21), separately from a PECR "unsubscribe." An objection —
  in whatever words it arrives — means stop processing that person's
  data for this purpose, not just stop emailing them; treat it the same
  way `CLAUDE.md` §7 already treats "unsubscribe": immediate, and it
  overrides everything else.
- A request to delete/erase their data entirely is a different, broader
  request than opting out of marketing — if one arrives, flag it for a
  human to handle rather than an agent silently deciding how far it
  goes (it may need to be actioned across Notion, Gmail threads, and
  anywhere else the data was copied).

## 6. Security and processors
Notion, Gmail/Google Workspace, and Canva are all acting as data
processors for whatever personal data passes through them — standard
enterprise terms from these vendors generally cover this, but no agent
should copy lead data out to a fourth tool/service without checking that's
appropriate first.

## 7. ICO registration
Confirm KMS's ICO data protection register entry actually covers direct
marketing/processing personal data for prospecting — this was already
flagged as an open item in an earlier conversation and still needs
Matthew/Marc to confirm, not something an agent can verify on its own.

## What this means for `sales-outreach` right now
Until the LIA and privacy notice above exist:
- Keep sourcing and CRM fields to the minimum in section 3.
- Note in every batch of outreach drafts that the Article 14 notice
  and LIA are outstanding prerequisites — don't quietly proceed as if
  they're solved.
- Treat any reply that reads as an objection or erasure request (not
  just "unsubscribe") as needing immediate human handling, flagged
  clearly rather than filed as a routine CRM update.
