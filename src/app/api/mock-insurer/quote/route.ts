import { NextResponse } from "next/server";
import { underwriteTrades, underwriteConsultants } from "@/lib/mockInsurer/underwriting";
import { parseTradesAnswers, parseConsultantsAnswers } from "@/lib/assistant/tools";

// Stands in for a real insurer/broker-platform endpoint (e.g. Acturis) —
// a genuinely separate, independently callable API representing "the
// other side" of an integration, with its own underwriting rules
// (src/lib/mockInsurer/underwriting.ts). Try it directly:
//
//   curl -X POST http://localhost:3000/api/mock-insurer/quote \
//     -H "Content-Type: application/json" \
//     -d '{"vertical":"trades","answers":{...}}'
//
// src/lib/quoteProvider/mockActurisProvider.ts calls the same underwriting
// functions in-process rather than fetching this route over HTTP (simpler,
// no latency, no URL/env plumbing) — but this route exists so the "other
// system" can be demoed and tested as a standalone endpoint, and is where
// a real HTTP call to Acturis would eventually replace it.

type Body = {
  vertical?: "trades" | "consultants";
  answers?: unknown;
};

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "invalid JSON body" }, { status: 400 });
  }

  if (body.vertical === "trades") {
    const answers = parseTradesAnswers(body.answers);
    if (!answers) return NextResponse.json({ error: "invalid trades answers" }, { status: 400 });
    return NextResponse.json(underwriteTrades(answers));
  }

  if (body.vertical === "consultants") {
    const answers = parseConsultantsAnswers(body.answers);
    if (!answers) return NextResponse.json({ error: "invalid consultants answers" }, { status: 400 });
    return NextResponse.json(underwriteConsultants(answers));
  }

  return NextResponse.json({ error: "vertical must be 'trades' or 'consultants'" }, { status: 400 });
}
