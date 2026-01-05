import React from "react";
import BlogGrid from "@/components/blog/BlogGrid";
import { supabase } from "@/lib/supabase";
import { Database } from "@/types/supabase";

export const revalidate = 60; // ISR: Revalidate every 60 seconds

type BlogPost = Database["public"]["Tables"]["blog_posts"]["Row"] & {
  blog_post_images?: Database["public"]["Tables"]["blog_post_images"]["Row"][];
};

async function getBlogPosts(): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*, blog_post_images(*)")
    .eq("is_active", true) // Only published posts
    .not("published_at", "is", null) // Ensure published_at is present
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Error fetching blog posts:", error);
    return [];
  }

  return data as unknown as BlogPost[];
}

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <div className="container px-4 py-14 min-h-screen">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold pb-4 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
          Thoughts & Stories
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Exploring code, design, and the journey of building products.
        </p>
      </div>

      {/* 
        We pass the server-fetched posts directly to BlogGrid.
        Client-side loading skeleton is no longer needed on initial load 
        because logic is now server-first.
      */}
      <BlogGrid posts={posts} />
    </div>
  );
}
