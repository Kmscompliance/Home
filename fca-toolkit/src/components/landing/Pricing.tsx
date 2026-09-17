import Link from "next/link";
import { bundlePriceGBP, documents } from "@/lib/documents";

export function Pricing() {
  const cheapest = Math.min(...documents.map((d) => d.priceGBP));

  return (
    <section id="pricing" className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
      <div className="max-w-2xl">
        <h2 className="text-2xl font-bold text-kms-navy sm:text-3xl">Simple, one-off pricing</h2>
        <p className="mt-3 text-base leading-relaxed text-kms-text">
          No subscriptions and no accounts. Pay once for the document you
          need, download it straight away.
        </p>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <div className="rounded-xl border border-kms-border bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-kms-navy">Single document</p>
          <p className="mt-2 text-3xl font-bold text-kms-navy">
            from £{cheapest}
          </p>
          <p className="mt-1 text-sm text-kms-text/70">Priced individually per document, £{cheapest}–£{Math.max(...documents.map((d) => d.priceGBP))}</p>
          <ul className="mt-5 space-y-2 text-sm text-kms-text">
            <li>✓ Editable Word (.docx) download</li>
            <li>✓ Clearly highlighted placeholders with guidance notes</li>
            <li>✓ Secure download link, delivered by email and on-screen</li>
          </ul>
          <Link
            href="/documents"
            className="mt-6 inline-block rounded-md bg-kms-green px-5 py-2.5 text-sm font-semibold text-white hover:bg-kms-green-light"
          >
            Browse documents
          </Link>
        </div>

        <div className="rounded-xl border border-kms-navy bg-kms-navy p-6 text-white shadow-sm">
          <p className="text-sm font-semibold text-white/80">Full toolkit bundle</p>
          <p className="mt-2 text-3xl font-bold">£{bundlePriceGBP}</p>
          <p className="mt-1 text-sm text-white/70">All 13 documents, one purchase</p>
          <ul className="mt-5 space-y-2 text-sm text-white/90">
            <li>✓ Everything in the single document plan</li>
            <li>✓ Covers the full FCA application document set</li>
            <li>✓ Better value than buying individually</li>
          </ul>
          <span className="mt-6 inline-block rounded-md bg-white/15 px-5 py-2.5 text-sm font-semibold text-white/70">
            Coming soon
          </span>
        </div>
      </div>
    </section>
  );
}
