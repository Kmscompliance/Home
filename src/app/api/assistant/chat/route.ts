import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import type Anthropic from "@anthropic-ai/sdk";
import { claude, CLAUDE_MODEL } from "@/lib/anthropic/client";
import { ASSISTANT_SYSTEM_PROMPT } from "@/lib/assistant/systemPrompt";
import {
  SELECT_VERTICAL_TOOL,
  SUBMIT_TRADES_TOOL,
  SUBMIT_CONSULTANTS_TOOL,
  parseTradesAnswers,
  parseConsultantsAnswers,
} from "@/lib/assistant/tools";
import { calculateTradesPremium } from "@/lib/pricing/trades";
import { calculateConsultantsPremium } from "@/lib/pricing/consultants";
import { explainPremium } from "@/lib/pricing/explain";
import { appendQuoteLog } from "@/lib/store/quoteLog";
import type { PremiumResult } from "@/lib/pricing/types";

type Vertical = "trades" | "consultants";

type ChatMessage = { role: "user" | "assistant"; content: string };

type ChatBody = {
  vertical: Vertical | null;
  messages: ChatMessage[];
};

const FALLBACK_REPLY =
  "Sorry, I'm having trouble thinking right now — you're welcome to keep going with the step-by-step form instead, or try me again in a moment.";

export async function POST(req: Request) {
  let body: Partial<ChatBody>;
  try {
    body = (await req.json()) as Partial<ChatBody>;
  } catch {
    return NextResponse.json({ error: "invalid JSON body" }, { status: 400 });
  }

  if (!Array.isArray(body.messages) || body.messages.length === 0) {
    return NextResponse.json({ error: "messages is required" }, { status: 400 });
  }

  const vertical: Vertical | null = body.vertical === "trades" || body.vertical === "consultants" ? body.vertical : null;

  // Basic hygiene on a public endpoint: cap history length and message size.
  const messages: Anthropic.MessageParam[] = body.messages.slice(-30).map((m) => ({
    role: m.role === "assistant" ? "assistant" : "user",
    content: String(m.content ?? "").slice(0, 2000),
  }));

  try {
    const tools: Anthropic.Tool[] =
      vertical === "trades"
        ? [SUBMIT_TRADES_TOOL]
        : vertical === "consultants"
          ? [SUBMIT_CONSULTANTS_TOOL]
          : [SELECT_VERTICAL_TOOL, SUBMIT_TRADES_TOOL, SUBMIT_CONSULTANTS_TOOL];

    const response = await claude.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 1024,
      output_config: { effort: "medium" },
      system: ASSISTANT_SYSTEM_PROMPT,
      tools,
      tool_choice: { type: "auto" },
      messages,
    });

    const textParts = response.content.filter((b) => b.type === "text").map((b) => (b.type === "text" ? b.text : ""));
    let replyText = textParts.join("\n\n").trim();

    let resolvedVertical: Vertical | undefined;
    let quoteCompleted: { vertical: Vertical; premium: PremiumResult } | undefined;

    for (const block of response.content) {
      if (block.type !== "tool_use") continue;

      if (block.name === "select_vertical") {
        const input = block.input as { vertical?: string };
        if (input.vertical === "trades" || input.vertical === "consultants") {
          resolvedVertical = input.vertical;
        }
      }

      if (block.name === "submit_trades_quote_answers") {
        const answers = parseTradesAnswers(block.input);
        if (answers) {
          const premium = calculateTradesPremium(answers);
          const explanation = await explainPremium(premium.annualGBP, premium.breakdown);
          quoteCompleted = { vertical: "trades", premium };
          replyText = [
            replyText,
            `Here's your simulated quote: £${premium.monthlyGBP}/month (£${premium.annualGBP}/year). ${explanation}`,
          ]
            .filter(Boolean)
            .join("\n\n");
          await appendQuoteLog({
            id: randomUUID(),
            timestamp: new Date().toISOString(),
            vertical: "trades",
            annualGBP: premium.annualGBP,
            monthlyGBP: premium.monthlyGBP,
            factorCount: premium.breakdown.length,
          });
        }
      }

      if (block.name === "submit_consultants_quote_answers") {
        const answers = parseConsultantsAnswers(block.input);
        if (answers) {
          const premium = calculateConsultantsPremium(answers);
          const explanation = await explainPremium(premium.annualGBP, premium.breakdown);
          quoteCompleted = { vertical: "consultants", premium };
          replyText = [
            replyText,
            `Here's your simulated quote: £${premium.monthlyGBP}/month (£${premium.annualGBP}/year). ${explanation}`,
          ]
            .filter(Boolean)
            .join("\n\n");
          await appendQuoteLog({
            id: randomUUID(),
            timestamp: new Date().toISOString(),
            vertical: "consultants",
            annualGBP: premium.annualGBP,
            monthlyGBP: premium.monthlyGBP,
            factorCount: premium.breakdown.length,
          });
        }
      }
    }

    if (!replyText) {
      replyText = resolvedVertical
        ? "Got it — let's go from there."
        : "Could you tell me a little more?";
    }

    return NextResponse.json({
      reply: replyText,
      vertical: resolvedVertical,
      quoteCompleted,
    });
  } catch {
    return NextResponse.json({ reply: FALLBACK_REPLY });
  }
}
