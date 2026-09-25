"""KMS house-style helpers for Excel registers (mirrors the v1.0 KMS logs:
light accent-6 header fill with dark accent-6 text, thin borders, no gridlines)."""
import re
from openpyxl import load_workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.styles.colors import Color
from openpyxl.worksheet.datavalidation import DataValidation
from openpyxl.formatting.rule import CellIsRule, FormulaRule
from openpyxl.utils import get_column_letter as L
from openpyxl.comments import Comment

GREEN_FILL = PatternFill('solid', fgColor=Color(theme=9, tint=0.3999755851924192))
GREEN_TEXT = Color(theme=9, tint=-0.499984740745262)
OPT_FILL = PatternFill('solid', fgColor='E2EFD9')
PH_FILL = PatternFill('solid', fgColor='FFFF00')
NOTE_FILL = PatternFill('solid', fgColor='F2F2F2')
WATCH_FILL = PatternFill('solid', fgColor='FFF2CC')
THIN = Side(style='thin', color='A6A6A6')
BORDER = Border(left=THIN, right=THIN, top=THIN, bottom=THIN)


class Book:
    def __init__(self, base_path, font):
        self.wb = load_workbook(base_path)
        self.font = font
        for ws in list(self.wb.worksheets):
            self.wb.remove(ws)
        self.lists = None
        self.list_cols = {}

    def f(self, **kw):
        return Font(name=self.font, **kw)

    # ------------------------------------------------------------ sheets
    def sheet(self, name, widths, title, subtitle=None, landscape=True):
        ws = self.wb.create_sheet(name[:31])
        ws.sheet_view.showGridLines = False
        for i, w in enumerate(widths, 1):
            ws.column_dimensions[L(i)].width = w
        n = len(widths)
        ws.merge_cells(start_row=1, start_column=1, end_row=1, end_column=n)
        c = ws.cell(1, 1, title)
        c.font = self.f(sz=20, b=True, color=GREEN_TEXT)
        c.fill = GREEN_FILL
        c.alignment = Alignment(horizontal='center', vertical='center')
        ws.row_dimensions[1].height = 30
        sub = subtitle or 'Firm: [Insert firm legal name]   |   Register owner: [Insert name and role]   |   Last reviewed: [Insert date]'
        ws.merge_cells(start_row=2, start_column=1, end_row=2, end_column=n)
        self.rich(ws.cell(2, 1), sub, italic=True)
        ws.row_dimensions[2].height = 20
        if landscape:
            ws.page_setup.orientation = 'landscape'
        ws.page_setup.fitToWidth = 1
        ws.page_setup.fitToHeight = 0
        ws.sheet_properties.pageSetUpPr.fitToPage = True
        return ws

    def rich(self, cell, text, italic=False, bold=False):
        """Placeholder-aware single cell: highlight the cell if it contains [..]."""
        cell.value = text
        cell.font = self.f(i=italic, b=bold or ('[' in text and text.strip().startswith('[')))
        cell.alignment = Alignment(wrap_text=True, vertical='top')
        if re.fullmatch(r'\s*\[[^\]]*\]\s*', text or ''):
            cell.fill = PH_FILL
            cell.font = self.f(b=True)

    def note(self, ws, row, text, ncols, fill=NOTE_FILL, label='KMS guidance:', height=None):
        ws.merge_cells(start_row=row, start_column=1, end_row=row, end_column=ncols)
        c = ws.cell(row, 1, f'{label} {text}')
        c.font = self.f(i=True, sz=10)
        c.fill = fill
        c.alignment = Alignment(wrap_text=True, vertical='top')
        est = max(1, int(len(text) / (sum((ws.column_dimensions[L(i)].width or 10) for i in range(1, ncols + 1)) * 1.1)) + 1)
        ws.row_dimensions[row].height = height or 15 * est + 4
        return row + 1

    def header(self, ws, row, cols, height=45, groups=None):
        if groups:  # [(label, span)]
            col = 1
            for label, span in groups:
                if span > 1:
                    ws.merge_cells(start_row=row, start_column=col, end_row=row, end_column=col + span - 1)
                for k in range(col, col + span):
                    cc = ws.cell(row, k)
                    cc.fill = GREEN_FILL
                    cc.border = BORDER
                c = ws.cell(row, col, label)
                c.font = self.f(b=True, color=GREEN_TEXT)
                c.alignment = Alignment(horizontal='center', vertical='center', wrap_text=True)
                col += span
            row += 1
        for i, h in enumerate(cols, 1):
            c = ws.cell(row, i, h)
            c.font = self.f(b=True, color=GREEN_TEXT)
            c.fill = GREEN_FILL
            c.border = BORDER
            c.alignment = Alignment(horizontal='center', vertical='center', wrap_text=True)
        ws.row_dimensions[row].height = height
        ws.freeze_panes = ws.cell(row + 1, 1)
        ws.print_title_rows = f'{row}:{row}'
        return row + 1

    def rows(self, ws, start, n, ncols, height=30, formulas=None, first_ref=None):
        for r in range(start, start + n):
            for cidx in range(1, ncols + 1):
                c = ws.cell(r, cidx)
                c.border = BORDER
                c.font = self.f()
                c.alignment = Alignment(wrap_text=True, vertical='top')
            if first_ref:
                ws.cell(r, 1, f'{first_ref}{r - start + 1:03d}')
            for col, tmpl in (formulas or {}).items():
                ws.cell(r, col, tmpl.format(r=r))
            ws.row_dimensions[r].height = height
        return start + n

    def data_row(self, ws, r, values, ncols, height=None, fill=None, bold=False):
        for cidx in range(1, ncols + 1):
            v = values[cidx - 1] if cidx - 1 < len(values) else None
            c = ws.cell(r, cidx)
            c.border = BORDER
            c.alignment = Alignment(wrap_text=True, vertical='top')
            c.font = self.f(b=bold)
            if v is not None:
                c.value = v
                if isinstance(v, str) and re.fullmatch(r'\s*\[[^\]]*\]\s*', v):
                    c.fill = PH_FILL
                    c.font = self.f(b=True)
            if fill:
                c.fill = fill
        if height:
            ws.row_dimensions[r].height = height
        return r + 1

    def option_row(self, ws, r, label, keep, ncols):
        ws.merge_cells(start_row=r, start_column=1, end_row=r, end_column=ncols)
        c = ws.cell(r, 1, f'OPTION – {label}   [Keep the rows below, down to the next OPTION row, only if {keep} Otherwise delete them.]')
        c.font = self.f(b=True, color='068A53')
        c.fill = OPT_FILL
        c.alignment = Alignment(wrap_text=True, vertical='center')
        for k in range(1, ncols + 1):
            ws.cell(r, k).border = BORDER
            ws.cell(r, k).fill = OPT_FILL
        ws.row_dimensions[r].height = 32
        return r + 1

    # ------------------------------------------------------------ lists / validation
    def add_list(self, key, values):
        if self.lists is None:
            self.lists = self.wb.create_sheet('Lists')
            self.lists.sheet_state = 'hidden'
        col = len(self.list_cols) + 1
        self.lists.cell(1, col, key)
        for i, v in enumerate(values, 2):
            self.lists.cell(i, col, v)
        self.list_cols[key] = f"Lists!${L(col)}$2:${L(col)}${len(values) + 1}"

    def validate(self, ws, key, col, r1, r2):
        dv = DataValidation(type='list', formula1=self.list_cols[key], allow_blank=True)
        dv.error = 'Please choose a value from the list.'
        dv.errorTitle = 'Invalid entry'
        dv.showErrorMessage = True
        ws.add_data_validation(dv)
        dv.add(f'{L(col)}{r1}:{L(col)}{r2}')

    def rag(self, ws, rng):
        ws.conditional_formatting.add(rng, FormulaRule(formula=[f'ISNUMBER(SEARCH("Red",{rng.split(":")[0]}))'], fill=PatternFill('solid', fgColor='F4B6B6')))
        ws.conditional_formatting.add(rng, FormulaRule(formula=[f'ISNUMBER(SEARCH("Amber",{rng.split(":")[0]}))'], fill=PatternFill('solid', fgColor='FFE699')))
        ws.conditional_formatting.add(rng, FormulaRule(formula=[f'ISNUMBER(SEARCH("Green",{rng.split(":")[0]}))'], fill=PatternFill('solid', fgColor='C6E0B4')))

    def guide(self, name, title, paras, width=120):
        """A 'How to use' sheet: list of (kind, text)."""
        ws = self.sheet(name, [width], title, landscape=False)
        r = 4
        for kind, text in paras:
            c = ws.cell(r, 1, text)
            c.alignment = Alignment(wrap_text=True, vertical='top')
            if kind == 'h':
                c.font = self.f(b=True, sz=13, color=GREEN_TEXT)
                ws.row_dimensions[r].height = 22
            elif kind == 'note':
                c.font = self.f(i=True)
                c.fill = NOTE_FILL
                ws.row_dimensions[r].height = 15 * (len(text) // 120 + 1) + 6
            elif kind == 'watch':
                c.value = 'Regulatory watch – not yet final: ' + text
                c.font = self.f(i=True)
                c.fill = WATCH_FILL
                ws.row_dimensions[r].height = 15 * (len(text) // 120 + 1) + 6
            else:
                c.font = self.f()
                ws.row_dimensions[r].height = 15 * (len(text) // 125 + 1) + 4
            r += 1
        return ws

    def save(self, path):
        # move the hidden Lists sheet to the end
        if self.lists is not None:
            self.wb.move_sheet(self.lists, offset=len(self.wb.sheetnames) - 1 - self.wb.sheetnames.index('Lists'))
        self.wb.active = 0
        self.wb.save(path)


STANDARD_GUIDE = [
    ('h', 'How to use this register'),
    ('p', 'This register is part of the KMS compliance framework. The policies that refer to it expect it to be kept up to date from your first day of trading: the FCA judges a firm on the records that show its policies working in practice, not on the policies alone. A policy without its supporting records is unlikely to withstand FCA scrutiny.'),
    ('p', 'Yellow cells containing text in [square brackets] are placeholders – replace them with your own details. Green header cells are column headings; do not delete a column unless the guidance for that column says you may.'),
    ('p', 'Green “OPTION” rows mark rows that only apply to particular regulated activities. Keep the rows under an OPTION label if your firm carries on that activity; otherwise delete the OPTION row and the rows beneath it, down to the next OPTION row. Each option stands alone.'),
    ('p', 'Drop-down lists are provided for consistency. The underlying lists are on a hidden sheet called “Lists” – unhide it (right-click any sheet tab, Unhide) if you need to change them.'),
    ('p', 'Keep this register securely, restrict access to the people who need it, and keep it for the retention period set out in the relevant policy and your Data Retention Schedule.'),
]
