import { NextResponse, type NextRequest } from "next/server";
import OpenAI from "openai";
import { buildSystemPrompt } from "@/lib/ai/system-prompt";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getOpenAI() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

const MAX_MESSAGE_LEN = 500;
const MAX_HISTORY = 20;

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "anonymous";
  const limit = rateLimit(`chat:${ip}`, 15, 60_000);

  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many requests. Try again in a minute." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(limit.resetIn / 1000)) } },
    );
  }

  let body: { messages?: Array<{ role: "user" | "assistant"; content: string }>; currency?: string; language?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const messages = (body.messages ?? []).slice(-MAX_HISTORY).map((m) => ({
    role: m.role === "user" ? ("user" as const) : ("assistant" as const),
    content: String(m.content ?? "").slice(0, MAX_MESSAGE_LEN),
  }));

  if (messages.length === 0) {
    return NextResponse.json({ error: "No messages" }, { status: 400 });
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({
      reply:
        "Our AI concierge is currently offline. For a fast response, message us on WhatsApp at +971 54 339 7190 or email hello@aureon.studio.",
    });
  }

  try {
    const completion = await getOpenAI().chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.6,
      max_tokens: 400,
      messages: [
        { role: "system", content: buildSystemPrompt({ currency: body.currency, language: body.language }) },
        ...messages,
      ],
    });

    const reply = completion.choices[0]?.message?.content ?? "Sorry, I lost the thread there. Could you say that again?";
    return NextResponse.json(
      { reply },
      { headers: { "X-RateLimit-Remaining": String(limit.remaining) } },
    );
  } catch (err) {
    console.error("[chat] OpenAI error:", err);
    return NextResponse.json({
      reply:
        "I had a momentary glitch. Try again, or message us directly on WhatsApp at +971 54 339 7190.",
    });
  }
}
