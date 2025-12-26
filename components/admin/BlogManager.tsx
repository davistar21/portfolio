"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Database } from "@/types/supabase";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import BlogList from "./blog/BlogList";
import BlogEditor from "./blog/BlogEditor";

type BlogPost = Database["public"]["Tables"]["blog_posts"]["Row"] & {
  blog_post_images?: Database["public"]["Tables"]["blog_post_images"]["Row"][];
};
type BlogPostInsert = Database["public"]["Tables"]["blog_posts"]["Insert"];

export default function BlogManager() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<BlogPost | null>(null);
  const [isCreating, setIsCreating] = useState(false);

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

  const handleSubmit = async (
    formData: Partial<BlogPostInsert>,
    currentImages: string[]
  ) => {
    // Sync first image to main table for backward compatibility/previews
    const mainImageUrl = currentImages.length > 0 ? currentImages[0] : null;

    // Destructure to remove blog_post_images from the payload
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { blog_post_images, ...restFormData } = formData as BlogPost;

    const postData = {
      ...restFormData,
      image_url: mainImageUrl,
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

    // Handle Cover/Gallery Images
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
    fetchPosts();
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
        <BlogEditor
          key="cal" // Force re-mount when switching modes if needed, though key in child is better
          initialData={editingItem}
          onSubmit={handleSubmit}
          onCancel={() => {
            setEditingItem(null);
            setIsCreating(false);
          }}
        />
      ) : (
        <BlogList
          posts={posts}
          onEdit={(item) => setEditingItem(item)}
          onDelete={handleDelete}
          onCreate={() => {
            setEditingItem(null);
            setIsCreating(true);
          }}
        />
      )}
    </AnimatePresence>
  );
}
