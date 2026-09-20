import "server-only";
import { readQuoteLog } from "@/lib/store/quoteLog";
import { readAssistantEvents, type AssistantEventKind } from "@/lib/store/assistantEventLog";

export type AdminMetrics = {
  quotesToday: number;
  quotesTotal: number;
  byVertical: { trades: number; consultants: number };
  averageAnnualGBP: number | null;
  averageMonthlyGBP: number | null;
  decisions: {
    total: number;
    quoted: number;
    referred: number;
    declined: number;
    straightThroughRatePercent: number | null;
  };
  rescue: {
    sessionsWithNudge: number;
    recovered: number;
    abandoned: number;
    nudgesByKind: Partial<Record<AssistantEventKind, number>>;
  };
};

// A "rescue" nudge is one that tries to save a stalling session; the
// post-quote offer and a completed chat quote are both signals that the
// session ended in a completed quote, not a stall.
const RESCUE_KINDS: AssistantEventKind[] = [
  "inactivity_nudge",
  "clarify_nudge",
  "confusion_nudge",
  "leave_intent_offer",
];
const COMPLETION_KINDS: AssistantEventKind[] = ["post_quote_offer", "chat_quote_completed"];

export async function getAdminMetrics(): Promise<AdminMetrics> {
  const [entries, events] = await Promise.all([readQuoteLog(), readAssistantEvents()]);

  const quoted = entries.filter((e) => e.status === "quoted");
  const referred = entries.filter((e) => e.status === "referred");
  const declined = entries.filter((e) => e.status === "declined");

  const todayStr = new Date().toISOString().slice(0, 10);
  const quotesToday = quoted.filter((q) => q.timestamp.slice(0, 10) === todayStr).length;

  const byVertical = { trades: 0, consultants: 0 };
  let annualSum = 0;
  let monthlySum = 0;
  for (const q of quoted) {
    byVertical[q.vertical] += 1;
    annualSum += q.annualGBP ?? 0;
    monthlySum += q.monthlyGBP ?? 0;
  }

  const nudgesByKind: Partial<Record<AssistantEventKind, number>> = {};
  for (const e of events) {
    if (RESCUE_KINDS.includes(e.kind)) {
      nudgesByKind[e.kind] = (nudgesByKind[e.kind] ?? 0) + 1;
    }
  }

  const bySession = new Map<string, AssistantEventKind[]>();
  for (const e of events) {
    const list = bySession.get(e.sessionId) ?? [];
    list.push(e.kind);
    bySession.set(e.sessionId, list);
  }

  let sessionsWithNudge = 0;
  let recovered = 0;
  for (const kinds of bySession.values()) {
    if (!kinds.some((k) => RESCUE_KINDS.includes(k))) continue;
    sessionsWithNudge += 1;
    if (kinds.some((k) => COMPLETION_KINDS.includes(k))) recovered += 1;
  }

  return {
    quotesToday,
    quotesTotal: quoted.length,
    byVertical,
    averageAnnualGBP: quoted.length ? Math.round(annualSum / quoted.length) : null,
    averageMonthlyGBP: quoted.length ? Math.round(monthlySum / quoted.length) : null,
    decisions: {
      total: entries.length,
      quoted: quoted.length,
      referred: referred.length,
      declined: declined.length,
      straightThroughRatePercent: entries.length ? Math.round((quoted.length / entries.length) * 100) : null,
    },
    rescue: {
      sessionsWithNudge,
      recovered,
      abandoned: sessionsWithNudge - recovered,
      nudgesByKind,
    },
  };
}
