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
import { getQuoteProvider } from "@/lib/quoteProvider";
import { logQuoteResult } from "@/lib/quoteProvider/logResult";
import { explainPremium } from "@/lib/pricing/explain";
import type { QuoteProviderResult, Vertical } from "@/lib/quoteProvider/types";

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
    let quoteCompleted: { vertical: Vertical; quote: QuoteProviderResult } | undefined;

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
          const quote = await getQuoteProvider().getQuote({ vertical: "trades", answers });
          await logQuoteResult("trades", quote);
          quoteCompleted = { vertical: "trades", quote };
          replyText = [replyText, await describeQuote(quote)].filter(Boolean).join("\n\n");
        }
      }

      if (block.name === "submit_consultants_quote_answers") {
        const answers = parseConsultantsAnswers(block.input);
        if (answers) {
          const quote = await getQuoteProvider().getQuote({ vertical: "consultants", answers });
          await logQuoteResult("consultants", quote);
          quoteCompleted = { vertical: "consultants", quote };
          replyText = [replyText, await describeQuote(quote)].filter(Boolean).join("\n\n");
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

async function describeQuote(quote: QuoteProviderResult): Promise<string> {
  if (quote.status === "quoted") {
    const explanation = await explainPremium(quote.grossAnnualGBP, quote.breakdown);
    return `Here's your simulated quote from ${quote.insurerName}: £${quote.grossMonthlyGBP}/month (£${quote.grossAnnualGBP}/year, including illustrative insurance tax). ${explanation}`;
  }
  if (quote.status === "referred") {
    return `${quote.insurerName} can't give you an instant price on this one — ${quote.reason.toLowerCase()} If you'd like, leave your details and we can follow up once it's been reviewed.`;
  }
  return `${quote.insurerName} isn't able to offer cover for this one — ${quote.reason.toLowerCase()} That doesn't mean no insurer would; it's just outside this particular insurer's appetite.`;
}
