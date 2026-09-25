#!/usr/bin/env python3
"""Rebuild the AML Incident Register (.docx) in place: keep heading, header, page setup and
table style; replace the body with guidance and an expanded ISAR log table."""
import os, re, sys, shutil, zipfile
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..'))
from build import runs, esc  # noqa

SRC = os.path.join(HERE, '..', 'logsrc', 'aml')
OUT = os.path.join(HERE, '..', 'out', 'Anti_Money_Laundering_Incident_Register_v2.0_Template.docx')
ITAL = None
ARIAL = '<w:rFonts w:ascii="Arial" w:eastAsia="Times New Roman" w:hAnsi="Arial" w:cs="Arial"/>'


ITAL = ARIAL + '<w:i/><w:sz w:val="18"/>'


def box(text, label, fill='F2F2F2', border='11304F'):
    bdr = (f'<w:pBdr><w:top w:val="single" w:sz="4" w:space="4" w:color="{border}"/><w:left w:val="single" w:sz="24" w:space="4" w:color="{border}"/>'
           f'<w:bottom w:val="single" w:sz="4" w:space="4" w:color="{border}"/><w:right w:val="single" w:sz="4" w:space="4" w:color="{border}"/></w:pBdr>')
    return (f'<w:p><w:pPr>{bdr}<w:shd w:val="clear" w:color="auto" w:fill="{fill}"/><w:spacing w:before="60" w:after="60"/><w:ind w:left="113" w:right="113"/></w:pPr>'
            f'<w:r><w:rPr>{ARIAL}<w:b/><w:bCs/><w:sz w:val="18"/></w:rPr><w:t xml:space="preserve">{esc(label)} </w:t></w:r>{runs(text, ITAL)}</w:p>')


def para(text, bold=False, size=18, color=None):
    rpr = ARIAL + ('<w:b/><w:bCs/>' if bold else '') + (f'<w:color w:val="{color}"/>' if color else '') + f'<w:sz w:val="{size}"/>'
    return f'<w:p><w:pPr><w:spacing w:before="40" w:after="40"/></w:pPr>{runs(text, rpr)}</w:p>'


COLS = [('Ref.', 850), ('Date ISAR received by MLRO', 1250), ('Reported by (name and role)', 1450), ('Customer / account reference', 1350),
        ('Summary of the suspicion and why it arose', 2750), ('MLRO review: information considered and reasoning', 2600),
        ('Decision – SAR / no SAR (and date)', 1300), ('NCA SAR reference', 1250), ('DAML requested? Outcome and date', 1350), ('Status / date closed', 1248)]


def cell(text, w, header=False):
    rpr = ARIAL + ('<w:b/><w:bCs/>' if header else '<w:b w:val="0"/><w:bCs w:val="0"/>') + '<w:sz w:val="18"/>'
    shd = '<w:shd w:val="clear" w:color="auto" w:fill="E2EFD9"/>' if header else ''
    t = f'<w:r><w:rPr>{rpr}</w:rPr><w:t xml:space="preserve">{esc(text)}</w:t></w:r>' if text else ''
    return f'<w:tc><w:tcPr><w:tcW w:w="{w}" w:type="dxa"/>{shd}<w:vAlign w:val="center"/></w:tcPr><w:p><w:pPr><w:spacing w:before="40" w:after="40" w:line="240" w:lineRule="auto"/><w:jc w:val="{"center" if header else "left"}"/></w:pPr>{t}</w:p></w:tc>'


def table(nrows=18):
    total = sum(w for _, w in COLS)
    x = [f'<w:tbl><w:tblPr><w:tblStyle w:val="GridTable1Light"/><w:tblW w:w="{total}" w:type="dxa"/><w:tblLayout w:type="fixed"/><w:tblLook w:val="04A0" w:firstRow="1" w:lastRow="0" w:firstColumn="0" w:lastColumn="0" w:noHBand="0" w:noVBand="1"/></w:tblPr><w:tblGrid>']
    x += [f'<w:gridCol w:w="{w}"/>' for _, w in COLS] + ['</w:tblGrid>']
    x.append('<w:tr><w:trPr><w:cantSplit/><w:tblHeader/></w:trPr>' + ''.join(cell(h, w, True) for h, w in COLS) + '</w:tr>')
    for i in range(1, nrows + 1):
        x.append('<w:tr><w:trPr><w:cantSplit/><w:trHeight w:val="567"/></w:trPr>' + ''.join(cell(f'ISAR-{i:03d}' if k == 0 else '', w) for k, (_, w) in enumerate(COLS)) + '</w:tr>')
    x.append('</w:tbl>')
    return ''.join(x)


def main():
    tmp = OUT + '.d'
    if os.path.exists(tmp):
        shutil.rmtree(tmp)
    shutil.copytree(SRC, tmp)
    p = f'{tmp}/word/document.xml'
    x = open(p, encoding='utf-8').read()
    b = x.index('<w:body>') + 8
    e = x.index('</w:body>')
    body = x[b:e]
    heading = re.match(r'<w:p[ >].*?</w:p>', body, re.S).group(0)
    sect = re.search(r'<w:sectPr.*?</w:sectPr>', body, re.S).group(0)
    parts = [heading,
             para('STRICTLY CONFIDENTIAL – for the MLRO only. Keep this register separate from customer files. Do not disclose its contents to the customer or anyone else: doing so may be a tipping-off or prejudicing-an-investigation offence.', bold=True, color='C00000'),
             para('Firm: [Insert firm legal name]   |   MLRO / nominated officer: [Insert name]   |   Deputy: [Insert name, or delete]'),
             box('This is the internal suspicious activity report log referred to in the Anti-Money Laundering and Financial Crime Policy (section 8). Record every internal suspicious activity report (ISAR) received by the MLRO, including those that do not lead to a report to the National Crime Agency (NCA). The FCA expects to see that every suspicion was considered promptly, that the MLRO’s reasoning is recorded, and that decisions were made independently of commercial considerations. A firm that cannot produce this record is unlikely to satisfy the FCA that its reporting procedures work.', 'KMS guidance:'),
             box('Record: when the MLRO received the report; who raised it; a factual summary of the suspicion; what the MLRO reviewed and why they reached their decision; whether a Suspicious Activity Report (SAR) was submitted and its NCA reference; and any request for a defence against money laundering (DAML) – the NCA has seven working days to respond, and if it refuses, a moratorium period (normally 31 days) applies. Keep the ISAR form, MLRO notes and NCA correspondence in the confidential MLRO file [Insert location]. Retain for [Insert period, e.g. five years] after the report.', 'How to complete:'),
             table(),
             para(' ')]
    x = x[:b] + ''.join(parts) + sect + x[e:]
    open(p, 'w', encoding='utf-8').write(x)
    if os.path.exists(OUT):
        os.remove(OUT)
    with zipfile.ZipFile(OUT, 'w', zipfile.ZIP_DEFLATED) as z:
        z.write(f'{tmp}/[Content_Types].xml', '[Content_Types].xml')
        for root, _, files in os.walk(tmp):
            for f in files:
                full = os.path.join(root, f)
                arc = os.path.relpath(full, tmp)
                if arc != '[Content_Types].xml':
                    z.write(full, arc)
    shutil.rmtree(tmp)
    print('built', OUT)


if __name__ == '__main__':
    main()
