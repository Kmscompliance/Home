# KMS Compliance Ltd — Local Agents for Sales Pipeline/CRM + FCA Policy Scout

Scoping document for two workstreams: (1) local Claude Code agents that keep
building and maintaining the sales pipeline/CRM, and (2) a dedicated agent
that tracks FCA legislative/consultation activity to find new consumer
credit verticals beyond motor finance/car dealerships, with a South
East/Essex sales focus.

## 1. Local agents for the sales pipeline & CRM

"Local agents" in Claude Code means a combination of:

- **Subagents** (`.claude/agents/*.md`) — specialised roles invoked on demand
  or by a coordinator (e.g. prospect researcher, outreach drafter, pipeline
  updater, reporting agent).
- **Skills** (`.claude/skills/*`) — repeatable playbooks (e.g. "qualify a
  new lead", "weekly pipeline review", "draft a follow-up sequence").
- **Routines** — scheduled triggers so agents run on a cadence without
  manual invocation (e.g. Monday morning pipeline digest, daily stale-deal
  check).
- **Connectors** — this environment already has Gmail, Microsoft 365
  (Outlook/Teams/SharePoint), Google Drive, and Notion available, which
  covers outreach logging, document storage, and a CRM-style database.

### Candidate agents

| Agent | Role | Effort to build |
|---|---|---|
| Prospect researcher | Finds/qualifies leads (car dealerships now, other consumer credit intermediaries later) in target geography | 0.5–1 day |
| Outreach drafter | Drafts emails/call notes, logs activity against a CRM record | 0.5–1 day |
| Pipeline updater | Keeps deal stages current, flags stale/at-risk deals | 0.5–1 day |
| Reporting agent | Weekly pipeline health summary, conversion metrics | 0.5 day |
| FCA policy scout | See section 2 | 2–4 days |

### Setup steps & effort

1. **Pick the system of record for the CRM.** This repo currently has no
   CRM data or code in it (just a `.gitignore`) — the single biggest
   effort driver is whether we build a lightweight CRM here (e.g. a Notion
   database, or structured files in this repo) versus integrating with an
   existing CRM tool via its API. 0.5–2 days depending on choice.
2. **Repo scaffolding:** `CLAUDE.md` with company/CRM context, agent
   definitions, skill playbooks. ~1 day.
3. **Build the core agents** above and iterate on their prompts against
   real data. ~2–5 days combined, plus an ongoing tuning period (expect
   1–2 weeks of refinement before they're reliably low-touch).
4. **Wire up Routines** for recurring runs (digests, stale-deal checks).
   ~0.5 day.
5. **Connect email/calendar** for activity logging (Gmail/Outlook already
   available as connectors). ~0.5–1 day.

**Rough total for a first working version: 1.5–3 weeks of part-time effort**,
less if we integrate with an existing CRM that already has a clean API and
no new data model is needed, more if we're designing a bespoke data model
and migrating existing pipeline data into it.

### Open questions that materially change scope
- Where does pipeline data live today (spreadsheet, an existing CRM tool,
  nothing formal yet)?
- Expected lead/deal volume (changes whether a spreadsheet/Notion DB is
  enough or a proper database is needed)?
- Should agents run unattended on a schedule, or only when invoked?

## 2. FCA policy/consultation scout — market expansion research

### Objective
Continuously monitor FCA (and HM Treasury) regulatory activity to surface
opportunities for KMS Compliance to extend its consumer credit compliance
engagement beyond motor finance/car dealerships.

### What it would track
- FCA Consultation Papers (CP) and Policy Statements (PS), especially
  changes to **CONC** (Consumer Credit sourcebook).
- **Motor finance / credit broking** — the live FCA motor finance discretionary
  commission redress work is directly relevant to KMS's current client base
  and should be watched closely regardless of expansion plans.
- **High-Cost Short-Term Credit (HCSTC / payday lending)** — CONC 5A/6.7.
- Home-collected credit, rent-to-own, guarantor loans, logbook loans
  (bills of sale).
- Debt collecting / debt administration / debt counselling.
- Peer-to-peer lending.
- **Buy Now Pay Later (BNPL)** — newly coming into FCA regulation; likely
  one of the biggest near-term opportunities given how new the compliance
  requirements will be for BNPL providers/brokers.
- The wider HMT/FCA Consumer Credit Act reform programme.

### Sources
FCA news/publications and Handbook pages, FCA consultation papers index,
HM Treasury policy papers, the FCA Register (for market/competitor
mapping), and trade press for secondary signal. These would be pulled via
web search/fetch on a schedule rather than a single one-off read, since
consultations open and close over months.

### Output
A structured digest (new/changed rules, consultation deadlines worth
responding to, and opportunity flags mapped to what KMS could plausibly
add) delivered to Notion or email on a weekly or fortnightly cadence via a
Routine.

### Important regulatory caveat
This agent can research and flag opportunities, but **actually adding a
new regulated activity requires a permissions decision**, not just a
sales decision:
- Confirming KMS Compliance Ltd's current FCA permissions (Part 4A) on the
  FS Register.
- Either a Variation of Permission (VoP) application to the FCA, or
  operating under a principal as an Appointed Representative for the new
  activity.
- That step is a compliance/legal decision for a qualified person at KMS.
  The agent should be treated as research support only, never as
  regulatory advice or a substitute for that sign-off.

### Geographic focus (South East / Essex)
FCA permissions are national — geography doesn't change what's
regulatorily possible. It does change **where to sell**: the agent can
cross-reference regulatory findings against local car dealership networks,
HCSTC/BNPL providers or brokers active in the South East/Essex, and local
introducer relationships, to prioritise which new-vertical opportunities
are worth pursuing first given the existing regional footprint.

### Setup & effort
~2–4 days to build (source integration, digest formatting, delivery via
Notion/email Routine). Ongoing running cost is low since it's a scheduled
job; it still needs a human compliance reviewer to sign off before any
finding turns into an actual permissions change.
