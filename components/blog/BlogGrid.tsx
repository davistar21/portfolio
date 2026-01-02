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
        // Use a repeating pattern of 7 items to create visual interest
        // Index % 7 === 0: Wide (Spans 2 cols)
        // Index % 7 === 3: Tall (Spans 2 rows)

        const isWide = index % 7 === 0;
        const isTall = index % 7 === 3;

        let spanClass = "";
        if (isWide) spanClass = "md:col-span-2";
        else if (isTall) spanClass = "row-span-2";

        return (
          <motion.div
            key={post.id}
            whileHover={{ y: -5 }}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              ease: "easeInOut",
              delay: index * 0.1,
            }}
            viewport={{ once: true }}
            className={spanClass}
          >
            <BlogCard post={post} />
          </motion.div>
        );
      })}
    </div>
  );
}
