import "server-only";
import { mkdir, appendFile, readFile } from "fs/promises";
import path from "path";

// Simple append-only JSON-lines log of completed quotes, anonymised (no
// name/email — that's collected separately from Stage 3 onward). Good
// enough for a local demo and single-instance deployments.
//
// NOTE: Vercel's serverless functions have an ephemeral, read-only
// filesystem outside /tmp, so writes here will NOT persist between
// invocations in production. Fine for local `next dev` / a single
// long-running server; swap for a real datastore (Vercel KV/Postgres/
// Supabase) before relying on this for the Stage 3 admin dashboard in
// production.

const LOG_DIR = path.join(process.cwd(), "data");
const LOG_FILE = path.join(LOG_DIR, "quote-log.jsonl");

export type QuoteLogEntry = {
  id: string;
  timestamp: string;
  vertical: "trades" | "consultants";
  annualGBP: number;
  monthlyGBP: number;
  factorCount: number;
};

export async function appendQuoteLog(entry: QuoteLogEntry): Promise<void> {
  try {
    await mkdir(LOG_DIR, { recursive: true });
    await appendFile(LOG_FILE, `${JSON.stringify(entry)}\n`, "utf8");
  } catch {
    // Logging is best-effort — never let it break the quote flow.
  }
}

export async function readQuoteLog(): Promise<QuoteLogEntry[]> {
  try {
    const contents = await readFile(LOG_FILE, "utf8");
    return contents
      .split("\n")
      .filter(Boolean)
      .map((line) => JSON.parse(line) as QuoteLogEntry);
  } catch {
    return [];
  }
}
