"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

type LeadCaptureCardProps = {
  vertical: "trades" | "consultants";
  /** Only present when the outcome was a price — omitted for referred/declined. */
  annualGBP?: number;
};

export function LeadCaptureCard({ vertical, annualGBP }: LeadCaptureCardProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit() {
    if (!email.trim()) return;
    setSubmitting(true);
    try {
      await fetch("/api/lead/capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim() || undefined,
          email: email.trim(),
          source: "quote_complete",
          vertical,
          annualGBP,
        }),
      });
    } catch {
      // best-effort — the confirmation shows either way, nothing for the
      // user to retry here
    } finally {
      setSubmitting(false);
      setSubmitted(true);
    }
  }

  if (submitted) {
    return (
      <Card className="mt-6">
        <p className="text-sm text-brand-navy-900">
          Thanks — we&rsquo;ve noted your details. This is a demo, so no real contact will follow
          unless you ask us to.
        </p>
      </Card>
    );
  }

  return (
    <Card className="mt-6">
      <p className="text-sm font-medium text-brand-neutral-700">Want us to follow up?</p>
      <p className="mt-1 text-xs text-brand-neutral-500">
        Optional — this is a demo, so no real contact will follow unless you ask us to.
      </p>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name (optional)"
          className="w-full rounded-lg border border-brand-neutral-300 px-3 py-2 text-sm text-brand-navy-900 focus:border-brand-green-600 focus:outline-none"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full rounded-lg border border-brand-neutral-300 px-3 py-2 text-sm text-brand-navy-900 focus:border-brand-green-600 focus:outline-none"
        />
        <Button size="md" disabled={!email.trim() || submitting} onClick={handleSubmit}>
          Send
        </Button>
      </div>
    </Card>
  );
}
