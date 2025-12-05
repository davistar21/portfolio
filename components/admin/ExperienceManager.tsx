"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Database } from "@/types/supabase";
import { toast } from "sonner";
import { Loader2, Plus, Pencil, Trash2, X } from "lucide-react";

type Experience = Database["public"]["Tables"]["experience"]["Row"];
type ExperienceInsert = Database["public"]["Tables"]["experience"]["Insert"];

export default function ExperienceManager() {
  const [experienceList, setExperienceList] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<Experience | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<Partial<ExperienceInsert>>({});

  useEffect(() => {
    fetchExperience();
  }, []);

  const fetchExperience = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("experience")
      .select("*")
      .order("order_index", { ascending: true });

    if (error) {
      toast.error("Failed to fetch experience: " + error.message);
    } else {
      setExperienceList(data || []);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this experience entry?"))
      return;

    const { error } = await supabase.from("experience").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete experience: " + error.message);
    } else {
      toast.success("Experience deleted successfully");
      fetchExperience();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const experienceData = {
      ...formData,
      highlights:
        typeof formData.highlights === "string"
          ? (formData.highlights as string)
              .split("\n")
              .map((t: string) => t.trim())
              .filter(Boolean)
          : formData.highlights,
    };

    let error;
    if (editingItem) {
      const { error: updateError } = await supabase
        .from("experience")
        .update(experienceData)
        .eq("id", editingItem.id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from("experience")
        .insert([experienceData as ExperienceInsert]);
      error = insertError;
    }

    if (error) {
      toast.error("Failed to save experience: " + error.message);
    } else {
      toast.success("Experience saved successfully");
      setEditingItem(null);
      setIsCreating(false);
      setFormData({});
      fetchExperience();
    }
  };

  const startEdit = (item: Experience) => {
    setEditingItem(item);
    setFormData({
      ...item,
      highlights: item.highlights ? item.highlights : [], // Keep as array for internal state, handle display in input
    });
    setIsCreating(false);
  };

  const startCreate = () => {
    setEditingItem(null);
    setFormData({
      title: "",
      type: "job",
      organization: "",
      organization_url: "",
      location: "",
      start_date: new Date().toISOString().split("T")[0],
      end_date: null,
      description: "",
      highlights: [],
      order_index: experienceList.length,
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
            {editingItem ? "Edit Experience" : "New Experience"}
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
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                className="w-full p-2 rounded-md border bg-background"
                value={formData.title || ""}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <select
                className="w-full p-2 rounded-md border bg-background"
                value={formData.type || "job"}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    type: e.target.value as Experience["type"],
                  })
                }
              >
                <option value="job">Job</option>
                <option value="achievement">Achievement</option>
                <option value="volunteering">Volunteering</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Organization
              </label>
              <input
                type="text"
                className="w-full p-2 rounded-md border bg-background"
                value={formData.organization || ""}
                onChange={(e) =>
                  setFormData({ ...formData, organization: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Organization URL
              </label>
              <input
                type="text"
                className="w-full p-2 rounded-md border bg-background"
                value={formData.organization_url || ""}
                onChange={(e) =>
                  setFormData({ ...formData, organization_url: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <input
                type="text"
                className="w-full p-2 rounded-md border bg-background"
                value={formData.location || ""}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Start Date
              </label>
              <input
                type="date"
                className="w-full p-2 rounded-md border bg-background"
                value={formData.start_date || ""}
                onChange={(e) =>
                  setFormData({ ...formData, start_date: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                End Date (Leave empty if ongoing)
              </label>
              <input
                type="date"
                className="w-full p-2 rounded-md border bg-background"
                value={formData.end_date || ""}
                onChange={(e) =>
                  setFormData({ ...formData, end_date: e.target.value || null })
                }
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
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">
                Description (Markdown)
              </label>
              <textarea
                className="w-full p-2 rounded-md border bg-background h-32"
                value={formData.description || ""}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">
                Highlights (One per line)
              </label>
              <textarea
                className="w-full p-2 rounded-md border bg-background h-32"
                value={
                  Array.isArray(formData.highlights)
                    ? formData.highlights.join("\n")
                    : formData.highlights || ""
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    highlights: e.target.value.split("\n"),
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
              Save Experience
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Experience</h2>
        <button
          onClick={startCreate}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          <Plus className="w-4 h-4" /> Add Experience
        </button>
      </div>

      <div className="grid gap-4">
        {experienceList.map((item) => (
          <div
            key={item.id}
            className="p-4 bg-card rounded-lg border shadow-sm flex justify-between items-start"
          >
            <div>
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="text-sm font-medium">{item.organization}</p>
              <p className="text-sm text-muted-foreground">
                {item.start_date} - {item.end_date || "Present"}
              </p>
              <span className="text-xs px-2 py-1 bg-muted rounded-full mt-2 inline-block capitalize">
                {item.type}
              </span>
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
        {experienceList.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No experience entries found. Create one to get started.
          </div>
        )}
      </div>
    </div>
  );
}
