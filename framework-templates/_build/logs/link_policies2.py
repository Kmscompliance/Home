#!/usr/bin/env python3
"""Second pass: policies reference one separate file per register; no register content inside policies."""
import os, re
C = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'content')
T = '_v2.0_Template.xlsx'

REPL = [  # global, order matters
    (' (in the Customer Due Diligence Checklist workbook)', ''),
    (' (in the Conflicts and Gifts Registers workbook)', ''),
    (' (in the Compliance Monitoring Tracker workbook)', ''),
    (' (in the Data Protection Registers workbook)', ''),
    (' (in the Consumer Duty Evidence workbook)', ''),
    ('confirms, using the Monitoring Schedule in the Compliance Monitoring Tracker, which checks', 'confirms, using the Compliance Monitoring Schedule, which checks'),
    (' (the ROPA tab in the Data Protection Registers workbook)', ''),
    ('completes the Approval Checklist in the Financial Promotions Log workbook,', 'completes the Financial Promotion Approval Checklist,'),
    (' (Financial_Promotions_Log_v2.0_Template.xlsx)', ''),
    ('Maintains the Training Log workbook, including the Training Matrix, Training Record, Competence Register and CPD Log;', 'Maintains the Training Matrix, Training Log, Competence Register and CPD Log;'),
    ('is maintained in the Training Matrix tab of the Training Log workbook.', 'is maintained in the Training Matrix.'),
    ('maintains the Training Log workbook (Training_Log_v2.0_Template.xlsx), which records, for each person:', 'maintains the Training Log, Competence Register and CPD Log, which together record, for each person:'),
    ('recorded in the Outcome MI tab of the Consumer Duty Evidence workbook. Actions are tracked in its Board Report Actions tab.', 'recorded in the Consumer Duty Outcome MI register. Actions are tracked in the Consumer Duty Board Report Actions log.'),
    ('recorded in the Outcome MI tab of the Consumer Duty Evidence workbook,', 'recorded in the Consumer Duty Outcome MI register,'),
    ('recorded in the AML Business-Wide Risk Assessment workbook', 'recorded in the AML Business-Wide Risk Assessment'),
    ('CDD Checklist, EDD Checklist, CDD Register', 'Customer Due Diligence Checklist, Enhanced Due Diligence Checklist, Customer Due Diligence Register'),
    ('the CDD Checklist and, where enhanced due diligence applies, the EDD Checklist', 'the Customer Due Diligence Checklist and, where enhanced due diligence applies, the Enhanced Due Diligence Checklist'),
    ('are recorded on the EDD Checklist and in the CDD Register.', 'are recorded on the Enhanced Due Diligence Checklist and in the Customer Due Diligence Register.'),
    ('It is recorded in the CDD Register and reviewed', 'It is recorded in the Customer Due Diligence Register and reviewed'),
]

REG = {
    'isar': ('AML Incident Register', 'Anti_Money_Laundering_Incident_Register_v2.0_Template.docx', 'Every internal suspicious activity report, the MLRO’s reasoning and decision, SARs and DAML requests'),
    'cddc': ('Customer Due Diligence Checklist', 'Customer_Due_Diligence_Checklist' + T, 'Due diligence completed for each customer before onboarding'),
    'eddc': ('Enhanced Due Diligence Checklist', 'Enhanced_Due_Diligence_Checklist' + T, 'Enhanced checks and approvals for higher-risk customers'),
    'cddr': ('Customer Due Diligence Register', 'Customer_Due_Diligence_Register' + T, 'Every customer’s verification, risk rating, screening, review and deletion dates'),
    'sanc': ('Sanctions Screening Log', 'Sanctions_Screening_Log' + T, 'Sanctions screening, potential matches, decisions and OFSI reports'),
    'bwra': ('AML Business-Wide Risk Assessment', 'AML_Business_Wide_Risk_Assessment' + T, 'The firm-wide assessment of financial crime risk that drives our controls'),
    'breach': ('Compliance Breach Log', 'Compliance_Breach_Log' + T, 'Every breach, root cause, customer impact, FCA notification decision and remediation'),
    'risk': ('Risk Assessment Log', 'Risk_Assessment_Log' + T, 'Identified risks, inherent and residual scores, controls, appetite and actions'),
    'tmat': ('Training Matrix', 'Training_Matrix' + T, 'The training each role must complete and how often'),
    'tlog': ('Training Log', 'Training_Log' + T, 'Every training activity completed, results and next-due dates'),
    'comp_reg': ('Competence Register', 'Competence_Register' + T, 'Competence assessments, supervision, qualifications and SM&CR fitness and propriety'),
    'cpd': ('CPD Log', 'CPD_Log' + T, 'CPD hours for staff with CPD requirements'),
    'comp': ('Complaints Register', 'Complaints_Register' + T, 'Every complaint, DISP deadlines, outcomes, redress, root causes and Ombudsman referrals'),
    'fpl': ('Financial Promotions Log', 'Financial_Promotions_Log' + T, 'Every promotion approved before use, evidence for claims, review and withdrawal'),
    'fpc': ('Financial Promotion Approval Checklist', 'Financial_Promotion_Approval_Checklist' + T, 'The checks made before each promotion is approved'),
    'ropa': ('Record of Processing Activities', 'Record_of_Processing_Activities' + T, 'Our processing activities, lawful bases, sharing and retention (Article 30 UK GDPR)'),
    'dsr': ('Data Rights Request Log', 'Data_Rights_Request_Log' + T, 'Rights requests and response times'),
    'dbl': ('Data Breach Log', 'Data_Breach_Log' + T, 'Personal data breaches and ICO notification decisions'),
    'dpc': ('Data Protection Complaints Log', 'Data_Protection_Complaints_Log' + T, 'Data protection complaints and 30-day acknowledgements'),
    'drs': ('Data Retention Schedule', 'Data_Retention_Schedule' + T, 'How long each type of record is kept and why'),
    'dpia': ('DPIA Register', 'DPIA_Register' + T, 'Data protection impact assessments completed'),
    'coi': ('Conflicts of Interest Register', 'Conflicts_of_Interest_Register' + T, 'Conflicts identified and how they are managed'),
    'gh': ('Gifts and Hospitality Register', 'Gifts_and_Hospitality_Register' + T, 'Gifts and hospitality given, received or declined, and approvals'),
    'msch': ('Compliance Monitoring Schedule', 'Compliance_Monitoring_Schedule' + T, 'Checks completed against the Compliance Monitoring Plan and their results'),
    'frr': ('File Review Record', 'File_Review_Record' + T, 'The result of each file reviewed'),
    'cal': ('Corrective Action Log', 'Corrective_Action_Log' + T, 'Findings and breaches tracked to verified closure'),
    'cur': ('Compliance Universe Register', 'Compliance_Universe_Register' + T, 'The requirements that apply to us and where each is covered'),
    'cdmi': ('Consumer Duty Outcome MI', 'Consumer_Duty_Outcome_MI' + T, 'Outcome monitoring for all customers and for vulnerable customers'),
    'tmr': ('Target Market Register', 'Target_Market_Register' + T, 'Target markets, our role and distribution strategy'),
    'fvr': ('Fair Value Register', 'Fair_Value_Register' + T, 'Fair value assessments and conclusions'),
    'bra': ('Consumer Duty Board Report Actions', 'Consumer_Duty_Board_Report_Actions' + T, 'Actions from outcome monitoring and the board report'),
}

INTRO = ('The KMS registers below support this {doc}. Each is a separate file. They are an essential part of the {doc}, not optional extras: the FCA judges whether a {doc} works in practice by looking at these records, and a {doc} without them is unlikely to withstand scrutiny. Keep them up to date from your first day of trading.')
NOTE = ('NOTE: Do not delete a register from this list because you have not started using it yet – start using it. Where part of a register genuinely cannot apply to your firm (for example safeguarding when you hold no relevant funds), keep the register and record why that part does not apply.')

SECTIONS = {
    'aml.txt': ('policy', ['isar', 'cddc', 'eddc', 'cddr', 'sanc', 'bwra', 'coi', 'gh', 'breach', 'tlog']),
    'cdd.txt': ('policy', ['cddc', 'eddc', 'cddr', 'sanc', 'isar', 'bwra', 'tlog']),
    'complaints.txt': ('procedure', ['comp', 'cal', 'breach', 'cdmi', 'dpc', 'tlog']),
    'cmplan.txt': ('plan', ['msch', 'frr', 'cal', 'cur', 'breach', 'comp', 'fpl', 'isar', 'cddr', 'sanc', 'tlog', 'comp_reg', 'dbl', 'dsr', 'coi', 'gh', 'risk', 'cdmi']),
    'cmp.txt': ('programme', ['cur', 'msch', 'frr', 'cal', 'breach', 'risk', 'cdmi']),
    'vuln.txt': ('policy', ['cdmi', 'tlog', 'comp', 'ropa']),
    'data.txt': ('policy', ['ropa', 'dsr', 'dbl', 'dpc', 'drs', 'dpia', 'breach', 'tlog']),
    'finprom.txt': ('policy', ['fpl', 'fpc', 'msch', 'comp', 'tlog']),
    'cduty.txt': ('plan', ['cdmi', 'tmr', 'fvr', 'bra', 'comp', 'risk', 'tlog']),
    'risk.txt': ('framework', ['risk', 'breach', 'cal', 'bwra', 'cdmi']),
    'training.txt': ('policy', ['tmat', 'tlog', 'comp_reg', 'cpd', 'msch', 'breach']),
}


def table(doc, keys):
    t = [INTRO.format(doc=doc), NOTE, 'TABLE: 28,36,36', '| Register | KMS file | What it evidences |']
    t += [f'| {REG[k][0]} | {REG[k][1]} | {REG[k][2]} |' for k in keys]
    return '\n'.join(t)


def main():
    for fn, (doc, keys) in SECTIONS.items():
        p = os.path.join(C, fn)
        s = open(p, encoding='utf-8').read()
        for a, b in REPL:
            s = s.replace(a, b)
        # replace the body of the existing Supporting registers section
        m = re.search(r'^(# [^\n]*Supporting registers)\n(.*?)(?=^#!? |\Z)', s, re.S | re.M)
        assert m, fn
        s = s[:m.start()] + m.group(1) + '\n' + table(doc, keys) + '\n\n' + s[m.end():]
        if fn == 'complaints.txt':
            m2 = re.search(r'^# Appendix B – Complaints Register\n.*?(?=^#!? |\Z)', s, re.S | re.M)
            assert m2
            s = s[:m2.start()] + ('# Appendix B – Complaints Register\n'
                                  'Complaints are recorded in the separate KMS Complaints Register (Complaints_Register_v2.0_Template.xlsx). It records every field DISP requires, calculates the DISP deadlines, and summarises complaints for management information and the FCA complaints return. It is an essential part of this procedure.\n') + s[m2.end():]
        s = s.rstrip('\n') + '\n'
        open(p, 'w', encoding='utf-8').write(s)
    # sanity: no workbook/tab wording left
    for fn in os.listdir(C):
        s = open(os.path.join(C, fn), encoding='utf-8').read()
        for bad in ['workbook', ' tab of', ' tab in']:
            if bad in s:
                print('WARNING', fn, bad, s[s.index(bad) - 80:s.index(bad) + 40].replace('\n', ' '))
    print('linked (pass 2)')


if __name__ == '__main__':
    main()
