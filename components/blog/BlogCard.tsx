// BlogCard.tsx
import React from "react";
import { motion } from "framer-motion";
import { MessageCircle, Eye } from "lucide-react";
import { BlogPost } from "@/mockData";

// Assume these are shadcn/ui components
// import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";

interface BlogCardProps {
  post: BlogPost;
  onReadMore: (postId: string) => void;
}

const BlogCard: React.FC<BlogCardProps> = ({ post, onReadMore }) => {
  return (
    <motion.div
      // Replace Card with a styled div for simplicity, applying shadcn/tailwind classes
      className="rounded-lg border bg-card text-card-foreground shadow-lg overflow-hidden cursor-pointer h-full"
      // Framer Motion Hover Effects
      whileHover={{ y: -5, boxShadow: "0 10px 15px rgba(0,0,0,0.15)" }}
      transition={{ type: "spring", stiffness: 300 }}
      onClick={() => onReadMore(post.id)}
    >
      <img
        src={post.imageUrl}
        alt={post.imageAlt}
        className="w-full h-52 object-cover"
      />

      <div className="p-4">
        {/* CardHeader */}
        <h3 className="text-xl font-semibold text-primary mb-2 truncate">
          {post.title}
        </h3>
        <p className="text-sm text-muted-foreground mb-3">
          By **{post.author}** | {post.date} | Track: *{post.track}*
        </p>

        {/* CardContent */}
        <p className="text-sm line-clamp-3">{post.excerpt}</p>

        <div className="flex flex-wrap gap-2 my-4">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500 pt-3 border-t">
          <span className="flex items-center">
            <Eye className="w-4 h-4 mr-1 text-muted-foreground" />
            {post.reads.toLocaleString()} Reads
          </span>
          <span className="flex items-center">
            <MessageCircle className="w-4 h-4 mr-1 text-muted-foreground" />
            {post.comments} Comments
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default BlogCard;
