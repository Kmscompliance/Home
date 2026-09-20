import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ResetDemoButton } from "@/components/ResetDemoButton";

export function SiteHeader() {
  return (
    <header className="border-b border-brand-neutral-200 bg-white">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-4">
        <Link href="/" className="text-lg font-semibold text-brand-navy-900">
          BeesKnee&rsquo;s <span className="text-brand-green-600">Insurance</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/about"
            className="text-sm text-brand-neutral-500 hover:text-brand-navy-900"
          >
            About this demo
          </Link>
          <ResetDemoButton />
          <Button href="/quote" size="md">
            Get a quote
          </Button>
        </div>
      </div>
    </header>
  );
}
