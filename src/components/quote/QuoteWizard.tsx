"use client";

import { useEffect, useState } from "react";
import { useAssistant } from "@/components/assistant/AssistantProvider";
import { QuestionCard } from "./QuestionCard";
import { VerticalPicker } from "./VerticalPicker";
import { RadioStep } from "./RadioStep";
import { FreeTextClassifyStep } from "./FreeTextClassifyStep";
import { HeadcountStep } from "./HeadcountStep";
import { OptionalStep } from "./OptionalStep";
import { ResultScreen } from "./ResultScreen";
import { Card } from "@/components/ui/Card";
import type { QuoteProviderResult } from "@/lib/quoteProvider/types";
import {
  TURNOVER_BAND_OPTIONS,
  YEARS_TRADING_OPTIONS,
  CLAIMS_OPTIONS as TRADES_CLAIMS_OPTIONS,
  LIABILITY_LIMIT_OPTIONS,
  type TradeCategory,
  type TurnoverBand,
  type YearsTradingBand,
  type ClaimsBand as TradesClaimsBand,
  type LiabilityLimit,
  type TradesAnswers,
} from "@/lib/pricing/trades";
import {
  REVENUE_BAND_OPTIONS,
  CLIENTS_BAND_OPTIONS,
  CLAIMS_OPTIONS as CONSULTANTS_CLAIMS_OPTIONS,
  WORK_LOCATION_OPTIONS,
  PI_LIMIT_OPTIONS,
  type ConsultingCategory,
  type RevenueBand,
  type ClientsBand,
  type ClaimsBand as ConsultantsClaimsBand,
  type WorkLocation,
  type PiLimit,
  type ConsultantsAnswers,
} from "@/lib/pricing/consultants";

type Vertical = "trades" | "consultants";
const TOTAL_STEPS = 8;

const TRADES_QUESTION_META = [
  { id: "tradeCategory", text: "What's your trade?" },
  { id: "turnoverBand", text: "Roughly, what's your annual turnover?" },
  { id: "headcount", text: "Is it just you, or do you have people working with you?" },
  { id: "yearsTradingBand", text: "How many years have you been trading?" },
  { id: "claimsBand", text: "Any insurance claims in the last 5 years?" },
  { id: "highRiskWork", text: "Does your work ever involve height, gas, or electrical installation?" },
  { id: "liabilityLimit", text: "How much liability cover do you want?" },
  { id: "toolsValueGBP", text: "Roughly what's your tools worth, if you'd like them covered too?" },
];

const CONSULTANTS_QUESTION_META = [
  { id: "consultingCategory", text: "What kind of consulting or freelance work do you do?" },
  { id: "revenueBand", text: "Roughly, what's your annual revenue?" },
  { id: "concurrentClientsBand", text: "How many clients are you typically working with at once?" },
  { id: "handlesSensitiveData", text: "Do you ever handle client data, financial information, or IP?" },
  { id: "claimsBand", text: "Any claims or client complaints in the last 5 years?" },
  { id: "workLocation", text: "Do you work from home, on client sites, or both?" },
  { id: "piLimit", text: "What level of professional indemnity cover do you want?" },
  { id: "usesSubcontractors", text: "Do you use subcontractors on your work?" },
];

function summariseTrades(a: Partial<TradesAnswers>): string {
  return [
    a.turnoverBand && `turnover ${a.turnoverBand}`,
    a.hasEmployees === false ? "works solo" : a.hasEmployees ? "has a team" : undefined,
    a.yearsTradingBand && `trading ${a.yearsTradingBand}`,
  ]
    .filter(Boolean)
    .join(", ");
}

function summariseConsultants(a: Partial<ConsultantsAnswers>): string {
  return [
    a.revenueBand && `revenue ${a.revenueBand}`,
    a.concurrentClientsBand && `${a.concurrentClientsBand} clients at once`,
    a.workLocation && `works ${a.workLocation.replace("_", " ")}`,
  ]
    .filter(Boolean)
    .join(", ");
}

export function QuoteWizard() {
  const assistant = useAssistant();
  const [vertical, setVertical] = useState<Vertical | null>(null);
  const [step, setStep] = useState(0);
  const [tradesAnswers, setTradesAnswers] = useState<Partial<TradesAnswers>>({});
  const [consultantsAnswers, setConsultantsAnswers] = useState<Partial<ConsultantsAnswers>>({});
  const [rawText, setRawText] = useState("");
  const [result, setResult] = useState<{ vertical: Vertical; quote: QuoteProviderResult } | null>(null);
  const [quoting, setQuoting] = useState(false);
  const [quoteError, setQuoteError] = useState(false);

  // A quote can finish either through the form (setResult below) or through
  // the assistant's chat mode (assistant.chatQuoteResult) — whichever
  // finishes first is what's shown, derived at render time rather than
  // synced into local state.
  const activeResult = result ?? assistant.chatQuoteResult;

  useEffect(() => {
    if (!vertical || activeResult || quoting) return;
    const meta = vertical === "trades" ? TRADES_QUESTION_META[step] : CONSULTANTS_QUESTION_META[step];
    if (meta) assistant.reportStep(vertical, meta.id, meta.text);
    // reportStep is stable (useCallback) — only step/vertical should re-trigger this
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vertical, step, activeResult, quoting]);

  useEffect(() => {
    if (activeResult?.quote.status === "quoted") {
      assistant.reportQuoteCompleted(activeResult.vertical, activeResult.quote.grossAnnualGBP);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeResult]);

  async function submitQuote(v: Vertical, answers: TradesAnswers | ConsultantsAnswers) {
    setQuoting(true);
    setQuoteError(false);
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vertical: v, answers }),
      });
      if (!res.ok) throw new Error("quote request failed");
      const quote = (await res.json()) as QuoteProviderResult;
      setResult({ vertical: v, quote });
    } catch {
      setQuoteError(true);
    } finally {
      setQuoting(false);
    }
  }

  function restart() {
    setVertical(null);
    setStep(0);
    setTradesAnswers({});
    setConsultantsAnswers({});
    setRawText("");
    setResult(null);
    setQuoteError(false);
    assistant.clearChatQuoteResult();
  }

  function back() {
    if (step === 0) {
      setVertical(null);
      return;
    }
    setStep((s) => s - 1);
  }

  if (activeResult) {
    return <ResultScreen vertical={activeResult.vertical} quote={activeResult.quote} onRestart={restart} />;
  }

  if (quoting) {
    return (
      <Card className="text-center">
        <p className="text-brand-navy-900">Getting your quote…</p>
      </Card>
    );
  }

  if (!vertical) {
    return (
      <VerticalPicker
        onSelect={(v) => {
          setVertical(v);
          setStep(0);
        }}
        onPreferChat={assistant.startChatQuote}
      />
    );
  }

  let content: React.ReactNode;

  if (vertical === "trades") {
    switch (step) {
      case 0:
        content = (
          <FreeTextClassifyStep
            vertical="trades"
            question="What's your trade?"
            helpText="Describe it in your own words — we'll work out the category."
            placeholder="e.g. I fix boilers and do general plumbing"
            onContinue={(text, category) => {
              setRawText(text);
              setTradesAnswers((a) => ({ ...a, tradeCategory: category as TradeCategory }));
              setStep(1);
            }}
          />
        );
        break;
      case 1:
        content = (
          <RadioStep
            question="Roughly, what's your annual turnover?"
            options={TURNOVER_BAND_OPTIONS}
            onContinue={(value) => {
              setTradesAnswers((a) => ({ ...a, turnoverBand: value as TurnoverBand }));
              setStep(2);
            }}
          />
        );
        break;
      case 2:
        content = (
          <HeadcountStep
            onContinue={(hasEmployees, headcountBand) => {
              setTradesAnswers((a) => ({ ...a, hasEmployees, headcountBand }));
              setStep(3);
            }}
          />
        );
        break;
      case 3:
        content = (
          <RadioStep
            question="How many years have you been trading?"
            options={YEARS_TRADING_OPTIONS}
            onContinue={(value) => {
              setTradesAnswers((a) => ({ ...a, yearsTradingBand: value as YearsTradingBand }));
              setStep(4);
            }}
          />
        );
        break;
      case 4:
        content = (
          <RadioStep
            question="Any insurance claims in the last 5 years?"
            options={TRADES_CLAIMS_OPTIONS}
            onContinue={(value) => {
              setTradesAnswers((a) => ({ ...a, claimsBand: value as TradesClaimsBand }));
              setStep(5);
            }}
          />
        );
        break;
      case 5:
        content = (
          <RadioStep
            question="Does your work ever involve height, gas, or electrical installation?"
            helpText="This covers higher-risk activities that carry extra cover."
            options={[
              { value: "yes", label: "Yes" },
              { value: "no", label: "No" },
            ]}
            onContinue={(value) => {
              setTradesAnswers((a) => ({ ...a, highRiskWork: value === "yes" }));
              setStep(6);
            }}
          />
        );
        break;
      case 6:
        content = (
          <RadioStep
            question="How much liability cover do you want?"
            helpText="This is the most your policy would pay out if a claim against your business succeeds."
            options={LIABILITY_LIMIT_OPTIONS}
            onContinue={(value) => {
              setTradesAnswers((a) => ({ ...a, liabilityLimit: value as LiabilityLimit }));
              setStep(7);
            }}
          />
        );
        break;
      case 7:
        content = (
          <OptionalStep
            vertical="trades"
            questionId="toolsValueGBP"
            question="Roughly what's your tools worth, if you'd like them covered too?"
            helpText="Optional — this adds tools cover to your policy."
            kind="number"
            unitPrefix="£"
            rawDescription={rawText}
            answeredSoFarSummary={summariseTrades(tradesAnswers)}
            onContinue={(value) => {
              const finalAnswers = {
                ...tradesAnswers,
                toolsValueGBP: typeof value === "number" ? value : undefined,
              } as TradesAnswers;
              submitQuote("trades", finalAnswers);
            }}
          />
        );
        break;
      default:
        content = null;
    }
  } else {
    switch (step) {
      case 0:
        content = (
          <FreeTextClassifyStep
            vertical="consultants"
            question="What kind of consulting or freelance work do you do?"
            helpText="Describe it in your own words — we'll work out the category."
            placeholder="e.g. I help startups with their go-to-market strategy"
            onContinue={(text, category) => {
              setRawText(text);
              setConsultantsAnswers((a) => ({
                ...a,
                consultingCategory: category as ConsultingCategory,
              }));
              setStep(1);
            }}
          />
        );
        break;
      case 1:
        content = (
          <RadioStep
            question="Roughly, what's your annual revenue?"
            options={REVENUE_BAND_OPTIONS}
            onContinue={(value) => {
              setConsultantsAnswers((a) => ({ ...a, revenueBand: value as RevenueBand }));
              setStep(2);
            }}
          />
        );
        break;
      case 2:
        content = (
          <RadioStep
            question="How many clients are you typically working with at once?"
            options={CLIENTS_BAND_OPTIONS}
            onContinue={(value) => {
              setConsultantsAnswers((a) => ({
                ...a,
                concurrentClientsBand: value as ClientsBand,
              }));
              setStep(3);
            }}
          />
        );
        break;
      case 3:
        content = (
          <RadioStep
            question="Do you ever handle client data, financial information, or IP?"
            options={[
              { value: "yes", label: "Yes" },
              { value: "no", label: "No" },
            ]}
            onContinue={(value) => {
              setConsultantsAnswers((a) => ({ ...a, handlesSensitiveData: value === "yes" }));
              setStep(4);
            }}
          />
        );
        break;
      case 4:
        content = (
          <RadioStep
            question="Any claims or client complaints in the last 5 years?"
            options={CONSULTANTS_CLAIMS_OPTIONS}
            onContinue={(value) => {
              setConsultantsAnswers((a) => ({ ...a, claimsBand: value as ConsultantsClaimsBand }));
              setStep(5);
            }}
          />
        );
        break;
      case 5:
        content = (
          <RadioStep
            question="Do you work from home, on client sites, or both?"
            options={WORK_LOCATION_OPTIONS}
            onContinue={(value) => {
              setConsultantsAnswers((a) => ({ ...a, workLocation: value as WorkLocation }));
              setStep(6);
            }}
          />
        );
        break;
      case 6:
        content = (
          <RadioStep
            question="What level of professional indemnity cover do you want?"
            helpText="Professional indemnity cover pays out if a client claims your advice or work caused them a financial loss."
            options={PI_LIMIT_OPTIONS}
            onContinue={(value) => {
              setConsultantsAnswers((a) => ({ ...a, piLimit: value as PiLimit }));
              setStep(7);
            }}
          />
        );
        break;
      case 7:
        content = (
          <OptionalStep
            vertical="consultants"
            questionId="usesSubcontractors"
            question="Do you use subcontractors on your work?"
            helpText="Optional — using subcontractors adds a small amount to your price, since you're responsible for their work too."
            kind="yesno"
            rawDescription={rawText}
            answeredSoFarSummary={summariseConsultants(consultantsAnswers)}
            onContinue={(value) => {
              const finalAnswers = {
                ...consultantsAnswers,
                usesSubcontractors: typeof value === "boolean" ? value : undefined,
              } as ConsultantsAnswers;
              submitQuote("consultants", finalAnswers);
            }}
          />
        );
        break;
      default:
        content = null;
    }
  }

  return (
    <QuestionCard step={step + 1} totalSteps={TOTAL_STEPS} onBack={back}>
      {content}
      {quoteError ? (
        <p className="mt-4 text-sm text-red-600">
          We couldn&rsquo;t get a quote just now — please try continuing again.
        </p>
      ) : null}
    </QuestionCard>
  );
}
