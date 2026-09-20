// UK Insurance Premium Tax — the standard rate applies to most general
// insurance, including public liability and professional indemnity.
// This is a simplified, illustrative figure for the demo, NOT tax advice —
// real IPT treatment can vary by product, and rates/rules should be
// confirmed with a real insurer or adviser before this number means
// anything outside this prototype.
export const IPT_STANDARD_RATE = 0.12;

export function applyIPT(netPremiumGBP: number): {
  netPremiumGBP: number;
  insurancePremiumTaxGBP: number;
  grossPremiumGBP: number;
} {
  const insurancePremiumTaxGBP = Math.round(netPremiumGBP * IPT_STANDARD_RATE);
  return {
    netPremiumGBP,
    insurancePremiumTaxGBP,
    grossPremiumGBP: netPremiumGBP + insurancePremiumTaxGBP,
  };
}
