import React from "react";
import Projects from "@/components/projects/Projects";
import { supabase } from "@/lib/supabase";
import { Database } from "@/types/supabase";

export const revalidate = 60; // ISR: Revalidate every 60 seconds

type Project = Database["public"]["Tables"]["projects"]["Row"] & {
  project_images?: Database["public"]["Tables"]["project_images"]["Row"][];
};

async function getProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from("projects")
    .select("*, project_images(*)")
    .order("order_index", { ascending: true });

  if (error) {
    console.error("Error fetching projects:", error);
    return [];
  }

  // Sort images for each project if needed or trust the DB order if we added sorting there?
  // Let's ensure images are sorted by order_index just in case, similar to page client logic
  const projectsWithSortedImages = (data as unknown as Project[]).map((p) => ({
    ...p,
    project_images: p.project_images?.sort(
      (a, b) => a.order_index - b.order_index
    ),
  }));

  return projectsWithSortedImages;
}

export default async function ProjectsPage() {
  const projects = await getProjects();

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

      <Projects initialProjects={projects} />
    </div>
  );
}
