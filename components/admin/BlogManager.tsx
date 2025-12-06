"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Database } from "@/types/supabase";
import { toast } from "sonner";
import { Loader2, Plus, Pencil, Trash2, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
type BlogPost = Database["public"]["Tables"]["blog_posts"]["Row"];
type BlogPostInsert = Database["public"]["Tables"]["blog_posts"]["Insert"];

export default function BlogManager() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<BlogPost | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<Partial<BlogPostInsert>>({});

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
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

    let error;
    if (editingItem) {
      const { error: updateError } = await supabase
        .from("blog_posts")
        .update(formData)
        .eq("id", editingItem.id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from("blog_posts")
        .insert([formData as BlogPostInsert]);
      error = insertError;
    }

    if (error) {
      toast.error("Failed to save post: " + error.message);
    } else {
      toast.success("Post saved successfully");
      setEditingItem(null);
      setIsCreating(false);
      setFormData({});
      fetchPosts();
    }
  };

  const startEdit = (item: BlogPost) => {
    setEditingItem(item);
    setFormData(item);
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
    setIsCreating(true);
  };

  if (loading)
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="animate-spin" />
      </div>
    );

  // if (editingItem || isCreating) {
  //   return (

  //   );
  // }

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
              <div>
                <label className="block text-sm font-medium mb-1">
                  Image URL
                </label>
                <input
                  type="text"
                  className="w-full p-2 rounded-md border bg-background"
                  value={formData.image_url || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, image_url: e.target.value })
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
                <div>
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">/{item.slug}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Published:{" "}
                    {item.published_at
                      ? new Date(item.published_at).toLocaleDateString()
                      : "Draft"}
                  </p>
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
