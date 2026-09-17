import Link from "next/link";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-kms-border bg-kms-navy text-white">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">
          <div>
            <span className="inline-flex items-center gap-2.5">
              <Logo variant="icon" />
              <span className="font-semibold tracking-[0.18em] text-white text-sm sm:text-base">
                KMS COMPLIANCE
              </span>
            </span>
            <p className="mt-3 max-w-sm text-sm text-white/70">
              Plain-English FCA authorisation document templates for sole traders
              and small founder-led financial services firms.
            </p>
          </div>
          <div className="flex flex-col gap-2 text-sm">
            <Link href="/documents" className="text-white/80 hover:text-white">
              Documents
            </Link>
            <Link href="/faq" className="text-white/80 hover:text-white">
              FAQ
            </Link>
            <Link href="/legal/disclaimer" className="text-white/80 hover:text-white">
              Disclaimer
            </Link>
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-6 text-xs leading-relaxed text-white/60">
          <p>
            These templates are general starting points based on FCA authorisation
            good practice. They are <strong className="text-white/80">not legal or regulatory advice</strong>{" "}
            and must be tailored to your firm and reviewed by a qualified compliance
            professional before submission or use. KMS Compliance Ltd accepts no
            liability for use of these templates without that review. Read the full{" "}
            <Link href="/legal/disclaimer" className="underline hover:text-white">
              disclaimer
            </Link>
            .
          </p>
          <p className="mt-3">© {new Date().getFullYear()} KMS Compliance Ltd. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
