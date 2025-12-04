"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Database } from "@/types/supabase";
import { toast } from "sonner";
import { Loader2, Plus, Pencil, Trash2, X } from "lucide-react";

type Testimonial = Database["public"]["Tables"]["testimonials"]["Row"];
type TestimonialInsert = Database["public"]["Tables"]["testimonials"]["Insert"];

export default function TestimonialsManager() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<Partial<TestimonialInsert>>({});

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .order("order_index", { ascending: true });

    if (error) {
      toast.error("Failed to fetch testimonials: " + error.message);
    } else {
      setTestimonials(data || []);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;

    const { error } = await supabase.from("testimonials").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete testimonial: " + error.message);
    } else {
      toast.success("Testimonial deleted successfully");
      fetchTestimonials();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let error;
    if (editingItem) {
      const { error: updateError } = await supabase
        .from("testimonials")
        .update(formData)
        .eq("id", editingItem.id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from("testimonials")
        .insert([formData as TestimonialInsert]);
      error = insertError;
    }

    if (error) {
      toast.error("Failed to save testimonial: " + error.message);
    } else {
      toast.success("Testimonial saved successfully");
      setEditingItem(null);
      setIsCreating(false);
      setFormData({});
      fetchTestimonials();
    }
  };

  const startEdit = (item: Testimonial) => {
    setEditingItem(item);
    setFormData(item);
    setIsCreating(false);
  };

  const startCreate = () => {
    setEditingItem(null);
    setFormData({
      name: "",
      role: "",
      company: "",
      message: "",
      image_url: "",
      order_index: testimonials.length,
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
            {editingItem ? "Edit Testimonial" : "New Testimonial"}
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
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                className="w-full p-2 rounded-md border bg-background"
                value={formData.name || ""}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Role</label>
              <input
                type="text"
                className="w-full p-2 rounded-md border bg-background"
                value={formData.role || ""}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Company</label>
              <input
                type="text"
                className="w-full p-2 rounded-md border bg-background"
                value={formData.company || ""}
                onChange={(e) =>
                  setFormData({ ...formData, company: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Image URL
              </label>
              <input
                type="text"
                className="w-full p-2 rounded-md border bg-background"
                value={formData.image_url || ""}
                onChange={(e) =>
                  setFormData({ ...formData, image_url: e.target.value })
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
              <label className="block text-sm font-medium mb-1">Message</label>
              <textarea
                className="w-full p-2 rounded-md border bg-background h-32"
                value={formData.message || ""}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                required
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
              Save Testimonial
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Testimonials</h2>
        <button
          onClick={startCreate}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          <Plus className="w-4 h-4" /> Add Testimonial
        </button>
      </div>

      <div className="grid gap-4">
        {testimonials.map((item) => (
          <div
            key={item.id}
            className="p-4 bg-card rounded-lg border shadow-sm flex justify-between items-start"
          >
            <div className="flex gap-4">
              {item.image_url && (
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              )}
              <div>
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {item.role} at {item.company}
                </p>
                <p className="text-sm mt-2 line-clamp-2">"{item.message}"</p>
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
        {testimonials.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No testimonials found. Create one to get started.
          </div>
        )}
      </div>
    </div>
  );
}
