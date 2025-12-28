import React from "react";
import { Database } from "@/types/supabase";

type ProjectInsert = Database["public"]["Tables"]["projects"]["Insert"];

interface ProjectMetaFormProps {
  formData: Partial<ProjectInsert>;
  setFormData: (data: Partial<ProjectInsert>) => void;
  tagsInput: string;
  setTagsInput: (tags: string) => void;
}

const ProjectMetaForm = ({
  formData,
  setFormData,
  tagsInput,
  setTagsInput,
}: ProjectMetaFormProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <input
          type="text"
          className="w-full p-2 rounded-md border bg-background"
          value={formData.title || ""}
          onChange={(e) => {
            const title = e.target.value;
            const slug = title
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/(^-|-$)+/g, "");

            setFormData({ ...formData, title, slug });
          }}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Slug</label>
        <input
          type="text"
          className="w-full p-2 rounded-md border bg-background"
          value={formData.slug || ""}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Order Index</label>
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
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium">Featured?</label>
        <input
          type="checkbox"
          checked={formData.is_featured || false}
          onChange={(e) =>
            setFormData({ ...formData, is_featured: e.target.checked })
          }
          className="w-4 h-4"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Project URL</label>
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
        <label className="block text-sm font-medium mb-1">GitHub URL</label>
        <input
          type="text"
          className="w-full p-2 rounded-md border bg-background"
          value={formData.github_url || ""}
          onChange={(e) =>
            setFormData({ ...formData, github_url: e.target.value })
          }
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">
          Tags (comma separated)
        </label>
        <input
          type="text"
          className="w-full p-2 rounded-md border bg-background"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
        />
      </div>
    </div>
  );
};

export default ProjectMetaForm;
