"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Database } from "@/types/supabase";
import { toast } from "sonner";
import { Loader2, Plus, Pencil, Trash2, X } from "lucide-react";

type Skill = Database["public"]["Tables"]["skills"]["Row"];
type SkillInsert = Database["public"]["Tables"]["skills"]["Insert"];

export default function SkillsManager() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<Partial<SkillInsert>>({});

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("skills")
      .select("*")
      .order("order_index", { ascending: true });

    if (error) {
      toast.error("Failed to fetch skills: " + error.message);
    } else {
      setSkills(data || []);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this skill?")) return;

    const { error } = await supabase.from("skills").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete skill: " + error.message);
    } else {
      toast.success("Skill deleted successfully");
      fetchSkills();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let error;
    if (editingSkill) {
      const { error: updateError } = await supabase
        .from("skills")
        .update(formData)
        .eq("id", editingSkill.id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from("skills")
        .insert([formData as SkillInsert]);
      error = insertError;
    }

    if (error) {
      toast.error("Failed to save skill: " + error.message);
    } else {
      toast.success("Skill saved successfully");
      setEditingSkill(null);
      setIsCreating(false);
      setFormData({});
      fetchSkills();
    }
  };

  const startEdit = (skill: Skill) => {
    setEditingSkill(skill);
    setFormData(skill);
    setIsCreating(false);
  };

  const startCreate = () => {
    setEditingSkill(null);
    setFormData({
      name: "",
      type: "Frontend",
      proficiency: 50,
      icon: "",
      order_index: skills.length,
    });
    setIsCreating(true);
  };

  if (loading)
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="animate-spin" />
      </div>
    );

  if (editingSkill || isCreating) {
    return (
      <div className="p-6 bg-card rounded-lg border shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            {editingSkill ? "Edit Skill" : "New Skill"}
          </h2>
          <button
            onClick={() => {
              setEditingSkill(null);
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
              <label className="block text-sm font-medium mb-1">Type</label>
              <select
                className="w-full p-2 rounded-md border bg-background"
                value={formData.type || "Frontend"}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
              >
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="Design">Design</option>
                <option value="Tools">Tools</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Proficiency (1-100)
              </label>
              <input
                type="number"
                min="1"
                max="100"
                className="w-full p-2 rounded-md border bg-background"
                value={formData.proficiency || 50}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    proficiency: parseInt(e.target.value),
                  })
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
            <div>
              <label className="block text-sm font-medium mb-1">
                Icon (Lucide name or URL)
              </label>
              <input
                type="text"
                className="w-full p-2 rounded-md border bg-background"
                value={formData.icon || ""}
                onChange={(e) =>
                  setFormData({ ...formData, icon: e.target.value })
                }
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={() => {
                setEditingSkill(null);
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
              Save Skill
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Skills</h2>
        <button
          onClick={startCreate}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          <Plus className="w-4 h-4" /> Add Skill
        </button>
      </div>

      <div className="grid gap-4">
        {skills.map((skill) => (
          <div
            key={skill.id}
            className="p-4 bg-card rounded-lg border shadow-sm flex justify-between items-center"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-lg font-bold">
                {skill.proficiency}%
              </div>
              <div>
                <h3 className="text-lg font-semibold">{skill.name}</h3>
                <p className="text-sm text-muted-foreground">{skill.type}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => startEdit(skill)}
                className="p-2 hover:bg-muted rounded-md text-blue-500"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(skill.id)}
                className="p-2 hover:bg-muted rounded-md text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {skills.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No skills found. Create one to get started.
          </div>
        )}
      </div>
    </div>
  );
}
