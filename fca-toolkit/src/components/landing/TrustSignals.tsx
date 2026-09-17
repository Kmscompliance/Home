import Image from "next/image";
import { documents } from "@/lib/documents";

const stats = [
  { label: "Templates covering the full application", value: String(documents.length) },
  { label: "Editable Word (.docx) downloads", value: "100%" },
  { label: "Accounts required to buy", value: "0" },
];

const founders = [
  {
    photo: "/brand/founder-matt.jpg",
    name: "Matt",
    role: "Co-Director, KMS Compliance",
  },
  {
    photo: "/brand/founder-cofounder.jpg",
    name: "Marc",
    role: "Ex-FCA, Co-Founder, KMS Compliance",
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
              className="overflow-hidden rounded-xl border border-kms-border bg-white shadow-sm"
            >
              <div className="relative aspect-[4/5] w-full bg-kms-surface">
                <Image
                  src={person.photo}
                  alt={person.name}
                  fill
                  className="object-cover object-top"
                  sizes="(min-width: 640px) 260px, 100vw"
                />
              </div>
              <div className="p-5">
                <p className="text-sm font-semibold text-kms-navy">{person.name}</p>
                <p className="text-xs text-kms-text/70">{person.role}</p>
              </div>
            </div>
          ))}
          <div className="rounded-xl border border-dashed border-kms-border bg-kms-surface p-5 text-xs text-kms-text/60 sm:col-span-2">
            Still need finalised bio copy for Matt and Marc before this goes
            live.
          </div>
        </div>
      </div>
    </section>
  );
}
