import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function SiteHeader() {
  return (
    <header className="border-b border-brand-neutral-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-semibold text-brand-navy-900">
          BeesKnee&rsquo;s <span className="text-brand-green-600">Insurance</span>
        </Link>
        <Button href="/quote" size="md">
          Get a quote
        </Button>
      </div>
    </header>
  );
}
