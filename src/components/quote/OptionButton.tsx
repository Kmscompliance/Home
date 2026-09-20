import type { ReactNode } from "react";

type OptionButtonProps = {
  children: ReactNode;
  selected?: boolean;
  onClick: () => void;
};

export function OptionButton({ children, selected, onClick }: OptionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border px-4 py-3 text-left transition-colors ${
        selected
          ? "border-brand-green-600 bg-brand-green-50 text-brand-navy-900"
          : "border-brand-neutral-200 text-brand-neutral-700 hover:border-brand-neutral-300"
      }`}
    >
      {children}
    </button>
  );
}
