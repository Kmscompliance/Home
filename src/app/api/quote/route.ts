import { NextResponse } from "next/server";
import { getQuoteProvider } from "@/lib/quoteProvider";
import { logQuoteResult } from "@/lib/quoteProvider/logResult";
import { parseTradesAnswers, parseConsultantsAnswers } from "@/lib/assistant/tools";

// The one endpoint the frontend calls to turn a finished set of answers
// into a quote. Everything about WHERE that quote actually comes from —
// our own pricing engine today, a mock external insurer, or a real one
// later — lives behind getQuoteProvider() and never needs to change here.

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

  const provider = getQuoteProvider();

  if (body.vertical === "trades") {
    const answers = parseTradesAnswers(body.answers);
    if (!answers) return NextResponse.json({ error: "invalid trades answers" }, { status: 400 });
    const result = await provider.getQuote({ vertical: "trades", answers });
    await logQuoteResult("trades", result);
    return NextResponse.json(result);
  }

  if (body.vertical === "consultants") {
    const answers = parseConsultantsAnswers(body.answers);
    if (!answers) return NextResponse.json({ error: "invalid consultants answers" }, { status: 400 });
    const result = await provider.getQuote({ vertical: "consultants", answers });
    await logQuoteResult("consultants", result);
    return NextResponse.json(result);
  }

  return NextResponse.json({ error: "vertical must be 'trades' or 'consultants'" }, { status: 400 });
}
