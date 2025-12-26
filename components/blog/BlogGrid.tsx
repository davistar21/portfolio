"use client";

import { motion } from "framer-motion";
import BlogCard from "./BlogCard";
import { Database } from "@/types/supabase";

type BlogPost = Database["public"]["Tables"]["blog_posts"]["Row"] & {
  blog_post_images?: Database["public"]["Tables"]["blog_post_images"]["Row"][];
};

interface BlogGridProps {
  posts: BlogPost[];
}

export default function BlogGrid({ posts }: BlogGridProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        <p>No posts published yet. Stay tuned!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[minmax(300px,auto)]">
      {posts.map((post, index) => {
        // Bento Logic:
        // First item spans 2 cols if on desktop (lg)
        // Every 4th item spans 2 cols
        const isFeatured = index === 0;
        const isWide = index % 4 === 0 && index !== 0;

        let spanClass = "";
        if (isFeatured) spanClass = "lg:col-span-2 lg:row-span-2";
        else if (isWide) spanClass = "md:col-span-2";

        return <BlogCard key={post.id} post={post} className={spanClass} />;
      })}
    </div>
  );
}
