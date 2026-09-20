import { NextResponse } from "next/server";
import type Anthropic from "@anthropic-ai/sdk";
import { claude, CLAUDE_MODEL } from "@/lib/anthropic/client";
import {
  TRADE_CATEGORIES,
  TRADE_CATEGORY_LABELS,
  type TradeCategory,
} from "@/lib/pricing/trades";
import {
  CONSULTING_CATEGORIES,
  CONSULTING_CATEGORY_LABELS,
  type ConsultingCategory,
} from "@/lib/pricing/consultants";
import { fallbackClassifyTrade, fallbackClassifyConsulting } from "@/lib/classify/fallback";

type ClassifyBody = {
  vertical: "trades" | "consultants";
  text: string;
};

function isToolUseBlock(block: Anthropic.ContentBlock): block is Anthropic.ToolUseBlock {
  return block.type === "tool_use";
}

export async function POST(req: Request) {
  let body: Partial<ClassifyBody>;
  try {
    body = (await req.json()) as Partial<ClassifyBody>;
  } catch {
    return NextResponse.json({ error: "invalid JSON body" }, { status: 400 });
  }

  const vertical = body.vertical;
  const text = (body.text ?? "").trim().slice(0, 500);

  if ((vertical !== "trades" && vertical !== "consultants") || !text) {
    return NextResponse.json({ error: "vertical and text are required" }, { status: 400 });
  }

  if (vertical === "trades") {
    const category = await classifyTrade(text);
    return NextResponse.json({ category, label: TRADE_CATEGORY_LABELS[category] });
  }

  const category = await classifyConsulting(text);
  return NextResponse.json({ category, label: CONSULTING_CATEGORY_LABELS[category] });
}

async function classifyTrade(text: string): Promise<TradeCategory> {
  try {
    const response = await claude.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 256,
      output_config: { effort: "low" },
      tools: [
        {
          name: "classify_trade",
          description:
            "Classify a UK tradesperson's own plain-English description of their work into exactly one category.",
          input_schema: {
            type: "object",
            properties: {
              category: { type: "string", enum: TRADE_CATEGORIES },
            },
            required: ["category"],
            additionalProperties: false,
          },
          strict: true,
        },
      ],
      tool_choice: { type: "tool", name: "classify_trade" },
      messages: [
        {
          role: "user",
          content: `A tradesperson described their work like this: "${text}"\n\nClassify it.`,
        },
      ],
    });

    const toolUse = response.content.find(isToolUseBlock);
    const category = (toolUse?.input as { category?: string } | undefined)?.category;
    if (category && (TRADE_CATEGORIES as string[]).includes(category)) {
      return category as TradeCategory;
    }
  } catch {
    // fall through to the offline fallback below
  }
  return fallbackClassifyTrade(text);
}

async function classifyConsulting(text: string): Promise<ConsultingCategory> {
  try {
    const response = await claude.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 256,
      output_config: { effort: "low" },
      tools: [
        {
          name: "classify_consulting",
          description:
            "Classify a freelancer or consultant's own plain-English description of their work into exactly one category.",
          input_schema: {
            type: "object",
            properties: {
              category: { type: "string", enum: CONSULTING_CATEGORIES },
            },
            required: ["category"],
            additionalProperties: false,
          },
          strict: true,
        },
      ],
      tool_choice: { type: "tool", name: "classify_consulting" },
      messages: [
        {
          role: "user",
          content: `A consultant/freelancer described their work like this: "${text}"\n\nClassify it.`,
        },
      ],
    });

    const toolUse = response.content.find(isToolUseBlock);
    const category = (toolUse?.input as { category?: string } | undefined)?.category;
    if (category && (CONSULTING_CATEGORIES as string[]).includes(category)) {
      return category as ConsultingCategory;
    }
  } catch {
    // fall through to the offline fallback below
  }
  return fallbackClassifyConsulting(text);
}
