import Link from "next/link";
import type { DocumentDefinition } from "@/lib/documents";

const statusBadge: Record<DocumentDefinition["status"], string | null> = {
  available: null,
  preview: "Preview available",
  "coming-soon": "Coming soon",
};

export function DocumentCard({ doc }: { doc: DocumentDefinition }) {
  const badge = statusBadge[doc.status];

  return (
    <div className="flex flex-col rounded-xl border border-kms-border bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-semibold text-kms-navy">{doc.title}</h3>
        {badge && (
          <span className="shrink-0 rounded-full bg-kms-navy/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-kms-navy">
            {badge}
          </span>
        )}
      </div>
      <p className="mt-2 flex-1 text-xs leading-relaxed text-kms-text/80">
        {doc.shortDescription}
      </p>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-sm font-bold text-kms-green">£{doc.priceGBP}</span>
        {doc.status === "coming-soon" ? (
          <span className="text-xs font-medium text-kms-text/40">Not yet available</span>
        ) : (
          <Link
            href={`/documents/${doc.slug}`}
            className="text-xs font-semibold text-kms-navy hover:underline"
          >
            {doc.status === "available" ? "View document →" : "Preview →"}
          </Link>
        )}
      </div>
    </div>
  );
}
