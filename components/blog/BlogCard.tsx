import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, Calendar, ArrowRight } from "lucide-react";
import { Database } from "@/types/supabase";

type BlogPost = Database["public"]["Tables"]["blog_posts"]["Row"] & {
  blog_post_images?: Database["public"]["Tables"]["blog_post_images"]["Row"][];
};

interface BlogCardProps {
  post: BlogPost;
  className?: string; // Allow bento grid styling (row/col spans)
}

export default function BlogCard({ post, className = "" }: BlogCardProps) {
  // Use first image as thumbnail, or fallback
  const thumbnail =
    post.blog_post_images && post.blog_post_images.length > 0
      ? post.blog_post_images[0].image_url
      : null;

  return (
    <motion.div
      layout
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className={`group relative overflow-hidden rounded-2xl bg-card border border-border shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full ${className}`}
    >
      <Link href={`/blog/${post.slug}`} className="absolute inset-0 z-10">
        <span className="sr-only">Read {post.title}</span>
      </Link>

      {/* Image Section - Logic for Bento: If it's a large card, maybe show more image? 
          For now, standardized cover image or gradient fallback */}
      {thumbnail ? (
        <div className="relative h-48 w-full overflow-hidden">
          <img
            src={thumbnail}
            alt={post.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent opacity-60" />
        </div>
      ) : (
        <div className="h-32 w-full bg-gradient-to-br from-primary/10 to-secondary/10" />
      )}

      <div className="flex flex-col flex-1 p-6 pt-4 h-full">
        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3 font-mono uppercase tracking-wider">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {post.published_at
              ? new Date(post.published_at).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "Draft"}
          </span>
        </div>

        <h3 className="text-xl font-bold mb-3 leading-tight group-hover:text-primary transition-colors">
          {post.title}
        </h3>

        {/* Preview Text - Fills available space with line clamp */}
        <div className="flex-1 min-h-0">
          <p className="text-muted-foreground text-sm leading-relaxed line-clamp-4">
            {post.tagline ||
              (post.content
                ? post.content.replace(/[*#_`\[\]]/g, "").slice(0, 200)
                : "")}
          </p>
        </div>

        <div className="mt-4 flex items-center text-primary text-xs font-bold uppercase tracking-widest opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
          Read Article <ArrowRight className="w-3 h-3 ml-2" />
        </div>
      </div>
    </motion.div>
  );
}
