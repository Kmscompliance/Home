# KMS Compliance Ltd — Legitimate Interests Assessment (Outreach)

**Status: DRAFT.** Not reviewed by a qualified solicitor/DPO. Contains
unresolved placeholders and a scope mismatch flagged at the bottom of
this file — do not treat as a valid, operative LIA until both are
resolved and it's signed off by Matt/Marc.

**Controller:** KMS Compliance Ltd
**Registered office:** [REGISTERED ADDRESS]
**Company number:** [COMPANIES HOUSE NUMBER]
**ICO registration number:** [ICO REGISTRATION NUMBER]
**Assessment owner:** Matt Gunn / Marc Smart, Co-Directors
**Date of assessment:** [DATE]
**Review date:** [DATE + 12 MONTHS, or sooner if the outreach method/data source changes]

## Activity being assessed
Direct marketing outreach (email and direct mail) to sole traders,
partnerships, and small founder-led firms in the motor trade sector,
sourced from Companies House public register data and held in KMS's
Notion Lead CRM, promoting the FCA Launch Pad authorisation support
service.

> **See "Open issues" at the bottom — this activity description is
> narrower than what the rest of this repo is built for.**

## Step 1 — Purpose Test: What is the legitimate interest?
- KMS Compliance Ltd has a genuine commercial interest in promoting FCA
  authorisation support services to firms that plausibly need FCA
  authorisation to trade lawfully (motor trade firms offering
  finance/insurance arrangements typically require FCA permissions).
- This is a legitimate business interest recognised under UK GDPR
  Recital 47, which specifically names direct marketing as a potential
  legitimate interest.
- The interest is real and specific, not speculative: KMS has an
  identifiable service (FCA Launch Pad) that addresses a genuine
  regulatory need for a defined, identifiable segment of firms.
- There is also a wider public-interest dimension worth recording:
  unauthorised trading in regulated activities is a harm the FCA itself
  seeks to prevent, so outreach that helps eligible firms get authorised
  has a legitimate secondary benefit beyond KMS's commercial interest.
  This does not change the legal basis but strengthens the balancing
  test below.

**Conclusion:** Legitimate interest identified and lawful
(Article 6(1)(f) UK GDPR).

## Step 2 — Necessity Test: Is the processing necessary for that purpose?
- Processing involves: business contact details (name, role/title where
  available, business email, business phone, company name, company
  number, registered/trading address, SIC code) drawn from Companies
  House.
- No special category data, no financial data, no data about the
  individual's private life is processed.
- Direct marketing to a targeted, sector-specific list is a
  proportionate and necessary way to reach firms likely to need FCA
  authorisation — there is no less intrusive way to identify and
  contact this specific population at comparable cost and reach (e.g.,
  broad advertising would not target the regulatory need as precisely,
  and would process more data on more people who don't need the
  service).
- Data minimisation is applied: only fields relevant to identifying and
  contacting a business decision-maker are collected; no scraping of
  personal social profiles, no inference of protected characteristics,
  no combining with data from unrelated sources.

**Conclusion:** Processing is necessary and proportionate; no less
intrusive means reasonably achieves the same purpose.

## Step 3 — Balancing Test: Do the individual's interests override the legitimate interest?

**Factors favouring the individual:**
- Individuals (particularly sole traders, who are "individuals" for UK
  GDPR/PECR purposes) have a reasonable interest in not receiving
  unsolicited marketing.
- Companies House data was collected for public transparency/regulatory
  purposes, not for marketing — this is a "purpose limitation"
  consideration the ICO expects controllers to weigh.
- Some contacts may not expect a compliance consultancy to contact them
  off the back of public filings.

**Mitigating factors / safeguards in place:**
- Outreach is limited to business contact details only, used in a
  business context, about a business-relevant service — not personal
  correspondence.
- The nature of the marketing (regulatory compliance) is directly
  relevant to the recipient's professional obligations, which the ICO
  treats as reducing intrusiveness (relevant, expected-in-substance
  content, not an unrelated hard sell).
- A clear, working opt-out/unsubscribe mechanism is provided in every
  communication (PECR requirement, and also required under Article 21
  UK GDPR for the right to object).
- No automated decision-making or profiling beyond simple sector/SIC-
  based list filtering.
- Data is not sold, shared, or disclosed to third parties beyond
  [DOCMAIL/INTELLIPRINT AS MAILING PROCESSOR — confirm DPA/data
  processing agreement is in place].
- Retention is time-bound: contact data is deleted or suppressed after
  [X months, e.g. 12] of no engagement, or immediately on
  opt-out/objection.
- An Article 14 privacy notice (`article-14-privacy-notice.md`) is
  proactively signposted in the first communication, satisfying
  transparency obligations and giving the individual a genuine, informed
  opportunity to object.
- KMS maintains a suppression list so that opted-out contacts are never
  re-added, including if the same lead resurfaces via a later Companies
  House pull.

**Reasonable expectations test:**
A business contact whose company is on public record, operating in a
regulated-adjacent sector (motor trade finance/insurance), could
reasonably expect to be contacted by relevant professional service
providers about regulatory obligations relevant to their trade — this
is a lower-intrusion context than, for example, contacting them about
an unrelated consumer product.

**Conclusion:** With the safeguards above in place — particularly the
working opt-out and the Article 14 notice — KMS's legitimate interest is
not overridden by the individual's interests, rights, or freedoms.
**Legitimate interests is a valid lawful basis for this processing,
provided the safeguards below remain operative.**

## Conditions attached to this LIA (must remain true for the assessment to hold)
1. Every marketing email/letter contains a clear, no-cost, immediate
   opt-out.
2. The Article 14 notice is linked/referenced in the first contact with
   any new lead.
3. Opt-outs are actioned and suppressed within [ICO guidance suggests as
   soon as possible, and PECR/DPA 2018 expects no undue delay —
   recommend committing to within 48 hours].
4. Data is reviewed/purged on the retention schedule set in the Article
   14 notice.
5. No special category data is inferred or collected about individuals.
6. This LIA is re-reviewed if: the data source changes, the outreach
   channel changes (e.g., adding SMS or social media DMs), or the
   service being marketed changes materially — **including the scope
   change flagged below.**
7. Sole traders and partnerships are flagged in the CRM as "individual
   subscribers" for PECR purposes and are subject to the same soft
   opt-in scrutiny as any consumer marketing — i.e., no cold email to a
   sole trader without confirming a lawful PECR basis for that specific
   contact (legitimate interest under GDPR does not by itself authorise
   unsolicited email marketing under PECR to an individual subscriber;
   PECR requires either consent or the narrow "soft opt-in" exception
   for existing customers, which will rarely apply to cold Companies
   House leads). **Recommend legal confirmation on whether cold email to
   sole-trader leads requires consent rather than opt-out-only
   treatment.** (This matches — and doesn't loosen — the sole trader
   rule already in `CLAUDE.md` §7 and `gdpr-sales-pipeline.md`.)

**DPIA screening outcome:** This activity does not meet ICO high-risk
triggers (no special category data, no large-scale systematic
profiling, no automated decision-making with legal/similar effect, no
vulnerable data subjects targeted as a category). A full DPIA is not
required, but this LIA should be kept on file as the documented risk
assessment.

**Sign-off:**

| Name | Role | Date |
|---|---|---|
| Matt Gunn | Co-Director | |
| Marc Smart | Co-Director | |

## Open issues before this LIA is operative
1. **Scope mismatch.** This LIA's "Activity being assessed" covers only
   the motor trade sector. `CLAUDE.md` §3 scopes the whole business —
   and this LIA — to the full consumer credit regulated-activity
   perimeter (Hire Purchase, HCSTC, credit broking generally, debt
   activities, P2P, etc.), not just motor trade. As written, this LIA
   only provides lawful-basis cover for motor trade outreach. Either
   widen "Activity being assessed" to the full list before
   `sales-outreach` emails outside motor trade, or keep outreach
   confined to motor trade until that's done — don't let the two drift
   apart silently.
2. **Direct mail is new.** This is the first mention of a direct-mail
   channel (Docmail/Intelliprint) anywhere in this repo — everything
   built so far (`CLAUDE.md` §7, `sales-outreach`) is email-only via
   Gmail. Confirm whether direct mail is actually happening: if not,
   strip it from this LIA rather than assessing an activity that isn't
   real; if it is, a data processing agreement with that mailing
   provider needs confirming (see the bracketed note above), and
   `sales-outreach`'s scope needs updating to reflect it.
3. **Every `[SQUARE BRACKET]` placeholder** — registered address,
   company number, ICO registration number, retention period, mailing
   processor DPA status — is a fact only Matt/Marc hold. No agent should
   fill these in; they need resolving before sign-off.
4. **Still not reviewed by a solicitor/DPO.** The document's own status
   line says this — treat that as accurate, not a formality.
