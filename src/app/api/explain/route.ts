import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import type { BreakdownFactor } from "@/lib/pricing/types";
import { explainPremium } from "@/lib/pricing/explain";
import { appendQuoteLog } from "@/lib/store/quoteLog";

type ExplainBody = {
  vertical: "trades" | "consultants";
  annualGBP: number;
  monthlyGBP: number;
  breakdown: BreakdownFactor[];
};

export async function POST(req: Request) {
  let body: Partial<ExplainBody>;
  try {
    body = (await req.json()) as Partial<ExplainBody>;
  } catch {
    return NextResponse.json({ error: "invalid JSON body" }, { status: 400 });
  }

  const { vertical, annualGBP, monthlyGBP, breakdown } = body;

  if (
    (vertical !== "trades" && vertical !== "consultants") ||
    typeof annualGBP !== "number" ||
    typeof monthlyGBP !== "number" ||
    !Array.isArray(breakdown)
  ) {
    return NextResponse.json(
      { error: "vertical, annualGBP, monthlyGBP and breakdown are required" },
      { status: 400 },
    );
  }

  const explanation = await explainPremium(annualGBP, breakdown);

  // Anonymised, best-effort — never blocks the response to the user.
  await appendQuoteLog({
    id: randomUUID(),
    timestamp: new Date().toISOString(),
    vertical,
    annualGBP,
    monthlyGBP,
    factorCount: breakdown.length,
  });

  return NextResponse.json({ explanation });
}
