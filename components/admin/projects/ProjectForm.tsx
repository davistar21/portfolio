import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { Database } from "@/types/supabase";

import ProjectMetaForm from "./ProjectMetaForm";
import ProjectImageManager from "./ProjectImageManager";
import ProjectDescriptionEditor from "./ProjectDescriptionEditor";

type Project = Database["public"]["Tables"]["projects"]["Row"] & {
  project_images?: Database["public"]["Tables"]["project_images"]["Row"][];
};
type ProjectInsert = Database["public"]["Tables"]["projects"]["Insert"];

interface ProjectFormProps {
  editingProject: Project | null;
  onClose: () => void;
  onSuccess: () => void;
}

const ProjectForm = ({
  editingProject,
  onClose,
  onSuccess,
}: ProjectFormProps) => {
  const [formData, setFormData] = useState<Partial<ProjectInsert>>({});
  const [currentImages, setCurrentImages] = useState<string[]>([]);
  const [tagsInput, setTagsInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (editingProject) {
      setFormData({ ...editingProject });
      setCurrentImages(
        editingProject.project_images?.map((img) => img.image_url) || []
      );
      setTagsInput(editingProject.tags ? editingProject.tags.join(", ") : "");
    } else {
      // Initialize for new project if needed? Parent likely passed null for new.
      setFormData({
        title: "",
        slug: "",
        is_featured: false,
        description: "",
        project_url: "",
        github_url: "",
        image_url: "",
        tags: [],
        // order_index: projects.length, // Passed logic? Or parent handles default? Let's leave undefined or set 0.
        // Better if parent passes default values or we fetch max index here. Simpler to just default 0 or let user set.
      });
      setCurrentImages([]);
      setTagsInput("");
    }
  }, [editingProject]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    // Sync first image to main table for backward compatibility
    const mainImageUrl = currentImages.length > 0 ? currentImages[0] : null;

    const projectData = {
      title: formData.title,
      slug: formData.slug,
      is_featured: formData.is_featured,
      description: formData.description,
      project_url: formData.project_url,
      github_url: formData.github_url,
      image_url: mainImageUrl,
      order_index: formData.order_index,
      tags: tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0),
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
      setIsSaving(false);
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
    setIsSaving(false);
    onSuccess(); // Triggers refresh and close in parent
  };

  return (
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
        <button onClick={onClose} className="p-2 hover:bg-muted rounded-full">
          <X className="w-5 h-5" />
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <ProjectMetaForm
          formData={formData}
          setFormData={setFormData}
          tagsInput={tagsInput}
          setTagsInput={setTagsInput}
        />

        <ProjectDescriptionEditor
          formData={formData}
          setFormData={setFormData}
        />

        <ProjectImageManager
          currentImages={currentImages}
          setCurrentImages={setCurrentImages}
          editingProject={editingProject}
        />

        <div className="flex justify-end gap-2 mt-6">
          <button
            type="button"
            onClick={onClose}
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
  );
};

export default ProjectForm;
