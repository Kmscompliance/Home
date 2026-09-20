import type { BreakdownFactor } from "@/lib/pricing/types";
import type { TradesAnswers } from "@/lib/pricing/trades";
import type { ConsultantsAnswers } from "@/lib/pricing/consultants";

export type Vertical = "trades" | "consultants";

export type QuoteProviderRequest =
  | { vertical: "trades"; answers: TradesAnswers }
  | { vertical: "consultants"; answers: ConsultantsAnswers };

export type QuotedResult = {
  status: "quoted";
  insurerName: string;
  productName: string;
  quoteReference: string;
  netPremiumGBP: number;
  insurancePremiumTaxGBP: number;
  grossAnnualGBP: number;
  grossMonthlyGBP: number;
  /** ISO date string — real quotes expire; this one does too, cosmetically. */
  validUntil: string;
  breakdown: BreakdownFactor[];
};

export type ReferredResult = {
  status: "referred";
  insurerName: string;
  /** Plain-English reason a human underwriter needs to look at this one. */
  reason: string;
};

export type DeclinedResult = {
  status: "declined";
  insurerName: string;
  /** Plain-English reason this risk is outside the insurer's appetite. */
  reason: string;
};

export type QuoteProviderResult = QuotedResult | ReferredResult | DeclinedResult;

/**
 * The seam a real insurer/broker-platform integration (e.g. Acturis) would
 * occupy. Every provider — our own pricing engine, the mock external
 * insurer, and eventually a real one — implements exactly this contract.
 * The rest of the app only ever talks to this interface, never to a
 * specific provider's implementation details, which is what makes swapping
 * one out for another a config change rather than a rewrite.
 */
export interface QuoteProvider {
  id: string;
  displayName: string;
  getQuote(request: QuoteProviderRequest): Promise<QuoteProviderResult>;
}
