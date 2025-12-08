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
  const [isSaving, setIsSaving] = useState(false);
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
    setIsSaving(true);
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

    // Handle Images
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
    setIsSaving(false);
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

  if (loading)
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="animate-spin" />
      </div>
    );

  return (
    <AnimatePresence mode="popLayout">
      {editingProject || isCreating ? (
        <motion.div
          key="form"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.2 }}
          className="p-6 bg-card rounded-lg border shadow-sm"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              {editingProject ? "Edit Project" : "New Project"}
            </h2>
            <button
              onClick={() => {
                setEditingProject(null);
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
              <div>
                <label className="block text-sm font-medium mb-1">
                  Project URL
                </label>
                <input
                  type="text"
                  className="w-full p-2 rounded-md border bg-background"
                  value={formData.project_url || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, project_url: e.target.value })
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
                <label className="block text-sm font-medium mb-3">
                  Project Images
                </label>
                <div className="space-y-4">
                  <AnimatePresence mode="wait">
                    {currentImages.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {currentImages.map((url, idx) => (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.2 }}
                            key={idx}
                            className="relative w-24 h-24 rounded-lg overflow-hidden border group"
                          >
                            <img
                              src={url}
                              alt="Project"
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={async () => {
                                if (url.includes("portfolio-assets")) {
                                  const path =
                                    url.split("portfolio-assets/")[1];
                                  if (path) {
                                    const { error } = await supabase.storage
                                      .from("portfolio-assets")
                                      .remove([path]);
                                    if (error) {
                                      toast.error(
                                        "Failed to delete image file"
                                      );
                                      return;
                                    }
                                  }
                                }
                                setCurrentImages((prev) =>
                                  prev.filter((u) => u !== url)
                                );
                              }}
                              className="absolute top-1 right-1 p-1 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </AnimatePresence>
                  <ImageUploader
                    multiple={true}
                    onFilesSelect={async (files) => {
                      if (!files || files.length === 0) return;

                      const uploads = files.map(async (file) => {
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
                          return null;
                        }

                        const {
                          data: { publicUrl },
                        } = supabase.storage
                          .from("portfolio-assets")
                          .getPublicUrl(filePath);

                        return publicUrl;
                      });

                      const results = await Promise.all(uploads);
                      const successfulUploads = results.filter(
                        (url): url is string => url !== null
                      );
                      setCurrentImages((prev) => [
                        ...prev,
                        ...successfulUploads,
                      ]);
                    }}
                  />
                </div>
              </div>
              <div>
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
            <div className="flex justify-end gap-2 mt-6">
              <button
                type="button"
                onClick={() => {
                  setEditingProject(null);
                  setIsCreating(false);
                }}
                className="px-4 py-2 border rounded-md hover:bg-muted"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90  disabled:opacity-50"
              >
                {isSaving ? "Saving..." : "Save Project"}
              </button>
            </div>
          </form>
        </motion.div>
      ) : (
        <motion.div
          key="list"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.2 }}
          className="space-y-6"
        >
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Projects</h2>
            <button
              onClick={startCreate}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              <Plus className="w-4 h-4" /> Add Project
            </button>
          </div>

          <div className="grid gap-4">
            {projects.map((project) => (
              <div
                key={project.id}
                className="p-4 bg-card rounded-lg border shadow-sm flex flex-col md:flex-row justify-between items-start max-sm:w-fit mx-auto"
              >
                <div className="flex gap-4 flex-col md:flex-row max-sm:max-w-xs">
                  {project.project_images &&
                    project.project_images.length > 0 && (
                      <div className="w-full h-auto  md:w-16 md:h-16 rounded-lg overflow-hidden border shrink-0">
                        <img
                          src={project.project_images[0].image_url}
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  <div>
                    <h3 className="text-lg font-semibold">{project.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {project.description}
                    </p>
                    <div className="flex gap-2 mt-2 overflow-x-auto py-4">
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
                <div className="flex gap-2 w-full max-sm:justify-evenly max-sm:pt-6">
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
        </motion.div>
      )}
    </AnimatePresence>
  );
}
