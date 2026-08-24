import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { z } from "zod";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import {
  getPortfolioContext,
  buildSystemPrompt,
} from "@/lib/getPortfolioContext";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || "",
  token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
});

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "1 m"),
});

const MessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(4000),
});

const RequestSchema = z.object({
  messages: z.array(MessageSchema).max(20),
});

let cachedContext: { data: string; timestamp: number } | null = null;
const CACHE_DURATION = 5 * 60 * 1000;

function getClientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

async function getSystemPrompt(): Promise<string> {
  const now = Date.now();
  if (cachedContext && now - cachedContext.timestamp < CACHE_DURATION) {
    return cachedContext.data;
  }
  const context = await getPortfolioContext();
  const systemPrompt = buildSystemPrompt(context);
  cachedContext = { data: systemPrompt, timestamp: now };
  return systemPrompt;
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);

  try {
    const { success, reset } = await ratelimit.limit(`ratelimit_ask_${ip}`);
    if (!success) {
      const retryAfter = Math.max(0, Math.ceil((reset - Date.now()) / 1000));
      return NextResponse.json(
        {
          error:
            "Whoa — that's a lot of questions in a minute. Give me a moment to catch up.",
        },
        { status: 429, headers: { "Retry-After": String(retryAfter) } },
      );
    }

    const bodyText = await request.text();
    // Validate request body size (rough max limit ~ 100KB)
    if (bodyText.length > 100000) {
      return NextResponse.json({ error: "Payload too large" }, { status: 413 });
    }

    const body = JSON.parse(bodyText);
    
    // Validate with Zod
    const result = RequestSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid request payload" },
        { status: 400 },
      );
    }

    const chatMessages = result.data.messages;
    const systemPrompt = await getSystemPrompt();

    // Ensure we only use the last 20 messages, and role is typed correctly
    const recentMessages = chatMessages.slice(-20);

    const messages = [
      { role: "system" as const, content: systemPrompt },
      ...recentMessages.map(m => ({
        role: m.role as "user" | "assistant",
        content: m.content
      })),
    ];

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages,
      temperature: 0.7,
      max_tokens: 1024,
    });

    const answer = completion.choices[0]?.message?.content?.trim() ?? "";

    return NextResponse.json({ answer });
  } catch (error) {
    console.error("Ask API error:", error);
    // Generic error to avoid leaking internals
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
