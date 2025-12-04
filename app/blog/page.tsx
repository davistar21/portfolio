"use client";
// Blog.tsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Zap } from "lucide-react";
import { blogPosts, BlogPost } from "@/mockData";
import BlogCard from "@/components/blog/BlogCard";
import BlogPostDetail from "@/components/blog/BlogPostDetail";

// Assume Button is imported from "@/components/ui/button"

const Blog: React.FC = () => {
  // State to simulate navigation between list and detail view
  const [view, setView] = useState<"list" | "detail">("list");
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(
    blogPosts[0]
  );

  // Function to switch view and select the post
  const handleReadMore = (postId: string) => {
    const post = blogPosts.find((p) => p.id === postId);
    if (post) {
      setSelectedPost(post);
      setView("detail");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <AnimatePresence mode="wait">
        {view === "detail" && selectedPost ? (
          <motion.div
            key="detail"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            {/* Button uses shadcn/tailwind styles */}
            <motion.button
              onClick={() => setView("list")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 py-2 px-4 mt-5 ml-8"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Posts
            </motion.button>
            <BlogPostDetail post={selectedPost} />
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.3 }}
            className="p-4 sm:p-8 max-w-7xl mx-auto"
          >
            <h1 className="text-3xl sm:text-4xl font-bold text-center mb-10 pt-5 flex items-center justify-center">
              <Zap className="w-8 h-8 mr-3 text-primary" />
              Eyitayo&apos;s Tech & Impact Insights
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.map((post) => (
                <BlogCard
                  key={post.id}
                  post={post}
                  onReadMore={handleReadMore}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Blog;
