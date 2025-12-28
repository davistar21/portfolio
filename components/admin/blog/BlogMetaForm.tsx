import React from "react";
import { Database } from "@/types/supabase";

type BlogPostInsert = Database["public"]["Tables"]["blog_posts"]["Insert"];

interface BlogMetaFormProps {
  data: Partial<BlogPostInsert>;
  onChange: (data: Partial<BlogPostInsert>) => void;
}

export default function BlogMetaForm({ data, onChange }: BlogMetaFormProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            className="w-full p-2 rounded-md border bg-background"
            value={data.title || ""}
            onChange={(e) =>
              onChange({
                ...data,
                title: e.target.value,
                slug: e.target.value
                  .toLowerCase()
                  .replace(/ /g, "-")
                  .replace(/[^\w-]+/g, ""),
              })
            }
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Slug</label>
          <input
            type="text"
            className="w-full p-2 rounded-md border bg-background"
            value={data.slug || ""}
            onChange={(e) => onChange({ ...data, slug: e.target.value })}
            required
          />
        </div>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Tagline</label>
          <input
            type="text"
            className="w-full p-2 rounded-md border bg-background"
            placeholder="A catchy subtitle..."
            value={data.tagline || ""}
            onChange={(e) => onChange({ ...data, tagline: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Published At</label>
          <input
            type="datetime-local"
            className="w-full p-2 rounded-md border bg-background"
            value={
              data.published_at
                ? new Date(data.published_at).toISOString().slice(0, 16)
                : ""
            }
            onChange={(e) =>
              onChange({
                ...data,
                published_at: new Date(e.target.value).toISOString(),
              })
            }
          />
        </div>

        <div className="flex items-center gap-3 pt-6">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={data.is_active ?? true}
              onChange={(e) =>
                onChange({ ...data, is_active: e.target.checked })
              }
            />
            <div className="w-11 h-6 bg-muted peer-focus:outline-none ring-offset-background rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
            <span className="ml-3 text-sm font-medium">
              {data.is_active ? "Active (Visible)" : "Inactive (Hidden)"}
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}
