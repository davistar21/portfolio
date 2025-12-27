import React, { useState, useRef } from "react";
import { Database } from "@/types/supabase";
import { toast } from "sonner";
import { X, Edit, Eye, ImageIcon, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { chat } from "@/lib/chat"; // Import the Puter chat function
import ImageUploader from "@/components/ImageUploader";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import MarkdownImage from "@/components/blog/MarkdownImage";

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
      is_active: true,
    }
  );
  const [currentImages, setCurrentImages] = useState<string[]>(
    initialData?.blog_post_images?.map((img) => img.image_url) || []
  );
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");
  const [isUploadingBodyImage, setIsUploadingBodyImage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [selection, setSelection] = useState<{
    start: number;
    end: number;
    text: string;
  } | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Handle text selection to show the floating button
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
      isPartial && selection ? selection.text : formData.content || "";

    if (!contentToRefine.trim()) {
      toast.error(
        isPartial ? "Select text to refine!" : "Write content first!"
      );
      return;
    }

    setIsRefining(true);
    try {
      // Prompt optimized for partial or full refinement
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

      const response = await chat(prompt);

      if (response && response.refined_content) {
        const newText = response.refined_content;

        if (isPartial && selection) {
          // Replace only the selected range
          const currentContent = formData.content || "";
          const updatedContent =
            currentContent.substring(0, selection.start) +
            newText +
            currentContent.substring(selection.end);

          setFormData({ ...formData, content: updatedContent });
          setSelection(null); // Clear selection after replace
        } else {
          // Replace all
          setFormData({ ...formData, content: newText });
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSubmit(formData, currentImages);
    setIsSubmitting(false);
  };

  return (
    <motion.div
      key="form"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.2 }}
      className="p-6 bg-card rounded-lg border shadow-sm max-w-6xl mx-auto relative"
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

            <div className="flex items-center gap-3 pt-6">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={formData.is_active ?? true}
                  onChange={(e) =>
                    setFormData({ ...formData, is_active: e.target.checked })
                  }
                />
                <div className="w-11 h-6 bg-muted peer-focus:outline-none ring-offset-background rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                <span className="ml-3 text-sm font-medium">
                  {formData.is_active
                    ? "Active (Visible)"
                    : "Inactive (Hidden)"}
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Editor Section */}
        <div className="border rounded-lg overflow-hidden flex flex-col h-[600px] bg-background relative">
          {/* Floating Refine Button (Partial) */}
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

            <span className="ml-auto text-xs text-muted-foreground hidden md:block">
              Markdown & GFM Supported
            </span>

            {/* Global Refine Button - Only show if NO selection (to avoid confusion) */}
            {!selection && (
              <button
                type="button"
                onClick={() => handleRefine(false)}
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
                value={formData.content || ""}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
              />
            ) : (
              <div className="w-full h-full p-8 overflow-auto bg-white dark:bg-black/20">
                <div className="prose prose-sm dark:prose-invert max-w-none border rounded-md p-6 min-h-[500px] bg-card">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      img: MarkdownImage,
                    }}
                  >
                    {formData.content || "*No content yet*"}
                  </ReactMarkdown>
                </div>
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
                  onClick={async () => {
                    if (
                      !confirm(
                        "Are you sure you want to delete this image? This cannot be undone."
                      )
                    )
                      return;

                    try {
                      // Extract path from URL
                      // URL format: .../storage/v1/object/public/portfolio-assets/blog/filename.ext
                      const path = url.split("portfolio-assets/")[1];
                      if (!path) {
                        // If we can't parse it, just remove from list to be safe
                        setCurrentImages((prev) =>
                          prev.filter((u) => u !== url)
                        );
                        return;
                      }

                      const { error: storageError } = await supabase.storage
                        .from("portfolio-assets")
                        .remove([path]);

                      if (storageError) throw storageError;

                      // Also remove from blog_post_images table if it exists there
                      const { error: dbError } = await supabase
                        .from("blog_post_images")
                        .delete()
                        .eq("image_url", url);

                      if (dbError) {
                        console.error("Error deleting from DB:", dbError);
                        // We don't throw here strictly because the image might not be in DB yet (unsaved draft case)
                        // but it's good to log.
                      }

                      setCurrentImages((prev) => prev.filter((u) => u !== url));
                      toast.success("Image deleted permanently");
                    } catch (error: unknown) {
                      console.error("Error deleting image:", error);
                      const errorMessage =
                        error instanceof Error
                          ? error.message
                          : "Failed to delete image";
                      toast.error("Failed to delete image: " + errorMessage);
                    }
                  }}
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
            className={cn(
              "px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90",
              isSubmitting ? "opacity-50 cursor-wait pointer-events-none" : ""
            )}
          >
            {isSubmitting ? "Saving..." : "Save Post"}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
