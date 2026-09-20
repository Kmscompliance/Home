import "server-only";
import { mkdir, appendFile, readFile } from "fs/promises";
import path from "path";

// Every attempted Claude call, whether it went through or was rate-
// limited — the visibility half of the cost-control story (rateLimit.ts
// is the enforcement half). Same local-file caveat as the other stores.

const LOG_DIR = path.join(process.cwd(), "data");
const LOG_FILE = path.join(LOG_DIR, "api-usage.jsonl");

export type ApiUsageRoute =
  | "classify"
  | "skip-check"
  | "nudge"
  | "explain"
  | "assistant-chat";

export type ApiUsageEntry = {
  id: string;
  timestamp: string;
  route: ApiUsageRoute;
  rateLimited: boolean;
};

export async function appendApiUsage(entry: ApiUsageEntry): Promise<void> {
  try {
    await mkdir(LOG_DIR, { recursive: true });
    await appendFile(LOG_FILE, `${JSON.stringify(entry)}\n`, "utf8");
  } catch {
    // Logging is best-effort — never let it break the request.
  }
}

export async function readApiUsage(): Promise<ApiUsageEntry[]> {
  try {
    const contents = await readFile(LOG_FILE, "utf8");
    return contents
      .split("\n")
      .filter(Boolean)
      .map((line) => JSON.parse(line) as ApiUsageEntry);
  } catch {
    return [];
  }
}
