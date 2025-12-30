import React, { useState, useRef } from "react";
import { toast } from "sonner";
import { X, Edit, Eye, ImageIcon, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
// import remarkGfm from "remark-gfm"; // Disabled for iOS compatibility
import { chat } from "@/lib/chat";
import { supabase } from "@/lib/supabase";
import MarkdownImage from "@/components/blog/MarkdownImage";
import MarkdownErrorBoundary from "@/components/MarkdownErrorBoundary";

interface BlogMarkdownEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export default function BlogMarkdownEditor({
  content,
  onChange,
}: BlogMarkdownEditorProps) {
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");
  const [isUploadingBodyImage, setIsUploadingBodyImage] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [selection, setSelection] = useState<{
    start: number;
    end: number;
    text: string;
  } | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSelection = () => {
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      const text = textareaRef.current.value.substring(start, end);

      if (text.trim().length > 0) {
        setSelection({ start, end, text });
      } else {
        setSelection(null);
      }
    }
  };

  const insertAtCursor = (text: string) => {
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      const currentContent = content || "";
      const newContent =
        currentContent.substring(0, start) +
        text +
        currentContent.substring(end);

      onChange(newContent);

      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          textareaRef.current.setSelectionRange(
            start + text.length,
            start + text.length
          );
        }
      }, 0);
    }
  };

  const handleBodyImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setIsUploadingBodyImage(true);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `blog-body-${
        crypto.randomUUID().split("-")[1]
      }.${fileExt}`;
      const filePath = `blog/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("portfolio-assets")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("portfolio-assets").getPublicUrl(filePath);

      insertAtCursor(`\n\n![${file.name}](${publicUrl})\n\n`);
      toast.success("Image inserted!");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast.error("Error upload image: " + errorMessage);
    } finally {
      setIsUploadingBodyImage(false);
      e.target.value = "";
    }
  };

  const handleRefine = async (isPartial = false) => {
    const contentToRefine =
      isPartial && selection ? selection.text : content || "";

    if (!contentToRefine.trim()) {
      toast.error(
        isPartial ? "Select text to refine!" : "Write content first!"
      );
      return;
    }

    setIsRefining(true);
    try {
      const prompt = `
You are a technical writing assistant.

Refine the following Markdown content to improve clarity, flow, and impact.
${
  isPartial
    ? "This is a selected snippet from a larger post. Improve it in isolation but keep the tone consistent."
    : "This is a full blog post."
}

Output rules:
- Return ONLY a valid JSON object.
- The JSON must contain a single key: "refined_content".
- The value must be valid Markdown as a string.

Content to refine:
${contentToRefine}
`;

      const response = (await chat(prompt)) as { refined_content: string };

      if (response && response.refined_content) {
        const newText = response.refined_content;

        if (isPartial && selection) {
          const currentContent = content || "";
          const updatedContent =
            currentContent.substring(0, selection.start) +
            newText +
            currentContent.substring(selection.end);

          onChange(updatedContent);
          setSelection(null);
        } else {
          onChange(newText);
        }
        toast.success(isPartial ? "Selection refined! ✨" : "Post refined! ✨");
      } else {
        throw new Error("Invalid response format from AI");
      }
    } catch (error: unknown) {
      console.error(error);
      const errorMessage =
        error instanceof Error ? error.message : "Active refinement failed";
      toast.error("Refinement failed: " + errorMessage);
    } finally {
      setIsRefining(false);
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden flex flex-col h-[600px] bg-background relative">
      {/* Floating Refine Button */}
      <AnimatePresence>
        {selection && activeTab === "write" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2 bg-popover border shadow-xl rounded-full p-1.5 px-3 items-center"
          >
            <span className="text-xs text-muted-foreground mr-2 border-r pr-2">
              {selection.text.length} chars selected
            </span>
            <button
              type="button"
              onClick={() => handleRefine(true)}
              disabled={isRefining}
              className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
            >
              <Sparkles
                size={12}
                className={isRefining ? "animate-spin" : ""}
              />
              {isRefining ? "Refining..." : "Refine Selection"}
            </button>
            <button
              onClick={() => setSelection(null)}
              className="ml-1 p-1 hover:bg-muted rounded-full text-muted-foreground"
            >
              <X size={12} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toolbar */}
      <div className="border-b p-2 bg-muted/40 flex gap-2 items-center">
        <button
          type="button"
          onClick={() => setActiveTab("write")}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors ${
            activeTab === "write"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "hover:bg-muted text-muted-foreground"
          }`}
        >
          <Edit size={14} /> Write
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("preview")}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors ${
            activeTab === "preview"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "hover:bg-muted text-muted-foreground"
          }`}
        >
          <Eye size={14} /> Preview
        </button>

        <div className="w-px h-6 bg-border mx-2" />

        <label
          className={`
          flex items-center gap-2 px-3 py-1.5 rounded-md text-sm cursor-pointer transition-colors
          hover:bg-muted text-muted-foreground
          ${isUploadingBodyImage ? "opacity-50 cursor-wait" : ""}
        `}
        >
          <ImageIcon size={14} />
          {isUploadingBodyImage ? "Uploading..." : "Insert Image"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleBodyImageUpload}
            disabled={isUploadingBodyImage}
          />
        </label>

        {/* <span className="ml-auto text-xs text-muted-foreground hidden md:block">
          Markdown Supported
        </span> */}

        {/* Global Refine Button - Only show if NO selection */}
        {!selection && (
          <button
            type="button"
            onClick={() => handleRefine(false)}
            disabled={isRefining}
            className={`
                flex ml-auto items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-all
                bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md hover:shadow-lg
                disabled:opacity-70 disabled:cursor-not-allowed
            `}
          >
            <Sparkles size={14} className={isRefining ? "animate-spin" : ""} />
            {isRefining ? "Refining..." : "Refine All"}
          </button>
        )}
      </div>

      <div className="flex-1 w-full h-full relative overflow-hidden">
        {activeTab === "write" ? (
          <textarea
            ref={textareaRef}
            onSelect={handleSelection} // Capture selection events
            onClick={handleSelection} // Redundant check to clear/update
            onKeyUp={handleSelection} // Keyboard selection check
            className="w-full h-full p-4 resize-none focus:outline-none font-mono text-sm leading-relaxed bg-background text-foreground"
            placeholder="Start writing your story here... use Markdown!"
            value={content || ""}
            onChange={(e) => onChange(e.target.value)}
          />
        ) : (
          <div className="w-full h-full p-8 overflow-auto bg-white dark:bg-black/20">
            <div className="prose prose-sm dark:prose-invert max-w-none border rounded-md p-6 min-h-[500px] bg-card">
              <MarkdownErrorBoundary>
                <ReactMarkdown
                  // remarkPlugins={[remarkGfm]} // Disabled for iOS
                  components={{
                    img: MarkdownImage,
                    a: ({ node, ...props }) => (
                      <a
                        {...props}
                        className="text-primary underline hover:text-primary/80"
                        target="_blank"
                        rel="noopener noreferrer"
                      />
                    ),
                  }}
                >
                  {content || "*No content yet*"}
                </ReactMarkdown>
              </MarkdownErrorBoundary>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
