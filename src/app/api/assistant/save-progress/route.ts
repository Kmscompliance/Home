import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { appendLeadLog } from "@/lib/store/leadLog";

type SaveProgressBody = {
  email: string;
  vertical: "trades" | "consultants" | null;
  step: number;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  let body: Partial<SaveProgressBody>;
  try {
    body = (await req.json()) as Partial<SaveProgressBody>;
  } catch {
    return NextResponse.json({ error: "invalid JSON body" }, { status: 400 });
  }

  const email = (body.email ?? "").trim();
  if (!EMAIL_PATTERN.test(email)) {
    return NextResponse.json({ error: "a valid email is required" }, { status: 400 });
  }

  await appendLeadLog({
    id: randomUUID(),
    timestamp: new Date().toISOString(),
    email,
    source: "save_and_resume",
    vertical: body.vertical ?? null,
    stepAtCapture: typeof body.step === "number" ? body.step : -1,
  });

  // NOTE: this demo doesn't have a real email provider wired up, so no
  // email is actually sent — we only capture and log it. Say so honestly
  // in the UI rather than implying a link was sent.
  return NextResponse.json({ ok: true });
}
