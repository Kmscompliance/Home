import type { TradeCategory } from "@/lib/pricing/trades";
import type { ConsultingCategory } from "@/lib/pricing/consultants";

/**
 * Offline, keyword-based classifiers used only if the Claude call fails
 * (network issue, missing API key, rate limit). Deliberately simple — the
 * real classification is Claude's job; this just keeps the demo working.
 */

const TRADE_KEYWORDS: [RegExp, TradeCategory][] = [
  [/plumb|boiler|leak|pipe/i, "plumbing"],
  [/electric|wiring|rewire|fuse/i, "electrical"],
  [/gas|heating|central heat|boiler install/i, "gas_heating"],
  [/roof|guttering|gutter/i, "roofing"],
  [/paint|decorat/i, "painting_decorating"],
  [/garden|landscap|fenc|paving/i, "landscaping_grounds"],
  [/carpen|joiner|kitchen fitt|furniture/i, "carpentry_joinery"],
  [/build|construct|extension|renovat/i, "general_building"],
];

export function fallbackClassifyTrade(text: string): TradeCategory {
  for (const [pattern, category] of TRADE_KEYWORDS) {
    if (pattern.test(text)) return category;
  }
  return "other_trade";
}

const CONSULTING_KEYWORDS: [RegExp, ConsultingCategory][] = [
  [/software|developer|it consult|cyber|tech/i, "it_software"],
  [/financ|invest|account|tax/i, "financial_advisory"],
  [/legal|law|hr|recruit|employment/i, "legal_hr"],
  [/market|brand|design|creative|copywrit|content/i, "marketing_creative"],
  [/engineer|technical|architect/i, "engineering_technical"],
  [/coach|train|mentor/i, "coaching_training"],
  [/management|strategy|business consult/i, "management_business"],
];

export function fallbackClassifyConsulting(text: string): ConsultingCategory {
  for (const [pattern, category] of CONSULTING_KEYWORDS) {
    if (pattern.test(text)) return category;
  }
  return "other_consulting";
}
