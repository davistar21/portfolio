"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Database } from "@/types/supabase";
import { toast } from "sonner";
import { Loader2, Plus, Pencil, Trash2, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { AnimatePresence, motion } from "framer-motion";
import ImageUploader from "@/components/ImageUploader";

type Project = Database["public"]["Tables"]["projects"]["Row"] & {
  project_images?: Database["public"]["Tables"]["project_images"]["Row"][];
};
type ProjectInsert = Database["public"]["Tables"]["projects"]["Insert"];

export default function ProjectsManager() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<Partial<ProjectInsert>>({});
  const [currentImages, setCurrentImages] = useState<string[]>([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("projects")
      .select("*, project_images(*)")
      .order("order_index", { ascending: true });

    if (error) {
      toast.error("Failed to fetch projects: " + error.message);
    } else {
      setProjects(data || []);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete project: " + error.message);
    } else {
      toast.success("Project deleted successfully");
      fetchProjects();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Sync first image to main table for backward compatibility
    const mainImageUrl = currentImages.length > 0 ? currentImages[0] : null;

    const projectData = {
      ...formData,
      image_url: mainImageUrl, // Update the main image_url column
      tags:
        typeof formData.tags === "string"
          ? (formData.tags as string).split(",").map((t: string) => t.trim())
          : formData.tags,
    };

    let error;
    let projectId = editingProject?.id;

    if (editingProject) {
      const { error: updateError } = await supabase
        .from("projects")
        .update(projectData)
        .eq("id", editingProject.id);
      error = updateError;
    } else {
      const { data, error: insertError } = await supabase
        .from("projects")
        .insert([projectData as ProjectInsert])
        .select()
        .single();
      error = insertError;
      if (data) projectId = data.id;
    }

    if (error) {
      toast.error("Failed to save project: " + error.message);
      return;
    }

    // Handle Image Saving.
    // We only insert NEW images effectively. Or simplistic approach:
    // User requirement: "Store the resulting public image URL in the appropriate image table".
    // For simplicity in this "Replace text field" task, we will assume images in `currentImages` that are NOT already in DB need insertion?
    // Actually, `currentImages` is just strings.
    // If we are editing, we might have old images.
    // Simplest robust logic:
    // 1. We have `currentImages` (URLs).
    // 2. We have `projectId`.
    // 3. Insert all `currentImages` that satisfy the check?
    // Better: Just insert ALL into `project_images`? No, duplicates.
    // Since we are "Replacing text fields", and likely starting fresh for many, or appending.
    // I made `currentImages` just a list of *newly uploaded* URLs + existing ones?
    // Let's iterate `currentImages`. If it already exists in `editingProject.project_images`, skip. Else insert.

    if (projectId && currentImages.length > 0) {
      const existingUrls = new Set(
        editingProject?.project_images?.map((img) => img.image_url) || []
      );
      const newImages = currentImages.filter((url) => !existingUrls.has(url));

      if (newImages.length > 0) {
        const { error: imgError } = await supabase
          .from("project_images")
          .insert(
            newImages.map((url, idx) => ({
              project_id: projectId!,
              image_url: url,
              order_index: idx,
            }))
          );
        if (imgError) toast.error("Failed to save images: " + imgError.message);
      }
    }

    toast.success("Project saved successfully");
    setEditingProject(null);
    setIsCreating(false);
    setFormData({});
    setCurrentImages([]);
    fetchProjects();
  };

  const startEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      ...project,
      tags: project.tags ? project.tags : [],
    });
    // Load existing images into state
    setCurrentImages(project.project_images?.map((img) => img.image_url) || []);
    setIsCreating(false);
  };

  const startCreate = () => {
    setEditingProject(null);
    setFormData({
      title: "",
      description: "",
      project_url: "",
      github_url: "",
      image_url: "",
      tags: [],
      order_index: projects.length,
    });
    setCurrentImages([]);
    setIsCreating(true);
  };

  const allObjs = {
    startCreate,
    setEditingProject,
    editingProject,
    isCreating,
    setIsCreating,
    handleSubmit,
    formData,
    setFormData,
    currentImages,
    setCurrentImages,
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
        <h2 className="text-2xl font-bold">Projects</h2>
        <AddProjectDialog {...allObjs} />
      </div>

      <div className="grid gap-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="p-4 bg-card rounded-lg border shadow-sm flex justify-between items-start"
          >
            <div className="flex gap-4">
              {project.project_images && project.project_images.length > 0 && (
                <img
                  src={project.project_images[0].image_url}
                  alt={project.title}
                  className="w-16 h-16 rounded object-cover border"
                />
              )}
              <div>
                <h3 className="text-lg font-semibold">{project.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {project.description}
                </p>
                <div className="flex gap-2 mt-2">
                  {project.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-1 bg-muted rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => startEdit(project)}
                className="p-2 hover:bg-muted rounded-md text-blue-500"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(project.id)}
                className="p-2 hover:bg-muted rounded-md text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {projects.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No projects found. Create one to get started.
          </div>
        )}
      </div>
    </div>
  );
}

interface ProjectDialogProps {
  startCreate: () => void;
  setEditingProject: (editingProject: Project | null) => void;
  isCreating: boolean;
  setIsCreating: (isCreating: boolean) => void;
  handleSubmit: (e: React.FormEvent) => void;

  formData: Partial<ProjectInsert>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<ProjectInsert>>>;

  editingProject: Project | null;
  currentImages: string[];
  setCurrentImages: React.Dispatch<React.SetStateAction<string[]>>;
}

const AddProjectDialog = ({
  startCreate,
  setEditingProject,
  editingProject,
  isCreating,
  setIsCreating,
  handleSubmit,
  formData,
  setFormData,
  currentImages,
  setCurrentImages,
}: ProjectDialogProps) => {
  const isOpen = !!isCreating || !!editingProject;

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setIsCreating(false);
      setEditingProject(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <button
          onClick={startCreate}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          <Plus className="w-4 h-4" /> Add Project
        </button>
      </DialogTrigger>

      <DialogContent className="h-[90vh] overflow-y-auto scrollbar sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {editingProject ? "Edit Project" : "New Project"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
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
                  setFormData({
                    ...formData,
                    description: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Project URL
              </label>
              <input
                type="text"
                className="w-full p-2 rounded-md border bg-background"
                value={formData.project_url || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    project_url: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                GitHub URL
              </label>
              <input
                type="text"
                className="w-full p-2 rounded-md border bg-background"
                value={formData.github_url || ""}
                onChange={(e) =>
                  setFormData({ ...formData, github_url: e.target.value })
                }
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">
                Project Images
              </label>
              <div className="space-y-4">
                {currentImages.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {currentImages.map((url, idx) => (
                      <div
                        key={idx}
                        className="relative w-20 h-20 rounded-lg overflow-hidden border group"
                      >
                        <img
                          src={url}
                          alt="Project"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                    <ImageUploader
                      onFileSelect={async (file) => {
                        if (!file) return;

                        const fileExt = file.name.split(".").pop();
                        const fileName = `project-${
                          crypto.randomUUID().split("-")[1]
                        }.${fileExt}`;
                        const filePath = `projects/${fileName}`;

                        const { error: uploadError } = await supabase.storage
                          .from("portfolio-assets")
                          .upload(filePath, file);

                        if (uploadError) {
                          toast.error(
                            "Error uploading image: " + uploadError.message
                          );
                          return;
                        }

                        const {
                          data: { publicUrl },
                        } = supabase.storage
                          .from("portfolio-assets")
                          .getPublicUrl(filePath);

                        setCurrentImages((prev) => [...prev, publicUrl]);
                      }}
                    />
                  </div>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  className="w-full p-2 rounded-md border bg-background"
                  value={
                    Array.isArray(formData.tags)
                      ? formData.tags.join(", ")
                      : formData.tags || ""
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      tags: e.target.value
                        .split(",")
                        .map((t: string) => t.trim()),
                    })
                  }
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={() => handleOpenChange(false)}
              className="px-4 py-2 border rounded-md hover:bg-muted"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Save Project
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
