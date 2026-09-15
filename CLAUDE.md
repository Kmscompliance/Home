# KMS Compliance Ltd — Home

Context for any agent working in this repo.

## The business
KMS Compliance Ltd is a UK FCA compliance consultancy, co-directed by
Matthew Gunn and Marc Smart. KMS is **not itself FCA-authorised and does
not need to be** — it advises other firms on becoming FCA-authorised,
varying their permissions, and staying compliant. Service lines:

- **FCA Launch Pad** — helping firms get authorised.
- **FCA Guard** — ongoing compliance support for authorised firms.
- **Health Check & Rescue** — remediation for firms with compliance issues.

Current client base: car dealerships (motor finance / credit broking),
concentrated in the **South East and Essex**.

## CRM — system of record
The sales pipeline/CRM lives in Notion, **not** in this repo:

- **KMS Compliance — Lead CRM** — `https://app.notion.com/p/66645caa525c49bd8ae473aed9979361`
  (data source: `collection://7c0d5e57-bfe9-4815-9b1e-6c3f2d9357fc`)
  Key properties: Firm Name, Stage (New Lead → Contacted → Negotiating →
  Proposal Sent → Won/Lost/Not Qualified), Region (Essex, East London,
  Hertfordshire, Kent, National), Regulated Activity, Service Interest,
  FCA Status, Next Action / Next Action Date, Estimated Value.
  Has an "🎯 Essex Leads" / "🎯 Essex Pipeline" filtered view already.
- **🏢 KMS Compliance — HQ** — `https://app.notion.com/p/357aac9aa77b81cf971ee7eb9629a159`
  central workspace page (marketing, tools/SOPs, business admin also live
  under here).
- **📜 FCA Policy Watch** — `https://app.notion.com/p/f9284c444ba8423a8cb2fe13d12168a0`
  (data source: `collection://053647f2-a74d-47c1-914c-2e5aa4bbdeb3`)
  New database for the FCA policy scout agent's findings (see below).

Any agent that touches leads/deals should read/write the Notion CRM via
the Notion MCP tools (`notion-fetch`, `notion-query-data-sources`,
`notion-create-pages`, `notion-update-page`) — do not create a parallel
CRM in this repo.

## Growth direction
Current engagement is mainly car dealerships. We're exploring expansion
into other consumer credit activities: High-Cost Short-Term Credit
(HCSTC), home-collected credit, rent-to-own, guarantor loans, logbook
loans, debt collecting/administration, peer-to-peer lending, and
newly-regulated Buy Now Pay Later (BNPL). Geographic focus stays the
South East/Essex. Since KMS is the *adviser*, not the regulated firm,
"expansion" means finding firms in these verticals who need compliance
support — not KMS applying for its own permissions.

## Agents
See `.claude/agents/` for the specialised agents that work this pipeline
(prospect research, pipeline maintenance, reporting, and the FCA policy
scout). `PROPOSAL-local-agents-crm-fca-scout.md` has the original scoping
notes and effort estimates.
