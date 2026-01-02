"use client";
import { useBlogStore } from "@/store/useBlogStore";
import { usePathname } from "next/navigation";
import BlogCard from "./BlogCard";
import { useEffect, useMemo } from "react";
import { Skeleton } from "../ui/skeleton";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const BlogPreview = () => {
  const { posts, isLoading, hasLoaded, fetchPosts } = useBlogStore();
  const pathname = usePathname();

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);
  const randomPostIndex = useMemo(() => {
    const index = Math.floor(Math.random() * posts.length);
    return index;
  }, [pathname]);

  return (
    <div>
      <div className="flex justify-between items-end mb-8">
        <h2 className="font-semibold text-xl md:text-2xl flex items-center gap-3">
          {/* <span className="bg-primary/20 text-primary p-2 rounded-xl text-xl">
                      ⚡
                    </span> */}
          Blog
        </h2>

        <Link
          href="/blog"
          className="group flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
        >
          View All{" "}
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
      <AnimatePresence mode="wait">
        {isLoading && !hasLoaded ? (
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            viewport={{ once: true }}
            className={`group relative overflow-hidden rounded-xl bg-card border shadow-sm flex flex-col`}
          >
            {/* Image Skeleton */}
            <div className="relative w-full h-48 sm:h-56 overflow-hidden">
              <Skeleton className="w-full h-full" />
            </div>

            {/* Content Skeleton */}
            <div className="p-5 flex flex-col flex-1 gap-3">
              <div className="flex gap-2 mb-1">
                <Skeleton className="w-16 h-4 rounded-full" />
                <Skeleton className="w-20 h-4 rounded-full" />
              </div>

              <Skeleton className="w-3/4 h-8" />
              <Skeleton className="w-full h-4" />
              <Skeleton className="w-2/3 h-4" />

              <div className="mt-auto pt-4 flex items-center justify-between">
                <Skeleton className="w-24 h-4" />
                <Skeleton className="w-8 h-8 rounded-full" />
              </div>
            </div>
          </motion.div>
        ) : posts.length > 0 && posts[randomPostIndex] ? (
          <motion.div
            whileHover={{ y: -5 }}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            // viewport={{ once: true }}
          >
            <BlogCard post={posts[randomPostIndex]} />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center py-20 border rounded-xl border-dashed"
          >
            <p className="text-muted-foreground">
              No posts found. Check back soon!
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BlogPreview;
