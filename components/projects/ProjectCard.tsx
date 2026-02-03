import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Database } from "@/types/supabase";
import { cn } from "@/lib/utils";

type Project = Database["public"]["Tables"]["projects"]["Row"] & {
  project_images?: Database["public"]["Tables"]["project_images"]["Row"][];
};

interface ProjectCardProps {
  project: Project;
  className?: string;
  clamped?: boolean;
}

const ProjectCard = ({ project, className, clamped }: ProjectCardProps) => {
  return (
    <motion.div
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition-all hover:shadow-lg h-full",
        className,
      )}
    >
      {/* Image Section */}
      <Link
        href={`/projects/${project.slug || project.id}`}
        className="relative block w-full overflow-hidden aspect-video"
      >
        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors z-10" />
        {project.image_url ? (
          <img
            src={project.image_url}
            alt={project.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="h-full w-full bg-muted flex items-center justify-center text-muted-foreground">
            No Image
          </div>
        )}
      </Link>

      {/* Content Section */}
      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-start justify-between gap-2 mb-3">
          <Link
            href={`/projects/${project.slug || project.id}`}
            className="group/link"
          >
            <h3 className="text-xl font-bold font-poppins group-hover/link:text-primary transition-colors">
              {project.title}
            </h3>
          </Link>
          <Link
            href={project.project_url || project.github_url || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-muted-foreground hover:text-primary hover:bg-muted rounded-full transition-colors"
          >
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        <p
          className={cn(
            "text-muted-foreground text-sm mb-4 font-varelaRound",
            clamped ? "line-clamp-8" : "line-clamp-3",
          )}
        >
          {project.description}
        </p>

        {/* Tags */}
        <div className="mt-auto flex flex-wrap gap-2 pt-2">
          {project.tags?.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-xs font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary"
            >
              {tag}
            </span>
          ))}
          {project.tags && project.tags.length > 3 && (
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
              +{project.tags.length - 3}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
