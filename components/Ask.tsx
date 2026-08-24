"use client";

/**
 * Ask
 *
 * Interactive Q&A widget for portfolio questions.
 * Non-streaming Groq response, rendered as markdown, revealed top-to-bottom
 * via an animated mask gradient. While waiting, a whimsical verb cycles in
 * place of the loading dots.
 */

import { useState, useRef, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion";
import { Send, Loader2, X, Sparkles, Trash2 } from "lucide-react";
import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

// Hand-picked so it has voice. Mix of verbs and short noun-phrases.
const LOADING_VERBS = [
  "thinking",
  "rummaging",
  "pondering",
  "shuffling notes",
  "consulting the source",
  "thumbing through projects",
  "sketching a reply",
  "fact-checking myself",
  "scribbling",
  "warming up the keys",
  "chasing references",
  "piecing things together",
];

function LoadingVerbs() {
  const [index, setIndex] = useState(() =>
    Math.floor(Math.random() * LOADING_VERBS.length),
  );
  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % LOADING_VERBS.length);
    }, 1500);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/60 w-fit text-sm text-muted-foreground italic">
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.25 }}
        >
          {LOADING_VERBS[index]}…
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

const markdownComponents: Components = {
  a: ({ href, children }) => {
    const url = href ?? "#";
    const isExternal = /^https?:\/\//i.test(url);
    if (isExternal) {
      return (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline decoration-primary/30 underline-offset-2 hover:decoration-primary"
        >
          {children}
        </a>
      );
    }
    return (
      <Link
        href={url}
        className="text-primary underline decoration-primary/30 underline-offset-2 hover:decoration-primary"
      >
        {children}
      </Link>
    );
  },
  p: ({ children }) => (
    <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="list-disc pl-5 mb-2 last:mb-0 space-y-1">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal pl-5 mb-2 last:mb-0 space-y-1">{children}</ol>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold">{children}</strong>
  ),
  em: ({ children }) => <em className="italic">{children}</em>,
  code: ({ children }) => (
    <code className="px-1 py-0.5 rounded bg-muted/60 text-xs font-mono">
      {children}
    </code>
  ),
};

function AssistantBubble({
  content,
  isFresh,
}: {
  content: string;
  isFresh: boolean;
}) {
  // Mask gradient sweeps top→bottom on first mount when this message is fresh.
  // 0 = fully hidden (gradient sits above the element).
  // 1 = fully revealed (gradient sits below the element).
  const reveal = useMotionValue(isFresh ? 0 : 1);
  const maskImage = useTransform(
    reveal,
    (v) =>
      `linear-gradient(to bottom, black ${-30 + v * 130}%, transparent ${
        v * 130
      }%)`,
  );

  useEffect(() => {
    if (!isFresh) return;
    const controls = animate(reveal, 1, { duration: 0.5, ease: "easeOut" });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      style={{
        maskImage,
        WebkitMaskImage: maskImage,
      }}
      className="text-sm leading-relaxed p-3 rounded-xl max-w-[85%] text-foreground"
    >
      <ReactMarkdown components={markdownComponents} remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </motion.div>
  );
}

export function Ask({ className = "" }: { className?: string }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [freshTimestamp, setFreshTimestamp] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Load chat history from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("ask-chat");
    if (stored) {
      try {
        setMessages(JSON.parse(stored));
      } catch {
        // Ignore parse errors
      }
    }
  }, []);

  // Scroll to bottom when content changes
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // Save chat history to localStorage
  const saveMessages = (newMessages: ChatMessage[]) => {
    localStorage.setItem("ask-chat", JSON.stringify(newMessages));
    setMessages(newMessages);
  };

  // Focus input when expanded
  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  const clearChat = () => {
    localStorage.removeItem("ask-chat");
    setMessages([]);
    setFreshTimestamp(null);
  };

  const handleSubmit = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: input.trim(),
      timestamp: Date.now(),
    };

    const updatedMessages = [...messages, userMessage];
    saveMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (response.status === 429) {
        const data = await response.json().catch(() => ({}));
        const friendly =
          (typeof data.error === "string" && data.error) ||
          "You're asking faster than I can think — give it a moment.";
        const rateLimitMessage: ChatMessage = {
          role: "assistant",
          content: friendly,
          timestamp: Date.now(),
        };
        saveMessages([...updatedMessages, rateLimitMessage]);
        setFreshTimestamp(rateLimitMessage.timestamp);
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();
      const answer =
        (typeof data.answer === "string" && data.answer.trim()) ||
        "Sorry, I couldn't process that question.";

      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: answer,
        timestamp: Date.now(),
      };
      const finalMessages = [...updatedMessages, assistantMessage];
      localStorage.setItem("ask-chat", JSON.stringify(finalMessages));
      setMessages(finalMessages);
      setFreshTimestamp(assistantMessage.timestamp);
    } catch (error) {
      console.error(error);
      const errorMessage: ChatMessage = {
        role: "assistant",
        content: "Sorry, I couldn't process that question. Please try again!",
        timestamp: Date.now(),
      };
      saveMessages([...updatedMessages, errorMessage]);
      setFreshTimestamp(errorMessage.timestamp);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === "Escape") {
      setIsExpanded(false);
    }
  };

  return (
    <div className={cn("relative", className)}>
      {/* Main container */}
      <motion.div
        layout
        className={cn(
          "overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm shadow-lg shadow-primary/5",
          isExpanded && "border-primary/40",
        )}
      >
        <AnimatePresence mode="wait">
          {!isExpanded ? (
            // Collapsed: Ask button
            <motion.button
              key="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={() => setIsExpanded(true)}
              className="flex items-center gap-3 px-5 py-4 w-full hover:bg-primary/5 transition-colors group"
            >
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="p-2 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20"
              >
                <Sparkles className="w-5 h-5 text-primary" />
              </motion.div>
              <div className="flex flex-col items-start">
                <span className="font-semibold text-foreground">
                  Ask about Eyitayo
                </span>
                <span className="text-xs text-muted-foreground">
                  Powered by AI
                </span>
              </div>
              <span className="text-sm text-primary ml-auto font-medium group-hover:translate-x-1 transition-transform">
                Chat →
              </span>
            </motion.button>
          ) : (
            // Expanded: Chat interface
            <motion.div
              key="chat"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-4"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-border/50">
                <div className="flex items-center gap-2">
                  {/* <div className="p-1.5 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20">
                    <Sparkles className="w-4 h-4 text-primary" />
                  </div> */}
                  <span className="font-semibold text-sm">
                    Ask about Eyitayo
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {messages.length > 0 && (
                    <button
                      onClick={clearChat}
                      className="p-1.5 rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                      title="Clear chat"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => setIsExpanded(false)}
                    className="p-1.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Messages area */}
              <div
                ref={messagesContainerRef}
                className="max-h-64 overflow-y-auto scrollbar-thin mb-4 space-y-3"
              >
                {messages.length === 0 && !isLoading ? (
                  <div className="text-center py-6 text-muted-foreground text-sm">
                    <p className="mb-2">
                      👋 Hi! Ask me anything about Eyitayo.
                    </p>
                    <p className="text-xs">
                      Try: &quot;What projects has he built?&quot; or &quot;What
                      are his skills?&quot;
                    </p>
                  </div>
                ) : (
                  <>
                    {messages.map((msg, idx) =>
                      msg.role === "user" ? (
                        <div
                          key={idx}
                          className="text-sm leading-relaxed p-3 rounded-xl w-fit max-w-[85%] ml-auto bg-muted/80 text-white whitespace-pre-wrap"
                        >
                          {msg.content}
                        </div>
                      ) : (
                        <AssistantBubble
                          key={idx}
                          content={msg.content}
                          isFresh={msg.timestamp === freshTimestamp}
                        />
                      ),
                    )}
                  </>
                )}
                {isLoading && <LoadingVerbs />}
              </div>

              {/* Input row */}
              <div className="flex items-center gap-2 p-2 rounded-xl bg-muted/30 border border-border/50 focus-within:border-primary/40 transition-colors">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask something..."
                  disabled={isLoading}
                  className="flex-1 bg-transparent outline-none text-sm px-2 py-1.5 placeholder:text-muted-foreground/60"
                />
                <Button
                  size="sm"
                  onClick={handleSubmit}
                  disabled={!input.trim() || isLoading}
                  className="shrink-0 rounded-full w-8 h-8 p-0 bg-primary hover:bg-primary/90"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Chat history badge */}
      {messages.length > 0 && !isExpanded && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute -top-2 -right-2 min-w-5 h-5 px-1.5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shadow-lg"
        >
          {Math.min(messages.length, 99)}
        </motion.div>
      )}
    </div>
  );
}
