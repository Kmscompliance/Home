"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

type SaveAndResumeFormProps = {
  onSubmit: (email: string) => Promise<void>;
  onDecline: () => void;
};

export function SaveAndResumeForm({ onSubmit, onDecline }: SaveAndResumeFormProps) {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    if (!email.trim()) return;
    setSubmitting(true);
    await onSubmit(email.trim());
    setSubmitting(false);
  }

  return (
    <div className="rounded-xl border border-brand-neutral-200 bg-brand-neutral-50 p-3">
      <p className="text-xs text-brand-neutral-500">
        Optional — no real email will be sent in this demo, and no obligation either way.
      </p>
      <div className="mt-2 flex gap-2">
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
      <button
        type="button"
        onClick={onDecline}
        className="mt-2 text-xs text-brand-neutral-500 hover:text-brand-navy-900"
      >
        No thanks
      </button>
    </div>
  );
}
