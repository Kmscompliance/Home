import type { Metadata } from "next";
import Link from "next/link";
import { documents } from "@/lib/documents";

export const metadata: Metadata = {
  title: "Documents | KMS Compliance FCA Authorisation Toolkit",
};

export default function DocumentsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
      <h1 className="text-3xl font-bold text-kms-navy">Document catalogue</h1>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-kms-text">
        Thirteen templates covering the full FCA authorisation application.
        Buy individually, edit in Word, and tailor with the help of a
        qualified compliance professional before you rely on any of them.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {documents.map((doc) => (
          <div
            key={doc.slug}
            className="flex flex-col rounded-xl border border-kms-border bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-2">
              <h2 className="text-sm font-semibold text-kms-navy">{doc.title}</h2>
              {doc.status === "coming-soon" && (
                <span className="shrink-0 rounded-full bg-kms-navy/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-kms-navy">
                  Coming soon
                </span>
              )}
            </div>
            <p className="mt-2 flex-1 text-xs leading-relaxed text-kms-text/80">
              {doc.shortDescription}
            </p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm font-bold text-kms-green">£{doc.priceGBP}</span>
              {doc.status === "available" ? (
                <Link
                  href={`/documents/${doc.slug}`}
                  className="text-xs font-semibold text-kms-navy hover:underline"
                >
                  View document →
                </Link>
              ) : (
                <span className="text-xs font-medium text-kms-text/40">Not yet available</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
