"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useAssistant } from "@/components/assistant/AssistantProvider";

type FreeTextClassifyStepProps = {
  vertical: "trades" | "consultants";
  question: string;
  helpText?: string;
  placeholder: string;
  onContinue: (rawText: string, category: string, label: string) => void;
};

const CONFUSION_PATTERN = /not sure|don'?t know|doesn'?t apply|not applicable|n\/?a\b|skip/i;
const LOW_CONFIDENCE_CATEGORIES = new Set(["other_trade", "other_consulting"]);

export function FreeTextClassifyStep({
  vertical,
  question,
  helpText,
  placeholder,
  onContinue,
}: FreeTextClassifyStepProps) {
  const assistant = useAssistant();
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [classification, setClassification] = useState<{ category: string; label: string } | null>(
    null,
  );
  const [retryCount, setRetryCount] = useState(0);

  async function handleClassify() {
    const trimmed = text.trim();
    if (!trimmed) return;

    if (CONFUSION_PATTERN.test(trimmed)) {
      assistant.reportConfusion(vertical, question, trimmed);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vertical, text: trimmed }),
      });
      if (!res.ok) throw new Error("classify failed");
      const data = (await res.json()) as { category: string; label: string };
      setClassification(data);
      if (LOW_CONFIDENCE_CATEGORIES.has(data.category)) {
        assistant.reportClassifyStruggle(vertical, question, trimmed);
      }
    } catch {
      setError("We couldn't read that just now — please try again in a moment.");
    } finally {
      setLoading(false);
    }
  }

  function handleReject() {
    const next = retryCount + 1;
    setRetryCount(next);
    setClassification(null);
    if (next >= 2) {
      assistant.reportClassifyStruggle(vertical, question, text);
    }
  }

  if (classification) {
    return (
      <div>
        <h2 className="text-xl font-semibold text-brand-navy-900">{question}</h2>
        <p className="mt-4 rounded-xl border border-brand-green-100 bg-brand-green-50 px-4 py-3 text-brand-navy-900">
          Got it — we&rsquo;ve classed this as <strong>{classification.label}</strong>.
        </p>
        <div className="mt-6 flex items-center justify-between">
          <button
            type="button"
            onClick={handleReject}
            className="text-sm text-brand-neutral-500 hover:text-brand-navy-900"
          >
            That&rsquo;s not quite right
          </button>
          <Button onClick={() => onContinue(text, classification.category, classification.label)}>
            Continue
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-brand-navy-900">{question}</h2>
      {helpText ? <p className="mt-2 text-sm text-brand-neutral-500">{helpText}</p> : null}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="mt-6 w-full rounded-xl border border-brand-neutral-300 p-4 text-brand-navy-900 focus:border-brand-green-600 focus:outline-none"
      />
      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
      <div className="mt-6 flex justify-end">
        <Button disabled={!text.trim() || loading} onClick={handleClassify}>
          {loading ? "Reading that…" : "Continue"}
        </Button>
      </div>
    </div>
  );
}
