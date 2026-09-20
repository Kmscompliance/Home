import type { BreakdownFactor } from "./types";

/**
 * A deterministic, template-based explanation used if the Claude call for
 * the "why this price" summary fails or is unavailable. Keeps the demo
 * working even offline or without an API key.
 */
export function explainFallback(annualGBP: number, breakdown: BreakdownFactor[]): string {
  const movers = breakdown
    .filter((f) => f.effect === "increase" || f.effect === "decrease")
    .slice(0, 2);

  if (movers.length === 0) {
    return `Your price of £${annualGBP}/year is close to our starting point for a business like yours, with no major factors pushing it up or down.`;
  }

  const parts = movers.map((f) =>
    f.effect === "increase" ? `${f.label.toLowerCase()} pushed it up a bit` : `${f.label.toLowerCase()} brought it down a bit`,
  );

  return `Your price of £${annualGBP}/year is based on a few things about your business — mainly that ${parts.join(", and ")}. Everything else was fairly average for a business like yours.`;
}
