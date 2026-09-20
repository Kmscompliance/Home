import "server-only";
import { randomUUID } from "crypto";
import { calculateTradesPremium } from "@/lib/pricing/trades";
import { calculateConsultantsPremium } from "@/lib/pricing/consultants";
import { applyIPT } from "./ipt";
import type { QuoteProvider, QuoteProviderRequest, QuoteProviderResult } from "./types";

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

/**
 * Wraps BeesKnee's own deterministic pricing engine (src/lib/pricing/) in
 * the same QuoteProvider shape every other provider uses — including a
 * mock insurer-quote reference and IPT, so the "quoted" response looks the
 * same regardless of which provider produced it. Always returns "quoted":
 * this provider has no concept of underwriting appetite, unlike the mock
 * external insurer.
 */
export const localProvider: QuoteProvider = {
  id: "local",
  displayName: "BeesKnee's in-house pricing engine",

  async getQuote(request: QuoteProviderRequest): Promise<QuoteProviderResult> {
    const premium =
      request.vertical === "trades"
        ? calculateTradesPremium(request.answers)
        : calculateConsultantsPremium(request.answers);

    const annual = applyIPT(premium.annualGBP);
    const monthly = applyIPT(premium.monthlyGBP);

    return {
      status: "quoted",
      insurerName: "BeesKnee's Insurance (in-house pricing engine)",
      productName: request.vertical === "trades" ? "Trades Public Liability" : "Professional Indemnity",
      quoteReference: `BK-${randomUUID().slice(0, 8).toUpperCase()}`,
      netPremiumGBP: annual.netPremiumGBP,
      insurancePremiumTaxGBP: annual.insurancePremiumTaxGBP,
      grossAnnualGBP: annual.grossPremiumGBP,
      grossMonthlyGBP: monthly.grossPremiumGBP,
      validUntil: new Date(Date.now() + THIRTY_DAYS_MS).toISOString(),
      breakdown: premium.breakdown,
    };
  },
};
