import Link from "next/link";
import { documents } from "@/lib/documents";

export function Hero() {
  return (
    <section className="bg-kms-surface">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-24">
        <div>
          <span className="inline-flex items-center rounded-full border border-kms-green/30 bg-kms-green/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-kms-green">
            Built by ex-FCA compliance specialists
          </span>
          <h1 className="mt-5 text-3xl font-bold leading-tight text-kms-navy sm:text-4xl lg:text-5xl">
            FCA authorisation document templates, without the £000s consultancy bill
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-kms-text sm:text-lg">
            {documents.length} editable, plain-English templates covering everything a
            sole trader or small founder-led firm needs to prepare a full FCA
            authorisation application — buy only the documents you need, edit
            them yourself, submit with confidence.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/documents"
              className="rounded-md bg-kms-green px-6 py-3 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-kms-green-light"
            >
              Browse the document catalogue
            </Link>
            <Link
              href="/faq"
              className="rounded-md border border-kms-navy/20 px-6 py-3 text-center text-sm font-semibold text-kms-navy transition hover:bg-white"
            >
              How it works
            </Link>
          </div>
          <p className="mt-5 text-xs text-kms-text/70">
            No accounts, no subscriptions. Pay once per document, download
            straight away.
          </p>
        </div>

        <div className="rounded-xl border border-kms-border bg-white p-6 shadow-sm sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-kms-text/60">
            Preview: Risk Management Framework
          </p>
          <div className="mt-4 space-y-3 text-sm text-kms-text">
            <p className="font-semibold text-kms-navy">1. Purpose and Scope</p>
            <p className="text-kms-text/80">
              This Risk Management Framework sets out how{" "}
              <span className="rounded bg-kms-highlight px-1.5 py-0.5 font-medium text-kms-navy ring-1 ring-inset ring-kms-highlight-border">
                [FIRM NAME]
              </span>{" "}
              identifies, assesses, manages and reports on the risks it faces
              in carrying out{" "}
              <span className="rounded bg-kms-highlight px-1.5 py-0.5 font-medium text-kms-navy ring-1 ring-inset ring-kms-highlight-border">
                [INSERT REGULATED ACTIVITIES]
              </span>
              .
            </p>
            <div className="rounded-md border border-dashed border-kms-border bg-kms-surface p-4 text-kms-text/50">
              <p className="text-xs">🔒 Full document unlocks after purchase — Sections 2–9, appendices and the editable .docx download.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
