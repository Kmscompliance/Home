type VerticalPickerProps = {
  onSelect: (vertical: "trades" | "consultants") => void;
};

export function VerticalPicker({ onSelect }: VerticalPickerProps) {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-brand-navy-900">What kind of work do you do?</h1>
      <p className="mt-2 text-brand-neutral-500">
        A handful of quick questions and we&rsquo;ll give you an illustrative price.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => onSelect("trades")}
          className="rounded-2xl border border-brand-neutral-200 bg-white p-6 text-left shadow-sm transition-colors hover:border-brand-green-600"
        >
          <h2 className="text-lg font-semibold text-brand-navy-900">I&rsquo;m a tradesperson</h2>
          <p className="mt-2 text-sm text-brand-neutral-500">
            Plumber, electrician, builder or similar — public liability cover.
          </p>
        </button>
        <button
          type="button"
          onClick={() => onSelect("consultants")}
          className="rounded-2xl border border-brand-neutral-200 bg-white p-6 text-left shadow-sm transition-colors hover:border-brand-green-600"
        >
          <h2 className="text-lg font-semibold text-brand-navy-900">
            I&rsquo;m a consultant or freelancer
          </h2>
          <p className="mt-2 text-sm text-brand-neutral-500">
            Professional indemnity cover for advice-based work.
          </p>
        </button>
      </div>
    </div>
  );
}
