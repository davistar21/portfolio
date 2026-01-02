"use client";

import React, { useEffect } from "react";
import BlogGrid from "@/components/blog/BlogGrid";
import BlogGridSkeleton from "@/components/blog/BlogGridSkeleton";
import { useBlogStore } from "@/store/useBlogStore";
import { Loader2 } from "lucide-react";
import { AnimatePresence } from "framer-motion";

export default function BlogPage() {
  const { posts, isLoading, fetchPosts, hasLoaded } = useBlogStore();

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

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
      <AnimatePresence>
        {isLoading && !hasLoaded ? (
          <BlogGridSkeleton />
        ) : (
          <BlogGrid posts={posts} />
        )}
      </AnimatePresence>
    </div>
  );
}
