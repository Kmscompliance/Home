import "server-only";
import { mkdir, appendFile, readFile } from "fs/promises";
import path from "path";

// The one place real contact data is captured, from wherever it comes in:
// Stage 2's "save and resume" offer (email only, mid-form) and Stage 3's
// optional post-quote capture (name + email). Both write here as the same
// kind of lead record rather than two separate stores, per the product
// decision to treat every contact point the same way. A future phone-
// number capture step (see ARCHITECTURE.md -> Planned / not yet built)
// would write here too.
//
// This is real personal data the moment someone submits it, even though
// the whole app is a demo — treat it with the same care described in
// ARCHITECTURE.md / the build guide's Stage 4 notes from day one, not just
// once Stage 4 is built.
//
// Same caveat as quoteLog.ts: this is a local file, fine for dev, NOT
// durable on Vercel's serverless filesystem in production.

const LOG_DIR = path.join(process.cwd(), "data");
const LOG_FILE = path.join(LOG_DIR, "lead-log.jsonl");

export type LeadSource = "save_and_resume" | "quote_complete";

export type LeadLogEntry = {
  id: string;
  timestamp: string;
  name: string | null;
  email: string;
  source: LeadSource;
  vertical: "trades" | "consultants" | null;
  /** Present for save_and_resume (which form step they were on). */
  stepAtCapture: number | null;
  /** Present for quote_complete (their simulated annual price). */
  annualGBP: number | null;
};

export async function appendLeadLog(entry: LeadLogEntry): Promise<void> {
  try {
    await mkdir(LOG_DIR, { recursive: true });
    await appendFile(LOG_FILE, `${JSON.stringify(entry)}\n`, "utf8");
  } catch {
    // Logging is best-effort — never let it break the flow for the user.
  }
}

export async function readLeadLog(): Promise<LeadLogEntry[]> {
  try {
    const contents = await readFile(LOG_FILE, "utf8");
    return contents
      .split("\n")
      .filter(Boolean)
      .map((line) => JSON.parse(line) as LeadLogEntry);
  } catch {
    return [];
  }
}
