import "server-only";
import { localProvider } from "./localProvider";
import { mockActurisProvider } from "./mockActurisProvider";
import type { QuoteProvider } from "./types";

const PROVIDERS: Record<string, QuoteProvider> = {
  local: localProvider,
  "mock-acturis": mockActurisProvider,
  // A real integration adds an entry here (e.g. "acturis": acturisProvider)
  // implementing the same QuoteProvider interface, then QUOTE_PROVIDER
  // flips to that value — no other code in the app needs to change.
};

/**
 * Picks the active quote provider from the QUOTE_PROVIDER env var
 * (defaults to "local"). This is the one place that decision is made —
 * every call site asks for "the provider," never a specific one.
 */
export function getQuoteProvider(): QuoteProvider {
  const key = process.env.QUOTE_PROVIDER ?? "local";
  return PROVIDERS[key] ?? localProvider;
}
