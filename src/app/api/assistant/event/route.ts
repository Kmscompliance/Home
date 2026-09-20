import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { appendAssistantEvent, type AssistantEventKind } from "@/lib/store/assistantEventLog";

const VALID_KINDS: AssistantEventKind[] = [
  "inactivity_nudge",
  "clarify_nudge",
  "confusion_nudge",
  "post_quote_offer",
  "leave_intent_offer",
  "nudge_dismissed",
  "chat_quote_started",
  "chat_quote_completed",
];

type EventBody = {
  sessionId: string;
  kind: AssistantEventKind;
  vertical: "trades" | "consultants" | null;
};

export async function POST(req: Request) {
  let body: Partial<EventBody>;
  try {
    body = (await req.json()) as Partial<EventBody>;
  } catch {
    return NextResponse.json({ error: "invalid JSON body" }, { status: 400 });
  }

  if (!body.sessionId || !body.kind || !VALID_KINDS.includes(body.kind)) {
    return NextResponse.json({ error: "sessionId and a valid kind are required" }, { status: 400 });
  }

  await appendAssistantEvent({
    id: randomUUID(),
    timestamp: new Date().toISOString(),
    sessionId: body.sessionId,
    kind: body.kind,
    vertical: body.vertical ?? null,
  });

  return NextResponse.json({ ok: true });
}
