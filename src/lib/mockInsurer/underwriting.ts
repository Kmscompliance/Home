import "server-only";
import { randomUUID } from "crypto";
import type { BreakdownFactor } from "@/lib/pricing/types";
import {
  TRADE_CATEGORY_LABELS,
  YEARS_TRADING_OPTIONS,
  LIABILITY_LIMIT_OPTIONS,
  type TradesAnswers,
  type TradeCategory,
  type TurnoverBand,
  type HeadcountBand,
  type YearsTradingBand,
  type ClaimsBand as TradesClaimsBand,
  type LiabilityLimit,
} from "@/lib/pricing/trades";
import {
  CONSULTING_CATEGORY_LABELS,
  CLIENTS_BAND_OPTIONS,
  PI_LIMIT_OPTIONS,
  type ConsultantsAnswers,
  type ConsultingCategory,
  type RevenueBand,
  type ClientsBand,
  type ClaimsBand as ConsultantsClaimsBand,
  type PiLimit,
} from "@/lib/pricing/consultants";
import { applyIPT } from "@/lib/quoteProvider/ipt";
import type { QuoteProviderResult } from "@/lib/quoteProvider/types";

// ---------------------------------------------------------------------------
// A fictional demo panel insurer, entirely invented for this prototype — a
// placeholder for what a real Acturis-connected insurer would look like on
// the other end of an integration. Named after Acturis deliberately (this
// is the demo narrative: "here's where a real Acturis-panel insurer would
// plug in"), NOT because it's affiliated with, endorsed by, or a real
// product of Acturis — it isn't, and the "(fictional...)" qualifier on
// INSURER_NAME should stay wherever this name is shown, so nobody mistakes
// it for a real Acturis product if this demo is ever shown outside the
// team. Its numbers are deliberately its OWN, independent of BeesKnee's
// in-house engine (src/lib/pricing/*.ts), the way two real panel insurers
// would genuinely quote differently for the same risk.
// ---------------------------------------------------------------------------

const INSURER_NAME = "Acturis Test Insurance Company (fictional placeholder, not a real Acturis product)";
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

function quoteReference(): string {
  return `ACT-${new Date().getFullYear()}-${randomUUID().slice(0, 6).toUpperCase()}`;
}

// ---------------------------------------------------------------------------
// Trades — public liability
// ---------------------------------------------------------------------------

const TRADES_BASE_PREMIUM: Record<TurnoverBand, number> = {
  under_25k: 210,
  "25k_50k": 300,
  "50k_100k": 460,
  "100k_250k": 700,
  "250k_plus": 1050,
};

const TRADES_CATEGORY_MULTIPLIER: Record<TradeCategory, number> = {
  plumbing: 1.05,
  electrical: 1.25,
  gas_heating: 1.4,
  general_building: 1.15,
  carpentry_joinery: 0.85,
  roofing: 1.5,
  painting_decorating: 0.7,
  landscaping_grounds: 1.0,
  other_trade: 1.1,
};

const TRADES_HEADCOUNT_MULTIPLIER: Record<HeadcountBand, number> = {
  solo: 1.0,
  small_team: 1.3,
  larger_team: 1.9,
};

const TRADES_EXPERIENCE_MULTIPLIER: Record<YearsTradingBand, number> = {
  under_1: 1.2,
  "1_to_3": 1.08,
  "3_to_10": 1.0,
  "10_plus": 0.85,
};

const TRADES_CLAIMS_MULTIPLIER: Record<TradesClaimsBand, number> = {
  none: 1.0,
  one: 1.35,
  two_plus: 2.0,
};

const TRADES_HIGH_RISK_MULTIPLIER = 1.3;

const TRADES_LIMIT_MULTIPLIER: Record<LiabilityLimit, number> = {
  "1m": 1.0,
  "2m": 1.4,
  "5m": 2.0,
};

export function underwriteTrades(answers: TradesAnswers): QuoteProviderResult {
  if (answers.claimsBand === "two_plus" && answers.highRiskWork) {
    return {
      status: "declined",
      insurerName: INSURER_NAME,
      reason:
        "Two or more claims combined with height, gas or electrical work falls outside our current appetite.",
    };
  }
  if (answers.turnoverBand === "250k_plus" || answers.liabilityLimit === "5m") {
    return {
      status: "referred",
      insurerName: INSURER_NAME,
      reason: "Larger accounts and £5m+ limits need manual underwriter sign-off before we can confirm a price.",
    };
  }

  const base = TRADES_BASE_PREMIUM[answers.turnoverBand];
  const categoryMultiplier = TRADES_CATEGORY_MULTIPLIER[answers.tradeCategory];
  const headcountBand: HeadcountBand = answers.hasEmployees ? (answers.headcountBand ?? "small_team") : "solo";
  const headcountMultiplier = TRADES_HEADCOUNT_MULTIPLIER[headcountBand];
  const experienceMultiplier = TRADES_EXPERIENCE_MULTIPLIER[answers.yearsTradingBand];
  const claimsMultiplier = TRADES_CLAIMS_MULTIPLIER[answers.claimsBand];
  const highRiskMultiplier = answers.highRiskWork ? TRADES_HIGH_RISK_MULTIPLIER : 1;
  const limitMultiplier = TRADES_LIMIT_MULTIPLIER[answers.liabilityLimit];

  const netAnnual = Math.round(
    base * categoryMultiplier * headcountMultiplier * experienceMultiplier * claimsMultiplier * highRiskMultiplier * limitMultiplier,
  );
  const netMonthly = Math.round((netAnnual / 12) * 1.08);

  const breakdown: BreakdownFactor[] = [
    {
      id: "base",
      label: "Starting point for your turnover",
      detail: `This insurer's own rate card starts around £${base}/year for this turnover band.`,
      effect: "base",
      amountGBP: base,
    },
    {
      id: "trade",
      label: `Your trade: ${TRADE_CATEGORY_LABELS[answers.tradeCategory]}`,
      detail:
        categoryMultiplier > 1
          ? "This insurer rates this trade above their average risk."
          : categoryMultiplier < 1
            ? "This insurer rates this trade below their average risk."
            : "Rated as average risk by this insurer.",
      effect: categoryMultiplier > 1 ? "increase" : categoryMultiplier < 1 ? "decrease" : "neutral",
      multiplier: categoryMultiplier,
    },
    {
      id: "experience",
      label: `${YEARS_TRADING_OPTIONS.find((o) => o.value === answers.yearsTradingBand)?.label} trading`,
      detail:
        experienceMultiplier < 1
          ? "A longer track record counts in your favour with this insurer too."
          : "This insurer applies a new-trader loading for less experience.",
      effect: experienceMultiplier < 1 ? "decrease" : experienceMultiplier > 1 ? "increase" : "neutral",
      multiplier: experienceMultiplier,
    },
    {
      id: "limit",
      label: `${LIABILITY_LIMIT_OPTIONS.find((o) => o.value === answers.liabilityLimit)?.label} cover limit`,
      detail: "A higher maximum payout costs more with this insurer as well.",
      effect: limitMultiplier > 1 ? "increase" : "neutral",
      multiplier: limitMultiplier,
    },
  ];

  const { netPremiumGBP, insurancePremiumTaxGBP, grossPremiumGBP: grossAnnualGBP } = applyIPT(netAnnual);
  const { grossPremiumGBP: grossMonthlyGBP } = applyIPT(netMonthly);

  return {
    status: "quoted",
    insurerName: INSURER_NAME,
    productName: "Tradesperson Public Liability",
    quoteReference: quoteReference(),
    netPremiumGBP,
    insurancePremiumTaxGBP,
    grossAnnualGBP,
    grossMonthlyGBP,
    validUntil: new Date(Date.now() + THIRTY_DAYS_MS).toISOString(),
    breakdown,
  };
}

// ---------------------------------------------------------------------------
// Consultants / freelancers — professional indemnity
// ---------------------------------------------------------------------------

const CONSULTANTS_BASE_PREMIUM: Record<RevenueBand, number> = {
  under_25k: 175,
  "25k_50k": 260,
  "50k_100k": 400,
  "100k_250k": 620,
  "250k_plus": 900,
};

const CONSULTANTS_CATEGORY_MULTIPLIER: Record<ConsultingCategory, number> = {
  management_business: 1.05,
  it_software: 1.2,
  financial_advisory: 1.6,
  legal_hr: 1.35,
  marketing_creative: 0.8,
  engineering_technical: 1.25,
  coaching_training: 0.75,
  other_consulting: 1.1,
};

const CONSULTANTS_CLIENTS_MULTIPLIER: Record<ClientsBand, number> = {
  "1_to_2": 1.0,
  "3_to_5": 1.2,
  "6_to_10": 1.4,
  "10_plus": 1.65,
};

const CONSULTANTS_DATA_MULTIPLIER = 1.25;

const CONSULTANTS_CLAIMS_MULTIPLIER: Record<ConsultantsClaimsBand, number> = {
  none: 1.0,
  one: 1.4,
  two_plus: 2.1,
};

const CONSULTANTS_LIMIT_MULTIPLIER: Record<PiLimit, number> = {
  "250k": 1.0,
  "500k": 1.35,
  "1m": 1.85,
};

const CONSULTANTS_LOCATION_ADDON_GBP = 70;
const CONSULTANTS_SUBCONTRACTOR_ADDON_GBP = 50;

export function underwriteConsultants(answers: ConsultantsAnswers): QuoteProviderResult {
  if (answers.claimsBand === "two_plus" && answers.consultingCategory === "financial_advisory") {
    return {
      status: "declined",
      insurerName: INSURER_NAME,
      reason: "Financial advisory work with two or more prior claims falls outside our current appetite.",
    };
  }
  if (answers.revenueBand === "250k_plus" || answers.piLimit === "1m") {
    return {
      status: "referred",
      insurerName: INSURER_NAME,
      reason:
        "Larger accounts and £1m+ indemnity limits need manual underwriter sign-off before we can confirm a price.",
    };
  }

  const base = CONSULTANTS_BASE_PREMIUM[answers.revenueBand];
  const categoryMultiplier = CONSULTANTS_CATEGORY_MULTIPLIER[answers.consultingCategory];
  const clientsMultiplier = CONSULTANTS_CLIENTS_MULTIPLIER[answers.concurrentClientsBand];
  const dataMultiplier = answers.handlesSensitiveData ? CONSULTANTS_DATA_MULTIPLIER : 1;
  const claimsMultiplier = CONSULTANTS_CLAIMS_MULTIPLIER[answers.claimsBand];
  const limitMultiplier = CONSULTANTS_LIMIT_MULTIPLIER[answers.piLimit];

  const coreAnnual = base * categoryMultiplier * clientsMultiplier * dataMultiplier * claimsMultiplier * limitMultiplier;
  const locationAddOn = answers.workLocation !== "home" ? CONSULTANTS_LOCATION_ADDON_GBP : 0;
  const subcontractorAddOn = answers.usesSubcontractors ? CONSULTANTS_SUBCONTRACTOR_ADDON_GBP : 0;

  const netAnnual = Math.round(coreAnnual + locationAddOn + subcontractorAddOn);
  const netMonthly = Math.round((netAnnual / 12) * 1.08);

  const breakdown: BreakdownFactor[] = [
    {
      id: "base",
      label: "Starting point for your revenue",
      detail: `This insurer's own rate card starts around £${base}/year for this revenue band.`,
      effect: "base",
      amountGBP: base,
    },
    {
      id: "category",
      label: `Your field: ${CONSULTING_CATEGORY_LABELS[answers.consultingCategory]}`,
      detail:
        categoryMultiplier > 1
          ? "This insurer rates this field above their average risk."
          : categoryMultiplier < 1
            ? "This insurer rates this field below their average risk."
            : "Rated as average risk by this insurer.",
      effect: categoryMultiplier > 1 ? "increase" : categoryMultiplier < 1 ? "decrease" : "neutral",
      multiplier: categoryMultiplier,
    },
    {
      id: "clients",
      label: `${CLIENTS_BAND_OPTIONS.find((o) => o.value === answers.concurrentClientsBand)?.label} at once`,
      detail: clientsMultiplier > 1 ? "More concurrent clients mean more exposure to this insurer too." : "A small client list keeps this part of the price down.",
      effect: clientsMultiplier > 1 ? "increase" : "neutral",
      multiplier: clientsMultiplier,
    },
    {
      id: "limit",
      label: `${PI_LIMIT_OPTIONS.find((o) => o.value === answers.piLimit)?.label} cover limit`,
      detail: "A higher maximum payout costs more with this insurer as well.",
      effect: limitMultiplier > 1 ? "increase" : "neutral",
      multiplier: limitMultiplier,
    },
  ];

  const { netPremiumGBP, insurancePremiumTaxGBP, grossPremiumGBP: grossAnnualGBP } = applyIPT(netAnnual);
  const { grossPremiumGBP: grossMonthlyGBP } = applyIPT(netMonthly);

  return {
    status: "quoted",
    insurerName: INSURER_NAME,
    productName: "Consultants Professional Indemnity",
    quoteReference: quoteReference(),
    netPremiumGBP,
    insurancePremiumTaxGBP,
    grossAnnualGBP,
    grossMonthlyGBP,
    validUntil: new Date(Date.now() + THIRTY_DAYS_MS).toISOString(),
    breakdown,
  };
}
