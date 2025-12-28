"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Database } from "@/types/supabase";
import { toast } from "sonner";
import { Skeleton } from "../ui/skeleton";
import { AnimatePresence } from "framer-motion";

import ProjectList from "./projects/ProjectList";
import ProjectForm from "./projects/ProjectForm";

type Project = Database["public"]["Tables"]["projects"]["Row"] & {
  project_images?: Database["public"]["Tables"]["project_images"]["Row"][];
};

export default function ProjectsManager() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isCreating, setIsCreating] = useState(false);

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

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setIsCreating(false);
  };

  const handleStartCreate = () => {
    setEditingProject(null);
    setIsCreating(true);
  };

  const handleClose = () => {
    setEditingProject(null);
    setIsCreating(false);
  };

  const handleSuccess = () => {
    handleClose();
    fetchProjects();
  };

  if (loading)
    return (
      <div className="p-6 bg-card rounded-lg border shadow-sm">
        <h2 className="text-2xl font-bold mb-6">Projects</h2>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="p-4 bg-card rounded-lg border shadow-sm flex flex-col md:flex-row gap-4 w-full"
            >
              <div className="w-full h-48 md:w-16 md:h-16 rounded-lg overflow-hidden border shrink-0">
                <Skeleton className="w-full h-full" />
              </div>
              <div className="w-full flex flex-col">
                <Skeleton className="w-full h-2 mb-2" />
                <Skeleton className="w-full h-2 mb-2" />
                <Skeleton className="w-full h-2 mb-4" />
                <Skeleton className="w-1/2 h-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );

  return (
    <AnimatePresence mode="popLayout">
      {editingProject || isCreating ? (
        <ProjectForm
          editingProject={editingProject}
          onClose={handleClose}
          onSuccess={handleSuccess}
        />
      ) : (
        <ProjectList
          projects={projects}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onStartCreate={handleStartCreate}
        />
      )}
    </AnimatePresence>
  );
}
