import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDocumentBySlug } from "@/lib/documents";
import { getDocumentBody } from "@/lib/document-content";
import { RichBlock } from "@/components/document/RichText";
import { DocumentDisclaimer } from "@/components/document/DocumentDisclaimer";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const doc = getDocumentBySlug(slug);
  return { title: doc ? `${doc.title} | KMS Compliance` : "Document | KMS Compliance" };
}

export default async function DocumentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const doc = getDocumentBySlug(slug);
  const body = getDocumentBody(slug);

  if (!doc || !body) {
    notFound();
  }

  const [firstSection, ...restSections] = body.sections;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <Link href="/documents" className="text-xs font-semibold text-kms-navy hover:underline">
        ← Back to document catalogue
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-kms-navy sm:text-3xl">{doc.title}</h1>
          <p className="mt-2 max-w-xl text-sm text-kms-text/80 sm:text-base">{body.summary}</p>
        </div>
        <div className="rounded-xl border border-kms-border bg-white p-4 text-center shadow-sm">
          <p className="text-2xl font-bold text-kms-green">£{doc.priceGBP}</p>
          <button
            type="button"
            disabled
            className="mt-2 w-full cursor-not-allowed rounded-md bg-kms-navy/40 px-4 py-2 text-xs font-semibold text-white"
          >
            Checkout coming soon
          </button>
        </div>
      </div>

      <div className="mt-6">
        <DocumentDisclaimer />
      </div>

      <div className="mt-8 rounded-xl border border-kms-border bg-kms-surface p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-kms-text/60">
          What&apos;s in this document
        </p>
        <ol className="mt-3 space-y-1.5 text-sm text-kms-navy">
          {body.sections.map((section) => (
            <li key={section.id}>{section.heading}</li>
          ))}
        </ol>
      </div>

      <div className="mt-10 space-y-4">
        <h2 className="text-lg font-semibold text-kms-navy">{firstSection.heading}</h2>
        <div className="space-y-4">
          {firstSection.blocks.map((block, i) => (
            <RichBlock key={i} block={block} />
          ))}
        </div>
      </div>

      {restSections.length > 0 && (
        <div className="relative mt-8 overflow-hidden rounded-xl border border-kms-border">
          <div aria-hidden className="space-y-6 p-6 blur-sm select-none">
            {restSections.map((section) => (
              <div key={section.id} className="space-y-2">
                <h3 className="text-base font-semibold text-kms-navy">{section.heading}</h3>
                {section.blocks.slice(0, 1).map((block, i) => (
                  <RichBlock key={i} block={block} />
                ))}
              </div>
            ))}
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-b from-white/40 via-white/85 to-white p-6 text-center">
            <span className="text-2xl">🔒</span>
            <p className="text-sm font-semibold text-kms-navy">
              {restSections.length} more section{restSections.length === 1 ? "" : "s"} in the full document
            </p>
            <p className="max-w-sm text-xs text-kms-text/70">
              Unlocks after purchase, along with the editable Word (.docx)
              download.
            </p>
          </div>
        </div>
      )}

      <div className="mt-10">
        <DocumentDisclaimer />
      </div>
    </div>
  );
}
