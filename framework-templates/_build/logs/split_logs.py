#!/usr/bin/env python3
"""Split multi-register workbooks into one file per register."""
import os, sys, warnings
warnings.filterwarnings('ignore')
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from openpyxl import load_workbook
from xl import Book, STANDARD_GUIDE

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'out')
STAGE = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'combined')
T = '_v2.0_Template.xlsx'

# combined file -> [(sheet to keep, extra sheets to keep, new file stem, register name, font, guide paragraphs)]
SPLITS = {
    'Customer_Due_Diligence_Checklist': ('Aptos Narrow', [
        ('CDD Checklist', [], 'Customer_Due_Diligence_Checklist', 'Customer Due Diligence Checklist', [
            ('p', 'Complete one copy for each customer at onboarding (save a copy in the customer file). Nothing proceeds until every applicable line is complete. Where an enhanced due diligence trigger applies, also complete the Enhanced Due Diligence Checklist.'),
            ('p', 'Firms outside the Money Laundering Regulations must still verify identity and screen for sanctions – these checks evidence your fraud and financial crime controls (SYSC 6.1.1R).')]),
        ('EDD Checklist', [], 'Enhanced_Due_Diligence_Checklist', 'Enhanced Due Diligence Checklist', [
            ('p', 'Complete in addition to the Customer Due Diligence Checklist whenever an EDD trigger applies (Customer Due Diligence Policy, section 7). For firms within the MLRs, senior management approval is mandatory before establishing or continuing a relationship with a PEP.')]),
        ('CDD Register', [], 'Customer_Due_Diligence_Register', 'Customer Due Diligence Register', [
            ('p', 'One line per customer, giving a single view of every customer’s verification, risk rating, screening, review dates and deletion date. Update it whenever a customer is onboarded, reviewed or leaves.'),
            ('p', 'Keep CDD records for five years after the relationship ends. Firms within the MLRs must then delete personal data unless the law, legal proceedings or the individual’s consent allow longer retention. The register calculates the deletion date.')]),
        ('Sanctions Screening Log', [], 'Sanctions_Screening_Log', 'Sanctions Screening Log', [
            ('p', 'One line per screening check, at onboarding and each re-screen. Escalate any potential match to the MLRO immediately and do nothing further on the account or transaction until the MLRO has decided. As an FCA-authorised firm we must report to OFSI as soon as practicable if we know or reasonably suspect a person is designated or has breached sanctions.')]),
    ]),
    'Training_Log': ('Calibri', [
        ('Training Matrix', [], 'Training_Matrix', 'Training Matrix', [
            ('p', 'The training each role must complete, when it is first required and how often it is refreshed. Adapt the modules and roles to your firm and delete activity OPTION rows you do not need.')]),
        ('Training Log', [], 'Training_Log', 'Training Log', [
            ('p', 'One line for every training activity completed by anyone in the firm. Enter the refresher period in months and the next-due date calculates automatically; overdue dates turn red. Keep certificates, assessment results and signed declarations as evidence.')]),
        ('Competence Register', [], 'Competence_Register', 'Competence Register', [
            ('p', 'One line per person: activities performed, supervision, the date they were assessed as competent, qualifications, CPD and (for SM&CR firms) fitness and propriety and certification dates. Nobody carries out a regulated or customer-facing activity unsupervised until the “Assessed competent on” date is completed.'),
            ('p', 'Enter each person’s CPD hours for the year from the CPD Log.')]),
        ('CPD Log', [], 'CPD_Log', 'CPD Log', [
            ('p', 'For staff with CPD requirements: insurance distribution (at least 15 hours a year), mortgage advisers ([Insert] hours) and investment advisers (35 hours, of which 21 structured). Transfer annual totals to the Competence Register.')]),
        ('Individual Record (template)', [], 'Individual_Training_Record', 'Individual Training Record', [
            ('p', 'Optional reflective record – copy the sheet for each person if you want to capture what they learned and how it changed their work. The Training Log is the mandatory record.')]),
    ]),
    'Financial_Promotions_Log': ('Aptos Narrow', [
        ('Financial Promotions Log', [], 'Financial_Promotions_Log', 'Financial Promotions Log', [
            ('p', 'One line for every financial promotion (and version) approved, including social media posts, influencer and affiliate content, and scripts for real-time promotions. Nothing is published until it has been approved and logged. Keep a copy of each promotion exactly as it appeared, its approval, the evidence for its claims and when it was withdrawn.')]),
        ('Approval Checklist', [], 'Financial_Promotion_Approval_Checklist', 'Financial Promotion Approval Checklist', [
            ('p', 'Complete a copy for each promotion before approval and keep it with the promotion. Every applicable check must be “Yes” before the promotion is approved and entered in the Financial Promotions Log.')]),
    ]),
    'Data_Protection_Registers': ('Aptos Narrow', [
        ('ROPA', [], 'Record_of_Processing_Activities', 'Record of Processing Activities', [
            ('p', 'One line per processing activity (Article 30 UK GDPR). The starter lines are examples – adapt them to your own processing and add activity-specific processing from section 8 of the Data Processing Policy.')]),
        ('Data Rights Request Log', [], 'Data_Rights_Request_Log', 'Data Rights Request Log', [
            ('p', 'Record every request to exercise a data protection right – requests can be made in any form, including verbally or by social media. Respond within one month (extendable by two months for complex requests; paused while waiting for information needed to identify the person or clarify the request).')]),
        ('Data Breach Log', [], 'Data_Breach_Log', 'Data Breach Log', [
            ('p', 'Record every personal data breach, including those you do not report. Where there is a risk to individuals, notify the ICO within 72 hours of becoming aware. Where a breach is also a regulatory breach, record it in the Compliance Breach Log too.')]),
        ('DP Complaints Log', [], 'Data_Protection_Complaints_Log', 'Data Protection Complaints Log', [
            ('p', 'Since 19 June 2026 data protection complaints must be acknowledged within 30 days and responded to without undue delay. If the complaint is also about our financial services, record it in the Complaints Register too and meet the shorter deadline.')]),
        ('Data Retention Schedule', [], 'Data_Retention_Schedule', 'Data Retention Schedule', [
            ('p', 'Keep this consistent with sections 8 and 14 of the Data Processing Policy. Replace every placeholder with your own period and delete rows for activities you do not carry on.')]),
        ('DPIA Register', [], 'DPIA_Register', 'DPIA Register', [
            ('p', 'List every data protection impact assessment. A DPIA is required before high-risk processing (for example credit scoring, large-scale special category data, systematic monitoring, or new technology including AI tools).')]),
    ]),
    'Conflicts_and_Gifts_Registers': ('Aptos Narrow', [
        ('Conflicts of Interest Register', [], 'Conflicts_of_Interest_Register', 'Conflicts of Interest Register', [
            ('p', 'Record every actual or potential conflict between the firm (including staff, owners and partners) and its customers, or between customers – for example commission and remuneration, volume incentives, close relationships with providers or introducers, and outside interests. Record how each is managed; disclosure to customers is a last resort, not a substitute for managing the conflict.')]),
        ('Gifts and Hospitality Register', [], 'Gifts_and_Hospitality_Register', 'Gifts and Hospitality Register', [
            ('p', 'Record all gifts and hospitality given, received or declined above [Insert value], and whether they were approved in advance, as the Anti-Money Laundering and Financial Crime Policy (section 9.2) requires.')]),
    ]),
    'Compliance_Monitoring_Tracker': ('Aptos Narrow', [
        ('Monitoring Schedule', [], 'Compliance_Monitoring_Schedule', 'Compliance Monitoring Schedule', [
            ('p', 'Tracks each check in the Compliance Monitoring Plan (Part A and your Part B options): when it is due, when it was done and the result. Overdue checks turn red.')]),
        ('File Review Record', [], 'File_Review_Record', 'File Review Record', [
            ('p', 'One line per file reviewed, so findings can be evidenced and trends identified. Keep completed checklists and evidence in the Monitoring Evidence Folder.')]),
        ('Corrective Action Log', [], 'Corrective_Action_Log', 'Corrective Action Log', [
            ('p', 'Every Red or Amber finding, breach or significant complaint theme is tracked here to verified closure, including putting affected customers right. Overdue actions turn red.')]),
        ('Compliance Universe Register', [], 'Compliance_Universe_Register', 'Compliance Universe Register', [
            ('p', 'The requirements that apply to your firm and where each is covered. Universal lines are pre-filled; add the activity-specific sourcebooks from section 3 of your Compliance Monitoring Programme.')]),
    ]),
    'Consumer_Duty_Evidence': ('Aptos Narrow', [
        ('Outcome MI', [], 'Consumer_Duty_Outcome_MI', 'Consumer Duty Outcome MI', [
            ('p', 'The management information used to monitor the four Consumer Duty outcomes, with outcomes for customers with characteristics of vulnerability shown separately. It is the evidence base for the annual board report (PRIN 2A.8). Draw conclusions from the data, not just present it.'),
            ('watch', 'CP26/23 (June 2026) proposes clarifying distribution chain responsibilities and board reporting proportionality. Final rules are expected in Q1 2027.')]),
        ('Target Market Register', [], 'Target_Market_Register', 'Target Market Register', [
            ('p', 'The target market, our role and the distribution strategy for each product or service we manufacture or distribute (products and services outcome).')]),
        ('Fair Value Register', [], 'Fair_Value_Register', 'Fair Value Register', [
            ('p', 'Each fair value assessment and its conclusion (price and value outcome). Review at least annually.')]),
        ('Board Report Actions', [], 'Consumer_Duty_Board_Report_Actions', 'Consumer Duty Board Report Actions', [
            ('p', 'Actions agreed from outcome monitoring and the annual board report, tracked to completion. The board report should show progress against them.')]),
    ]),
}


def main():
    for combined, (font, parts) in SPLITS.items():
        src = os.path.join(STAGE, combined + T)
        os.makedirs(STAGE, exist_ok=True)
        if os.path.exists(os.path.join(OUT, combined + T)):
            os.replace(os.path.join(OUT, combined + T), src)
        for keep, extra, stem, name, paras in parts:
            wb = load_workbook(src)
            for ws in list(wb.worksheets):
                if ws.title not in [keep, 'Lists'] + extra:
                    wb.remove(ws)
            b = Book.__new__(Book)
            b.wb, b.font, b.lists, b.list_cols = wb, font, None, {}
            g = b.guide('How to use', f'{name} – how to use', STANDARD_GUIDE[:1] + [('p', STANDARD_GUIDE[1][1])] + [('h', 'This register')] + paras + STANDARD_GUIDE[2:])
            wb.move_sheet(g, offset=-wb.index(g))
            if keep == 'Competence Register':
                ws = wb[keep]
                for row in ws.iter_rows():
                    for c in row:
                        if isinstance(c.value, str) and c.value.startswith('=IF(A') and 'CPD Log' in c.value:
                            c.value = None
                        if c.value == 'CPD hours completed (from CPD Log)':
                            c.value = 'CPD hours completed this year (from CPD Log)'
            if 'Lists' in wb.sheetnames:
                wb.move_sheet('Lists', offset=len(wb.sheetnames) - 1 - wb.sheetnames.index('Lists'))
            wb.active = 0
            wb.save(os.path.join(OUT, stem + T))
            print('split ->', stem + T)


if __name__ == '__main__':
    main()
