import type { ReactNode } from "react";
import { SiteHeader } from "@/components/SiteHeader";

const LAST_UPDATED = "20 September 2026";

export function LegalPageShell({
  title,
  docLabel,
  children,
}: {
  title: string;
  docLabel: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-16">
        <h1 className="text-2xl font-semibold text-brand-navy-900">{title}</h1>
        <p className="mt-1 text-xs text-brand-neutral-500">Last updated: {LAST_UPDATED}</p>

        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <p className="text-sm font-medium text-amber-800">This is a draft, not a final legal document.</p>
          <p className="mt-1 text-sm text-amber-700">
            It was written to describe what this demo actually does, as a starting point — it hasn&rsquo;t
            been reviewed by a qualified compliance professional or lawyer, and the bracketed placeholders
            below (company name, address, contact details) haven&rsquo;t been filled in. Don&rsquo;t treat this
            as your real {docLabel} until that review has happened.
          </p>
        </div>

        <div className="prose-legal mt-8 flex flex-col gap-6 text-sm text-brand-navy-900">{children}</div>
      </main>
    </div>
  );
}
