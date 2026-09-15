# KMS Compliance Ltd — Home

Context for any agent working in this repo. This file is the shared
brief — read it before running any agent in `.claude/agents/`.

## 1. Who we are
KMS Compliance Ltd is a small, independent UK FCA compliance advisory,
co-directed by Matthew Gunn and Marc Smart. KMS is **not itself
FCA-authorised and does not need to be** — it advises other firms that
carry out FCA-regulated consumer credit activities: helping them get
authorised, keeping them compliant once they are, and fixing things when
they've gone wrong.

**Service lines:**
- **FCA Launch Pad** — helping firms get authorised.
- **FCA Guard** — ongoing compliance support for authorised firms.
- **Health Check & Rescue** — remediation for firms with compliance issues.

**Current client base:** car dealerships (motor finance / credit
broking), concentrated in the **South East and Essex**.

**Contact:** `admin@kmscompliance.com` · `07368 387972`.

**Brand:** Canva brand kit `kAGyr1qCMpE` ("KMS Compliance LTD") holds the
logo and visual identity — any agent generating branded material (Canva
designs, proposals) should pull from that kit rather than inventing one.

## 2. Positioning — how everything we write should sound
Deliberately **small and able to pivot** — the opposite pitch to a
big-name compliance consultancy. Existing outreach copy (Canva designs
"KMS Compliance - New Client Outreach Email" and "KMS Outreach Email -
Motor Trade") already establishes the working tone — match it rather
than inventing a new one:

- Tagline: **"Turn Compliance Into a Competitive Advantage."**
- Open by naming the cost of *not* being compliant in terms the firm
  feels directly (e.g. "you're turning away customers who want finance
  and taking their business elsewhere"), then reframe compliance as
  unlocked revenue, not overhead, before introducing KMS.
- **Ex-FCA line (already in production copy):** "Led by an ex-FCA
  employee, KMS Compliance helps sole traders and small firms get
  authorised and stay compliant, proportionately and in plain English."
  Longer-form material (proposals, a "why KMS" page) can use the fuller
  version: Matthew Gunn worked at the FCA during the 2014 transfer of
  consumer credit regulation from the OFT, supporting firms through
  authorisation as part of the programme that brought roughly 50,000
  consumer credit firms through the FCA's Connect portal — i.e. he has
  seen authorisation from the regulator's side, on the exact population
  of firms KMS now advises.
  **Guardrail:** describe this experience accurately; never imply it
  gives KMS special access, influence, or an inside track with the
  current FCA. "Understands what the FCA actually looks for" — fine.
  Anything implying contacts, favours, or fast-tracking — never.
- Plain English, proportionate to a small firm's size, no regulatory
  jargon dumped on the reader.
- Target client: small-to-medium firms with thin or no in-house
  compliance function — not large national lenders or listed groups.

## 3. Regulated activities in scope — full consumer credit perimeter
Per the FCA's Regulated Activities Order, Part 2:

- **Lending** — entering into a regulated credit agreement as lender,
  across its product forms: Hire Purchase & conditional sale,
  High-Cost Short-Term Credit (HCSTC/payday), home-collected credit
  (doorstep lending), logbook loans (bills of sale), guarantor loans,
  rent-to-own, running-account/revolving credit, unsecured personal
  loans, and Buy Now Pay Later as it comes into regulation.
- Exercising, or having the right to exercise, a lender's rights and
  duties under a regulated credit agreement (loan-book/debt purchasers).
- **Consumer hire** — entering into a regulated consumer hire agreement
  as owner, and exercising an owner's rights/duties under one.
- **Credit broking** — introducing/arranging credit; our current base
  (car dealerships arranging motor finance), plus other intermediaries,
  comparison sites, and appointed representatives.
- **Debt-related activities** — debt adjusting, debt counselling, debt
  collecting, debt administration.
- **Credit information** — providing credit references, providing
  credit information services.
- **Peer-to-peer/platform lending** — operating an electronic system in
  relation to lending.

Near-term priority (given the existing motor-finance base): Credit
Broking, Hire Purchase, and HCSTC — but every agent should treat the
full list above as in scope, not just those three.

## 4. Geography
South East and Essex are the sales/prospecting focus for outreach and
lead-sourcing. The research repository is national in scope, since FCA
rules and publications aren't regional.

## 5. CRM — system of record
The sales pipeline/CRM lives in Notion, **not** in this repo:

- **KMS Compliance — Lead CRM** — `https://app.notion.com/p/66645caa525c49bd8ae473aed9979361`
  (data source: `collection://7c0d5e57-bfe9-4815-9b1e-6c3f2d9357fc`)
  Key properties: Firm Name, Stage (New Lead → Contacted → Negotiating →
  Proposal Sent → Won/Lost/Not Qualified), Region (Essex, East London,
  Hertfordshire, Kent, National), Regulated Activity, Service Interest,
  FCA Status, Next Action / Next Action Date, Estimated Value.
  Has an "🎯 Essex Leads" / "🎯 Essex Pipeline" filtered view already.
- **🏢 KMS Compliance — HQ** — `https://app.notion.com/p/357aac9aa77b81cf971ee7eb9629a159`
  central workspace page.
- **📚 FCA & Consumer Credit Research Repository** — `https://app.notion.com/p/f9284c444ba8423a8cb2fe13d12168a0`
  (data source: `collection://053647f2-a74d-47c1-914c-2e5aa4bbdeb3`)
  Standing knowledge base of FCA/HMT regulatory material across the full
  activity list in section 3 — not just a sales-opportunity log. See
  `research-repository` agent.

Any agent that touches leads/deals reads/writes the Notion CRM via the
Notion MCP tools (`notion-fetch`, `notion-query-data-sources`,
`notion-create-pages`, `notion-update-page`) — do not create a parallel
CRM in this repo.

## 6. Lead sourcing — Companies House
The Companies House API connection is already active in this
environment (look it up via ToolSearch rather than assuming a name).
Use it to search by SIC code and Essex/South East postcodes for
candidate firms across the activities in section 3, and to confirm a
company is real, active, and trading (incorporation date, status,
filing history, officers) before it goes in the CRM.

## 7. Email outreach — rules that must never be skipped
All outreach sends from **admin@kmscompliance.com** (Gmail).

- **Draft, don't auto-send**, until explicitly told otherwise. Every
  outreach email is created as a Gmail draft for Matthew/Marc to review
  and send, not sent automatically.
- **Every cold outreach email must include an opt-out line** — e.g. "Don't
  want to hear from us again? Reply 'unsubscribe' and we'll stop." — this
  is already standard in existing KMS templates and is a PECR
  requirement for unsolicited direct marketing email in the UK, not just
  a style choice. Any reply containing "unsubscribe" (or similar) must
  immediately update that CRM record so it's excluded from all future
  outreach — never treat it as just a note.
- **Sole traders and unincorporated partnerships are treated differently
  under PECR than limited companies.** A limited company's generic
  business contact is a "corporate subscriber" and can generally be
  cold-emailed with an opt-out. A sole trader or partnership counts as an
  "individual subscriber," which generally needs either consent or a
  "soft opt-in" (an existing relationship) before cold marketing email is
  sent — check Firm Type before adding a contact to an outreach batch,
  and flag sole trader/partnership leads for human review rather than
  emailing them the same way as limited companies.
- **Sending volume must ramp, not jump.** A brand-new or lightly-used
  sending address that suddenly sends a large batch of cold emails risks
  spam-filtering or a domain reputation hit that damages
  admin@kmscompliance.com for all legitimate use, including client
  correspondence. Confirm current sending volume/domain authentication
  (SPF/DKIM/DMARC on kmscompliance.com) before scaling up daily volume —
  see `PROPOSAL-local-agents-crm-fca-scout.md` for the open questions on
  this.

## 8. Growth target (in progress — see open questions)
The business wants a steady flow of qualified lead conversations — the
exact daily/weekly outreach volume and reply-rate target is still being
finalised with Matthew (see the proposal doc). Until that's set, agents
should default to **quality and personalisation over raw volume**: a
well-targeted, personalised email that matches a firm's specific
regulated activity outperforms a generic blast, and a damaged sending
domain is much harder to fix than a slow start.

## 9. Standard of practice
`.claude/standards/` is not optional background reading — it's the bar
every agent is held to whenever it produces anything about a specific
firm (outreach, a proposal, scoping advice):

- `advisory-standard.md` — write and reason as a 20+ year UK compliance
  partner would: grounded in the specific firm's facts, never a
  template, no overselling, no false certainty on a live regulatory
  question.
- `client-research-protocol.md` — the five things to establish about a
  firm (regulatory profile, business profile, signals of change, fit
  across the three service lines, then and only then draft) before
  writing anything client-facing about them.
- `gdpr-sales-pipeline.md` — how the pipeline itself must handle personal
  data (lawful basis, the Article 14 notice, minimisation, retention,
  objections/erasure) — separate from the PECR email rules in §7 below.
  **Not verified by a data protection professional — treat it as a
  working baseline, not settled legal advice**, and see its own
  outstanding action items (an LIA and a privacy notice, both owed to
  Matthew/Marc, not something an agent should draft and assume correct).

`sales-outreach` must follow all three before drafting any email. Any
future agent that produces client-facing material (proposals, onboarding,
a health-check report) should be pointed at these files too.

## 10. Agents
See `.claude/agents/`:
- `sales-outreach` — Companies House lead sourcing + CRM + drafted,
  brand-matched outreach email.
- `pipeline-updater` — CRM hygiene (stale deals, missing next actions).
- `pipeline-reporter` — weekly pipeline health summary.
- `research-repository` — builds and maintains the FCA/HMT knowledge
  base in Notion.

`PROPOSAL-local-agents-crm-fca-scout.md` has the original scoping notes,
effort estimates, and currently-open questions (growth target number,
email sending posture, domain warm-up status).
