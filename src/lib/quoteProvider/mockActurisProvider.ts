import "server-only";
import { underwriteTrades, underwriteConsultants } from "@/lib/mockInsurer/underwriting";
import type { QuoteProvider, QuoteProviderRequest, QuoteProviderResult } from "./types";

/**
 * Calls the same underwriting logic exposed over HTTP at
 * POST /api/mock-insurer/quote — in-process here for reliability and
 * latency, rather than this server fetching its own route. Structurally,
 * this file is the exact seam a real ActurisProvider would occupy: same
 * QuoteProvider interface, same call site (getQuoteProvider(), below) —
 * only the body of getQuote() would change to a real HTTP call to Acturis.
 */
export const mockActurisProvider: QuoteProvider = {
  id: "mock-acturis",
  displayName: "Mock Acturis-style insurer panel (demo)",

  async getQuote(request: QuoteProviderRequest): Promise<QuoteProviderResult> {
    return request.vertical === "trades"
      ? underwriteTrades(request.answers)
      : underwriteConsultants(request.answers);
  },
};
