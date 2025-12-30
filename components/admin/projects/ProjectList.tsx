import React from "react";
import { Database } from "@/types/supabase";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

type Project = Database["public"]["Tables"]["projects"]["Row"] & {
  project_images?: Database["public"]["Tables"]["project_images"]["Row"][];
};

interface ProjectListProps {
  projects: Project[];
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
  onStartCreate: () => void;
}

const ProjectList = ({
  projects,
  onEdit,
  onDelete,
  onStartCreate,
}: ProjectListProps) => {
  return (
    <motion.div
      key="list"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.2 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center w-full">
        <h2 className="text-2xl font-bold">Projects</h2>
        <button
          onClick={onStartCreate}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          <Plus className="w-4 h-4" /> Add Project
        </button>
      </div>

      <div className="grid gap-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="p-4 bg-card rounded-lg border shadow-sm flex flex-col md:flex-row justify-between items-start max-sm:w-fit mx-auto w-full"
          >
            <div className="flex gap-4 flex-col md:flex-row max-sm:max-w-xs">
              {project.project_images && project.project_images.length > 0 && (
                <div className="w-full h-auto md:w-16 md:h-16 rounded-lg overflow-hidden border shrink-0">
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
                <div className="flex flex-wrap gap-2 mt-2 overflow-x-auto py-4">
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
            <div className="flex gap-2 max-w-sm:w-full max-sm:justify-evenly max-sm:pt-6">
              <button
                onClick={() => onEdit(project)}
                className="p-2 hover:bg-muted rounded-md text-blue-500"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(project.id)}
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
  );
};

export default ProjectList;
