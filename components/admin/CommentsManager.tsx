"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Database } from "@/types/supabase";
import { toast } from "sonner";
import { Loader2, Trash2 } from "lucide-react";

type BlogComment = Database["public"]["Tables"]["blog_comments"]["Row"];

export default function CommentsManager() {
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("blog_comments")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to fetch comments: " + error.message);
    } else {
      setComments(data || []);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    const { error } = await supabase
      .from("blog_comments")
      .delete()
      .eq("id", id);
    if (error) {
      toast.error("Failed to delete comment: " + error.message);
    } else {
      toast.success("Comment deleted successfully");
      fetchComments();
    }
  };

  if (loading)
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="animate-spin" />
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Blog Comments</h2>
      </div>

      <div className="grid gap-4">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="p-4 bg-card rounded-lg border shadow-sm"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-lg font-semibold">
                  {comment.name || "Anonymous"}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {new Date(comment.created_at).toLocaleString()}
                </p>
                {comment.email && (
                  <p className="text-xs text-muted-foreground">
                    {comment.email}
                  </p>
                )}
              </div>
              <button
                onClick={() => handleDelete(comment.id)}
                className="p-2 hover:bg-muted rounded-md text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="p-3 bg-muted/50 rounded-md text-sm whitespace-pre-wrap">
              {comment.content}
            </div>
          </div>
        ))}
        {comments.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No comments found.
          </div>
        )}
      </div>
    </div>
  );
}
