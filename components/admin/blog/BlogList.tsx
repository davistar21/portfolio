import React from "react";
import { Database } from "@/types/supabase";
import { Pencil, Trash2, Plus } from "lucide-react";
import { motion } from "framer-motion";

type BlogPost = Database["public"]["Tables"]["blog_posts"]["Row"] & {
  blog_post_images?: Database["public"]["Tables"]["blog_post_images"]["Row"][];
};

interface BlogListProps {
  posts: BlogPost[];
  onEdit: (post: BlogPost) => void;
  onDelete: (id: string) => void;
  onCreate: () => void;
}

export default function BlogList({
  posts,
  onEdit,
  onDelete,
  onCreate,
}: BlogListProps) {
  return (
    <motion.div
      key="list"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.2 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Blog Posts</h2>
        <button
          onClick={onCreate}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          <Plus className="w-4 h-4" /> Add Post
        </button>
      </div>

      <div className="grid gap-4">
        {posts.map((item) => (
          <div
            key={item.id}
            className="p-4 bg-card rounded-lg border shadow-sm flex justify-between items-start"
          >
            <div className="flex gap-4">
              {item.blog_post_images && item.blog_post_images.length > 0 && (
                <div className="w-16 h-16 rounded-lg overflow-hidden border shrink-0">
                  <img
                    src={item.blog_post_images[0].image_url}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div>
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.tagline}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  /{item.slug} • Published:{" "}
                  {item.published_at
                    ? new Date(item.published_at).toLocaleDateString()
                    : "Draft"}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(item)}
                className="p-2 hover:bg-muted rounded-md text-blue-500"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(item.id)}
                className="p-2 hover:bg-muted rounded-md text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {posts.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No posts found. Create one to get started.
          </div>
        )}
      </div>
    </motion.div>
  );
}
