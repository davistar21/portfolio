"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Database } from "@/types/supabase";
import { Loader2 } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import ImageUploader from "@/components/ImageUploader";

type Bio = Database["public"]["Tables"]["bio"]["Row"];

export default function BioManager() {
  const [bio, setBio] = useState<Bio | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchBio();
  }, []);

  const fetchBio = async () => {
    // Fetch the first bio entry if it exists
    const { data, error } = await supabase.from("bio").select("*").limit(1);

    setLoading(true);

    if (error) {
      toast.error("Failed to fetch bio: " + error.message);
    } else if (data && data.length > 0) {
      setBio(data[0]);
    } else {
      // No bio exists yet, that's fine
      setBio(null);
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
      <div className="p-6 bg-card rounded-lg border shadow-sm">
        <h2 className="text-2xl font-bold mb-4">Bio Management</h2>

        <div className="flex flex-col gap-4">
          <div>
            Name
            <Skeleton className="w-full h-10" />
          </div>
          <div>
            Tagline
            <Skeleton className="w-full h-10" />
          </div>
          <div>
            Description
            <Skeleton className="w-full h-30" />
          </div>
          <div>
            Profile Image URL
            <Skeleton className="w-full h-32" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-card rounded-lg border shadow-sm">
      <div className="flex justify-between gap-2 items-center">
        <h2 className="text-2xl font-bold mb-4">Bio Management</h2>

        {bio?.profile_image_url && (
          <div className="relative w-16 h-16 rounded-full overflow-hidden border">
            <img
              src={bio.profile_image_url}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>
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
                      name: e.target.value,
                      tagline: "",
                      description: "",
                      profile_image_url: "",
                      created_at: new Date().toISOString(),
                      updated_at: new Date().toISOString(),
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
            className="w-full p-2 rounded-md border bg-background h-48 scrollbar"
            value={bio?.description || ""}
            onChange={(e) =>
              setBio(bio ? { ...bio, description: e.target.value } : null)
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            Profile Image
          </label>

          <ImageUploader
            onFileSelect={async (file) => {
              if (!file) return;

              // Upload logic
              const fileExt = file.name.split(".").pop();
              const fileName = `bio-${
                crypto.randomUUID().split("-")[1]
              }.${fileExt}`;
              const filePath = `bio/${fileName}`;

              const { error: uploadError } = await supabase.storage
                .from("portfolio-assets")
                .upload(filePath, file);

              if (uploadError) {
                toast.error("Error uploading image: " + uploadError.message);
                return;
              }

              const {
                data: { publicUrl },
              } = supabase.storage
                .from("portfolio-assets")
                .getPublicUrl(filePath);

              // Delete old image if exists
              if (bio?.profile_image_url) {
                const oldUrl = bio.profile_image_url;
                if (oldUrl.includes("portfolio-assets")) {
                  const oldPath = oldUrl.split("portfolio-assets/")[1];
                  if (oldPath) {
                    await supabase.storage
                      .from("portfolio-assets")
                      .remove([oldPath]);
                  }
                }
              }

              setBio(bio ? { ...bio, profile_image_url: publicUrl } : null);
            }}
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
