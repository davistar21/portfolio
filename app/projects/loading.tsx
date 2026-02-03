import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import ProjectSkeleton from "@/components/projects/ProjectSkeleton";

export default function Loading() {
  return (
    <div className="container px-4 py-14 min-h-screen">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold pb-4 bg-clip-text text-transparent bg-gradient-to-br from-primary to-secondary">
          Projects
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          A collection of my work, experiments, and side projects.
        </p>
      </div>

      <ProjectSkeleton />
    </div>
  );
}
