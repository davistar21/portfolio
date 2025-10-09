import React from "react";
import ProjectCard from "@/components/ProjectCard";
export const metadata = {
  title: "Projects — Eyitayo",
  description: "A selection of projects I’ve shipped.",
};

const projects = [
  {
    id: 1,
    title: "Studently",
    description: "Landing kit & course platform",
    tags: ["Next.js", "Tailwind"],
  },
  {
    id: 2,
    title: "ResumeAI",
    description: "AI resume analyzer",
    tags: ["React", "API"],
  },
];

export default function ProjectsPage() {
  return (
    <section>
      <h1 className="text-3xl font-bold mb-6">Projects</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((p) => (
          <ProjectCard
            key={p.id}
            title={p.title}
            description={p.description}
            tags={p.tags}
          />
        ))}
      </div>
    </section>
  );
}
