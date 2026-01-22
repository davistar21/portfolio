import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, options } = body as {
      prompt: string | ChatMessage[];
      options?: {
        model?: string;
        temperature?: number;
        maxTokens?: number;
      };
    };

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 },
      );
    }

    const messages: ChatMessage[] = Array.isArray(prompt)
      ? prompt
      : [{ role: "user", content: prompt }];

    const response = await groq.chat.completions.create({
      model: options?.model || "llama-3.3-70b-versatile",
      messages: messages,
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens ?? 4096,
      response_format: { type: "json_object" },
    });

    const content = response.choices[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: "AI returned an invalid or empty response." },
        { status: 500 },
      );
    }

    // Try to parse as JSON
    try {
      const parsed = JSON.parse(content);
      return NextResponse.json(parsed);
    } catch {
      // Fallback: try to extract JSON from markdown code blocks
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return NextResponse.json(parsed);
      }
      return NextResponse.json(
        { error: "AI response was not valid JSON.", raw: content },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}
