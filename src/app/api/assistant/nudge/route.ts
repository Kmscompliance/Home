import { NextResponse } from "next/server";
import { claude, CLAUDE_MODEL } from "@/lib/anthropic/client";

export type NudgeKind = "inactivity" | "clarify" | "confusion" | "post_quote" | "leave_intent";

type NudgeBody = {
  kind: NudgeKind;
  vertical?: "trades" | "consultants";
  questionText?: string;
  rawText?: string;
  summary?: string;
  annualGBP?: number;
};

const FALLBACKS: Record<NudgeKind, string> = {
  inactivity:
    "No rush — if it helps, try describing your answer in your own words, and I can take it from there.",
  clarify: "That didn't quite match one of our categories — could you describe what you actually do, day-to-day?",
  confusion: 'No worries — describe it however feels natural, or just say "skip" and we\'ll move on.',
  post_quote: "Want me to explain any part of this, or is there anything else I can help with?",
  leave_intent: "Want me to email you a link so you can pick this back up later? Totally optional, no obligation.",
};

const INSTRUCTIONS: Record<NudgeKind, string> = {
  inactivity:
    "The person has paused on this question for a little while. Offer a short, encouraging example or a simpler way to think about it, specific to the question on screen.",
  clarify:
    "The person's free-text answer didn't map cleanly to one of our categories. Ask a short, friendly follow-up question to help clarify what they meant.",
  confusion:
    "The person said something suggesting they're not sure or want to skip this question. Reassure them and give them an easy way forward (an example, or explicitly offer to skip).",
  post_quote:
    "The person just received their simulated quote. Proactively offer to explain any part of it or answer follow-up questions.",
  leave_intent:
    "The person seems to be about to leave the form without finishing. Gently offer to email them a link to resume later, making clear it's optional.",
};

export async function POST(req: Request) {
  let body: Partial<NudgeBody>;
  try {
    body = (await req.json()) as Partial<NudgeBody>;
  } catch {
    return NextResponse.json({ error: "invalid JSON body" }, { status: 400 });
  }

  const kind = body.kind;
  if (!kind || !(kind in FALLBACKS)) {
    return NextResponse.json({ error: "a valid kind is required" }, { status: 400 });
  }

  const message = await generateNudge(kind, body);
  return NextResponse.json({ message });
}

async function generateNudge(kind: NudgeKind, body: Partial<NudgeBody>): Promise<string> {
  try {
    const context = [
      body.vertical && `Vertical: ${body.vertical}`,
      body.questionText && `The question on screen: "${body.questionText}"`,
      body.rawText && `What they've typed so far: "${body.rawText}"`,
      body.summary && `What we know so far: ${body.summary}`,
      typeof body.annualGBP === "number" && `Their simulated price: £${body.annualGBP}/year`,
    ]
      .filter(Boolean)
      .join("\n");

    const response = await claude.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 150,
      output_config: { effort: "low" },
      system:
        "You write a single short, warm, plain-English chat message (one sentence, two at most) for an insurance quote assistant. No greeting, no sign-off, no jargon. Never invent coverage details or claim to give financial advice.",
      messages: [
        {
          role: "user",
          content: `${INSTRUCTIONS[kind]}\n\n${context || "(no extra context)"}`,
        },
      ],
    });

    const textBlock = response.content.find((b) => b.type === "text");
    const text = textBlock?.type === "text" ? textBlock.text.trim() : "";
    if (text) return text;
  } catch (error) {
    console.error("[assistant/nudge] Claude call failed:", error);
  }
  return FALLBACKS[kind];
}
