import { SiteHeader } from "@/components/SiteHeader";
import { QuoteWizard } from "@/components/quote/QuoteWizard";

export default function QuotePage() {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-16">
        <QuoteWizard />
      </main>
    </div>
  );
}
