import React, { useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { Database } from "@/types/supabase";
import { useAdminDraft } from "@/hooks/useLocalStorageState";

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
  // Use localStorage-backed state for draft persistence
  const [formData, setFormData, clearFormDraft] = useAdminDraft<
    Partial<ProjectInsert>
  >(
    "project",
    editingProject?.id,
    editingProject || {
      title: "",
      slug: "",
      is_featured: false,
      description: "",
      project_url: "",
      github_url: "",
      image_url: "",
      tags: [],
    },
  );

  const [currentImages, setCurrentImages, clearImagesDraft] = useAdminDraft<
    string[]
  >(
    "project",
    editingProject?.id ? `${editingProject.id}-images` : "new-images",
    editingProject?.project_images?.map((img) => img.image_url) || [],
  );

  const [tagsInput, setTagsInput, clearTagsDraft] = useAdminDraft<string>(
    "project",
    editingProject?.id ? `${editingProject.id}-tags` : "new-tags",
    editingProject?.tags ? editingProject.tags.join(", ") : "",
  );

  const [isSaving, setIsSaving] = useState(false);

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

    // Handle Images - sync order for ALL images
    if (projectId && currentImages.length > 0) {
      const existingImageMap = new Map(
        editingProject?.project_images?.map((img) => [img.image_url, img.id]) ||
          [],
      );

      // Process each image in order
      for (let idx = 0; idx < currentImages.length; idx++) {
        const url = currentImages[idx];
        const existingId = existingImageMap.get(url);

        if (existingId) {
          // Update order_index for existing image
          const { error: updateError } = await supabase
            .from("project_images")
            .update({ order_index: idx })
            .eq("id", existingId);

          if (updateError) {
            console.error("Failed to update image order:", updateError);
          }
        } else {
          // Insert new image with correct order_index
          const { error: insertError } = await supabase
            .from("project_images")
            .insert({
              project_id: projectId,
              image_url: url,
              order_index: idx,
            });

          if (insertError) {
            toast.error("Failed to save image: " + insertError.message);
          }
        }
      }
    }

    toast.success("Project saved successfully");
    // Clear drafts on successful save
    clearFormDraft();
    clearImagesDraft();
    clearTagsDraft();
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
          projectId={editingProject?.id}
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
