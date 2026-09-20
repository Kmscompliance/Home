"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { OptionButton } from "./OptionButton";

type Option = { value: string; label: string };

type RadioStepProps = {
  question: string;
  helpText?: string;
  options: Option[];
  onContinue: (value: string) => void;
};

export function RadioStep({ question, helpText, options, onContinue }: RadioStepProps) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div>
      <h2 className="text-xl font-semibold text-brand-navy-900">{question}</h2>
      {helpText ? <p className="mt-2 text-sm text-brand-neutral-500">{helpText}</p> : null}
      <div className="mt-6 flex flex-col gap-2">
        {options.map((option) => (
          <OptionButton
            key={option.value}
            selected={selected === option.value}
            onClick={() => setSelected(option.value)}
          >
            {option.label}
          </OptionButton>
        ))}
      </div>
      <div className="mt-6 flex justify-end">
        <Button disabled={!selected} onClick={() => selected && onContinue(selected)}>
          Continue
        </Button>
      </div>
    </div>
  );
}
