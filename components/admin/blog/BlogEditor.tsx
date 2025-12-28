import React, { useState } from "react";
import { Database } from "@/types/supabase";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import BlogMetaForm from "./BlogMetaForm";
import BlogImageManager from "./BlogImageManager";
import BlogMarkdownEditor from "./BlogMarkdownEditor";

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
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        <BlogMetaForm
          data={formData}
          onChange={(newData) => setFormData({ ...formData, ...newData })}
        />

        {/* Editor Section */}
        <BlogMarkdownEditor
          content={formData.content || ""}
          onChange={(newContent) =>
            setFormData({ ...formData, content: newContent })
          }
        />

        {/* Cover Images */}
        <BlogImageManager
          images={currentImages}
          onImagesChange={setCurrentImages}
        />

        {/* Actions */}
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
