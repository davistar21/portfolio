"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Database } from "@/types/supabase";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

type Bio = Database["public"]["Tables"]["bio"]["Row"];

export default function BioManager() {
  const [bio, setBio] = useState<Bio | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchBio();
  }, []);

  const fetchBio = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("bio").select("*").single();
    if (error) {
      if (error.code !== "PGRST116") {
        // Ignore "Row not found" error for initial setup
        toast.error("Failed to fetch bio: " + error.message);
      }
    } else {
      setBio(data);
    }
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bio) return;

    setSaving(true);
    const { error } = await supabase.from("bio").upsert(bio);

    if (error) {
      toast.error("Failed to save bio: " + error.message);
    } else {
      toast.success("Bio saved successfully!");
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 bg-card rounded-lg border shadow-sm">
      <h2 className="text-2xl font-bold mb-4">Bio Management</h2>
      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            className="w-full p-2 rounded-md border bg-background"
            value={bio?.name || ""}
            onChange={(e) =>
              setBio(
                bio
                  ? { ...bio, name: e.target.value }
                  : ({
                      id: "",
                      name: e.target.value,
                      tagline: "",
                      description: "",
                      profile_image_url: "",
                      created_at: "",
                      updated_at: "",
                    } as Bio)
              )
            }
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Tagline</label>
          <input
            type="text"
            className="w-full p-2 rounded-md border bg-background"
            value={bio?.tagline || ""}
            onChange={(e) =>
              setBio(bio ? { ...bio, tagline: e.target.value } : null)
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            className="w-full p-2 rounded-md border bg-background h-32"
            value={bio?.description || ""}
            onChange={(e) =>
              setBio(bio ? { ...bio, description: e.target.value } : null)
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Profile Image URL
          </label>
          <input
            type="text"
            className="w-full p-2 rounded-md border bg-background"
            value={bio?.profile_image_url || ""}
            onChange={(e) =>
              setBio(bio ? { ...bio, profile_image_url: e.target.value } : null)
            }
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Bio"}
        </button>
      </form>
    </div>
  );
}
