#!/usr/bin/env python3
"""Rebuild a KMS source .docx in place: keep cover, title block, TOC wrapper,
styles, theme, numbering and section setup; replace the body with content
generated from a simple line-based markup file."""
import re, os, sys, shutil, zipfile, html, datetime, json

W = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'

def esc(s):
    return html.escape(s, quote=False)

# ---------------------------------------------------------------- inline runs
PH_RPR = '<w:b/><w:bCs/><w:highlight w:val="yellow"/>'

def runs(text, base_rpr='', allow_ph=True):
    """Convert inline markup to runs. **bold**, [placeholder]."""
    out = []
    # tokenise
    pattern = re.compile(r'(\*\*.+?\*\*|\[[^\]]+\])') if allow_ph else re.compile(r'(\*\*.+?\*\*)')
    for tok in pattern.split(text):
        if not tok:
            continue
        if tok.startswith('**') and tok.endswith('**'):
            inner = tok[2:-2]
            # placeholders can sit inside bold text
            for t2 in re.split(r'(\[[^\]]+\])', inner) if allow_ph else [inner]:
                if not t2:
                    continue
                if allow_ph and t2.startswith('[') and t2.endswith(']'):
                    out.append(f'<w:r><w:rPr>{base_rpr}{PH_RPR}</w:rPr><w:t xml:space="preserve">{esc(t2)}</w:t></w:r>')
                else:
                    out.append(f'<w:r><w:rPr>{base_rpr}<w:b/><w:bCs/></w:rPr><w:t xml:space="preserve">{esc(t2)}</w:t></w:r>')
        elif allow_ph and tok.startswith('[') and tok.endswith(']'):
            out.append(f'<w:r><w:rPr>{base_rpr}{PH_RPR}</w:rPr><w:t xml:space="preserve">{esc(tok)}</w:t></w:r>')
        else:
            rp = f'<w:rPr>{base_rpr}</w:rPr>' if base_rpr else ''
            out.append(f'<w:r>{rp}<w:t xml:space="preserve">{esc(tok)}</w:t></w:r>')
    return ''.join(out)

# ---------------------------------------------------------------- builder
class Builder:
    def __init__(self, cfg):
        self.cfg = cfg
        self.parts = []
        self.comments = []   # (id, text)
        self.pid = 0x10000000

    def _p(self, inner, ppr=''):
        return f'<w:p>{"<w:pPr>" + ppr + "</w:pPr>" if ppr else ""}{inner}</w:p>'

    def heading(self, level, text):
        sid = self.cfg['h'][level - 1]
        self.parts.append(self._p(runs(text, allow_ph=True),
                                  f'<w:pStyle w:val="{sid}"/><w:outlineLvl w:val="{level-1}"/>'))

    def para(self, text, ppr_extra='', rpr=''):
        ppr = self.cfg.get('normal_ppr', '') + ppr_extra
        self.parts.append(self._p(runs(text, rpr), ppr))

    def bullet(self, text, lvl=0):
        num = self.cfg['bullet']
        style = f'<w:pStyle w:val="{self.cfg["list_style"]}"/>' if self.cfg.get('list_style') else ''
        self.parts.append(self._p(runs(text), f'{style}<w:numPr><w:ilvl w:val="{lvl}"/><w:numId w:val="{num}"/></w:numPr>'))

    def box(self, text, fill, border, label, italic=True, comment=None):
        bdr = (f'<w:pBdr><w:top w:val="single" w:sz="4" w:space="4" w:color="{border}"/>'
               f'<w:left w:val="single" w:sz="24" w:space="4" w:color="{border}"/>'
               f'<w:bottom w:val="single" w:sz="4" w:space="4" w:color="{border}"/>'
               f'<w:right w:val="single" w:sz="4" w:space="4" w:color="{border}"/></w:pBdr>')
        ppr = f'{bdr}<w:shd w:val="clear" w:color="auto" w:fill="{fill}"/><w:spacing w:before="120" w:after="120"/><w:ind w:left="113" w:right="113"/>'
        it = '<w:i/><w:iCs/>' if italic else ''
        inner = f'<w:r><w:rPr><w:b/><w:bCs/></w:rPr><w:t xml:space="preserve">{esc(label)} </w:t></w:r>' + runs(text, it)
        if comment:
            cid = len(self.comments)
            self.comments.append((cid, comment))
            inner = (f'<w:commentRangeStart w:id="{cid}"/>' + inner +
                     f'<w:commentRangeEnd w:id="{cid}"/><w:r><w:rPr><w:rStyle w:val="CommentReference"/></w:rPr><w:commentReference w:id="{cid}"/></w:r>')
        self.parts.append(self._p(inner, ppr))

    def note(self, text):
        self.box(text, 'F2F2F2', '11304F', 'KMS guidance:')

    def watch(self, text):
        self.box(text, 'FFF2CC', 'BF8F00', 'Regulatory watch – not yet final:',
                 comment='KMS Compliance: this passage relies on FCA/Government material that is still in consultation or not yet in force. ' + re.sub(r'\*\*|\[|\]', '', text)[:600])

    def option(self, code, title, keep):
        fill, border = 'E2EFD9', '068A53'
        bdr = (f'<w:pBdr><w:top w:val="single" w:sz="12" w:space="4" w:color="{border}"/>'
               f'<w:left w:val="single" w:sz="12" w:space="4" w:color="{border}"/>'
               f'<w:bottom w:val="single" w:sz="12" w:space="4" w:color="{border}"/>'
               f'<w:right w:val="single" w:sz="12" w:space="4" w:color="{border}"/></w:pBdr>')
        ppr = f'<w:keepNext/>{bdr}<w:shd w:val="clear" w:color="auto" w:fill="{fill}"/><w:spacing w:before="240" w:after="0"/>'
        t1 = f'<w:r><w:rPr><w:b/><w:bCs/><w:color w:val="068A53"/></w:rPr><w:t xml:space="preserve">▼ START OF OPTION {esc(code)} — {esc(title)}</w:t></w:r>'
        self.parts.append(self._p(t1, ppr))
        instr = (f'[KEEP this option if {keep} Otherwise DELETE everything from this START banner down to and including '
                 f'the matching END OF OPTION {code} banner. Each option is self-contained, so nothing else in the document needs to change.]')
        ppr2 = f'<w:keepNext/>{bdr}<w:shd w:val="clear" w:color="auto" w:fill="{fill}"/><w:spacing w:before="0" w:after="160"/>'
        self.parts.append(self._p(f'<w:r><w:rPr><w:i/><w:iCs/>{PH_RPR}</w:rPr><w:t xml:space="preserve">{esc(instr)}</w:t></w:r>', ppr2))

    def endoption(self, code, title):
        fill, border = 'E2EFD9', '068A53'
        bdr = (f'<w:pBdr><w:top w:val="single" w:sz="12" w:space="4" w:color="{border}"/>'
               f'<w:left w:val="single" w:sz="12" w:space="4" w:color="{border}"/>'
               f'<w:bottom w:val="single" w:sz="12" w:space="4" w:color="{border}"/>'
               f'<w:right w:val="single" w:sz="12" w:space="4" w:color="{border}"/></w:pBdr>')
        ppr = f'{bdr}<w:shd w:val="clear" w:color="auto" w:fill="{fill}"/><w:spacing w:before="160" w:after="240"/>'
        t = f'<w:r><w:rPr><w:b/><w:bCs/><w:color w:val="068A53"/></w:rPr><w:t xml:space="preserve">▲ END OF OPTION {esc(code)} — {esc(title)}</w:t></w:r>'
        self.parts.append(self._p(t, ppr))

    def table(self, rows, widths_pct=None):
        total = self.cfg.get('text_width', 9026)
        ncol = max(len(r) for r in rows)
        if widths_pct:
            ws = [int(total * p / 100) for p in widths_pct]
        else:
            ws = [total // ncol] * ncol
        ws[-1] = total - sum(ws[:-1])
        b = '<w:tblBorders>' + ''.join(f'<w:{s} w:val="single" w:sz="4" w:space="0" w:color="A6A6A6"/>' for s in ['top', 'left', 'bottom', 'right', 'insideH', 'insideV']) + '</w:tblBorders>'
        x = [f'<w:tbl><w:tblPr><w:tblW w:w="{total}" w:type="dxa"/>{b}<w:tblLayout w:type="fixed"/><w:tblCellMar><w:top w:w="57" w:type="dxa"/><w:left w:w="85" w:type="dxa"/><w:bottom w:w="57" w:type="dxa"/><w:right w:w="85" w:type="dxa"/></w:tblCellMar><w:tblLook w:val="04A0" w:firstRow="1" w:lastRow="0" w:firstColumn="0" w:lastColumn="0" w:noHBand="0" w:noVBand="1"/></w:tblPr><w:tblGrid>']
        x += [f'<w:gridCol w:w="{w}"/>' for w in ws]
        x.append('</w:tblGrid>')
        for ri, r in enumerate(rows):
            r = r + [''] * (ncol - len(r))
            trpr = '<w:trPr><w:cantSplit/><w:tblHeader/></w:trPr>' if ri == 0 else '<w:trPr><w:cantSplit/></w:trPr>'
            x.append(f'<w:tr>{trpr}')
            for ci, c in enumerate(r):
                shd = f'<w:shd w:val="clear" w:color="auto" w:fill="{self.cfg.get("th_fill", "D9E2F3")}"/>' if ri == 0 else ''
                x.append(f'<w:tc><w:tcPr><w:tcW w:w="{ws[ci]}" w:type="dxa"/>{shd}</w:tcPr>')
                for line in (c.split('<br>') if c else ['']):
                    line = line.strip()
                    rpr = '<w:b/><w:bCs/>' if ri == 0 else ''
                    ppr = '<w:spacing w:before="0" w:after="60"/>'
                    if line.startswith('• '):
                        ppr += '<w:ind w:left="227" w:hanging="227"/>'
                    x.append(f'<w:p><w:pPr>{ppr}</w:pPr>{runs(line, rpr)}</w:p>')
                x.append('</w:tc>')
            x.append('</w:tr>')
        x.append('</w:tbl>')
        self.parts.append(''.join(x))
        self.parts.append('<w:p><w:pPr><w:spacing w:before="0" w:after="0"/></w:pPr></w:p>')

    def pagebreak(self):
        self.parts.append('<w:p><w:r><w:br w:type="page"/></w:r></w:p>')

    def section_break(self, sectpr):
        self.parts.append(f'<w:p><w:pPr>{sectpr}</w:pPr></w:p>')

    # ------------------------------------------------------------ markup
    def load(self, path):
        text = open(path, encoding='utf-8').read()
        def _inc(m):
            inc = open(os.path.join(os.path.dirname(path), '_howto.txt'), encoding='utf-8').read()
            return inc.replace('{DOC}', m.group(1).strip())
        text = re.sub(r'^HOWTO:(.*)$', _inc, text, flags=re.M)
        lines = text.split('\n')
        i = 0
        while i < len(lines):
            ln = lines[i].rstrip()
            s = ln.strip()
            i += 1
            if not s or s.startswith('//'):
                continue
            if s.startswith('TABLE'):
                widths = None
                if ':' in s:
                    widths = [float(v) for v in s.split(':', 1)[1].split(',') if v.strip()]
                rows = []
                while i < len(lines) and lines[i].strip().startswith('|'):
                    cells = [c.strip() for c in lines[i].strip().strip('|').split('|')]
                    rows.append(cells)
                    i += 1
                self.table(rows, widths)
                continue
            if s.startswith('#! '):
                sid = self.cfg['h'][0]
                self.parts.append(self._p(runs(s[3:]), f'<w:pStyle w:val="{sid}"/><w:numPr><w:ilvl w:val="0"/><w:numId w:val="0"/></w:numPr><w:outlineLvl w:val="0"/>'))
                continue
            m = re.match(r'^(#{1,4}) (.*)$', s)
            if m:
                self.heading(len(m.group(1)), m.group(2)); continue
            if s.startswith('-- '):
                self.bullet(s[3:], 1); continue
            if s.startswith('- '):
                self.bullet(s[2:], 0); continue
            if s.startswith('NOTE: '):
                self.note(s[6:]); continue
            if s.startswith('WATCH: '):
                self.watch(s[7:]); continue
            if s.startswith('OPT: '):
                code, title, keep = [p.strip() for p in s[5:].split('|')]
                self.option(code, title, keep); continue
            if s.startswith('ENDOPT: '):
                code, title = [p.strip() for p in s[8:].split('|')]
                self.endoption(code, title); continue
            if s.startswith('WIDTH:'):
                self.cfg['text_width'] = int(s.split(':', 1)[1]); continue
            if s == 'PAGEBREAK':
                self.pagebreak(); continue
            if s.startswith('SECTIONBREAK:'):
                self.section_break(self.cfg['sectprs'][s.split(':', 1)[1].strip()]); continue
            self.para(s)

# ---------------------------------------------------------------- package ops
def para_text(pxml):
    return ''.join(re.findall(r'<w:t(?: [^>]*)?>([^<]*)</w:t>', pxml))

def top_level_elements(body):
    """Split body XML into top-level elements (p, tbl, sdt, bookmark, sectPr)."""
    els = []
    i = 0
    n = len(body)
    while i < n:
        if body.startswith('<w:', i):
            m = re.match(r'<w:([A-Za-z]+)', body[i:])
            tag = m.group(1)
            # self-closing?
            end_open = body.index('>', i)
            if body[end_open - 1] == '/':
                els.append((tag, body[i:end_open + 1])); i = end_open + 1; continue
            # find matching close, accounting for nesting of same tag
            depth = 0
            j = i
            pat = re.compile(r'<(/?)w:' + tag + r'(?=[ >/])[^>]*?(/?)>')
            for mm in pat.finditer(body, i):
                if mm.group(1) == '':
                    if mm.group(2) == '/':
                        continue
                    depth += 1
                else:
                    depth -= 1
                    if depth == 0:
                        j = mm.end(); break
            els.append((tag, body[i:j])); i = j
        else:
            i += 1
    return els

def rewrite_meta_para(pxml, new_text):
    ppr = re.search(r'<w:pPr>.*?</w:pPr>', pxml, re.S)
    ppr = ppr.group(0) if ppr else ''
    ppr = re.sub(r'<w:rPr>.*?</w:rPr>', '', ppr, flags=re.S)
    first_rpr = re.search(r'<w:r(?: [^>]*)?>\s*(<w:rPr>.*?</w:rPr>)', pxml, re.S)
    base = first_rpr.group(1)[7:-8] if first_rpr else ''
    base = re.sub(r'<w:b/>|<w:bCs/>|<w:highlight[^>]*/>', '', base)
    head = re.match(r'<w:p(?: [^>]*)?>', pxml).group(0)
    return f'{head}{ppr}{runs(new_text, base)}</w:p>'

def build(src_dir, out_path, markup, cfg):
    tmp = out_path + '.d'
    if os.path.exists(tmp):
        shutil.rmtree(tmp)
    shutil.copytree(src_dir, tmp)
    doc = open(f'{tmp}/word/document.xml', encoding='utf-8').read()
    bstart = doc.index('<w:body>') + len('<w:body>')
    bend = doc.index('</w:body>')
    body = doc[bstart:bend]
    els = top_level_elements(body)
    final_sect = [e for t, e in els if t == 'sectPr'][-1]
    # collect section properties embedded in paragraphs (for landscape etc.)
    cfg.setdefault('sectprs', {})
    for t, e in els:
        if t == 'p' and '<w:sectPr' in e:
            sp = re.search(r'<w:sectPr.*?</w:sectPr>', e, re.S).group(0)
            if 'landscape' in sp:
                cfg['sectprs']['landscape'] = sp
            else:
                cfg['sectprs']['portrait'] = sp
    # find body start
    target, occ = cfg['start'], cfg.get('start_occurrence', 1)
    seen = 0
    start_idx = None
    for k, (t, e) in enumerate(els):
        if t == 'p' and para_text(e).strip() == target:
            seen += 1
            if seen == occ:
                start_idx = k; break
    assert start_idx is not None, f'start marker not found: {target}'
    prefix = els[:start_idx]
    new_prefix = []
    for t, e in prefix:
        if t == 'p':
            e = re.sub(r'<w:commentRangeStart [^>]*/>|<w:commentRangeEnd [^>]*/>', '', e)
            e = re.sub(r'<w:r(?: [^>]*)?>(?:(?!</w:r>).)*<w:commentReference [^>]*/></w:r>', '', e, flags=re.S)
            txt = para_text(e).strip()
            for label, new in cfg.get('meta', []):
                if txt.startswith(label) or txt == label.strip():
                    if isinstance(new, list):
                        e = ''.join(rewrite_meta_para(e, nt) for nt in new)
                    else:
                        e = rewrite_meta_para(e, new)
                    break
        if t == 'sdt' and 'Table of Contents' in e:
            head_p = re.search(r'<w:sdtContent>(<w:p(?: [^>]*)?>.*?</w:p>)', e, re.S).group(1)
            toc_style = 'TOC1'
            fld = ('<w:p><w:pPr><w:pStyle w:val="' + toc_style + '"/><w:tabs><w:tab w:val="right" w:leader="dot" w:pos="9016"/></w:tabs></w:pPr>'
                   '<w:r><w:fldChar w:fldCharType="begin" w:dirty="true"/></w:r><w:r><w:instrText xml:space="preserve"> TOC \\o "1-3" \\h \\z \\u </w:instrText></w:r>'
                   '<w:r><w:fldChar w:fldCharType="separate"/></w:r>'
                   f'<w:r><w:rPr>{PH_RPR}</w:rPr><w:t xml:space="preserve">[Contents list: right-click here and choose “Update Field”, then “Update entire table”, to build the contents list once you have deleted the options that do not apply to your firm.]</w:t></w:r>'
                   '<w:r><w:fldChar w:fldCharType="end"/></w:r></w:p>')
            e = re.sub(r'<w:sdtContent>.*</w:sdtContent>', lambda m: '<w:sdtContent>' + head_p + fld + '</w:sdtContent>', e, flags=re.S)
        new_prefix.append(e)
    b = Builder(cfg)
    b.load(markup)
    new_body = ''.join(new_prefix) + ''.join(b.parts) + final_sect
    doc = doc[:bstart] + new_body + doc[bend:]
    open(f'{tmp}/word/document.xml', 'w', encoding='utf-8').write(doc)
    # ---------------- comments: replace originals with our regulatory-watch comments
    rels_p = f'{tmp}/word/_rels/document.xml.rels'
    rels = open(rels_p, encoding='utf-8').read()
    ct_p = f'{tmp}/[Content_Types].xml'
    ct = open(ct_p, encoding='utf-8').read()
    for part in ['comments.xml', 'commentsExtended.xml', 'commentsIds.xml', 'commentsExtensible.xml', 'people.xml']:
        if os.path.exists(f'{tmp}/word/{part}'):
            os.remove(f'{tmp}/word/{part}')
        rels = re.sub(r'<Relationship [^>]*Target="' + re.escape(part) + r'"[^>]*/>', '', rels)
        ct = re.sub(r'<Override [^>]*PartName="/word/' + re.escape(part) + r'"[^>]*/>', '', ct)
    if b.comments:
        now = datetime.datetime(2026, 9, 25).strftime('%Y-%m-%dT%H:%M:%SZ')
        cx = [f'<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<w:comments xmlns:w="{W}">']
        for cid, text in b.comments:
            cx.append(f'<w:comment w:id="{cid}" w:author="KMS Compliance" w:date="{now}" w:initials="KMS"><w:p><w:r><w:t xml:space="preserve">{esc(text)}</w:t></w:r></w:p></w:comment>')
        cx.append('</w:comments>')
        open(f'{tmp}/word/comments.xml', 'w', encoding='utf-8').write(''.join(cx))
        rels = rels.replace('</Relationships>', '<Relationship Id="rIdKmsComments" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/comments" Target="comments.xml"/></Relationships>')
        ct = ct.replace('</Types>', '<Override PartName="/word/comments.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.comments+xml"/></Types>')
    open(rels_p, 'w', encoding='utf-8').write(rels)
    open(ct_p, 'w', encoding='utf-8').write(ct)
    # ---------------- ask Word to refresh the contents list on open
    st_p = f'{tmp}/word/settings.xml'
    st = open(st_p, encoding='utf-8').read()
    if '<w:updateFields' not in st and 'Table of Contents' in doc:
        m = re.search(r'<w:(hdrShapeDefaults|footnotePr|endnotePr|compat)[ >/]', st)
        if m:
            st = st[:m.start()] + '<w:updateFields w:val="true"/>' + st[m.start():]
    open(st_p, 'w', encoding='utf-8').write(st)
    # ---------------- core properties: clear personal authoring metadata of the source
    cp = f'{tmp}/docProps/core.xml'
    if os.path.exists(cp):
        c = open(cp, encoding='utf-8').read()
        c = re.sub(r'<cp:lastModifiedBy>.*?</cp:lastModifiedBy>', '<cp:lastModifiedBy>KMS Compliance</cp:lastModifiedBy>', c)
        c = re.sub(r'<dc:title>.*?</dc:title>', '', c)
        open(cp, 'w', encoding='utf-8').write(c)
    # ---------------- zip
    if os.path.exists(out_path):
        os.remove(out_path)
    with zipfile.ZipFile(out_path, 'w', zipfile.ZIP_DEFLATED) as z:
        # [Content_Types].xml first
        z.write(ct_p, '[Content_Types].xml')
        for root, _, files in os.walk(tmp):
            for f in files:
                full = os.path.join(root, f)
                arc = os.path.relpath(full, tmp)
                if arc == '[Content_Types].xml':
                    continue
                z.write(full, arc)
    shutil.rmtree(tmp)
    return len(b.comments)

if __name__ == '__main__':
    cfgs = json.load(open(sys.argv[1]))
    names = sys.argv[2:] or list(cfgs)
    base = os.path.dirname(os.path.abspath(sys.argv[1]))
    for name in names:
        cfg = cfgs[name]
        n = build(f'{base}/src/{cfg["src"]}', f'{base}/out/{cfg["out"]}', f'{base}/content/{name}.txt', cfg)
        print(f'built {cfg["out"]}  (watch comments: {n})')
