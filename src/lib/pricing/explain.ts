import "server-only";
import { claude, CLAUDE_MODEL } from "@/lib/anthropic/client";
import type { BreakdownFactor } from "./types";
import { explainFallback } from "./explainFallback";

/**
 * Calls Claude for a short, plain-English "why this price" summary.
 * Never used to calculate the price itself — only to explain a price
 * that calculateTradesPremium/calculateConsultantsPremium already produced.
 * Falls back to a deterministic template if the call fails.
 */
export async function explainPremium(annualGBP: number, breakdown: BreakdownFactor[]): Promise<string> {
  try {
    const factorLines = breakdown.map((f) => `- ${f.label} (${f.effect}): ${f.detail}`).join("\n");

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
  } catch (error) {
    console.error("[explain] Claude call failed:", error);
  }
  return explainFallback(annualGBP, breakdown);
}
