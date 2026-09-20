import type { ReactNode } from "react";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";

type QuestionCardProps = {
  step: number;
  totalSteps: number;
  onBack: () => void;
  children: ReactNode;
};

export function QuestionCard({ step, totalSteps, onBack, children }: QuestionCardProps) {
  return (
    <div>
      <ProgressBar step={step} totalSteps={totalSteps} label="Your quote" />
      <Card className="mt-6">{children}</Card>
      <button
        type="button"
        onClick={onBack}
        className="mt-4 text-sm text-brand-neutral-500 hover:text-brand-navy-900"
      >
        ← Back
      </button>
    </div>
  );
}
