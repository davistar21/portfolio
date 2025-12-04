"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Database } from "@/types/supabase";
import { toast } from "sonner";
import { Loader2, Plus, Pencil, Trash2, X } from "lucide-react";

type Education = Database["public"]["Tables"]["education"]["Row"];
type EducationInsert = Database["public"]["Tables"]["education"]["Insert"];

export default function EducationManager() {
  const [educationList, setEducationList] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<Education | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<Partial<EducationInsert>>({});

  useEffect(() => {
    fetchEducation();
  }, []);

  const fetchEducation = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("education")
      .select("*")
      .order("order_index", { ascending: true });

    if (error) {
      toast.error("Failed to fetch education: " + error.message);
    } else {
      setEducationList(data || []);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this education entry?"))
      return;

    const { error } = await supabase.from("education").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete education: " + error.message);
    } else {
      toast.success("Education deleted successfully");
      fetchEducation();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let error;
    if (editingItem) {
      const { error: updateError } = await supabase
        .from("education")
        .update(formData)
        .eq("id", editingItem.id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from("education")
        .insert([formData as EducationInsert]);
      error = insertError;
    }

    if (error) {
      toast.error("Failed to save education: " + error.message);
    } else {
      toast.success("Education saved successfully");
      setEditingItem(null);
      setIsCreating(false);
      setFormData({});
      fetchEducation();
    }
  };

  const startEdit = (item: Education) => {
    setEditingItem(item);
    setFormData(item);
    setIsCreating(false);
  };

  const startCreate = () => {
    setEditingItem(null);
    setFormData({
      degree: "",
      institution: "",
      start_date: new Date().toISOString().split("T")[0],
      end_date: null,
      description: "",
      order_index: educationList.length,
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
            {editingItem ? "Edit Education" : "New Education"}
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
              <label className="block text-sm font-medium mb-1">Degree</label>
              <input
                type="text"
                className="w-full p-2 rounded-md border bg-background"
                value={formData.degree || ""}
                onChange={(e) =>
                  setFormData({ ...formData, degree: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Institution
              </label>
              <input
                type="text"
                className="w-full p-2 rounded-md border bg-background"
                value={formData.institution || ""}
                onChange={(e) =>
                  setFormData({ ...formData, institution: e.target.value })
                }
                required
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
              Save Education
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Education</h2>
        <button
          onClick={startCreate}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          <Plus className="w-4 h-4" /> Add Education
        </button>
      </div>

      <div className="grid gap-4">
        {educationList.map((item) => (
          <div
            key={item.id}
            className="p-4 bg-card rounded-lg border shadow-sm flex justify-between items-start"
          >
            <div>
              <h3 className="text-lg font-semibold">{item.degree}</h3>
              <p className="text-sm font-medium">{item.institution}</p>
              <p className="text-sm text-muted-foreground">
                {item.start_date} - {item.end_date || "Present"}
              </p>
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
        {educationList.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No education entries found. Create one to get started.
          </div>
        )}
      </div>
    </div>
  );
}
