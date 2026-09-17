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

**Contact:** `admin@kmscompliance.com` · `07368 387972` · TikTok:
`https://www.tiktok.com/@kms_compliance`.

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

### SIC code mapping — Companies House sourcing
Expanded 2026-09-17 at Matthew's request, beyond the original motor-trade
codes, to cover more of the perimeter above. Pass all of these to
`advanced-search`'s `sic_codes` parameter (comma-separated) when sourcing:

- **Lenders / credit grantors** — `64921` (mortgage finance companies),
  `64922` and `64929` (other credit granting institutions n.e.c. — HCSTC,
  home-collected credit, logbook loans, guarantor loans, rent-to-own
  credit, revolving credit, unsecured personal loans; Companies House
  data shows both codes actively self-selected, not just one — added
  `64922` 2026-09-17 after a live search turned up a strong-fit lender
  using it that the original `64921`/`64929`-only list would have missed),
  `64910` (financial leasing — hire purchase/finance lease providers).
- **Credit brokers / mortgage brokers / other intermediaries** — `66190`
  (activities auxiliary to financial intermediation n.e.c. — the code most
  credit brokers and mortgage brokers/advisers self-classify under),
  `64999` (financial intermediation n.e.c. — also used by some brokers and
  P2P platforms, which have no dedicated SIC code).
- **Debt-related / credit information** — `82910` (activities of
  collection agencies and credit bureaus — debt collectors, debt
  purchasers, credit reference agencies).
- **Car dealerships** (existing base) — `45111` (sale of new cars and
  light motor vehicles), `45112` (sale of used cars and light motor
  vehicles), `45190` (sale of other motor vehicles), `45400` (motorcycle
  dealers — also broke finance).
- **Hire companies** (consumer hire) — `77110` (renting/leasing of cars
  and light motor vehicles), `77120` (renting/leasing of trucks and other
  heavy vehicles), `77299` (renting/leasing of other personal and
  household goods n.e.c. — rent-to-own furniture/appliances/electronics),
  `77390` (renting/leasing of other machinery, equipment and tangible
  goods n.e.c.).

**Insurance brokers/agents (`66220`, `66290`) are deliberately excluded**
— insurance distribution isn't a consumer credit activity under RAO Part 2
and isn't covered by the list above, so it sits outside this section's
scope and outside the draft LIA/Article 14 notice too. Don't add it
without Matthew/Marc confirming it as a new vertical first — that would
need both this section and the data-protection drafts widened again, the
same way motor-trade-only was widened to the full list above on
2026-09-16.

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
There is no dedicated connector — `sales-outreach` calls the real
Companies House REST API directly over `Bash`, authenticated with a key
the user stores locally in a `.env` file at the repo root (see
`sales-outreach.md` for the exact mechanism; the key is never committed
to this repo). This only works when run from an environment whose
network isn't blocked to `api.company-information.service.gov.uk` —
**as of 2026-09-17, this repo runs locally via Claude Code on a Windows
PC for that reason** (the cloud session this was originally built in has
that domain blocked by its own network policy and can't be used for
Companies House work).

Candidates are found via Companies House's **Advanced Search** endpoint
(`/advanced-search/companies`, filterable by SIC code, location,
company status, and incorporation date — confirmed working live
2026-09-17 against real Essex consumer-credit firms), not a bulk CSV
download. Default target profile is companies **incorporated in the
last 12 months** (computed dynamically, not a fixed date) — newly
registered firms are the ones most likely to still need FCA
authorisation, which is the current outreach focus. `location` is a
free-text match against the address, reliable for county names like
Essex/Kent but not for "East London" as a concept — that needs a
broader query filtered afterwards by postcode prefix. The ordinary
per-company endpoint is then used to verify each candidate is still
active before it goes in the CRM. See `sales-outreach.md` for the exact
SIC codes and mechanism.

**FCA Register check — confirmed working live 2026-09-17.** After a
Companies House candidate is found, `sales-outreach` searches the FCA
Register by name (`/Search?type=firm`) and matches the right result via
its "Companies House Number" field (names collide — this is the only
reliable match), not by name or postcode alone. Uses a separate account
and key from Companies House, stored in `.env` as
`FCA_REGISTER_API_EMAIL`/`FCA_REGISTER_API_KEY`
(`x-auth-email`/`x-auth-key` headers, `Content-Type: application/json`,
rate limit 50 requests/10 seconds — much tighter than Companies House's).
Genuinely unauthorised firms are the active outreach target right now;
already-authorised firms are still logged accurately in the CRM but
deferred to a later FCA Guard/Health Check & Rescue outreach phase, per
Matthew's instruction, rather than emailed now.

## 7. Email & telephone outreach — rules that must never be skipped
Outreach currently runs on two channels only: email from
**admin@kmscompliance.com** via **Outlook/Microsoft 365** (not Gmail —
corrected 2026-09-16), and telephone calls made directly by
Matthew/Marc. No direct mail, no third-party mailing house or call
centre.

- **Draft, don't auto-send**, until explicitly told otherwise. Every
  outreach email is created as an Outlook draft for Matthew/Marc to
  review and send, not sent automatically.
- **Every cold outreach email must include an opt-out line** — e.g. "Don't
  want to hear from us again? Reply 'unsubscribe' and we'll stop." — this
  is already standard in existing KMS templates and is a PECR
  requirement for unsolicited direct marketing email in the UK, not just
  a style choice. Any reply containing "unsubscribe" (or similar) must
  immediately update that CRM record so it's excluded from all future
  outreach — never treat it as just a note.
- **Calls need the same discipline as email.** No automated or recorded
  calls. Before calling a sole trader or partnership, that number should
  be checked against the Telephone Preference Service (TPS) — a limited
  company's general business line has no TPS protection, but any verbal
  "don't call again" during a call is actioned immediately and
  suppresses that contact from *all* channels, not just future calls.
  Agents can't place calls themselves — their role is call prep (see
  `client-research-protocol.md`) and logging outcomes a human reports
  back, including any objection.
- **Sole traders and unincorporated partnerships are treated differently
  under PECR than limited companies — for calls as well as email.** A
  limited company's generic business contact is a "corporate subscriber"
  and can generally be cold-contacted with an opt-out. A sole trader or
  partnership counts as an "individual subscriber," which generally
  needs either consent or a "soft opt-in" (an existing relationship)
  before cold marketing email is sent, and TPS screening before a call —
  check Firm Type before adding a contact to an outreach batch, and flag
  sole trader/partnership leads for human review rather than contacting
  them the same way as limited companies.
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
  working baseline, not settled legal advice.**
- `data-protection/` — a drafted Legitimate Interests Assessment and
  Article 14 privacy notice, now widened to the full activity list in
  §3 and corrected to the real channels (Outlook email + telephone, no
  direct mail). **Still not operative:** several factual placeholders
  remain, and neither document has Matthew/Marc's sign-off or a
  solicitor's review yet.

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
