"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { OptionButton } from "./OptionButton";

type OptionalStepProps = {
  vertical: "trades" | "consultants";
  questionId: string;
  question: string;
  helpText?: string;
  kind: "number" | "yesno";
  unitPrefix?: string;
  rawDescription: string;
  answeredSoFarSummary: string;
  onContinue: (value: number | boolean | undefined) => void;
};

export function OptionalStep({
  vertical,
  questionId,
  question,
  helpText,
  kind,
  unitPrefix,
  rawDescription,
  answeredSoFarSummary,
  onContinue,
}: OptionalStepProps) {
  const [checking, setChecking] = useState(true);
  const [suggestSkip, setSuggestSkip] = useState(false);
  const [skipReason, setSkipReason] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [numberValue, setNumberValue] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function check() {
      try {
        const res = await fetch("/api/skip-check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            vertical,
            questionId,
            questionText: question,
            rawDescription,
            answeredSoFar: answeredSoFarSummary,
          }),
        });
        const data = (await res.json()) as { skip?: boolean; reason?: string };
        if (!cancelled) {
          setSuggestSkip(Boolean(data.skip));
          setSkipReason(data.reason ?? "");
        }
      } catch {
        if (!cancelled) setSuggestSkip(false);
      } finally {
        if (!cancelled) setChecking(false);
      }
    }

    check();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionId]);

  if (checking) {
    return (
      <div>
        <h2 className="text-xl font-semibold text-brand-navy-900">{question}</h2>
        <p className="mt-4 text-sm text-brand-neutral-500">One moment…</p>
      </div>
    );
  }

  if (suggestSkip && !showInput) {
    return (
      <div>
        <h2 className="text-xl font-semibold text-brand-navy-900">{question}</h2>
        <p className="mt-4 rounded-xl border border-brand-neutral-200 bg-brand-neutral-50 px-4 py-3 text-brand-neutral-700">
          {skipReason || "Based on what you've told us, this probably doesn't apply to you."}
        </p>
        <div className="mt-6 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setShowInput(true)}
            className="text-sm text-brand-neutral-500 hover:text-brand-navy-900"
          >
            Actually, I&rsquo;d like to add this
          </button>
          <Button onClick={() => onContinue(undefined)}>Skip this</Button>
        </div>
      </div>
    );
  }

  if (kind === "yesno") {
    return (
      <div>
        <h2 className="text-xl font-semibold text-brand-navy-900">{question}</h2>
        {helpText ? <p className="mt-2 text-sm text-brand-neutral-500">{helpText}</p> : null}
        <div className="mt-6 flex flex-col gap-2">
          <OptionButton onClick={() => onContinue(true)}>Yes</OptionButton>
          <OptionButton onClick={() => onContinue(false)}>No</OptionButton>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={() => onContinue(undefined)}
            className="text-sm text-brand-neutral-500 hover:text-brand-navy-900"
          >
            Skip this
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-brand-navy-900">{question}</h2>
      {helpText ? <p className="mt-2 text-sm text-brand-neutral-500">{helpText}</p> : null}
      <div className="mt-6 flex items-center gap-2">
        {unitPrefix ? <span className="text-brand-neutral-500">{unitPrefix}</span> : null}
        <input
          type="number"
          min={0}
          value={numberValue}
          onChange={(e) => setNumberValue(e.target.value)}
          placeholder="0"
          className="w-full rounded-xl border border-brand-neutral-300 p-3 text-brand-navy-900 focus:border-brand-green-600 focus:outline-none"
        />
      </div>
      <div className="mt-6 flex items-center justify-between">
        <button
          type="button"
          onClick={() => onContinue(undefined)}
          className="text-sm text-brand-neutral-500 hover:text-brand-navy-900"
        >
          Skip this
        </button>
        <Button
          disabled={!numberValue}
          onClick={() => onContinue(numberValue ? Number(numberValue) : undefined)}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
