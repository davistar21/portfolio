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
type Project = Database["public"]["Tables"]["projects"]["Row"];
type ProjectInsert = Database["public"]["Tables"]["projects"]["Insert"];

export default function ProjectsManager() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<Partial<ProjectInsert>>({});

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("projects")
      .select("*")
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

    const projectData = {
      ...formData,
      tags:
        typeof formData.tags === "string"
          ? (formData.tags as string).split(",").map((t: string) => t.trim())
          : formData.tags,
    };

    let error;
    if (editingProject) {
      const { error: updateError } = await supabase
        .from("projects")
        .update(projectData)
        .eq("id", editingProject.id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from("projects")
        .insert([projectData as ProjectInsert]);
      error = insertError;
    }

    if (error) {
      toast.error("Failed to save project: " + error.message);
    } else {
      toast.success("Project saved successfully");
      setEditingProject(null);
      setIsCreating(false);
      setFormData({});
      fetchProjects();
    }
  };

  const startEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      ...project,
      tags: project.tags ? project.tags : [], // Keep as array for internal state, handle display in input
    });
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
    setIsCreating(true);
  };

  if (loading)
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="animate-spin" />
      </div>
    );

  // if (editingProject || isCreating) {
  //   return (
  //     <div className="p-6 bg-card rounded-lg border shadow-sm">
  //       <div className="flex justify-between items-center mb-6">
  //         <h2 className="text-2xl font-bold">
  //           {editingProject ? "Edit Project" : "New Project"}
  //         </h2>
  //         <button
  //           onClick={() => {
  //             setEditingProject(null);
  //             setIsCreating(false);
  //           }}
  //           className="p-2 hover:bg-muted rounded-full"
  //         >
  //           <X className="w-5 h-5" />
  //         </button>
  //       </div>
  //       <form onSubmit={handleSubmit} className="space-y-4">
  //         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  //           <div>
  //             <label className="block text-sm font-medium mb-1">Title</label>
  //             <input
  //               type="text"
  //               className="w-full p-2 rounded-md border bg-background"
  //               value={formData.title || ""}
  //               onChange={(e) =>
  //                 setFormData({ ...formData, title: e.target.value })
  //               }
  //               required
  //             />
  //           </div>
  //           <div>
  //             <label className="block text-sm font-medium mb-1">
  //               Order Index
  //             </label>
  //             <input
  //               type="number"
  //               className="w-full p-2 rounded-md border bg-background"
  //               value={formData.order_index || 0}
  //               onChange={(e) =>
  //                 setFormData({
  //                   ...formData,
  //                   order_index: parseInt(e.target.value),
  //                 })
  //               }
  //             />
  //           </div>
  //           <div className="md:col-span-2">
  //             <label className="block text-sm font-medium mb-1">
  //               Description (Markdown)
  //             </label>
  //             <textarea
  //               className="w-full p-2 rounded-md border bg-background h-32"
  //               value={formData.description || ""}
  //               onChange={(e) =>
  //                 setFormData({ ...formData, description: e.target.value })
  //               }
  //             />
  //           </div>
  //           <div>
  //             <label className="block text-sm font-medium mb-1">
  //               Project URL
  //             </label>
  //             <input
  //               type="text"
  //               className="w-full p-2 rounded-md border bg-background"
  //               value={formData.project_url || ""}
  //               onChange={(e) =>
  //                 setFormData({ ...formData, project_url: e.target.value })
  //               }
  //             />
  //           </div>
  //           <div>
  //             <label className="block text-sm font-medium mb-1">
  //               GitHub URL
  //             </label>
  //             <input
  //               type="text"
  //               className="w-full p-2 rounded-md border bg-background"
  //               value={formData.github_url || ""}
  //               onChange={(e) =>
  //                 setFormData({ ...formData, github_url: e.target.value })
  //               }
  //             />
  //           </div>
  //           <div>
  //             <label className="block text-sm font-medium mb-1">
  //               Image URL
  //             </label>
  //             <input
  //               type="text"
  //               className="w-full p-2 rounded-md border bg-background"
  //               value={formData.image_url || ""}
  //               onChange={(e) =>
  //                 setFormData({ ...formData, image_url: e.target.value })
  //               }
  //             />
  //           </div>
  //           <div>
  //             <label className="block text-sm font-medium mb-1">
  //               Tags (comma separated)
  //             </label>
  //             <input
  //               type="text"
  //               className="w-full p-2 rounded-md border bg-background"
  //               value={
  //                 Array.isArray(formData.tags)
  //                   ? formData.tags.join(", ")
  //                   : formData.tags || ""
  //               }
  //               onChange={(e) =>
  //                 setFormData({
  //                   ...formData,
  //                   tags: e.target.value
  //                     .split(",")
  //                     .map((t: string) => t.trim()),
  //                 })
  //               }
  //             />
  //           </div>
  //         </div>
  //         <div className="flex justify-end gap-2 mt-6">
  //           <button
  //             type="button"
  //             onClick={() => {
  //               setEditingProject(null);
  //               setIsCreating(false);
  //             }}
  //             className="px-4 py-2 border rounded-md hover:bg-muted"
  //           >
  //             Cancel
  //           </button>
  //           <button
  //             type="submit"
  //             className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
  //           >
  //             Save Project
  //           </button>
  //         </div>
  //       </form>
  //     </div>
  //   );
  // }
  const allObjs = {
    startCreate,
    setEditingProject,
    editingProject,
    isCreating,
    setIsCreating,
    handleSubmit,
    formData,
    setFormData,
  };
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Projects</h2>
        {/* <button
          onClick={startCreate}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          <Plus className="w-4 h-4" /> Add Project
        </button> */}
        <AddProjectDialog {...allObjs} />
      </div>

      <div className="grid gap-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="p-4 bg-card rounded-lg border shadow-sm flex justify-between items-start"
          >
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
  setFormData: (formData: Omit<Project, "id">) => void;
  editingProject: Project | null;
  formData: Omit<Project, "id">;
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
}: ProjectDialogProps) => {
  return (
    <Dialog
      open={!!isCreating || !!editingProject}
      onOpenChange={() => {
        if (isCreating) {
          setIsCreating(false);
        } else {
          setEditingProject(null);
        }
      }}
    >
      <DialogTrigger>
        <button
          onClick={startCreate}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          <Plus className="w-4 h-4" /> Add Project
        </button>
      </DialogTrigger>
      <AnimatePresence mode="wait">
        {(isCreating || editingProject) && (
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold">
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
              </DialogTitle>
            </DialogHeader>
            <motion.div
              className="p-6 bg-card rounded-lg border shadow-sm"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Title
                    </label>
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
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                  >
                    Save Project
                  </button>
                </div>
              </form>
            </motion.div>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  );
};
