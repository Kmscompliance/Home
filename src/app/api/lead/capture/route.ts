import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { appendLeadLog, type LeadSource } from "@/lib/store/leadLog";

type CaptureBody = {
  name?: string;
  email: string;
  source: LeadSource;
  vertical: "trades" | "consultants" | null;
  step?: number;
  annualGBP?: number;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VALID_SOURCES: LeadSource[] = ["save_and_resume", "quote_complete"];

export async function POST(req: Request) {
  let body: Partial<CaptureBody>;
  try {
    body = (await req.json()) as Partial<CaptureBody>;
  } catch {
    return NextResponse.json({ error: "invalid JSON body" }, { status: 400 });
  }

  const email = (body.email ?? "").trim();
  if (!EMAIL_PATTERN.test(email)) {
    return NextResponse.json({ error: "a valid email is required" }, { status: 400 });
  }
  if (!body.source || !VALID_SOURCES.includes(body.source)) {
    return NextResponse.json({ error: "a valid source is required" }, { status: 400 });
  }

  await appendLeadLog({
    id: randomUUID(),
    timestamp: new Date().toISOString(),
    name: body.name?.trim() || null,
    email,
    source: body.source,
    vertical: body.vertical ?? null,
    stepAtCapture: typeof body.step === "number" ? body.step : null,
    annualGBP: typeof body.annualGBP === "number" ? body.annualGBP : null,
  });

  // NOTE: this demo doesn't have a real email provider wired up, so no
  // email is actually sent — we only capture and log it. Say so honestly
  // in the UI rather than implying a link was sent or contact was made.
  return NextResponse.json({ ok: true });
}
