import { create } from "zustand";
import { supabase } from "@/lib/supabase";
import { Database } from "@/types/supabase";

type BlogPost = Database["public"]["Tables"]["blog_posts"]["Row"] & {
  blog_post_images?: Database["public"]["Tables"]["blog_post_images"]["Row"][];
};

interface BlogStore {
  posts: BlogPost[];
  isLoading: boolean;
  error: string | null;
  hasLoaded: boolean;
  fetchPosts: () => Promise<void>;
  getPostBySlug: (slug: string) => BlogPost | undefined;
}

export const useBlogStore = create<BlogStore>((set, get) => ({
  posts: [],
  isLoading: false,
  error: null,
  hasLoaded: false,

  fetchPosts: async () => {
    // If already loaded and not force refreshing, we could skip,
    // but usually a soft refresh is good. For now, strict caching:
    if (get().hasLoaded) return;

    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*, blog_post_images(*)")
        .not("published_at", "is", null) // Only published posts
        .eq("is_active", true) // Only active posts
        .order("published_at", { ascending: false });

      if (error) throw error;

      set({ posts: data || [], isLoading: false, hasLoaded: true });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  getPostBySlug: (slug: string) => {
    return get().posts.find((p) => p.slug === slug);
  },
}));
