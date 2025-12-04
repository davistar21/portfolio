"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Database } from "@/types/supabase";
import { toast } from "sonner";
import { Loader2, Plus, Pencil, Trash2, X } from "lucide-react";

type SocialLink = Database["public"]["Tables"]["social_links"]["Row"];
type SocialLinkInsert = Database["public"]["Tables"]["social_links"]["Insert"];

export default function SocialsManager() {
  const [socials, setSocials] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<SocialLink | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<Partial<SocialLinkInsert>>({});

  useEffect(() => {
    fetchSocials();
  }, []);

  const fetchSocials = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("social_links")
      .select("*")
      .order("order_index", { ascending: true });

    if (error) {
      toast.error("Failed to fetch social links: " + error.message);
    } else {
      setSocials(data || []);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this social link?")) return;

    const { error } = await supabase.from("social_links").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete social link: " + error.message);
    } else {
      toast.success("Social link deleted successfully");
      fetchSocials();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let error;
    if (editingItem) {
      const { error: updateError } = await supabase
        .from("social_links")
        .update(formData)
        .eq("id", editingItem.id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from("social_links")
        .insert([formData as SocialLinkInsert]);
      error = insertError;
    }

    if (error) {
      toast.error("Failed to save social link: " + error.message);
    } else {
      toast.success("Social link saved successfully");
      setEditingItem(null);
      setIsCreating(false);
      setFormData({});
      fetchSocials();
    }
  };

  const startEdit = (item: SocialLink) => {
    setEditingItem(item);
    setFormData(item);
    setIsCreating(false);
  };

  const startCreate = () => {
    setEditingItem(null);
    setFormData({
      platform: "GitHub",
      url: "",
      icon: "Github",
      order_index: socials.length,
    });
    setIsCreating(true);
  };

  if (loading)
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="animate-spin" />
      </div>
    );

  if (editingItem || isCreating) {
    return (
      <div className="p-6 bg-card rounded-lg border shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            {editingItem ? "Edit Social Link" : "New Social Link"}
          </h2>
          <button
            onClick={() => {
              setEditingItem(null);
              setIsCreating(false);
            }}
            className="p-2 hover:bg-muted rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Platform</label>
              <input
                type="text"
                className="w-full p-2 rounded-md border bg-background"
                value={formData.platform || ""}
                onChange={(e) =>
                  setFormData({ ...formData, platform: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">URL</label>
              <input
                type="text"
                className="w-full p-2 rounded-md border bg-background"
                value={formData.url || ""}
                onChange={(e) =>
                  setFormData({ ...formData, url: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Icon (Lucide name)
              </label>
              <input
                type="text"
                className="w-full p-2 rounded-md border bg-background"
                value={formData.icon || ""}
                onChange={(e) =>
                  setFormData({ ...formData, icon: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Order Index
              </label>
              <input
                type="number"
                className="w-full p-2 rounded-md border bg-background"
                value={formData.order_index || 0}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    order_index: parseInt(e.target.value),
                  })
                }
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={() => {
                setEditingItem(null);
                setIsCreating(false);
              }}
              className="px-4 py-2 border rounded-md hover:bg-muted"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Save Social Link
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Social Links</h2>
        <button
          onClick={startCreate}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          <Plus className="w-4 h-4" /> Add Social Link
        </button>
      </div>

      <div className="grid gap-4">
        {socials.map((item) => (
          <div
            key={item.id}
            className="p-4 bg-card rounded-lg border shadow-sm flex justify-between items-center"
          >
            <div className="flex items-center gap-4">
              <div className="p-2 bg-muted rounded-md">
                {/* We would dynamically render icon here if we had a map or dynamic import, for now just text */}
                <span className="text-xs font-mono">{item.icon}</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold">{item.platform}</h3>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  {item.url}
                </a>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => startEdit(item)}
                className="p-2 hover:bg-muted rounded-md text-blue-500"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="p-2 hover:bg-muted rounded-md text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {socials.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No social links found. Create one to get started.
          </div>
        )}
      </div>
    </div>
  );
}
