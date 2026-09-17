import {
  AlignmentType,
  BorderStyle,
  Document,
  Footer,
  Header,
  HeadingLevel,
  Packer,
  Paragraph,
  ShadingType,
  TextRun,
} from "docx";
import type { Block, DocumentBody, TextPart } from "@/lib/document-content/types";
import type { DocumentDefinition } from "@/lib/documents";

const NAVY = "112F4F";
const TEXT = "233F5C";
const MUTED = "6B7280";
const HIGHLIGHT_FILL = "FFF3C4";
const HIGHLIGHT_BORDER = "E8C547";

const DISCLAIMER =
  "This is a general template, not legal or regulatory advice. It must be tailored to your firm and reviewed by a qualified compliance professional before you submit or rely on it. KMS Compliance Ltd accepts no liability for use of this document without that review.";

function textRuns(parts: TextPart[]): TextRun[] {
  return parts.flatMap((part) => {
    if (typeof part === "string") {
      return [new TextRun({ text: part, color: TEXT })];
    }
    return [
      new TextRun({
        text: `[${part.placeholder}]`,
        bold: true,
        color: NAVY,
        shading: { type: ShadingType.SOLID, fill: HIGHLIGHT_FILL },
        border: { style: BorderStyle.SINGLE, color: HIGHLIGHT_BORDER, size: 2, space: 1 },
      }),
      new TextRun({ text: " " }),
      new TextRun({ text: `(${part.note})`, italics: true, color: MUTED, size: 20 }),
    ];
  });
}

function renderBlock(block: Block): Paragraph[] {
  if (block.type === "p") {
    return [new Paragraph({ children: textRuns(block.parts), spacing: { after: 200 } })];
  }
  return block.items.map(
    (item) =>
      new Paragraph({
        children: textRuns(item),
        bullet: block.type === "ul" ? { level: 0 } : undefined,
        numbering: block.type === "ol" ? { reference: "doc-numbering", level: 0 } : undefined,
        spacing: { after: 100 },
      })
  );
}

function disclaimerParagraph(): Paragraph {
  return new Paragraph({
    border: {
      top: { style: BorderStyle.SINGLE, color: "DBE3EA", size: 4, space: 4 },
      bottom: { style: BorderStyle.SINGLE, color: "DBE3EA", size: 4, space: 4 },
      left: { style: BorderStyle.SINGLE, color: "DBE3EA", size: 4, space: 4 },
      right: { style: BorderStyle.SINGLE, color: "DBE3EA", size: 4, space: 4 },
    },
    shading: { type: ShadingType.SOLID, fill: "F4F7FA" },
    spacing: { before: 200, after: 200 },
    children: [new TextRun({ text: DISCLAIMER, italics: true, size: 18, color: MUTED })],
  });
}

export async function generateDocumentDocx(
  doc: DocumentDefinition,
  body: DocumentBody
): Promise<Buffer> {
  const children: Paragraph[] = [
    new Paragraph({
      heading: HeadingLevel.TITLE,
      children: [new TextRun({ text: doc.title, color: NAVY, bold: true })],
    }),
    new Paragraph({
      spacing: { after: 200 },
      children: [new TextRun({ text: body.summary, italics: true, color: TEXT })],
    }),
    disclaimerParagraph(),
  ];

  for (const section of body.sections) {
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 300, after: 150 },
        children: [new TextRun({ text: section.heading, color: NAVY, bold: true })],
      })
    );
    for (const block of section.blocks) {
      children.push(...renderBlock(block));
    }
  }

  children.push(disclaimerParagraph());

  const document = new Document({
    numbering: {
      config: [
        {
          reference: "doc-numbering",
          levels: [{ level: 0, format: "decimal", text: "%1.", alignment: AlignmentType.START }],
        },
      ],
    },
    sections: [
      {
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({ text: "KMS COMPLIANCE", bold: true, color: NAVY, size: 16 }),
                ],
              }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: "General template only — not legal or regulatory advice. Tailor and have it reviewed before use. © KMS Compliance Ltd.",
                    size: 14,
                    color: MUTED,
                  }),
                ],
              }),
            ],
          }),
        },
        children,
      },
    ],
    styles: {
      default: {
        document: { run: { color: TEXT, font: "Calibri", size: 22 } },
      },
    },
  });

  return Packer.toBuffer(document);
}
