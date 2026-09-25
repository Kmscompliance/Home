#!/usr/bin/env python3
"""Align policy text with the KMS v2.0 supporting registers and make them mandatory."""
import os
C = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'content')

INTRO = ('The KMS registers below support this {doc}. They are an essential part of it, not optional extras: the FCA judges whether a {doc} works in practice by looking at these records, and a {doc} without them is unlikely to withstand scrutiny. Keep them up to date from your first day of trading. The owner and review frequency are recorded in each register.')
NOTE = ('NOTE: Do not delete a register from this list because you have not started using it yet – start using it. Where one part of a register genuinely cannot apply to your firm (for example safeguarding when you hold no relevant funds), keep the register and record why that part does not apply.')


def section(num, doc, rows):
    head = f'# {num}Supporting registers' if num else '# Supporting registers'
    t = [head, INTRO.format(doc=doc), NOTE, 'TABLE: 28,32,40', '| Register | KMS file | What it evidences |']
    t += [f'| {a} | {b} | {c} |' for a, b, c in rows]
    return '\n' + '\n'.join(t) + '\n'


R = {
    'isar': ('AML Incident Register', 'Anti_Money_Laundering_Incident_Register_v2.0_Template.docx', 'Every internal suspicious activity report, the MLRO’s reasoning and decision, SARs and DAML requests'),
    'cdd': ('CDD Checklist and EDD Checklist', 'Customer_Due_Diligence_Checklist_v2.0_Template.xlsx', 'Due diligence completed for each customer before onboarding'),
    'cddreg': ('CDD Register', 'Customer_Due_Diligence_Checklist_v2.0_Template.xlsx (CDD Register tab)', 'Every customer’s verification, risk rating, screening, review and deletion dates'),
    'sanc': ('Sanctions Screening Log', 'Customer_Due_Diligence_Checklist_v2.0_Template.xlsx (Sanctions Screening Log tab)', 'Sanctions screening, potential matches and decisions, and OFSI reports'),
    'bwra': ('AML Business-Wide Risk Assessment', 'AML_Business_Wide_Risk_Assessment_v2.0_Template.xlsx', 'The firm-wide assessment of financial crime risk that drives our controls'),
    'breach': ('Compliance Breach Log', 'Compliance_Breach_Log_v2.0_Template.xlsx', 'Every breach, its root cause, customer impact, FCA notification decision and remediation'),
    'risk': ('Risk Assessment Log', 'Risk_Assessment_Log_v2.0_Template.xlsx', 'Identified risks, inherent and residual scores, controls, appetite and actions'),
    'train': ('Training Log (Training Matrix, Training Record, Competence Register, CPD Log)', 'Training_Log_v2.0_Template.xlsx', 'Training completed, competence assessed, supervision, qualifications and CPD'),
    'comp': ('Complaints Register', 'Complaints_Register_v2.0_Template.xlsx', 'Every complaint, DISP deadlines, outcomes, redress, root causes and Ombudsman referrals'),
    'fp': ('Financial Promotions Log and Approval Checklist', 'Financial_Promotions_Log_v2.0_Template.xlsx', 'Every promotion approved before use, the checks made, evidence for claims and withdrawal'),
    'dp': ('Data Protection Registers (ROPA, Data Rights Request Log, Data Breach Log, DP Complaints Log, Data Retention Schedule, DPIA Register)', 'Data_Protection_Registers_v2.0_Template.xlsx', 'Accountability under the UK GDPR: processing, rights requests, breaches, complaints, retention and DPIAs'),
    'coi': ('Conflicts of Interest Register and Gifts and Hospitality Register', 'Conflicts_and_Gifts_Registers_v2.0_Template.xlsx', 'Conflicts identified and managed; gifts and hospitality approved and recorded'),
    'mon': ('Compliance Monitoring Tracker (Monitoring Schedule, File Review Record, Corrective Action Log, Compliance Universe Register)', 'Compliance_Monitoring_Tracker_v2.0_Template.xlsx', 'Checks completed against the plan, file review results, corrective actions to closure, and the requirements that apply to us'),
    'cd': ('Consumer Duty Evidence (Outcome MI, Target Market Register, Fair Value Register, Board Report Actions)', 'Consumer_Duty_Evidence_v2.0_Template.xlsx', 'Outcome monitoring, target markets, fair value assessments and board report actions'),
}


def rows(*keys):
    return [R[k] for k in keys]


EDITS = {
    'aml.txt': [
        ('**1.2 Related documents.** This policy should be read with our: Customer Due Diligence Policy; Business-Wide Risk Assessment; Compliance Monitoring Plan; Customer Vulnerability Policy; Training and Competence Policy; Data Processing Policy; and our registers (Customer Due Diligence Register, Internal Suspicious Activity Report Log and Sanctions Screening Log). [Delete any document or register you do not have, and make sure every document you list actually exists.]',
         '**1.2 Related documents.** This policy should be read with our Customer Due Diligence Policy, Compliance Monitoring Plan, Customer Vulnerability Policy, Training and Competence Policy and Data Processing Policy. It is supported by the registers listed in section 13, which must be kept from our first day of trading.'),
        ('[Insert the date of your current BWRA and where it is kept.]', 'Our BWRA is recorded in the AML Business-Wide Risk Assessment workbook and was last approved by senior management on [Insert date].'),
        ('alerts and decisions in our Sanctions Screening Log.', 'alerts and decisions in our Sanctions Screening Log (in the Customer Due Diligence Checklist workbook).'),
        ('records their reasoning in the ISAR Log,', 'records their reasoning in the AML Incident Register,'),
        ('**8A.6 Records.** The MLRO keeps a confidential record of every ISAR,', '**8A.6 Records.** The MLRO keeps a confidential record in the AML Incident Register of every ISAR,'),
        ('**8B.6 Records.** The MLRO keeps a confidential record of every internal report,', '**8B.6 Records.** The MLRO keeps a confidential record in the AML Incident Register of every internal report,'),
        ('recorded in our Gifts and Hospitality Register.', 'recorded in our Gifts and Hospitality Register (in the Conflicts and Gifts Registers workbook).'),
        ('keeps a record of every ISAR, the MLRO’s decision and reasons', 'keeps a record of every ISAR, the MLRO’s decision and reasons'),
    ],
    'cdd.txt': [
        ('It is recorded in the Customer Due Diligence Register and reviewed when circumstances change.', 'It is recorded in the CDD Register (in the Customer Due Diligence Checklist workbook) and reviewed when circumstances change. Each customer’s checks are recorded on the CDD Checklist and, where enhanced due diligence applies, the EDD Checklist.'),
        ('are recorded in the Customer Due Diligence Register.', 'are recorded on the EDD Checklist and in the CDD Register.'),
        ('We keep, in the Customer Due Diligence Register and customer files:', 'We keep, in the CDD Checklist, EDD Checklist, CDD Register and customer files:'),
        ('Every customer (and, where relevant, beneficial owners and third-party payers) is screened against the UK sanctions list before onboarding, as our Anti-Money Laundering Policy requires.', 'Every customer (and, where relevant, beneficial owners and third-party payers) is screened against the UK sanctions list before onboarding, as our Anti-Money Laundering Policy requires. Results are recorded in the Sanctions Screening Log.'),
    ],
    'cmp.txt': [
        ('It is recorded in our Compliance Universe Register [Insert location]', 'It is recorded in our Compliance Universe Register (in the Compliance Monitoring Tracker workbook)'),
        ('Breaches are recorded in the Breach Register and assessed', 'Breaches are recorded in the Compliance Breach Log and assessed'),
        ('Every finding is tracked through the Corrective Action Log to closure', 'Every finding is tracked through the Corrective Action Log (in the Compliance Monitoring Tracker workbook) to closure'),
    ],
    'cmplan.txt': [
        ('confirms which checks are due under the schedule', 'confirms, using the Monitoring Schedule in the Compliance Monitoring Tracker, which checks are due under the schedule'),
        ('[Insert where checklists are kept.]', 'The result for each file is recorded in the File Review Record, and checklists are kept at [Insert location].'),
        ('We record every breach in our **Breach Register**,', 'We record every breach in our **Compliance Breach Log**,'),
        ('Every Red or Amber finding is entered in the Corrective Action Log', 'Every Red or Amber finding is entered in the Corrective Action Log (in the Compliance Monitoring Tracker workbook)'),
        ('review the internal suspicion report log for timely MLRO decisions', 'review the AML Incident Register for timely MLRO decisions'),
        ('review data breach log and subject access request timeliness', 'review the Data Breach Log and Data Rights Request Log for timeliness'),
        ('Review the conflicts register;', 'Review the Conflicts of Interest Register and Gifts and Hospitality Register;'),
    ],
    'complaints.txt': [
        ('# Appendix B – Complaints Register fields', '# Appendix B – Complaints Register\nThe fields below are built into the KMS Complaints Register workbook (Complaints_Register_v2.0_Template.xlsx), which also calculates the DISP deadlines and produces a summary for management information. Use that workbook – it is an essential part of this procedure.'),
    ],
    'data.txt': [
        ('We keep a Record of Processing Activities [Insert location],', 'We keep a Record of Processing Activities (the ROPA tab in the Data Protection Registers workbook),'),
        ('All requests are recorded in our Data Rights Request Log [Insert location].', 'All requests are recorded in our Data Rights Request Log (in the Data Protection Registers workbook).'),
        ('DPIAs are approved by [Insert name or role] and kept at [Insert location].', 'DPIAs are approved by [Insert name or role], kept at [Insert location] and listed in the DPIA Register.'),
        ('Our Data Retention Schedule [Insert location] gives more detail', 'Our Data Retention Schedule (in the Data Protection Registers workbook) gives more detail'),
        ('- tell the complainant the outcome and that they can complain to the ICO.', '- tell the complainant the outcome and that they can complain to the ICO; and\n- record each data protection complaint in the DP Complaints Log (in the Data Protection Registers workbook).'),
    ],
    'finprom.txt': [
        ('The approver uses our Financial Promotion Checklist [Insert location],', 'The approver completes the Approval Checklist in the Financial Promotions Log workbook,'),
        ('**4.3 Financial Promotions Log.** We record every promotion in our Financial Promotions Log,', '**4.3 Financial Promotions Log.** We record every promotion in our Financial Promotions Log (Financial_Promotions_Log_v2.0_Template.xlsx),'),
    ],
    'risk.txt': [
        ('complete the risk register in Appendix A with your own risks.', 'complete the Risk Assessment Log with your own risks.'),
        ('All identified risks are recorded in our Risk Register (Appendix A).', 'All identified risks are recorded in our Risk Assessment Log (see Appendix A).'),
        ('maintains the Risk Register;', 'maintains the Risk Assessment Log;'),
        ('named for each risk in the Risk Register;', 'named for each risk in the Risk Assessment Log;'),
        ('the risk appetite and the Risk Register are reviewed', 'the risk appetite and the Risk Assessment Log are reviewed'),
    ],
    'training.txt': [
        ('Maintains the training matrix and Training Log;', 'Maintains the Training Log workbook, including the Training Matrix, Training Record, Competence Register and CPD Log;'),
        ('Our training matrix is below.', 'Our training matrix is below and is maintained in the Training Matrix tab of the Training Log workbook.'),
        ('**8.1 Training Log.** [Insert name or role] maintains a Training Log recording, for each person:', '**8.1 Training Log.** [Insert name or role] maintains the Training Log workbook (Training_Log_v2.0_Template.xlsx), which records, for each person:'),
        ('linked to our business plan, risk register,', 'linked to our business plan, Risk Assessment Log,'),
    ],
    'cduty.txt': [
        ('- We **review** each product and service at least [Insert frequency]', '- We record target markets and approvals in the Target Market Register (in the Consumer Duty Evidence workbook).\n- We **review** each product and service at least [Insert frequency]'),
        ('- We **review** fair value at least annually,', '- We record each assessment in the Fair Value Register (in the Consumer Duty Evidence workbook).\n- We **review** fair value at least annually,'),
        ('We monitor the outcomes our customers receive using management information (MI) that is proportionate to our size. Our key indicators are:', 'We monitor the outcomes our customers receive using management information (MI) that is proportionate to our size, recorded in the Outcome MI tab of the Consumer Duty Evidence workbook. Actions are tracked in its Board Report Actions tab. Our key indicators are:'),
    ],
    'vuln.txt': [
        ('The results are reported to [Insert: the board / the directors / the business owner] at least [Insert frequency] and included in our annual Consumer Duty board report.', 'The results are recorded in the Outcome MI tab of the Consumer Duty Evidence workbook, reported to [Insert: the board / the directors / the business owner] at least [Insert frequency] and included in our annual Consumer Duty board report.'),
        ('All customer-facing staff complete vulnerability training at induction,', 'All customer-facing staff complete vulnerability training (recorded in the Training Log) at induction,'),
    ],
}

APPEND = {
    'aml.txt': ('13. ', 'policy', rows('isar', 'cdd', 'cddreg', 'sanc', 'bwra', 'coi', 'breach', 'train')),
    'cdd.txt': ('15. ', 'policy', rows('cdd', 'cddreg', 'sanc', 'isar', 'bwra', 'train')),
    'complaints.txt': ('13. ', 'procedure', rows('comp', 'mon', 'breach', 'cd', 'dp', 'train')),
    'cmplan.txt': ('11. ', 'plan', rows('mon', 'breach', 'comp', 'fp', 'isar', 'cddreg', 'sanc', 'train', 'dp', 'coi', 'risk', 'cd')),
    'cmp.txt': ('8. ', 'programme', rows('mon', 'breach', 'risk', 'cd')),
    'vuln.txt': ('', 'policy', rows('cd', 'train', 'comp', 'dp')),
    'data.txt': ('18. ', 'policy', rows('dp', 'breach', 'train')),
    'finprom.txt': ('13. ', 'policy', rows('fp', 'mon', 'comp', 'train')),
    'cduty.txt': ('11. ', 'plan', rows('cd', 'comp', 'mon', 'risk', 'train')),
    'risk.txt': None,  # handled by replacing Appendix A
    'training.txt': ('12. ', 'policy', rows('train', 'mon', 'breach')),
}

RISK_APPENDIX = """# Appendix A – Risk Assessment Log
Our risks are recorded in the KMS Risk Assessment Log (Risk_Assessment_Log_v2.0_Template.xlsx). It applies the scoring in section 5.2, calculates inherent and residual scores and ratings, records controls, appetite, owners and actions, and contains starter risks for every firm and for each regulated activity.
NOTE: The starter risks are examples, not a finished assessment. Rewrite each in terms of your own business, delete those that do not apply, add your own (aim for the 10 to 20 risks that matter most), and score them. The FCA expects a risk register that is clearly specific to your firm.
""" + section('', 'framework', rows('risk', 'breach', 'mon', 'bwra', 'cd')).replace('# Supporting registers', '# Appendix B – Supporting registers')


def main():
    for fn, edits in EDITS.items():
        p = os.path.join(C, fn)
        s = open(p, encoding='utf-8').read()
        for old, new in edits:
            if old == new:
                continue
            assert old in s, (fn, old[:60])
            s = s.replace(old, new, 1)
        open(p, 'w', encoding='utf-8').write(s)
    for fn, spec in APPEND.items():
        p = os.path.join(C, fn)
        s = open(p, encoding='utf-8').read()
        if 'Supporting registers' in s:
            continue
        if fn == 'risk.txt':
            i = s.index('# Appendix A – Risk Register template')
            s = s[:i] + RISK_APPENDIX
        elif fn == 'vuln.txt':
            i = s.index('# Review')
            s = s[:i] + section('', spec[1], spec[2]).lstrip('\n') + '\n' + s[i:]
        elif fn == 'complaints.txt':
            i = s.index('# Appendix A')
            s = s[:i] + section(spec[0], spec[1], spec[2]).lstrip('\n') + '\n' + s[i:]
        else:
            s = s.rstrip('\n') + '\n' + section(spec[0], spec[1], spec[2])
        open(p, 'w', encoding='utf-8').write(s)
    # how-to bullet
    for fn in ['_howto.txt', 'complaints.txt']:
        p = os.path.join(C, fn)
        s = open(p, encoding='utf-8').read()
        bullet = '- **Supporting registers are mandatory.** This document relies on the KMS registers listed in its “Supporting registers” section (where it has one). The FCA judges a firm on the records that show its policies working in practice, so a firm that adopts this document without using its registers is likely to fail FCA scrutiny. Start using them from day one.'
        if 'Supporting registers are mandatory' not in s:
            anchor = '- **Grey “KMS guidance” boxes**'
            assert anchor in s, fn
            s = s.replace(anchor, bullet + '\n' + anchor, 1)
        open(p, 'w', encoding='utf-8').write(s)
    print('policies linked')


if __name__ == '__main__':
    main()
