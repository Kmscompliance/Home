import Link from "next/link";

export function DemoDisclaimer() {
  return (
    <div className="border-t border-brand-neutral-200 bg-brand-neutral-50 px-4 py-2 text-center text-xs text-brand-neutral-500">
      <p>Working prototype · Illustrative prices only · No real insurance or payments</p>
      <p className="mt-1">
        <Link href="/privacy" className="underline decoration-dotted hover:text-brand-navy-900">
          Privacy Policy
        </Link>
        {" · "}
        <Link href="/terms" className="underline decoration-dotted hover:text-brand-navy-900">
          Terms of Use
        </Link>
        {" (both draft)"}
      </p>
    </div>
  );
}
