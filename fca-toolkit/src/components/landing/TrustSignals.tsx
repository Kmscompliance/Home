const stats = [
  { label: "Templates covering the full application", value: "13" },
  { label: "Editable Word (.docx) downloads", value: "100%" },
  { label: "Accounts required to buy", value: "0" },
];

const founders = [
  {
    initials: "MK",
    name: "Matt",
    role: "Co-Director, KMS Compliance",
  },
  {
    initials: "KM",
    name: "Co-Director",
    role: "Ex-FCA, Co-Director, KMS Compliance",
  },
];

export function TrustSignals() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div>
          <h2 className="text-2xl font-bold text-kms-navy sm:text-3xl">
            Built by people who&apos;ve sat on the other side of the desk
          </h2>
          <p className="mt-4 text-base leading-relaxed text-kms-text">
            KMS Compliance is a UK FCA compliance consultancy for sole traders
            and small, founder-led financial services firms. These templates
            are drawn from the same documents we use with our own clients —
            adapted so you can complete them yourself.
          </p>

          <div className="mt-8 grid grid-cols-3 gap-4 sm:gap-6">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-bold text-kms-green sm:text-3xl">{stat.value}</p>
                <p className="mt-1 text-xs leading-snug text-kms-text/70 sm:text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {founders.map((person) => (
            <div
              key={person.name}
              className="rounded-xl border border-kms-border bg-white p-5 shadow-sm"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-kms-navy text-sm font-semibold text-white">
                {person.initials}
              </div>
              <p className="mt-4 text-sm font-semibold text-kms-navy">{person.name}</p>
              <p className="text-xs text-kms-text/70">{person.role}</p>
            </div>
          ))}
          <div className="rounded-xl border border-dashed border-kms-border bg-kms-surface p-5 text-xs text-kms-text/60 sm:col-span-2">
            Placeholder photos and bios — swap in real headshots and finalised
            bio copy for Matt and his co-director before this goes live.
          </div>
        </div>
      </div>
    </section>
  );
}
