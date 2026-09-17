import { documents } from "@/lib/documents";
import { DocumentCard } from "@/components/DocumentCard";

export function Catalogue() {
  return (
    <section id="documents" className="bg-kms-surface">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-bold text-kms-navy sm:text-3xl">
            The full FCA authorisation document set
          </h2>
          <p className="mt-3 text-base leading-relaxed text-kms-text">
            Buy exactly what you need, one document at a time. Every template
            uses the same clear placeholder highlighting, so you always know
            what to fill in and why.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {documents.map((doc) => (
            <DocumentCard key={doc.slug} doc={doc} />
          ))}
        </div>
      </div>
    </section>
  );
}
