export type BreakdownEffect = "base" | "increase" | "decrease" | "neutral";

export type BreakdownFactor = {
  id: string;
  /** Short, plain-English label, e.g. "Your trade: Roofing". */
  label: string;
  /** One sentence explaining why this factor moved the price. */
  detail: string;
  effect: BreakdownEffect;
  /** Multiplicative factors carry this; flat add-ons use amountGBP instead. */
  multiplier?: number;
  amountGBP?: number;
};

export type PremiumResult = {
  annualGBP: number;
  monthlyGBP: number;
  breakdown: BreakdownFactor[];
};
