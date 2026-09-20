import { SiteHeader } from "@/components/SiteHeader";
import { Card } from "@/components/ui/Card";

export default function AboutPage() {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-16">
        <h1 className="text-2xl font-semibold text-brand-navy-900">About this demo</h1>
        <p className="mt-2 text-brand-neutral-500">
          A quick, honest breakdown of what&rsquo;s real here and what&rsquo;s simulated.
        </p>

        <Card className="mt-8">
          <p className="text-sm font-medium text-brand-green-700">What&rsquo;s real</p>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-brand-navy-900">
            <li>
              Claude reads what you type — your trade or line of work — and works out which
              category it fits, in plain conversation, not a dropdown menu in disguise.
            </li>
            <li>
              It decides whether an optional question is worth asking you at all, based on what
              you&rsquo;ve already said.
            </li>
            <li>
              It writes the plain-English explanation of why your price came out the way it did.
            </li>
            <li>
              The chat assistant can carry an entire quote conversation end to end, and it always
              lands on the same price a click-through of the form would.
            </li>
          </ul>
        </Card>

        <Card className="mt-6">
          <p className="text-sm font-medium text-brand-neutral-700">What&rsquo;s simulated</p>
          <p className="mt-3 text-brand-navy-900">
            The price itself. There is no real insurer, no real underwriting, and no real policy
            behind any number this app shows you — the pricing logic is a set of illustrative
            rules we wrote for this demo. No payment is ever taken, and nothing shown here is a
            real, bindable insurance quote.
          </p>
        </Card>

        <p className="mt-6 text-xs text-brand-neutral-500">
          This notice is also shown, in short form, on every page of the app.
        </p>
      </main>
    </div>
  );
}
