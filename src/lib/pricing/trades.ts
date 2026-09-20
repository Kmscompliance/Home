import type { BreakdownFactor, PremiumResult } from "./types";

// ---------------------------------------------------------------------------
// Trade category
// ---------------------------------------------------------------------------

export type TradeCategory =
  | "plumbing"
  | "electrical"
  | "gas_heating"
  | "general_building"
  | "carpentry_joinery"
  | "roofing"
  | "painting_decorating"
  | "landscaping_grounds"
  | "other_trade";

export const TRADE_CATEGORIES: TradeCategory[] = [
  "plumbing",
  "electrical",
  "gas_heating",
  "general_building",
  "carpentry_joinery",
  "roofing",
  "painting_decorating",
  "landscaping_grounds",
  "other_trade",
];

export const TRADE_CATEGORY_LABELS: Record<TradeCategory, string> = {
  plumbing: "Plumbing",
  electrical: "Electrical work",
  gas_heating: "Gas & heating",
  general_building: "General building",
  carpentry_joinery: "Carpentry & joinery",
  roofing: "Roofing",
  painting_decorating: "Painting & decorating",
  landscaping_grounds: "Landscaping & grounds work",
  other_trade: "Other trade work",
};

// Relative public-liability risk by trade. 1.0 = an average-risk trade.
// This is a simulated, illustrative rate table for the demo — a real
// insurer's rating engine would sit here instead.
const TRADE_RISK_MULTIPLIER: Record<TradeCategory, number> = {
  plumbing: 1.0,
  electrical: 1.2, // live electrics carry more risk than average
  gas_heating: 1.3, // gas work is one of the higher-risk trades
  general_building: 1.1,
  carpentry_joinery: 0.9,
  roofing: 1.35, // working at height is the highest-risk factor here
  painting_decorating: 0.75,
  landscaping_grounds: 0.95,
  other_trade: 1.0,
};

// ---------------------------------------------------------------------------
// Annual turnover band
// ---------------------------------------------------------------------------

export type TurnoverBand =
  | "under_25k"
  | "25k_50k"
  | "50k_100k"
  | "100k_250k"
  | "250k_plus";

export const TURNOVER_BAND_OPTIONS: { value: TurnoverBand; label: string }[] = [
  { value: "under_25k", label: "Under £25,000" },
  { value: "25k_50k", label: "£25,000 – £50,000" },
  { value: "50k_100k", label: "£50,000 – £100,000" },
  { value: "100k_250k", label: "£100,000 – £250,000" },
  { value: "250k_plus", label: "£250,000+" },
];

// Starting annual premium (£), before any risk adjustments, by turnover band.
// Bigger businesses have more exposure, so they start from a higher base.
const TURNOVER_BASE_PREMIUM: Record<TurnoverBand, number> = {
  under_25k: 180,
  "25k_50k": 280,
  "50k_100k": 420,
  "100k_250k": 650,
  "250k_plus": 950,
};

// ---------------------------------------------------------------------------
// Headcount
// ---------------------------------------------------------------------------

export type HeadcountBand = "solo" | "small_team" | "larger_team";

export const HEADCOUNT_BAND_OPTIONS: { value: HeadcountBand; label: string }[] = [
  { value: "small_team", label: "2–5 people" },
  { value: "larger_team", label: "6 or more people" },
];

// More people working under the policy means more exposure to a claim.
const HEADCOUNT_MULTIPLIER: Record<HeadcountBand, number> = {
  solo: 1.0,
  small_team: 1.35,
  larger_team: 1.75,
};

// ---------------------------------------------------------------------------
// Years trading
// ---------------------------------------------------------------------------

export type YearsTradingBand = "under_1" | "1_to_3" | "3_to_10" | "10_plus";

export const YEARS_TRADING_OPTIONS: { value: YearsTradingBand; label: string }[] = [
  { value: "under_1", label: "Less than 1 year" },
  { value: "1_to_3", label: "1 – 3 years" },
  { value: "3_to_10", label: "3 – 10 years" },
  { value: "10_plus", label: "10+ years" },
];

// A longer track record with no surprises is treated as lower risk.
const EXPERIENCE_MULTIPLIER: Record<YearsTradingBand, number> = {
  under_1: 1.15,
  "1_to_3": 1.05,
  "3_to_10": 1.0,
  "10_plus": 0.9,
};

// ---------------------------------------------------------------------------
// Claims history
// ---------------------------------------------------------------------------

export type ClaimsBand = "none" | "one" | "two_plus";

export const CLAIMS_OPTIONS: { value: ClaimsBand; label: string }[] = [
  { value: "none", label: "No claims" },
  { value: "one", label: "One claim" },
  { value: "two_plus", label: "Two or more claims" },
];

const CLAIMS_MULTIPLIER: Record<ClaimsBand, number> = {
  none: 1.0,
  one: 1.25,
  two_plus: 1.6,
};

// ---------------------------------------------------------------------------
// High-risk activity (height / gas / electrical installation)
// ---------------------------------------------------------------------------

// A flat loading applied when the work itself is inherently higher-risk,
// on top of whatever the trade category already reflects.
const HIGH_RISK_MULTIPLIER = 1.2;

// ---------------------------------------------------------------------------
// Liability limit
// ---------------------------------------------------------------------------

export type LiabilityLimit = "1m" | "2m" | "5m";

export const LIABILITY_LIMIT_OPTIONS: { value: LiabilityLimit; label: string }[] = [
  { value: "1m", label: "£1 million" },
  { value: "2m", label: "£2 million" },
  { value: "5m", label: "£5 million" },
];

// The most a claim would be covered up to. A higher ceiling costs more.
const LIMIT_MULTIPLIER: Record<LiabilityLimit, number> = {
  "1m": 1.0,
  "2m": 1.35,
  "5m": 1.8,
};

// ---------------------------------------------------------------------------
// Tools cover (optional add-on)
// ---------------------------------------------------------------------------

const TOOLS_COVER_RATE = 0.06; // 6% of declared tools value, per year
const TOOLS_COVER_MIN_GBP = 30;

// Paying monthly instead of annually costs a little more, as with most
// insurance — this reflects the admin cost of spreading payments.
const MONTHLY_PAYMENT_LOADING = 1.08;

// ---------------------------------------------------------------------------
// Calculation
// ---------------------------------------------------------------------------

export type TradesAnswers = {
  tradeCategory: TradeCategory;
  turnoverBand: TurnoverBand;
  hasEmployees: boolean;
  headcountBand?: HeadcountBand;
  yearsTradingBand: YearsTradingBand;
  claimsBand: ClaimsBand;
  highRiskWork: boolean;
  liabilityLimit: LiabilityLimit;
  toolsValueGBP?: number;
};

export function calculateTradesPremium(answers: TradesAnswers): PremiumResult {
  const base = TURNOVER_BASE_PREMIUM[answers.turnoverBand];
  const tradeMultiplier = TRADE_RISK_MULTIPLIER[answers.tradeCategory];
  const headcountBand: HeadcountBand = answers.hasEmployees
    ? (answers.headcountBand ?? "small_team")
    : "solo";
  const headcountMultiplier = HEADCOUNT_MULTIPLIER[headcountBand];
  const experienceMultiplier = EXPERIENCE_MULTIPLIER[answers.yearsTradingBand];
  const claimsMultiplier = CLAIMS_MULTIPLIER[answers.claimsBand];
  const highRiskMultiplier = answers.highRiskWork ? HIGH_RISK_MULTIPLIER : 1;
  const limitMultiplier = LIMIT_MULTIPLIER[answers.liabilityLimit];

  const coreAnnual =
    base *
    tradeMultiplier *
    headcountMultiplier *
    experienceMultiplier *
    claimsMultiplier *
    highRiskMultiplier *
    limitMultiplier;

  const toolsAddOn =
    answers.toolsValueGBP && answers.toolsValueGBP > 0
      ? Math.max(TOOLS_COVER_MIN_GBP, Math.round(answers.toolsValueGBP * TOOLS_COVER_RATE))
      : 0;

  const annualGBP = Math.round(coreAnnual + toolsAddOn);
  const monthlyGBP = Math.round((annualGBP / 12) * MONTHLY_PAYMENT_LOADING);

  const breakdown: BreakdownFactor[] = [
    {
      id: "base",
      label: "Starting point for your turnover",
      detail: `Businesses with a similar turnover typically start around £${base}/year before any adjustments.`,
      effect: "base",
      amountGBP: base,
    },
    {
      id: "trade",
      label: `Your trade: ${TRADE_CATEGORY_LABELS[answers.tradeCategory]}`,
      detail:
        tradeMultiplier > 1
          ? "This type of work carries a higher public liability risk than average."
          : tradeMultiplier < 1
            ? "This type of work carries a lower public liability risk than average."
            : "This is treated as an average-risk trade.",
      effect: tradeMultiplier > 1 ? "increase" : tradeMultiplier < 1 ? "decrease" : "neutral",
      multiplier: tradeMultiplier,
    },
    {
      id: "headcount",
      label: answers.hasEmployees ? "People working with you" : "Just you",
      detail: answers.hasEmployees
        ? "More people covered by the policy means more exposure to a claim."
        : "Covering one person keeps this part of the price down.",
      effect: answers.hasEmployees ? "increase" : "neutral",
      multiplier: headcountMultiplier,
    },
    {
      id: "experience",
      label: `${YEARS_TRADING_OPTIONS.find((o) => o.value === answers.yearsTradingBand)?.label} trading`,
      detail:
        experienceMultiplier < 1
          ? "A longer track record with no issues counts in your favour."
          : experienceMultiplier > 1
            ? "Newer businesses carry a small new-trader loading."
            : "This is treated as an average level of experience.",
      effect: experienceMultiplier < 1 ? "decrease" : experienceMultiplier > 1 ? "increase" : "neutral",
      multiplier: experienceMultiplier,
    },
    {
      id: "claims",
      label:
        answers.claimsBand === "none"
          ? "No claims in the last 5 years"
          : "Previous claims in the last 5 years",
      detail:
        answers.claimsBand === "none"
          ? "A clean claims history keeps your price lower."
          : "Past claims suggest a higher chance of a future one, so this adds a loading.",
      effect: answers.claimsBand === "none" ? "decrease" : "increase",
      multiplier: claimsMultiplier,
    },
    {
      id: "high_risk",
      label: answers.highRiskWork ? "Height, gas or electrical work" : "No higher-risk activities",
      detail: answers.highRiskWork
        ? "Work involving height, gas or electrical installation carries extra risk."
        : "None of your work falls into our higher-risk categories.",
      effect: answers.highRiskWork ? "increase" : "neutral",
      multiplier: highRiskMultiplier,
    },
    {
      id: "limit",
      label: `${LIABILITY_LIMIT_OPTIONS.find((o) => o.value === answers.liabilityLimit)?.label} cover limit`,
      detail: "A higher maximum payout costs more to insure.",
      effect: limitMultiplier > 1 ? "increase" : "neutral",
      multiplier: limitMultiplier,
    },
  ];

  if (toolsAddOn > 0) {
    breakdown.push({
      id: "tools",
      label: "Tools cover add-on",
      detail: `Covering roughly £${answers.toolsValueGBP?.toLocaleString()} of tools adds a flat amount to your price.`,
      effect: "increase",
      amountGBP: toolsAddOn,
    });
  }

  return { annualGBP, monthlyGBP, breakdown };
}
