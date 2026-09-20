import "server-only";
import { mkdir, appendFile } from "fs/promises";
import path from "path";

// Captures the ONE piece of real personal data Stage 2 collects: an
// optional email for "save and resume". Kept in its own file, separate
// from the anonymised quoteLog, because — unlike that log — this one is
// real contact data from the moment someone submits it, even though the
// whole app is a demo. Treat it with the same care described in
// ARCHITECTURE.md / the build guide's Stage 4 notes from day one, not just
// once Stage 4 is built.
//
// Same caveat as quoteLog.ts: this is a local file, fine for dev, NOT
// durable on Vercel's serverless filesystem in production.

const LOG_DIR = path.join(process.cwd(), "data");
const LOG_FILE = path.join(LOG_DIR, "lead-log.jsonl");

export type LeadLogEntry = {
  id: string;
  timestamp: string;
  email: string;
  source: "save_and_resume";
  vertical: "trades" | "consultants" | null;
  stepAtCapture: number;
};

export async function appendLeadLog(entry: LeadLogEntry): Promise<void> {
  try {
    await mkdir(LOG_DIR, { recursive: true });
    await appendFile(LOG_FILE, `${JSON.stringify(entry)}\n`, "utf8");
  } catch {
    // Logging is best-effort — never let it break the flow for the user.
  }
}
