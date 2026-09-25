# KMS framework templates v2.0: summary of changes

This folder holds 12 KMS compliance documents rewritten as generic, activity-modular framework templates for firms preparing FCA authorisation applications. The regulatory position is current to **25 September 2026**.

## How the templates work (common to all 12)

- **Branding.** Each template is built from its own v1.0 source file. The cover spacing, title block, contents-list wrapper, styles, theme fonts and colours, numbering definitions, page size, margins and section layout are unchanged. This includes the landscape schedule pages in the Monitoring Plan and the footer in the SoR. Only the body text has been replaced.
  - **What the sources contain.** None of the 12 source files has a logo, header or footer image. None uses the KMS brand colours (#11304F navy, #068A53 green); they use Word's default theme colours. If KMS has a branded master template, apply it before release.
  - **What was added.** Three new visual elements are needed for usability:
    - yellow-highlighted placeholders;
    - grey "KMS guidance" boxes, with a navy #11304F edge;
    - green START and END option banners, in #068A53.
  - **Tables.** Tables use thin grey borders. Most source tables were borderless web-pasted tables.
- **Placeholders** are written as `[Insert …]`, `[Specify …]` or `[Delete if …]`, in bold with yellow highlighting.
- **Options** are wrapped in "▼ START OF OPTION 7C / ▲ END OF OPTION 7C" banners, each with its own keep/delete instruction. The labels combine the section number and a letter, so deleting one option never breaks numbering elsewhere. No option refers to another option's wording. Options may only refer to the universal sections that every buyer keeps.
- **"How to use this template"** is the first section of every document. It explains the placeholders, the options, the guidance boxes, the regulatory watch boxes and how to update the contents list.
- **Regulatory watch items** appear as amber boxes and are also attached as Word comments by "KMS Compliance".
- **Matthew Gunn's v1.0 review comments** have been folded into the instruction text (for example "confirm complaint methods", "update each role") and the original comments removed.
- **Contents lists** are set to rebuild when the document is opened. Word will ask whether to update fields; answer Yes.

## (a) Firm- and industry-specific content removed or made generic

The v1.0 set was written for a **small motor dealership with limited-permission credit broking**. Across all documents, the following were replaced with activity-neutral wording or moved into the relevant activity option:
- references to the dealership, vehicles, PCP and hire purchase, showroom and forecourt;
- AutoTrader and Gumtree;
- the "Dealer Principal", "Credit Brokerage Manager", "Company Secretary" and "Finance Coordinator" roles;
- statements that the firm is "credit broking, not lending".

Specific corrections:

| Document | Removed or corrected |
|---|---|
| AML Policy | Dealership risk narrative and the "vehicle sales / PCP" scope removed. Added the MLRs 2026 amendments (SI 2026/621), sanctions reporting as a "relevant firm", failure-to-prevent offences, and correct POCA reporting positions for firms inside and outside the regulated sector. |
| CDD Policy | Removed the £8,000 cash threshold. It was not an MLR figure: the high value dealer threshold was €10,000, now converted to sterling by SI 2026/621. Removed biometric residence permits as ID, because they expired on 31 December 2024. Removed "remote = automatic EDD": being remote is now a risk factor, not a mandatory trigger. |
| Complaints Procedure | Removed the firm-imposed 12-month complaint deadline, which is not permitted under DISP. Removed the company secretary / managing director escalation route and the "4 week" target. Rebuilt the procedure around DISP 1 and the Financial Ombudsman Service rules. |
| Compliance Monitoring Plan | Replaced dealership roles and "3 files per month" with a risk-rated schedule and placeholders. |
| Monitoring Programme | Removed COBS, best execution and client money wording that assumed an investment firm. Title corrected to match the document. |
| Vulnerability Policy | Removed showroom and vehicle scenarios and "product/service" find-and-replace errors (for example "levels of product/servicee"). Corrected the FCA definition wording. |
| Data Processing Policy | Removed vehicle, DVLA and dealership data sets. Removed the duplicated rights section. Corrected CDD retention from 6 years to the MLR 5 years plus the deletion requirement. Updated for the Data (Use and Access) Act 2025. |
| Financial Promotions Policy | Removed dealership channels and examples. Corrected PS23/13, which is the section 21 approver gateway, not the Consumer Duty. Replaced FG15/4 with FG24/1. Replaced the Consumer Protection from Unfair Trading Regulations with the DMCC Act 2024. |
| Consumer Duty Plan | Rewritten from "the Duty is coming in 2023" to a day-one implementation and embedding plan. Removed unreliable FG22/5 page-number references and broker-only wording. |
| Risk Framework | Expanded from a short generic policy into risk appetite, a scoring method, financial resources and wind-down planning, operational resilience and a risk register template. |
| SM&CR Statement of Responsibilities | **Materially corrected.** v1.0 listed the banking/PRA list of functions (SMF2, SMF4–8, SMF14, SMF19, SMF22, SMF24, SMF25) and the enhanced/PRA prescribed responsibilities (for example stress testing, recovery plans, treasury), plus a Consumer Duty "PR (AA)" that does not exist. It now uses the correct solo-regulated Limited Scope and Core lists. The fax field is removed and SYSC 24.3 is marked as applying to enhanced firms only. |
| Training Policy | Removed dealership and limited-permission-only wording. Added activity-specific TC qualification and CPD requirements, and SM&CR changes from PS26/6. |

## (b) Where placeholders were inserted

Every document has placeholders in these places:
- the cover and metadata block: firm legal name, FRN or "application pending", author, approver, dates and version;
- the regulated activities the firm holds;
- named owners for every role and responsibility;
- frequencies, thresholds, sample sizes and internal targets;
- systems and locations of registers and logs;
- contact channels;
- supplier and provider names;
- board, directors or owner governance wording.

Document-specific placeholders include:
- the complaint channels and customer-facing summary (Complaints Appendix A);
- the risk appetite measures and risk register (Risk Framework);
- the retention periods table (Data Processing Policy, sections 8 and 14);
- the Owner column in every monitoring table;
- the owners, dates and evidence in the Consumer Duty implementation table;
- all personal, firm and SMF fields in the SoR.

## (c) Regulatory-activity options drafted

All options are self-contained, the same shape within each section, and labelled "Option [section][letter] — [activity]" with their own keep/delete instruction.

**Standard activity set, used in 10 documents.** Letters A–L are used consistently across documents:
- A: credit broking
- B: debt adjusting and debt counselling
- C: debt collecting and debt administration
- D: credit information services and credit references
- E: peer-to-peer (P2P) platforms
- F: consumer credit lending, including deferred payment credit ("buy now, pay later")
- G: exercising the lender's rights
- H: consumer hire
- I: insurance distribution
- J: mortgage intermediaries
- K: payment services and e-money
- L: investment advice and arranging

Some activities are paired where the rules are identical for that subject: debt adjusting with debt counselling; debt collecting with debt administration; credit information services with credit references.

| Document | Option sections |
|---|---|
| AML Policy | §2 MLR scope, risks and controls (2A–2L); §8 suspicion reporting by MLR status (8A inside the regulated sector / 8B outside) |
| CDD Policy | §3 who we check, when and why (3A–3L) |
| Complaints Procedure | §5 timescales (5A eight weeks / 5B payment services 15/35 business days); §7 activity-specific handling (7A–7L) |
| Compliance Monitoring Plan | Part B activity monitoring tables (B-A to B-L), in landscape |
| Monitoring Programme | §3 compliance universe, grouped by sourcebook (3A consumer credit, all 10 activities; 3B P2P; 3C insurance; 3D mortgages; 3E payments; 3F investments) |
| Vulnerability Policy | §3 contact channel (3A face-to-face / 3B telephone / 3C digital); §7 activity-specific rules (7A–7L) |
| Data Processing Policy | §8 activity-specific processing, sharing and retention (8A–8L) |
| Financial Promotions | §7 activity-specific promotion rules (7A–7L) |
| Consumer Duty Plan | §2 distribution-chain role and outcome points (2A–2L) |
| Risk Framework | §8 activity-specific risks and prudential/resilience requirements (8A–8L) |
| Training & Competence | §7 activity-specific competence and TC requirements (7A–7L) |
| SM&CR SoR | By **SM&CR category**, not activity, because the SoR does not vary by activity: §3 SMFs (3A Limited Scope / 3B Core); §4 prescribed responsibilities (4A / 4B). Payment and e-money institutions are flagged as outside SM&CR. |

Where the rules genuinely differ, the options differ in substance rather than being blended. Examples:
- **AML:** MLR scope differs by activity. Lending, payment services, investments and life insurance are inside the MLRs. Broking, debt management, debt collection, credit reference agencies, general insurance, mortgage broking and account-information-only firms are outside.
- **Complaints:** payment services have 15/35 business-day deadlines; credit reference agencies have section 159 notice-of-correction rights.
- **Financial promotions:** payment services are generally outside section 21 of FSMA; P2P investor promotions follow the COBS 4.12A restricted mass market investment rules; mortgages follow the MCOB 3A risk warnings.
- **Prudential and resilience:** debt management firms are under CONC 10, P2P under IPRU-INV 12, intermediaries under MIPRU, payment and e-money firms under CASS 15 and SYSC 15A.
- **Training:** the TC qualification and CPD rules apply to mortgage, insurance and investment advisers, but not to consumer credit.

**Other activities you may want to add** (not drafted, because they were outside your list):
- **Claims management:** relevant to Complaints, Financial Promotions and Consumer Duty, because it has its own CMCOB rules.
- **Home finance beyond regulated mortgages:** home purchase plans, home reversion, and equity release as a distinct advice line.
- **Appointed representatives oversight:** a business model rather than an activity, so it is handled through placeholders; a dedicated AR option or annex may be worth selling separately.
- **Lead generation and debt packaging:** partly covered within the debt options.

I proceeded without asking first. Each document's subject made the relevant activities clear, so the "ask before guessing" condition did not arise.

## (d) FCA and Government material relied on, and items flagged as pending

**Relied on as final and in force:**
- **Consumer Duty:** PRIN 2A, FG22/5, and the FCA's April 2026 observations on Year 2 board reports.
- **Complaints:**
  - DISP 1, 1.6.2AR and 2.8;
  - PS25/19 (consolidated complaints return; periods from 1 January 2027, first due 1 July 2027);
  - the FCA/Ombudsman Modernising the Redress System policy statement (August 2026; new dismissal grounds and clarified test from 1 October 2026);
  - the Ombudsman award limit of £455,000 from 1 April 2026.
- **Money laundering and sanctions:**
  - MLRs 2017 as amended by SI 2026/621 (in force 30 June 2026; mandatory high-risk country EDD narrowed to FATF call-for-action jurisdictions; thresholds moved to sterling);
  - MLR regulation 15 (account information service providers excluded, 2022);
  - POCA, Terrorism Act 2000, SAMLA 2018, Bribery Act 2010, Criminal Finances Act 2017;
  - ECCTA 2023 failure to prevent fraud (from 1 September 2025, large organisations only);
  - SYSC 6.1.1R and 6.3; the FCA Financial Crime Guide (FCG); JMLSG guidance.
- **SM&CR:** PS26/6 SM&CR phase 1 (April 2026: submit applications within 12 weeks; more time for SoR updates; certification duplication removed).
- **Consumer credit:**
  - PS26/1 deferred payment credit ("buy now, pay later"), regulated from 15 July 2026, with broking of it unregulated;
  - PS24/2 (CONC 7 and MCOB 13 forbearance, November 2024);
  - CONC 3, 4, 5, 5A, 6, 7, 8 and 10; Consumer Credit Act 1974 ss.155 and 158–159.
- **Payments:** PS25/12 / CASS 15 safeguarding (7 May 2026).
- **Financial promotions:** PS23/13 (section 21 approver gateway, 7 February 2024); FG24/1 (social media).
- **Vulnerable customers:** FG21/1, which stays in force, and the FCA's March 2025 vulnerability review.
- **Data protection:** the Data (Use and Access) Act 2025, including the controller complaints duty from 19 June 2026.
- **Consumer protection:** DMCC Act 2024 unfair commercial practices (April 2025).
- **Sector sourcebooks:** ICOBS (including 6A.4 and 6B), PROD 3 and 4, MCOB 3A, 4 and 5A, MIPRU, COBS 4.12A–B, 9, 10 and 18.12, CASS 5, 7 and 11, IPRU-INV 12 and 13, TC.

**Flagged as pending (amber box plus Word comment):**

| Item | Status | Documents |
|---|---|---|
| CP26/23 Consumer Duty scope and proportionality (distribution chains, board report) | Consultation closed 18 September 2026; policy statement expected Q1 2027 | Consumer Duty Plan |
| PS26/3 motor finance redress scheme | Final, but under legal challenge since May 2026; timetable may pause | Complaints (7A, 7F) |
| Ombudsman reforms through the FS&M Bill; Ombudsman registration stage | Legislation pending; registration not before April 2027 | Complaints §6 |
| PS26/2 operational incident and third-party reporting | Final, not in force until 18 March 2027 | Monitoring Plan, Data, Risk |
| SM&CR phase 2 (Certification Regime removal; notification route) | FS&M Bill and later FCA consultation | SoR, Training |
| DMCC subscription contracts regime | Commencement now expected spring 2027 | Financial Promotions (7D) |
| Payment Systems Regulator consolidation into the FCA (APP reimbursement) | Legislation pending | Complaints (7K) |
| Data (Use and Access) Act 2025 staged commencement and ICO guidance updates | Guidance partly in draft | Data Processing |

## Supporting registers

**Policies and registers are separate files.** The 12 policies are in `policies/` and the 32 registers are in `registers/`, **one register per file**. No policy contains a register, and no register file contains more than one register. The Complaints Register's Summary tab and the BWRA's Conclusion tab are part of those registers, not separate registers.

**The registers are mandatory.** Each policy has a "Supporting registers" section listing, by exact file name, the separate register files it relies on. The "How to use" page of every template says that a firm adopting a policy without its registers is likely to fail FCA scrutiny.

**Features of every register file:**
- a "How to use" tab;
- yellow placeholder cells;
- drop-down lists, held on a hidden "Lists" tab;
- calculated deadlines and scores;
- conditional formatting for overdue items and red/amber/green ratings;
- green OPTION rows for activity-specific content.

No formulas link one file to another.

**House style.** The same as the v1.0 KMS logs:
- a light green (accent 6) title and header fill, with dark green text;
- thin borders, and gridlines turned off;
- Calibri or Aptos Narrow, as in the original.

| Register file (`registers/`) | Origin | Used by |
|---|---|---|
| `Anti_Money_Laundering_Incident_Register_v2.0_Template.docx` | Updated v1.0 (Word) | AML, CDD, Monitoring Plan |
| `Compliance_Breach_Log_v2.0_Template.xlsx` | Updated v1.0 | Most policies |
| `Customer_Due_Diligence_Checklist_v2.0_Template.xlsx` | Updated v1.0 (Basic DD sheet) | AML, CDD |
| `Enhanced_Due_Diligence_Checklist_v2.0_Template.xlsx` | Updated v1.0 (EDD sheet) | AML, CDD |
| `Customer_Due_Diligence_Register_v2.0_Template.xlsx` | New | AML, CDD, Monitoring Plan |
| `Sanctions_Screening_Log_v2.0_Template.xlsx` | New | AML, CDD, Monitoring Plan |
| `AML_Business_Wide_Risk_Assessment_v2.0_Template.xlsx` | New | AML, CDD, Risk |
| `Risk_Assessment_Log_v2.0_Template.xlsx` | Updated v1.0 | Risk, Monitoring, Consumer Duty |
| `Training_Matrix_v2.0_Template.xlsx` | New | Training |
| `Training_Log_v2.0_Template.xlsx` | Updated v1.0 | All policies |
| `Competence_Register_v2.0_Template.xlsx` | New | Training, Monitoring Plan (also holds SM&CR fitness-and-propriety and certification dates) |
| `CPD_Log_v2.0_Template.xlsx` | New | Training |
| `Individual_Training_Record_v2.0_Template.xlsx` | v1.0 reflective record (optional) | Training |
| `Complaints_Register_v2.0_Template.xlsx` | New | Complaints, Monitoring, Vulnerability, Consumer Duty, Financial Promotions |
| `Financial_Promotions_Log_v2.0_Template.xlsx` | New | Financial Promotions, Monitoring Plan |
| `Financial_Promotion_Approval_Checklist_v2.0_Template.xlsx` | New | Financial Promotions |
| `Record_of_Processing_Activities_v2.0_Template.xlsx` | New | Data, Vulnerability |
| `Data_Rights_Request_Log_v2.0_Template.xlsx` | New | Data, Monitoring Plan |
| `Data_Breach_Log_v2.0_Template.xlsx` | New | Data, Monitoring Plan |
| `Data_Protection_Complaints_Log_v2.0_Template.xlsx` | New | Data, Complaints |
| `Data_Retention_Schedule_v2.0_Template.xlsx` | New | Data |
| `DPIA_Register_v2.0_Template.xlsx` | New | Data |
| `Conflicts_of_Interest_Register_v2.0_Template.xlsx` | New | AML, Monitoring Plan |
| `Gifts_and_Hospitality_Register_v2.0_Template.xlsx` | New | AML, Monitoring Plan |
| `Compliance_Monitoring_Schedule_v2.0_Template.xlsx` | New | Monitoring Plan and Programme, Financial Promotions, Training |
| `File_Review_Record_v2.0_Template.xlsx` | New | Monitoring Plan and Programme |
| `Corrective_Action_Log_v2.0_Template.xlsx` | New | Monitoring, Complaints, Risk |
| `Compliance_Universe_Register_v2.0_Template.xlsx` | New | Monitoring Plan and Programme |
| `Consumer_Duty_Outcome_MI_v2.0_Template.xlsx` | New | Consumer Duty, Vulnerability, Complaints, Monitoring, Risk |
| `Target_Market_Register_v2.0_Template.xlsx` | New | Consumer Duty |
| `Fair_Value_Register_v2.0_Template.xlsx` | New | Consumer Duty |
| `Consumer_Duty_Board_Report_Actions_v2.0_Template.xlsx` | New | Consumer Duty |

**Main changes to the v1.0 logs:**
- **AML Incident Register:** now the internal suspicious activity report log, recording MLRO reasoning, the SAR decision, NCA reference and DAML outcome, with a tipping-off warning.
- **Compliance Breach Log:** adds root cause, customer harm and redress, the FCA notification decision and sign-off.
- **CDD and EDD Checklists:**
  - dealership, affordability, consent and "TCF" items removed;
  - beneficial owners, PEP type, the FATF call-for-action test, risk rating and activity-specific checks added.
- **Risk Assessment Log:** regulatory categories, 1–5 × 1–5 scoring before and after controls, the missing controls column restored, and starter risks.
- **Training Log:** mandatory module tracking with next-due dates. The v1.0 per-employee reflective sheet becomes the optional Individual Training Record.

**Points for KMS to check in the registers:**
- The business-day deadlines use Excel WORKDAY without a bank holiday list.
- The files were checked by reloading them programmatically, not in Excel itself; open them once in Excel before release.
- CPD hours are now entered in the Competence Register by hand, because formulas no longer link to the separate CPD Log.

## Points for KMS review before release

These are areas where the templates deliberately defer to the buyer's own confirmation, or where a KMS second pair of eyes is worthwhile:
1. **SoR category detail.** The situations in which Limited Scope firms need SMF16 or SMF17, whether prescribed responsibility (d) applies to Core firms not subject to SYSC 6.3, and sole-trader SMF requirements. The templates tell the buyer to confirm these against SUP 10C and SYSC 24.2.6R.
2. **MLR scope edge cases.** P2P platforms (the template defaults to applying the MLR standard), debt purchasers exercising lender's rights, and consumer hire that amounts to financial leasing. Each option tells the buyer to confirm with legal advice.
3. **SYSC 15A for payment and e-money institutions.** The template states it applies and asks the buyer to confirm.
4. **Specific CONC rule references** (for example CONC 3.5 and 3.7, 4.4 and 4.5, 5.2A). Worth a quick Handbook cross-check, as these were written without live Handbook access (the FCA website is blocked from this environment).

## Files

The policies below are in `policies/`; the registers are listed above and are in `registers/`.


| v2.0 template | Built from |
|---|---|
| `Anti_Money_Laundering_Policy_v2.0_Template.docx` | Anti_Money_Laundering_Policy_v1.0 |
| `Customer_Due_Diligence_Policy_v2.0_Template.docx` | Customer_Due_Diligence_Policy_v1.0 |
| `Complaints_Procedure_v2.0_Template.docx` | Complaint_Proceedure_v1.0 |
| `Compliance_Monitoring_Plan_v2.0_Template.docx` | Compliance_Monitoring_Plan_v1.0 |
| `Compliance_Monitoring_Programme_Policy_v2.0_Template.docx` | Compliance_Monitoring_Programme_Policy_v1.0 |
| `Customer_Vulnerability_Policy_v2.0_Template.docx` | Customer_Vulnerabilty_Policy_v1.0 |
| `Data_Processing_Policy_v2.0_Template.docx` | Data_Processing_Policy_v1.0 |
| `Financial_Promotions_Policy_v2.0_Template.docx` | Financial_Promotions_Policy_v1.0 |
| `Consumer_Duty_Implementation_Plan_v2.0_Template.docx` | Implemention_Plan_-_Consumer_Duty_v1.0 |
| `Risk_Management_Framework_v2.0_Template.docx` | Risk_Management_Framework_Policy_v1.0 |
| `SMCR_Statement_of_Responsibilities_v2.0_Template.docx` | Senior_Management_Regime_Statement_of_Responsbility_v1.0 |
| `Training_and_Competence_Policy_v2.0_Template.docx` | Training_Policy_v1.0 |

`_build/` holds the text source for each template and the script that injects it into the v1.0 files. `_build/logs/` holds the register builders (`build_logs.py`, then `split_logs.py`), which need the v1.0 log files in `_build/logsrc/`. Use it to make future wording changes consistently. The script needs the v1.0 `.docx` files unzipped into `_build/src/`. All 12 outputs pass Office Open XML schema validation.
