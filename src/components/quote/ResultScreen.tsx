"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { LeadCaptureCard } from "./LeadCaptureCard";
import type { QuoteProviderResult } from "@/lib/quoteProvider/types";

type ResultScreenProps = {
  vertical: "trades" | "consultants";
  quote: QuoteProviderResult;
  onRestart: () => void;
};

function formatValidUntil(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  } catch {
    return iso;
  }
}

export function ResultScreen({ vertical, quote, onRestart }: ResultScreenProps) {
  return (
    <div>
      {quote.status === "quoted" ? <QuotedCard quote={quote} /> : null}
      {quote.status === "referred" ? <ReferredCard quote={quote} /> : null}
      {quote.status === "declined" ? <DeclinedCard quote={quote} /> : null}

      <LeadCaptureCard
        vertical={vertical}
        annualGBP={quote.status === "quoted" ? quote.grossAnnualGBP : undefined}
      />

      <div className="mt-6 flex justify-center">
        <Button variant="ghost" onClick={onRestart}>
          Start another quote
        </Button>
      </div>
    </div>
  );
}

function QuotedCard({ quote }: { quote: Extract<QuoteProviderResult, { status: "quoted" }> }) {
  const [explanation, setExplanation] = useState("");
  const [loadingExplanation, setLoadingExplanation] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchExplanation() {
      try {
        const res = await fetch("/api/explain", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            annualGBP: quote.grossAnnualGBP,
            monthlyGBP: quote.grossMonthlyGBP,
            breakdown: quote.breakdown,
          }),
        });
        const data = (await res.json()) as { explanation?: string };
        if (!cancelled) setExplanation(data.explanation ?? "");
      } catch {
        if (!cancelled) setExplanation("");
      } finally {
        if (!cancelled) setLoadingExplanation(false);
      }
    }

    fetchExplanation();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-brand-green-700">Your illustrative quote</p>
          <p className="text-xs text-brand-neutral-500">
            {quote.insurerName} · {quote.productName}
          </p>
        </div>
        <p className="text-right text-xs text-brand-neutral-500">
          Ref {quote.quoteReference}
          <br />
          Valid until {formatValidUntil(quote.validUntil)}
        </p>
      </div>

      <div className="mt-4 flex items-baseline gap-3">
        <span className="text-4xl font-semibold text-brand-navy-900">£{quote.grossMonthlyGBP}/mo</span>
        <span className="text-brand-neutral-500">or £{quote.grossAnnualGBP}/year</span>
      </div>
      <p className="mt-2 text-xs text-brand-neutral-500">
        Includes £{quote.insurancePremiumTaxGBP} of illustrative Insurance Premium Tax on top of a £
        {quote.netPremiumGBP} net premium (a simplified, non-tax-advice figure). Illustrative price
        only — not a real quote, and no payment is taken.
      </p>

      <div className="mt-6 border-t border-brand-neutral-200 pt-6">
        <p className="text-sm font-medium text-brand-neutral-700">Why this price?</p>
        <p className="mt-2 text-brand-navy-900">
          {loadingExplanation ? "Working that out…" : explanation || "This reflects the answers you gave us."}
        </p>
      </div>

      <div className="mt-6 border-t border-brand-neutral-200 pt-6">
        <p className="text-sm font-medium text-brand-neutral-700">What affected your price</p>
        <ul className="mt-3 flex flex-col gap-3">
          {quote.breakdown.map((factor) => (
            <li key={factor.id} className="flex items-start gap-3">
              <span
                className={`mt-1.5 h-2 w-2 flex-shrink-0 rounded-full ${
                  factor.effect === "increase"
                    ? "bg-amber-500"
                    : factor.effect === "decrease"
                      ? "bg-brand-green-600"
                      : "bg-brand-neutral-300"
                }`}
              />
              <div>
                <p className="text-sm font-medium text-brand-navy-900">{factor.label}</p>
                <p className="text-sm text-brand-neutral-500">{factor.detail}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}

function ReferredCard({ quote }: { quote: Extract<QuoteProviderResult, { status: "referred" }> }) {
  return (
    <Card>
      <p className="text-sm font-medium text-amber-600">Needs a closer look</p>
      <p className="mt-1 text-xs text-brand-neutral-500">{quote.insurerName}</p>
      <p className="mt-4 text-brand-navy-900">
        We can&rsquo;t give you an instant price on this one — {quote.reason.toLowerCase()}
      </p>
      <p className="mt-2 text-sm text-brand-neutral-500">
        In a real broker set-up, this is exactly the kind of case that would go to a human
        underwriter rather than being declined outright. Leave your details below and we can follow
        up once it&rsquo;s been reviewed.
      </p>
    </Card>
  );
}

function DeclinedCard({ quote }: { quote: Extract<QuoteProviderResult, { status: "declined" }> }) {
  return (
    <Card>
      <p className="text-sm font-medium text-brand-neutral-700">No automated quote available</p>
      <p className="mt-1 text-xs text-brand-neutral-500">{quote.insurerName}</p>
      <p className="mt-4 text-brand-navy-900">
        This insurer isn&rsquo;t able to offer cover here — {quote.reason.toLowerCase()}
      </p>
      <p className="mt-2 text-sm text-brand-neutral-500">
        That doesn&rsquo;t mean no insurer would take this on — different insurers have different
        appetites. Leave your details below if you&rsquo;d like us to check with others.
      </p>
    </Card>
  );
}
