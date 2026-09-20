import { NextResponse } from "next/server";
import type { BreakdownFactor } from "@/lib/pricing/types";
import { explainPremium } from "@/lib/pricing/explain";

// Purely about generating the "why this price" text — logging a completed
// quote is owned by /api/quote and the assistant chat route (via
// src/lib/quoteProvider/logResult.ts), the two places a quote decision is
// actually made. This route has no side effects.

type ExplainBody = {
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

  const { annualGBP, breakdown } = body;

  if (typeof annualGBP !== "number" || !Array.isArray(breakdown)) {
    return NextResponse.json({ error: "annualGBP and breakdown are required" }, { status: 400 });
  }

  const explanation = await explainPremium(annualGBP, breakdown);
  return NextResponse.json({ explanation });
}
