import type Anthropic from "@anthropic-ai/sdk";
import {
  TRADE_CATEGORIES,
  TURNOVER_BAND_OPTIONS,
  HEADCOUNT_BAND_OPTIONS,
  YEARS_TRADING_OPTIONS,
  CLAIMS_OPTIONS as TRADES_CLAIMS_OPTIONS,
  LIABILITY_LIMIT_OPTIONS,
  type TradesAnswers,
} from "@/lib/pricing/trades";
import {
  CONSULTING_CATEGORIES,
  REVENUE_BAND_OPTIONS,
  CLIENTS_BAND_OPTIONS,
  CLAIMS_OPTIONS as CONSULTANTS_CLAIMS_OPTIONS,
  WORK_LOCATION_OPTIONS,
  PI_LIMIT_OPTIONS,
  type ConsultantsAnswers,
} from "@/lib/pricing/consultants";

const valuesOf = (options: { value: string }[]) => options.map((o) => o.value);

export const SELECT_VERTICAL_TOOL: Anthropic.Tool = {
  name: "select_vertical",
  description:
    "Record which quote vertical applies to this person, once you're confident: 'trades' for tradespeople (public liability), 'consultants' for consultants/freelancers (professional indemnity).",
  input_schema: {
    type: "object",
    properties: {
      vertical: { type: "string", enum: ["trades", "consultants"] },
    },
    required: ["vertical"],
    additionalProperties: false,
  },
  strict: true,
};

export const SUBMIT_TRADES_TOOL: Anthropic.Tool = {
  name: "submit_trades_quote_answers",
  description:
    "Submit the complete set of answers for a trades (public liability) quote, once you have gathered all of them through conversation.",
  input_schema: {
    type: "object",
    properties: {
      tradeCategory: { type: "string", enum: TRADE_CATEGORIES },
      turnoverBand: { type: "string", enum: valuesOf(TURNOVER_BAND_OPTIONS) },
      hasEmployees: { type: "boolean" },
      headcountBand: { type: "string", enum: valuesOf(HEADCOUNT_BAND_OPTIONS) },
      yearsTradingBand: { type: "string", enum: valuesOf(YEARS_TRADING_OPTIONS) },
      claimsBand: { type: "string", enum: valuesOf(TRADES_CLAIMS_OPTIONS) },
      highRiskWork: { type: "boolean" },
      liabilityLimit: { type: "string", enum: valuesOf(LIABILITY_LIMIT_OPTIONS) },
      toolsValueGBP: { type: "number" },
    },
    required: [
      "tradeCategory",
      "turnoverBand",
      "hasEmployees",
      "yearsTradingBand",
      "claimsBand",
      "highRiskWork",
      "liabilityLimit",
    ],
    additionalProperties: false,
  },
  strict: true,
};

export const SUBMIT_CONSULTANTS_TOOL: Anthropic.Tool = {
  name: "submit_consultants_quote_answers",
  description:
    "Submit the complete set of answers for a consultants/freelancers (professional indemnity) quote, once you have gathered all of them through conversation.",
  input_schema: {
    type: "object",
    properties: {
      consultingCategory: { type: "string", enum: CONSULTING_CATEGORIES },
      revenueBand: { type: "string", enum: valuesOf(REVENUE_BAND_OPTIONS) },
      concurrentClientsBand: { type: "string", enum: valuesOf(CLIENTS_BAND_OPTIONS) },
      handlesSensitiveData: { type: "boolean" },
      claimsBand: { type: "string", enum: valuesOf(CONSULTANTS_CLAIMS_OPTIONS) },
      workLocation: { type: "string", enum: valuesOf(WORK_LOCATION_OPTIONS) },
      piLimit: { type: "string", enum: valuesOf(PI_LIMIT_OPTIONS) },
      usesSubcontractors: { type: "boolean" },
    },
    required: [
      "consultingCategory",
      "revenueBand",
      "concurrentClientsBand",
      "handlesSensitiveData",
      "claimsBand",
      "workLocation",
      "piLimit",
    ],
    additionalProperties: false,
  },
  strict: true,
};

const TRADE_CATEGORY_SET = new Set<string>(TRADE_CATEGORIES);
const TURNOVER_BAND_SET = new Set(valuesOf(TURNOVER_BAND_OPTIONS));
const HEADCOUNT_BAND_SET = new Set(valuesOf(HEADCOUNT_BAND_OPTIONS));
const YEARS_TRADING_SET = new Set(valuesOf(YEARS_TRADING_OPTIONS));
const TRADES_CLAIMS_SET = new Set(valuesOf(TRADES_CLAIMS_OPTIONS));
const LIABILITY_LIMIT_SET = new Set(valuesOf(LIABILITY_LIMIT_OPTIONS));

/** Defensive re-validation of a tool call's input — schema + strict:true should
 * already guarantee this, but this is a public endpoint, so we never trust a
 * network payload without checking it ourselves. */
export function parseTradesAnswers(input: unknown): TradesAnswers | null {
  if (typeof input !== "object" || input === null) return null;
  const a = input as Record<string, unknown>;
  if (typeof a.tradeCategory !== "string" || !TRADE_CATEGORY_SET.has(a.tradeCategory)) return null;
  if (typeof a.turnoverBand !== "string" || !TURNOVER_BAND_SET.has(a.turnoverBand)) return null;
  if (typeof a.hasEmployees !== "boolean") return null;
  if (a.headcountBand !== undefined && (typeof a.headcountBand !== "string" || !HEADCOUNT_BAND_SET.has(a.headcountBand))) return null;
  if (typeof a.yearsTradingBand !== "string" || !YEARS_TRADING_SET.has(a.yearsTradingBand)) return null;
  if (typeof a.claimsBand !== "string" || !TRADES_CLAIMS_SET.has(a.claimsBand)) return null;
  if (typeof a.highRiskWork !== "boolean") return null;
  if (typeof a.liabilityLimit !== "string" || !LIABILITY_LIMIT_SET.has(a.liabilityLimit)) return null;
  if (a.toolsValueGBP !== undefined && typeof a.toolsValueGBP !== "number") return null;

  return {
    tradeCategory: a.tradeCategory,
    turnoverBand: a.turnoverBand,
    hasEmployees: a.hasEmployees,
    headcountBand: a.headcountBand as TradesAnswers["headcountBand"],
    yearsTradingBand: a.yearsTradingBand,
    claimsBand: a.claimsBand,
    highRiskWork: a.highRiskWork,
    liabilityLimit: a.liabilityLimit,
    toolsValueGBP: a.toolsValueGBP as number | undefined,
  } as TradesAnswers;
}

const CONSULTING_CATEGORY_SET = new Set<string>(CONSULTING_CATEGORIES);
const REVENUE_BAND_SET = new Set(valuesOf(REVENUE_BAND_OPTIONS));
const CLIENTS_BAND_SET = new Set(valuesOf(CLIENTS_BAND_OPTIONS));
const CONSULTANTS_CLAIMS_SET = new Set(valuesOf(CONSULTANTS_CLAIMS_OPTIONS));
const WORK_LOCATION_SET = new Set(valuesOf(WORK_LOCATION_OPTIONS));
const PI_LIMIT_SET = new Set(valuesOf(PI_LIMIT_OPTIONS));

export function parseConsultantsAnswers(input: unknown): ConsultantsAnswers | null {
  if (typeof input !== "object" || input === null) return null;
  const a = input as Record<string, unknown>;
  if (typeof a.consultingCategory !== "string" || !CONSULTING_CATEGORY_SET.has(a.consultingCategory)) return null;
  if (typeof a.revenueBand !== "string" || !REVENUE_BAND_SET.has(a.revenueBand)) return null;
  if (typeof a.concurrentClientsBand !== "string" || !CLIENTS_BAND_SET.has(a.concurrentClientsBand)) return null;
  if (typeof a.handlesSensitiveData !== "boolean") return null;
  if (typeof a.claimsBand !== "string" || !CONSULTANTS_CLAIMS_SET.has(a.claimsBand)) return null;
  if (typeof a.workLocation !== "string" || !WORK_LOCATION_SET.has(a.workLocation)) return null;
  if (typeof a.piLimit !== "string" || !PI_LIMIT_SET.has(a.piLimit)) return null;
  if (a.usesSubcontractors !== undefined && typeof a.usesSubcontractors !== "boolean") return null;

  return {
    consultingCategory: a.consultingCategory,
    revenueBand: a.revenueBand,
    concurrentClientsBand: a.concurrentClientsBand,
    handlesSensitiveData: a.handlesSensitiveData,
    claimsBand: a.claimsBand,
    workLocation: a.workLocation,
    piLimit: a.piLimit,
    usesSubcontractors: a.usesSubcontractors as boolean | undefined,
  } as ConsultantsAnswers;
}
