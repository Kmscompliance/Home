import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { claude, CLAUDE_MODEL } from "@/lib/anthropic/client";
import type { BreakdownFactor } from "@/lib/pricing/types";
import { explainFallback } from "@/lib/pricing/explainFallback";
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

async function explainPremium(annualGBP: number, breakdown: BreakdownFactor[]): Promise<string> {
  try {
    const factorLines = breakdown
      .map((f) => `- ${f.label} (${f.effect}): ${f.detail}`)
      .join("\n");

    const response = await claude.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 300,
      output_config: { effort: "medium" },
      system:
        "You write short, warm, plain-English explanations of a simulated insurance quote for a small-business owner. " +
        "Write 2-3 sentences, referencing at most the top 2-3 factors that moved the price. " +
        "Never use insurance jargon without immediately explaining it in the same sentence. " +
        "Never invent coverage details, exclusions, or claims about what is or isn't covered beyond the factors given. " +
        "Never imply this is a real, bindable insurance quote or that payment can be taken — it's an illustrative demo price. " +
        "Do not use a greeting or sign-off, just the explanation itself.",
      messages: [
        {
          role: "user",
          content: `The simulated annual price is £${annualGBP}. Here are the pricing factors:\n${factorLines}\n\nExplain why the price is what it is.`,
        },
      ],
    });

    const textBlock = response.content.find((b) => b.type === "text");
    const text = textBlock?.type === "text" ? textBlock.text.trim() : "";
    if (text) return text;
  } catch {
    // fall through to the offline fallback below
  }
  return explainFallback(annualGBP, breakdown);
}
