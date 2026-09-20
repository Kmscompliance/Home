"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { OptionButton } from "./OptionButton";
import { HEADCOUNT_BAND_OPTIONS, type HeadcountBand } from "@/lib/pricing/trades";

type HeadcountStepProps = {
  onContinue: (hasEmployees: boolean, headcountBand?: HeadcountBand) => void;
};

export function HeadcountStep({ onContinue }: HeadcountStepProps) {
  const [hasEmployees, setHasEmployees] = useState<boolean | null>(null);
  const [band, setBand] = useState<HeadcountBand | null>(null);

  return (
    <div>
      <h2 className="text-xl font-semibold text-brand-navy-900">
        Is it just you, or do you have people working with you?
      </h2>
      <div className="mt-6 flex flex-col gap-2">
        <OptionButton
          selected={hasEmployees === false}
          onClick={() => {
            setHasEmployees(false);
            setBand(null);
          }}
        >
          Just me
        </OptionButton>
        <OptionButton selected={hasEmployees === true} onClick={() => setHasEmployees(true)}>
          I have others working with me
        </OptionButton>
      </div>

      {hasEmployees ? (
        <div className="mt-6">
          <p className="text-sm font-medium text-brand-neutral-700">
            Roughly how many, including you?
          </p>
          <div className="mt-3 flex flex-col gap-2">
            {HEADCOUNT_BAND_OPTIONS.map((option) => (
              <OptionButton
                key={option.value}
                selected={band === option.value}
                onClick={() => setBand(option.value)}
              >
                {option.label}
              </OptionButton>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-6 flex justify-end">
        <Button
          disabled={hasEmployees === null || (hasEmployees === true && !band)}
          onClick={() => onContinue(hasEmployees ?? false, band ?? undefined)}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
