import Link from "next/link";
import { faqs } from "@/lib/faqs";

export function FaqPreview() {
  const preview = faqs.slice(0, 4);

  return (
    <section className="bg-kms-surface">
      <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-16">
        <h2 className="text-2xl font-bold text-kms-navy sm:text-3xl">Frequently asked questions</h2>
        <div className="mt-8 space-y-4">
          {preview.map((faq) => (
            <details
              key={faq.question}
              className="group rounded-lg border border-kms-border bg-white p-4 open:shadow-sm"
            >
              <summary className="cursor-pointer list-none text-sm font-semibold text-kms-navy">
                {faq.question}
              </summary>
              <p className="mt-2 text-sm leading-relaxed text-kms-text/80">{faq.answer}</p>
            </details>
          ))}
        </div>
        <Link
          href="/faq"
          className="mt-6 inline-block text-sm font-semibold text-kms-navy hover:underline"
        >
          See the full FAQ →
        </Link>
      </div>
    </section>
  );
}
