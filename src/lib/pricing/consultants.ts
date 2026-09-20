import type { BreakdownFactor, PremiumResult } from "./types";

// ---------------------------------------------------------------------------
// Consulting category
// ---------------------------------------------------------------------------

export type ConsultingCategory =
  | "management_business"
  | "it_software"
  | "financial_advisory"
  | "legal_hr"
  | "marketing_creative"
  | "engineering_technical"
  | "coaching_training"
  | "other_consulting";

export const CONSULTING_CATEGORIES: ConsultingCategory[] = [
  "management_business",
  "it_software",
  "financial_advisory",
  "legal_hr",
  "marketing_creative",
  "engineering_technical",
  "coaching_training",
  "other_consulting",
];

export const CONSULTING_CATEGORY_LABELS: Record<ConsultingCategory, string> = {
  management_business: "Management & business consulting",
  it_software: "IT & software consulting",
  financial_advisory: "Financial or investment advisory",
  legal_hr: "Legal or HR consulting",
  marketing_creative: "Marketing & creative freelancing",
  engineering_technical: "Engineering & technical consulting",
  coaching_training: "Coaching & training",
  other_consulting: "Other consulting or freelance work",
};

// Relative professional-indemnity risk by field. 1.0 = an average-risk field.
// Simulated, illustrative rate table for the demo.
const CONSULTING_RISK_MULTIPLIER: Record<ConsultingCategory, number> = {
  management_business: 1.0,
  it_software: 1.15, // data handling and system failures add exposure
  financial_advisory: 1.45, // advice with direct financial consequences is the highest-risk category here
  legal_hr: 1.3,
  marketing_creative: 0.85,
  engineering_technical: 1.2,
  coaching_training: 0.8,
  other_consulting: 1.0,
};

// ---------------------------------------------------------------------------
// Annual revenue band
// ---------------------------------------------------------------------------

export type RevenueBand = "under_25k" | "25k_50k" | "50k_100k" | "100k_250k" | "250k_plus";

export const REVENUE_BAND_OPTIONS: { value: RevenueBand; label: string }[] = [
  { value: "under_25k", label: "Under £25,000" },
  { value: "25k_50k", label: "£25,000 – £50,000" },
  { value: "50k_100k", label: "£50,000 – £100,000" },
  { value: "100k_250k", label: "£100,000 – £250,000" },
  { value: "250k_plus", label: "£250,000+" },
];

// Starting annual premium (£), before any risk adjustments, by revenue band.
const REVENUE_BASE_PREMIUM: Record<RevenueBand, number> = {
  under_25k: 150,
  "25k_50k": 230,
  "50k_100k": 350,
  "100k_250k": 550,
  "250k_plus": 800,
};

// ---------------------------------------------------------------------------
// Concurrent clients
// ---------------------------------------------------------------------------

export type ClientsBand = "1_to_2" | "3_to_5" | "6_to_10" | "10_plus";

export const CLIENTS_BAND_OPTIONS: { value: ClientsBand; label: string }[] = [
  { value: "1_to_2", label: "1 – 2 clients" },
  { value: "3_to_5", label: "3 – 5 clients" },
  { value: "6_to_10", label: "6 – 10 clients" },
  { value: "10_plus", label: "10+ clients" },
];

// More concurrent client relationships mean more chances for something to
// go wrong at any one time.
const CLIENTS_MULTIPLIER: Record<ClientsBand, number> = {
  "1_to_2": 1.0,
  "3_to_5": 1.15,
  "6_to_10": 1.3,
  "10_plus": 1.5,
};

// ---------------------------------------------------------------------------
// Sensitive data / IP handling
// ---------------------------------------------------------------------------

// A flat loading applied when the work involves client data, financial
// information or intellectual property — a mistake here is costlier.
const SENSITIVE_DATA_MULTIPLIER = 1.2;

// ---------------------------------------------------------------------------
// Claims / complaints history
// ---------------------------------------------------------------------------

export type ClaimsBand = "none" | "one" | "two_plus";

export const CLAIMS_OPTIONS: { value: ClaimsBand; label: string }[] = [
  { value: "none", label: "None" },
  { value: "one", label: "One" },
  { value: "two_plus", label: "Two or more" },
];

const CLAIMS_MULTIPLIER: Record<ClaimsBand, number> = {
  none: 1.0,
  one: 1.3,
  two_plus: 1.7,
};

// ---------------------------------------------------------------------------
// Work location
// ---------------------------------------------------------------------------

export type WorkLocation = "home" | "client_site" | "both";

export const WORK_LOCATION_OPTIONS: { value: WorkLocation; label: string }[] = [
  { value: "home", label: "From home" },
  { value: "client_site", label: "On client sites" },
  { value: "both", label: "Both" },
];

// Visiting client sites brings in a small public liability exposure
// (e.g. accidentally damaging something or injuring someone on-site).
const PUBLIC_LIABILITY_ADD_ON_GBP = 60;

// ---------------------------------------------------------------------------
// Professional indemnity limit
// ---------------------------------------------------------------------------

export type PiLimit = "250k" | "500k" | "1m";

export const PI_LIMIT_OPTIONS: { value: PiLimit; label: string }[] = [
  { value: "250k", label: "£250,000" },
  { value: "500k", label: "£500,000" },
  { value: "1m", label: "£1 million" },
];

const LIMIT_MULTIPLIER: Record<PiLimit, number> = {
  "250k": 1.0,
  "500k": 1.3,
  "1m": 1.7,
};

// ---------------------------------------------------------------------------
// Subcontractors (optional add-on)
// ---------------------------------------------------------------------------

// Using subcontractors adds vicarious-liability exposure — you're on the
// hook for their work too — so it carries a flat loading.
const SUBCONTRACTOR_LOADING_GBP = 45;

// Paying monthly instead of annually costs a little more, as with most
// insurance — this reflects the admin cost of spreading payments.
const MONTHLY_PAYMENT_LOADING = 1.08;

// ---------------------------------------------------------------------------
// Calculation
// ---------------------------------------------------------------------------

export type ConsultantsAnswers = {
  consultingCategory: ConsultingCategory;
  revenueBand: RevenueBand;
  concurrentClientsBand: ClientsBand;
  handlesSensitiveData: boolean;
  claimsBand: ClaimsBand;
  workLocation: WorkLocation;
  piLimit: PiLimit;
  usesSubcontractors?: boolean;
};

export function calculateConsultantsPremium(answers: ConsultantsAnswers): PremiumResult {
  const base = REVENUE_BASE_PREMIUM[answers.revenueBand];
  const categoryMultiplier = CONSULTING_RISK_MULTIPLIER[answers.consultingCategory];
  const clientsMultiplier = CLIENTS_MULTIPLIER[answers.concurrentClientsBand];
  const dataMultiplier = answers.handlesSensitiveData ? SENSITIVE_DATA_MULTIPLIER : 1;
  const claimsMultiplier = CLAIMS_MULTIPLIER[answers.claimsBand];
  const limitMultiplier = LIMIT_MULTIPLIER[answers.piLimit];

  const coreAnnual =
    base * categoryMultiplier * clientsMultiplier * dataMultiplier * claimsMultiplier * limitMultiplier;

  const publicLiabilityAddOn = answers.workLocation !== "home" ? PUBLIC_LIABILITY_ADD_ON_GBP : 0;
  const subcontractorAddOn = answers.usesSubcontractors ? SUBCONTRACTOR_LOADING_GBP : 0;

  const annualGBP = Math.round(coreAnnual + publicLiabilityAddOn + subcontractorAddOn);
  const monthlyGBP = Math.round((annualGBP / 12) * MONTHLY_PAYMENT_LOADING);

  const breakdown: BreakdownFactor[] = [
    {
      id: "base",
      label: "Starting point for your revenue",
      detail: `Businesses with similar revenue typically start around £${base}/year before any adjustments.`,
      effect: "base",
      amountGBP: base,
    },
    {
      id: "category",
      label: `Your field: ${CONSULTING_CATEGORY_LABELS[answers.consultingCategory]}`,
      detail:
        categoryMultiplier > 1
          ? "Advice in this field carries a higher professional indemnity risk than average."
          : categoryMultiplier < 1
            ? "Advice in this field carries a lower professional indemnity risk than average."
            : "This is treated as an average-risk field.",
      effect: categoryMultiplier > 1 ? "increase" : categoryMultiplier < 1 ? "decrease" : "neutral",
      multiplier: categoryMultiplier,
    },
    {
      id: "clients",
      label: `${CLIENTS_BAND_OPTIONS.find((o) => o.value === answers.concurrentClientsBand)?.label} at once`,
      detail:
        clientsMultiplier > 1
          ? "More concurrent client relationships mean more exposure at any one time."
          : "A small, focused client list keeps this part of the price down.",
      effect: clientsMultiplier > 1 ? "increase" : "neutral",
      multiplier: clientsMultiplier,
    },
    {
      id: "data",
      label: answers.handlesSensitiveData ? "Handles client data, finances or IP" : "No sensitive data handled",
      detail: answers.handlesSensitiveData
        ? "A mistake involving client data or finances tends to be costlier to put right."
        : "Not handling sensitive data or IP keeps this part of the price down.",
      effect: answers.handlesSensitiveData ? "increase" : "neutral",
      multiplier: dataMultiplier,
    },
    {
      id: "claims",
      label:
        answers.claimsBand === "none"
          ? "No claims or complaints in the last 5 years"
          : "Previous claims or complaints in the last 5 years",
      detail:
        answers.claimsBand === "none"
          ? "A clean history keeps your price lower."
          : "Past claims or complaints suggest a higher chance of a future one.",
      effect: answers.claimsBand === "none" ? "decrease" : "increase",
      multiplier: claimsMultiplier,
    },
    {
      id: "limit",
      label: `${PI_LIMIT_OPTIONS.find((o) => o.value === answers.piLimit)?.label} cover limit`,
      detail: "A higher maximum payout costs more to insure.",
      effect: limitMultiplier > 1 ? "increase" : "neutral",
      multiplier: limitMultiplier,
    },
  ];

  if (publicLiabilityAddOn > 0) {
    breakdown.push({
      id: "location",
      label: "Working on client sites",
      detail: "Visiting client sites adds a small amount of public liability cover to your policy.",
      effect: "increase",
      amountGBP: publicLiabilityAddOn,
    });
  }

  if (subcontractorAddOn > 0) {
    breakdown.push({
      id: "subcontractors",
      label: "Using subcontractors",
      detail: "You're responsible for subcontractors' work too, so this adds a flat amount.",
      effect: "increase",
      amountGBP: subcontractorAddOn,
    });
  }

  return { annualGBP, monthlyGBP, breakdown };
}
