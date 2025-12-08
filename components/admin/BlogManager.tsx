"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Database } from "@/types/supabase";
import { toast } from "sonner";
import { Loader2, Plus, Pencil, Trash2, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import ImageUploader from "@/components/ImageUploader";

type BlogPost = Database["public"]["Tables"]["blog_posts"]["Row"] & {
  blog_post_images?: Database["public"]["Tables"]["blog_post_images"]["Row"][];
};
type BlogPostInsert = Database["public"]["Tables"]["blog_posts"]["Insert"];

export default function BlogManager() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<BlogPost | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<Partial<BlogPostInsert>>({});
  const [currentImages, setCurrentImages] = useState<string[]>([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*, blog_post_images(*)")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to fetch blog posts: " + error.message);
    } else {
      setPosts(data || []);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    const { error } = await supabase.from("blog_posts").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete post: " + error.message);
    } else {
      toast.success("Post deleted successfully");
      fetchPosts();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Sync first image to main table for backward compatibility
    const mainImageUrl = currentImages.length > 0 ? currentImages[0] : null;

    const postData = {
      ...formData,
      image_url: mainImageUrl, // Update the main image_url column
    };

    let error;
    let blogId = editingItem?.id;

    if (editingItem) {
      const { error: updateError } = await supabase
        .from("blog_posts")
        .update(postData)
        .eq("id", editingItem.id);
      error = updateError;
    } else {
      const { data, error: insertError } = await supabase
        .from("blog_posts")
        .insert([postData as BlogPostInsert])
        .select()
        .single();
      error = insertError;
      if (data) blogId = data.id;
    }

    if (error) {
      toast.error("Failed to save post: " + error.message);
      return;
    }

    // Handle Images
    if (blogId && currentImages.length > 0) {
      const existingUrls = new Set(
        editingItem?.blog_post_images?.map((img) => img.image_url) || []
      );
      const newImages = currentImages.filter((url) => !existingUrls.has(url));

      if (newImages.length > 0) {
        const { error: imgError } = await supabase
          .from("blog_post_images")
          .insert(
            newImages.map((url, idx) => ({
              blog_post_id: blogId!,
              image_url: url,
              order_index: idx,
            }))
          );
        if (imgError) toast.error("Failed to save images: " + imgError.message);
      }
    }

    toast.success("Post saved successfully");
    setEditingItem(null);
    setIsCreating(false);
    setFormData({});
    setCurrentImages([]);
    fetchPosts();
  };

  const startEdit = (item: BlogPost) => {
    setEditingItem(item);
    setFormData(item);
    setCurrentImages(item.blog_post_images?.map((img) => img.image_url) || []);
    setIsCreating(false);
  };

  const startCreate = () => {
    setEditingItem(null);
    setFormData({
      title: "",
      slug: "",
      content: "",
      image_url: "",
      published_at: new Date().toISOString(),
      comments_count: 0,
      likes_count: 0,
    });
    setCurrentImages([]);
    setIsCreating(true);
  };

  if (loading)
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="animate-spin" />
      </div>
    );

  return (
    <AnimatePresence mode="wait">
      {editingItem || isCreating ? (
        <motion.div
          key="form"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.2 }}
          className="p-6 bg-card rounded-lg border shadow-sm"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              {editingItem ? "Edit Post" : "New Post"}
            </h2>
            <button
              onClick={() => {
                setEditingItem(null);
                setIsCreating(false);
              }}
              className="p-2 hover:bg-muted rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Images</label>
                <div className="space-y-4">
                  {currentImages.length > 0 && (
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
                              setCurrentImages((prev) =>
                                prev.filter((u) => u !== url)
                              )
                            }
                            className="absolute top-0 right-0 p-1 bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <ImageUploader
                    onFileSelect={async (file) => {
                      if (!file) return;

                      const fileExt = file.name.split(".").pop();
                      const fileName = `blog-${
                        crypto.randomUUID().split("-")[1]
                      }.${fileExt}`;
                      const filePath = `blog/${fileName}`;

                      const { error: uploadError } = await supabase.storage
                        .from("portfolio-assets")
                        .upload(filePath, file);

                      if (uploadError) {
                        toast.error(
                          "Error uploading image: " + uploadError.message
                        );
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
              <div>
                <label className="block text-sm font-medium mb-1">
                  Published At
                </label>
                <input
                  type="datetime-local"
                  className="w-full p-2 rounded-md border bg-background"
                  value={
                    formData.published_at
                      ? new Date(formData.published_at)
                          .toISOString()
                          .slice(0, 16)
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
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">
                  Content (Markdown)
                </label>
                <textarea
                  className="w-full p-2 rounded-md border bg-background h-64 font-mono"
                  value={formData.content || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                type="button"
                onClick={() => {
                  setEditingItem(null);
                  setIsCreating(false);
                }}
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
      ) : (
        <motion.div
          key="list"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.2 }}
          className="space-y-6"
        >
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Blog Posts</h2>
            <button
              onClick={startCreate}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              <Plus className="w-4 h-4" /> Add Post
            </button>
          </div>

          <div className="grid gap-4">
            {posts.map((item) => (
              <div
                key={item.id}
                className="p-4 bg-card rounded-lg border shadow-sm flex justify-between items-start"
              >
                <div className="flex gap-4">
                  {item.blog_post_images &&
                    item.blog_post_images.length > 0 && (
                      <div className="w-16 h-16 rounded-lg overflow-hidden border shrink-0">
                        <img
                          src={item.blog_post_images[0].image_url}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  <div>
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      /{item.slug}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Published:{" "}
                      {item.published_at
                        ? new Date(item.published_at).toLocaleDateString()
                        : "Draft"}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(item)}
                    className="p-2 hover:bg-muted rounded-md text-blue-500"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 hover:bg-muted rounded-md text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            {posts.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                No posts found. Create one to get started.
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
