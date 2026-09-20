import "server-only";
import Anthropic from "@anthropic-ai/sdk";

// Server-only: never import this from a client component. The API key lives
// in ANTHROPIC_API_KEY and is only ever read here.
export const claude = new Anthropic();

// Sonnet-tier model: cheap and fast enough for the short classification and
// explanation calls this app makes, at current-generation quality.
export const CLAUDE_MODEL = process.env.CLAUDE_MODEL ?? "claude-sonnet-5";
