type ProgressBarProps = {
  /** Current step, 1-indexed. */
  step: number;
  totalSteps: number;
  label?: string;
};

export function ProgressBar({ step, totalSteps, label }: ProgressBarProps) {
  const percent = Math.min(100, Math.max(0, (step / totalSteps) * 100));

  return (
    <div className="w-full">
      {label ? (
        <div className="mb-2 flex justify-between text-xs font-medium text-brand-neutral-500">
          <span>{label}</span>
          <span>
            Step {step} of {totalSteps}
          </span>
        </div>
      ) : null}
      <div
        role="progressbar"
        aria-valuenow={step}
        aria-valuemin={0}
        aria-valuemax={totalSteps}
        className="h-2 w-full overflow-hidden rounded-full bg-brand-neutral-200"
      >
        <div
          className="h-full rounded-full bg-brand-green-600 transition-all duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
