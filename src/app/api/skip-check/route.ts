import { NextResponse } from "next/server";
import type Anthropic from "@anthropic-ai/sdk";
import { claude, CLAUDE_MODEL } from "@/lib/anthropic/client";
import { guardClaudeCall } from "@/lib/claudeGuard";

type SkipCheckBody = {
  vertical: "trades" | "consultants";
  /** e.g. "toolsValueGBP" or "usesSubcontractors" */
  questionId: string;
  /** The plain-English optional question being considered. */
  questionText: string;
  /** The person's own free-text answer to the first question, for context. */
  rawDescription: string;
  /** A short plain-text summary of the answers gathered so far. */
  answeredSoFar: string;
};

function isToolUseBlock(block: Anthropic.ContentBlock): block is Anthropic.ToolUseBlock {
  return block.type === "tool_use";
}

export async function POST(req: Request) {
  const limited = await guardClaudeCall("skip-check", req);
  if (limited) return limited;

  let body: Partial<SkipCheckBody>;
  try {
    body = (await req.json()) as Partial<SkipCheckBody>;
  } catch {
    return NextResponse.json({ error: "invalid JSON body" }, { status: 400 });
  }

  const { vertical, questionId, questionText, rawDescription, answeredSoFar } = body;

  if (!vertical || !questionId || !questionText) {
    return NextResponse.json({ error: "vertical, questionId and questionText are required" }, { status: 400 });
  }

  // Default is always to ask — skipping is only ever a convenience, never
  // something we risk getting wrong.
  const fallback = { skip: false, reason: "" };

  try {
    const response = await claude.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 256,
      output_config: { effort: "low" },
      system:
        "You help decide whether an optional question in an insurance quote form can be skipped, based on what the person has already said. Only suggest skipping when their own words make it clearly unnecessary — otherwise always ask.",
      tools: [
        {
          name: "skip_decision",
          description: "Decide whether to skip an optional quote question.",
          input_schema: {
            type: "object",
            properties: {
              skip: { type: "boolean" },
              reason: {
                type: "string",
                description: "One short, friendly sentence explaining the decision, to show the user.",
              },
            },
            required: ["skip", "reason"],
            additionalProperties: false,
          },
          strict: true,
        },
      ],
      tool_choice: { type: "tool", name: "skip_decision" },
      messages: [
        {
          role: "user",
          content: [
            `Vertical: ${vertical}`,
            `Optional question: "${questionText}"`,
            `Their own description of their work: "${rawDescription ?? ""}"`,
            `Answers so far: ${answeredSoFar ?? "(none yet)"}`,
            "Should we skip asking this optional question?",
          ].join("\n"),
        },
      ],
    });

    const toolUse = response.content.find(isToolUseBlock);
    const input = toolUse?.input as { skip?: boolean; reason?: string } | undefined;
    if (typeof input?.skip === "boolean") {
      return NextResponse.json({ skip: input.skip, reason: input.reason ?? "" });
    }
  } catch (error) {
    console.error("[skip-check] Claude call failed:", error);
  }

  return NextResponse.json(fallback);
}
