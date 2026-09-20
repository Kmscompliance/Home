import { SiteHeader } from "@/components/SiteHeader";
import { QuoteWizard } from "@/components/quote/QuoteWizard";
import { AssistantProvider } from "@/components/assistant/AssistantProvider";
import { AssistantWidget } from "@/components/assistant/AssistantWidget";

export default function QuotePage() {
  return (
    <AssistantProvider>
      <div className="flex min-h-full flex-col">
        <SiteHeader />

        <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-16">
          <QuoteWizard />
        </main>

        <AssistantWidget />
      </div>
    </AssistantProvider>
  );
}
