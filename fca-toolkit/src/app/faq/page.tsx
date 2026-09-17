import type { Metadata } from "next";
import { faqs } from "@/lib/faqs";

export const metadata: Metadata = {
  title: "FAQ | KMS Compliance FCA Authorisation Toolkit",
};

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
      <h1 className="text-3xl font-bold text-kms-navy">Frequently asked questions</h1>
      <p className="mt-3 text-base text-kms-text">
        Everything you need to know about how the FCA Authorisation Toolkit works.
      </p>

      <div className="mt-10 space-y-4">
        {faqs.map((faq) => (
          <details
            key={faq.question}
            className="rounded-lg border border-kms-border bg-white p-5 open:shadow-sm"
          >
            <summary className="cursor-pointer list-none text-base font-semibold text-kms-navy">
              {faq.question}
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-kms-text/80">{faq.answer}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
