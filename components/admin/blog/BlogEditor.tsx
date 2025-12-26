import React, { useState, useRef } from "react";
import { Database } from "@/types/supabase";
import { toast } from "sonner";
import { X, Edit, Eye, ImageIcon, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { chat } from "@/lib/chat"; // Import the Puter chat function
import ImageUploader from "@/components/ImageUploader";
import { supabase } from "@/lib/supabase";

type BlogPostInsert = Database["public"]["Tables"]["blog_posts"]["Insert"];
type BlogPost = Database["public"]["Tables"]["blog_posts"]["Row"] & {
  blog_post_images?: Database["public"]["Tables"]["blog_post_images"]["Row"][];
};

interface BlogEditorProps {
  initialData?: BlogPost | null;
  onSubmit: (data: Partial<BlogPostInsert>, images: string[]) => Promise<void>;
  onCancel: () => void;
}

export default function BlogEditor({
  initialData,
  onSubmit,
  onCancel,
}: BlogEditorProps) {
  const [formData, setFormData] = useState<Partial<BlogPostInsert>>(
    initialData || {
      title: "",
      slug: "",
      tagline: "",
      content: "",
      image_url: "",
      published_at: new Date().toISOString(),
    }
  );
  const [currentImages, setCurrentImages] = useState<string[]>(
    initialData?.blog_post_images?.map((img) => img.image_url) || []
  );
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");
  const [isUploadingBodyImage, setIsUploadingBodyImage] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertAtCursor = (text: string) => {
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      const currentContent = formData.content || "";
      const newContent =
        currentContent.substring(0, start) +
        text +
        currentContent.substring(end);

      setFormData({ ...formData, content: newContent });

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
    } catch (error: any) {
      toast.error("Error upload image: " + error.message);
    } finally {
      setIsUploadingBodyImage(false);
      e.target.value = "";
    }
  };

  const handleRefine = async () => {
    const currentContent = formData.content || "";
    if (!currentContent.trim()) {
      toast.error("Please write some content first!");
      return;
    }

    setIsRefining(true);
    try {
      let textToRefine = currentContent;
      let selectionStart = 0;
      let selectionEnd = currentContent.length;

      if (textareaRef.current) {
        const start = textareaRef.current.selectionStart;
        const end = textareaRef.current.selectionEnd;
        if (start !== end) {
          textToRefine = currentContent.substring(start, end);
          selectionStart = start;
          selectionEnd = end;
        }
      }

      // Updated prompt to request JSON response as per user instruction and lib/chat requirements
      const prompt = `
You are a technical writing assistant.

Refine the following Markdown blog content to improve clarity, flow, and impact, while preserving the author's personal developer journey and voice.

Formatting rules (important):
- Modify, if necessary, the existing heading hierarchy to improve readability (you can add or remove heading levels only where necessary).
- Keep Markdown formatting clean and minimal.
- Use bullet points, emphasis, or code blocks only where they naturally improve readability.
- Do NOT add new sections, summaries, or conclusions, except where necessary.
- Do NOT over-style or over-format the content, if it will not improve readability.

Output rules:
- Return ONLY a valid JSON object.
- The JSON must contain a single key: "refined_content".
- The value must be valid Markdown as a string.

Content to refine:
${textToRefine}
`;

      const response = await chat(prompt);

      if (response && response.refined_content) {
        const newText = response.refined_content;

        if (selectionStart !== selectionEnd) {
          const updatedContent =
            currentContent.substring(0, selectionStart) +
            newText +
            currentContent.substring(selectionEnd);
          setFormData({ ...formData, content: updatedContent });
        } else {
          setFormData({ ...formData, content: newText });
        }
        toast.success("Content refined successfully! ✨");
      } else {
        throw new Error("Invalid response format from AI");
      }
    } catch (error: any) {
      console.error(error);
      toast.error("Refinement failed: " + error.message);
    } finally {
      setIsRefining(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData, currentImages);
  };

  return (
    <motion.div
      key="form"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.2 }}
      className="p-6 bg-card rounded-lg border shadow-sm max-w-6xl mx-auto"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          {initialData ? "Edit Post" : "New Post"}
        </h2>
        <button onClick={onCancel} className="p-2 hover:bg-muted rounded-full">
          <X className="w-5 h-5" />
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Meta Data Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                className="w-full p-2 rounded-md border bg-background"
                value={formData.title || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    title: e.target.value,
                    slug: e.target.value
                      .toLowerCase()
                      .replace(/ /g, "-")
                      .replace(/[^\w-]+/g, ""),
                  })
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Slug</label>
              <input
                type="text"
                className="w-full p-2 rounded-md border bg-background"
                value={formData.slug || ""}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
                required
              />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Tagline</label>
              <input
                type="text"
                className="w-full p-2 rounded-md border bg-background"
                placeholder="A catchy subtitle..."
                value={formData.tagline || ""}
                onChange={(e) =>
                  setFormData({ ...formData, tagline: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Published At
              </label>
              <input
                type="datetime-local"
                className="w-full p-2 rounded-md border bg-background"
                value={
                  formData.published_at
                    ? new Date(formData.published_at).toISOString().slice(0, 16)
                    : ""
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    published_at: new Date(e.target.value).toISOString(),
                  })
                }
              />
            </div>
          </div>
        </div>

        {/* Editor Section */}
        <div className="border rounded-lg overflow-hidden flex flex-col h-[600px] bg-background">
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

            <span className="ml-auto text-xs text-muted-foreground hidden md:block">
              Markdown & GFM Supported
            </span>

            <button
              type="button"
              onClick={handleRefine}
              disabled={isRefining}
              className={`
                 flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-all
                 bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md hover:shadow-lg
                 disabled:opacity-70 disabled:cursor-not-allowed
              `}
            >
              <Sparkles
                size={14}
                className={isRefining ? "animate-spin" : ""}
              />
              {isRefining ? "Refining..." : "Refine"}
            </button>
          </div>

          <div className="flex-1 w-full h-full relative overflow-hidden">
            {activeTab === "write" ? (
              <textarea
                ref={textareaRef}
                className="w-full h-full p-4 resize-none focus:outline-none font-mono text-sm leading-relaxed bg-background text-foreground"
                placeholder="Start writing your story here... use Markdown!"
                value={formData.content || ""}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
              />
            ) : (
              <div className="w-full h-full p-8 overflow-auto bg-white dark:bg-black/20">
                <article className="prose dark:prose-invert max-w-none prose-img:rounded-lg prose-img:shadow-md">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {formData.content || "*Nothing to preview yet...*"}
                  </ReactMarkdown>
                </article>
              </div>
            )}
          </div>
        </div>

        {/* Cover Images */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Cover Image (Thumbnail)
          </label>
          <p className="text-xs text-muted-foreground mb-2">
            The first image here will be used as the blog post thumbnail.
          </p>
          <div className="flex flex-wrap gap-2">
            {currentImages.map((url, idx) => (
              <div
                key={idx}
                className="relative w-20 h-20 rounded-lg overflow-hidden border group"
              >
                <img
                  src={url}
                  alt="Blog"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() =>
                    setCurrentImages((prev) => prev.filter((u) => u !== url))
                  }
                  className="absolute top-0 right-0 p-1 bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            <ImageUploader
              onFileSelect={async (file) => {
                if (!file) return;
                const fileExt = file.name.split(".").pop();
                const fileName = `blog-${
                  crypto.randomUUID().split("-")[1]
                }.${fileExt}`;
                const filePath = `blog/${fileName}`;
                const { error } = await supabase.storage
                  .from("portfolio-assets")
                  .upload(filePath, file);
                if (error) {
                  toast.error("Error: " + error.message);
                  return;
                }
                const {
                  data: { publicUrl },
                } = supabase.storage
                  .from("portfolio-assets")
                  .getPublicUrl(filePath);
                setCurrentImages((prev) => [...prev, publicUrl]);
              }}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6 border-t pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border rounded-md hover:bg-muted"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Save Post
          </button>
        </div>
      </form>
    </motion.div>
  );
}
