"use client";

import React, { useEffect } from "react";
import { Loader2, ArrowLeft, Calendar, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion } from "framer-motion";
import Link from "next/link";
import { Database } from "@/types/supabase";
import MarkdownImage from "@/components/blog/MarkdownImage";
import MarkdownErrorBoundary from "@/components/MarkdownErrorBoundary";

type BlogPost = Database["public"]["Tables"]["blog_posts"]["Row"] & {
  blog_post_images?: Database["public"]["Tables"]["blog_post_images"]["Row"][];
};

interface BlogPostClientProps {
  post: BlogPost | null;
}

export default function BlogPostClient({ post }: BlogPostClientProps) {
  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <h2 className="text-2xl font-bold">Post not found</h2>
        <Link
          href="/blog"
          className="text-primary hover:underline flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Blog
        </Link>
      </div>
    );
  }

  const coverImage =
    post.blog_post_images && post.blog_post_images.length > 0
      ? post.blog_post_images[0].image_url
      : null;

  return (
    <div className="min-h-screen pb-24">
      {/* Hero Section */}
      <div className="relative h-[40vh] md:h-[50vh] w-full bg-muted overflow-hidden rounded-lg">
        {coverImage && (
          <motion.img
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8 }}
            src={coverImage}
            alt={post.title}
            className="w-full h-full object-cover opacity-60"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />

        <div className="absolute bottom-0 left-0 w-full p-4 md:p-12 max-w-4xl mx-auto">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </Link>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-bold mb-4"
          >
            {post.title}
          </motion.h1>

          <div className="flex flex-wrap items-center gap-6 text-sm md:text-base text-muted-foreground">
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {post.published_at && !isNaN(Date.parse(post.published_at))
                ? new Date(post.published_at).toLocaleDateString(undefined, {
                    dateStyle: "long",
                  })
                : "Draft/Invalid Date"}
            </span>
            <span className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Eyitayo Obembe
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="container max-w-3xl mx-auto px-4 mt-12"
      >
        {post.tagline && (
          <p className="text-xl md:text-2xl text-muted-foreground font-light mb-12 italic border-l-4 border-primary pl-4">
            {post.tagline}
          </p>
        )}

        <div className="prose prose-lg dark:prose-invert max-w-none prose-img:rounded-xl prose-img:shadow-lg prose-headings:font-bold prose-a:text-primary">
          <MarkdownErrorBoundary>
            <ReactMarkdown
              // remarkPlugins={[remarkGfm]}
              components={{
                // Use our custom component for smart rendering
                img: MarkdownImage,
              }}
            >
              {post.content || ""}
            </ReactMarkdown>
          </MarkdownErrorBoundary>
        </div>
      </motion.article>
    </div>
  );
}
