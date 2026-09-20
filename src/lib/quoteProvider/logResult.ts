import "server-only";
import { randomUUID } from "crypto";
import { appendQuoteLog } from "@/lib/store/quoteLog";
import type { QuoteProviderResult, Vertical } from "./types";

/** Shared by /api/quote and the assistant chat route, so every quote
 * decision — however it was reached — is logged exactly once, the same way. */
export async function logQuoteResult(vertical: Vertical, result: QuoteProviderResult): Promise<void> {
  await appendQuoteLog({
    id: randomUUID(),
    timestamp: new Date().toISOString(),
    vertical,
    status: result.status,
    insurerName: result.insurerName,
    annualGBP: result.status === "quoted" ? result.grossAnnualGBP : null,
    monthlyGBP: result.status === "quoted" ? result.grossMonthlyGBP : null,
    factorCount: result.status === "quoted" ? result.breakdown.length : null,
  });
}
