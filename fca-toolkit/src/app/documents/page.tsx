import type { Metadata } from "next";
import { documents } from "@/lib/documents";
import { DocumentCard } from "@/components/DocumentCard";

export const metadata: Metadata = {
  title: "Documents | KMS Compliance FCA Authorisation Toolkit",
};

export default function DocumentsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
      <h1 className="text-3xl font-bold text-kms-navy">Document catalogue</h1>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-kms-text">
        {documents.length} templates covering the full FCA authorisation application.
        Buy individually, edit in Word, and tailor with the help of a
        qualified compliance professional before you rely on any of them.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {documents.map((doc) => (
          <DocumentCard key={doc.slug} doc={doc} />
        ))}
      </div>
    </div>
  );
}
