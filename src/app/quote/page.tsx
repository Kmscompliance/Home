import { SiteHeader } from "@/components/SiteHeader";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";

export default function QuotePage() {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-16">
        <ProgressBar step={0} totalSteps={8} label="Your quote" />
        <Card className="mt-8 text-center">
          <p className="text-brand-neutral-700">
            Quote flow coming in Stage 1.
          </p>
        </Card>
      </main>
    </div>
  );
}
