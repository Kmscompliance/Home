import "server-only";
import { mkdir, appendFile } from "fs/promises";
import path from "path";

// Tracks how often each rescue trigger fires, keyed by a client-generated
// sessionId so a later "quote_completed" event can be correlated back to
// the nudges that led up to it — e.g. "how many inactivity nudges led to
// a completed quote vs. an abandoned one", the recovery metric Stage 3's
// admin view surfaces. Same local-file caveat as quoteLog.ts / leadLog.ts.

const LOG_DIR = path.join(process.cwd(), "data");
const LOG_FILE = path.join(LOG_DIR, "assistant-events.jsonl");

export type AssistantEventKind =
  | "inactivity_nudge"
  | "clarify_nudge"
  | "confusion_nudge"
  | "post_quote_offer"
  | "leave_intent_offer"
  | "nudge_dismissed"
  | "chat_quote_started"
  | "chat_quote_completed";

export type AssistantEventEntry = {
  id: string;
  timestamp: string;
  sessionId: string;
  kind: AssistantEventKind;
  vertical: "trades" | "consultants" | null;
};

export async function appendAssistantEvent(entry: AssistantEventEntry): Promise<void> {
  try {
    await mkdir(LOG_DIR, { recursive: true });
    await appendFile(LOG_FILE, `${JSON.stringify(entry)}\n`, "utf8");
  } catch {
    // Logging is best-effort — never let it break the flow for the user.
  }
}
