import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function Home() {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-4 py-24 text-center">
        <Card className="max-w-2xl">
          <h1 className="text-3xl font-semibold text-brand-navy-900 sm:text-4xl">
            Business insurance in minutes, without the jargon.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-brand-neutral-700">
            A handful of plain-English questions, one clear price. No forms
            full of small print, no insurance-speak.
          </p>
          <div className="mt-8 flex justify-center">
            <Button href="/quote" size="lg">
              Get a quote
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
}
