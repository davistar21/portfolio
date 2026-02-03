import React from "react";
import { supabase } from "@/lib/supabase";
import { Metadata } from "next";
import ProjectPageClient from "@/components/projects/ProjectPageClient";
import { Database } from "@/types/supabase";
import Link from "next/link";

export const revalidate = 60; // Revalidate every 60 seconds

type Props = {
  params: Promise<{ slug: string }>;
};

type Project = Database["public"]["Tables"]["projects"]["Row"] & {
  project_images?: Database["public"]["Tables"]["project_images"]["Row"][];
};

// Helper function to fetch project by slug or ID
// Helper function to fetch project by slug or ID
async function getProject(slugOrId: string): Promise<Project | null> {
  console.log("Fetching project for:", slugOrId);

  // 1. Try fetching by slug first
  const { data: slugData, error: slugError } = await supabase
    .from("projects")
    .select("*, project_images(*)")
    .eq("slug", slugOrId)
    .maybeSingle();

  if (slugError) {
    console.error("Slug fetch error:", slugError);
  }

  if (slugData) {
    console.log("Found by slug");
    return slugData as unknown as Project;
  }

  // DEBUG: If not found, list all slugs to see what's in DB
  const { data: allProjects } = await supabase
    .from("projects")
    .select("slug, id");
  console.log(
    "DEBUG: Available slugs in DB:",
    allProjects?.map((p) => ({ slug: p.slug, id: p.id })),
  );

  // 2. Fallback: Fetch by ID (ONLY if slugOrId looks like a UUID)
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  if (uuidRegex.test(slugOrId)) {
    console.log("Input looks like UUID, trying ID fetch...");
    const { data: idData, error: idError } = await supabase
      .from("projects")
      .select("*, project_images(*)")
      .eq("id", slugOrId)
      .maybeSingle();

    if (idError) console.error("ID fetch error:", idError);
    if (idData) {
      console.log("Found by ID");
      return idData as unknown as Project;
    }
  } else {
    console.log("Input is not a UUID, skipping ID fetch");
  }

  console.log("Project not found for:", slugOrId);
  return null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  const images =
    project.project_images && project.project_images.length > 0
      ? project.project_images.sort((a, b) => a.order_index - b.order_index)
      : [];
  const coverImage =
    images.length > 0
      ? images[0].image_url
      : "https://eyitayobembe.vercel.app/og-image.png"; // Fallback

  return {
    title: `${project.title} | Projects`,
    description:
      project.description?.slice(0, 160) ||
      "View this project in my portfolio.",
    openGraph: {
      title: project.title,
      description: project.description?.slice(0, 160) || "",
      type: "article", // or 'website'
      images: [
        {
          url: coverImage,
          width: 1200,
          height: 630,
          alt: project.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.description?.slice(0, 160) || "",
      images: [coverImage],
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
          <p className="text-muted-foreground">
            The project you are looking for does not exist or has been removed.
          </p>
          <Link href="/projects" className="mt-4">
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  return <ProjectPageClient project={project} />;
}
