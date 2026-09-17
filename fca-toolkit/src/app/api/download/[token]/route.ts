import { NextResponse } from "next/server";
import { verifyDownloadToken } from "@/lib/download-token";
import { getDocumentBySlug } from "@/lib/documents";
import { getDocumentBody } from "@/lib/document-content";
import { generateDocumentDocx } from "@/lib/docx/generate";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const result = verifyDownloadToken(token);

  if (!result.valid) {
    const message =
      result.reason === "expired"
        ? "This download link has expired."
        : "This download link is invalid.";
    return NextResponse.json({ error: message }, { status: 410 });
  }

  const { slug } = result.payload;
  const doc = getDocumentBySlug(slug);
  const body = getDocumentBody(slug);

  if (!doc || !body) {
    return NextResponse.json({ error: "Document not found." }, { status: 404 });
  }

  const buffer = await generateDocumentDocx(doc, body);
  const filename = `KMS Compliance - ${doc.title}.docx`;

  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
