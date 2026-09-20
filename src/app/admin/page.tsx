import { SiteHeader } from "@/components/SiteHeader";
import { Card } from "@/components/ui/Card";
import { getAdminMetrics } from "@/lib/admin/metrics";

export const dynamic = "force-dynamic";

const NUDGE_LABELS: Record<string, string> = {
  inactivity_nudge: "Inactivity nudges",
  clarify_nudge: "Clarify-my-answer nudges",
  confusion_nudge: "“Not sure / skip” nudges",
  leave_intent_offer: "Save-and-resume offers",
};

function StatTile({ label, value }: { label: string; value: string | number }) {
  return (
    <Card className="text-center">
      <p className="text-3xl font-semibold text-brand-navy-900">{value}</p>
      <p className="mt-1 text-sm text-brand-neutral-500">{label}</p>
    </Card>
  );
}

export default async function AdminPage() {
  const metrics = await getAdminMetrics();
  const nudgeEntries = Object.entries(metrics.rescue.nudgesByKind);

  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-12">
        <h1 className="text-2xl font-semibold text-brand-navy-900">Demo metrics</h1>
        <p className="mt-2 text-sm text-brand-neutral-500">
          Lightweight, local numbers for demo purposes — not production analytics. See{" "}
          <span className="font-medium">ARCHITECTURE.md</span> for why this doesn&rsquo;t persist
          on a real Vercel deployment yet.
        </p>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatTile label="Quotes today" value={metrics.quotesToday} />
          <StatTile label="Quotes total" value={metrics.quotesTotal} />
          <StatTile
            label="Avg. monthly premium"
            value={metrics.averageMonthlyGBP !== null ? `£${metrics.averageMonthlyGBP}` : "—"}
          />
          <StatTile
            label="Avg. annual premium"
            value={metrics.averageAnnualGBP !== null ? `£${metrics.averageAnnualGBP}` : "—"}
          />
        </div>

        <Card className="mt-6">
          <p className="text-sm font-medium text-brand-neutral-700">Underwriting decisions</p>
          <p className="mt-1 text-xs text-brand-neutral-500">
            Every answer set submitted to a quote provider, whichever one is active — see{" "}
            <span className="font-medium">QUOTE_PROVIDER</span> in ARCHITECTURE.md.
          </p>
          <div className="mt-4 flex flex-wrap gap-8">
            <div>
              <p className="text-2xl font-semibold text-brand-green-700">{metrics.decisions.quoted}</p>
              <p className="text-sm text-brand-neutral-500">Quoted</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-amber-600">{metrics.decisions.referred}</p>
              <p className="text-sm text-brand-neutral-500">Referred</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-brand-navy-900">{metrics.decisions.declined}</p>
              <p className="text-sm text-brand-neutral-500">Declined</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-brand-navy-900">
                {metrics.decisions.straightThroughRatePercent !== null
                  ? `${metrics.decisions.straightThroughRatePercent}%`
                  : "—"}
              </p>
              <p className="text-sm text-brand-neutral-500">Straight-through rate</p>
            </div>
          </div>
        </Card>

        <Card className="mt-6">
          <p className="text-sm font-medium text-brand-neutral-700">Quotes by vertical</p>
          <div className="mt-3 flex gap-8">
            <div>
              <p className="text-2xl font-semibold text-brand-navy-900">{metrics.byVertical.trades}</p>
              <p className="text-sm text-brand-neutral-500">Trades</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-brand-navy-900">
                {metrics.byVertical.consultants}
              </p>
              <p className="text-sm text-brand-neutral-500">Consultants/freelancers</p>
            </div>
          </div>
        </Card>

        <Card className="mt-6">
          <p className="text-sm font-medium text-brand-neutral-700">Assistant recovery</p>
          <p className="mt-1 text-xs text-brand-neutral-500">
            Sessions where a rescue nudge fired, and whether they went on to complete a quote.
          </p>
          <div className="mt-4 flex gap-8">
            <div>
              <p className="text-2xl font-semibold text-brand-green-700">{metrics.rescue.recovered}</p>
              <p className="text-sm text-brand-neutral-500">Recovered</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-brand-navy-900">{metrics.rescue.abandoned}</p>
              <p className="text-sm text-brand-neutral-500">Left incomplete</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-brand-navy-900">
                {metrics.rescue.sessionsWithNudge}
              </p>
              <p className="text-sm text-brand-neutral-500">Total rescued sessions</p>
            </div>
          </div>

          {nudgeEntries.length > 0 ? (
            <div className="mt-6 border-t border-brand-neutral-200 pt-4">
              <p className="text-xs font-medium text-brand-neutral-500">Nudges fired, by kind</p>
              <ul className="mt-2 flex flex-col gap-1">
                {nudgeEntries.map(([kind, count]) => (
                  <li key={kind} className="flex justify-between text-sm text-brand-navy-900">
                    <span>{NUDGE_LABELS[kind] ?? kind}</span>
                    <span className="font-medium">{count}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </Card>
      </main>
    </div>
  );
}
