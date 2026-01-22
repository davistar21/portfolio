// Client-safe chat utility - calls API route instead of Groq SDK directly

interface ChatOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

/**
 * Send a chat prompt to the AI via API route.
 * This is safe to use from both client and server components.
 */
export const chat = async (
  prompt: string | ChatMessage[],
  options?: ChatOptions,
): Promise<unknown> => {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt, options }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `API error: ${response.status}`);
  }

  return response.json();
};

// ============================================
// PUTER IMPLEMENTATION (Legacy/Fallback)
// ============================================
interface PuterAIResponse {
  message: { content: string | { type: string; text: string }[] };
}

interface PuterChatOptions {
  model?: string;
  responseMimeType?: string;
}

export const puterChat = async (
  prompt: string | ChatMessage[],
  options?: PuterChatOptions,
): Promise<unknown> => {
  
  const puter = typeof window !== "undefined" ? window.puter : null;
  if (!puter) {
    throw new Error("Puter.js not available for chat.");
  }

  const defaultOptions = {
    model: options?.model || "claude-3-7-sonnet-latest",
    responseMimeType: "application/json",
  };

  const response = (await puter.ai.chat(prompt, undefined, undefined, {
    ...defaultOptions,
    ...options,
  })) as PuterAIResponse | undefined;

  if (!response || !response.message.content) {
    throw new Error("AI returned an invalid or empty response.");
  }

  const content = Array.isArray(response.message.content)
    ? response.message.content[0]?.text || ""
    : response.message.content;

  console.log("Puter response:", content);

  try {
    return JSON.parse(content);
  } catch (_e) {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error("AI response was not valid JSON.");
  }
};
