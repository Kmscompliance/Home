"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { LeadCaptureCard } from "./LeadCaptureCard";
import type { PremiumResult } from "@/lib/pricing/types";

type ResultScreenProps = {
  vertical: "trades" | "consultants";
  result: PremiumResult;
  onRestart: () => void;
};

export function ResultScreen({ vertical, result, onRestart }: ResultScreenProps) {
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
            vertical,
            annualGBP: result.annualGBP,
            monthlyGBP: result.monthlyGBP,
            breakdown: result.breakdown,
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
    <div>
      <Card>
        <p className="text-sm font-medium text-brand-green-700">Your illustrative quote</p>
        <div className="mt-2 flex items-baseline gap-3">
          <span className="text-4xl font-semibold text-brand-navy-900">
            £{result.monthlyGBP}/mo
          </span>
          <span className="text-brand-neutral-500">or £{result.annualGBP}/year</span>
        </div>
        <p className="mt-2 text-xs text-brand-neutral-500">
          Illustrative price only — not a real quote, and no payment is taken.
        </p>

        <div className="mt-6 border-t border-brand-neutral-200 pt-6">
          <p className="text-sm font-medium text-brand-neutral-700">Why this price?</p>
          <p className="mt-2 text-brand-navy-900">
            {loadingExplanation
              ? "Working that out…"
              : explanation || "This reflects the answers you gave us."}
          </p>
        </div>

        <div className="mt-6 border-t border-brand-neutral-200 pt-6">
          <p className="text-sm font-medium text-brand-neutral-700">What affected your price</p>
          <ul className="mt-3 flex flex-col gap-3">
            {result.breakdown.map((factor) => (
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

      <LeadCaptureCard vertical={vertical} annualGBP={result.annualGBP} />

      <div className="mt-6 flex justify-center">
        <Button variant="ghost" onClick={onRestart}>
          Start another quote
        </Button>
      </div>
    </div>
  );
}
