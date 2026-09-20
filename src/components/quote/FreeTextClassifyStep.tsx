"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

type FreeTextClassifyStepProps = {
  vertical: "trades" | "consultants";
  question: string;
  helpText?: string;
  placeholder: string;
  onContinue: (rawText: string, category: string, label: string) => void;
};

export function FreeTextClassifyStep({
  vertical,
  question,
  helpText,
  placeholder,
  onContinue,
}: FreeTextClassifyStepProps) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [classification, setClassification] = useState<{ category: string; label: string } | null>(
    null,
  );

  async function handleClassify() {
    if (!text.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vertical, text }),
      });
      if (!res.ok) throw new Error("classify failed");
      const data = (await res.json()) as { category: string; label: string };
      setClassification(data);
    } catch {
      setError("We couldn't read that just now — please try again in a moment.");
    } finally {
      setLoading(false);
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
            onClick={() => setClassification(null)}
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
