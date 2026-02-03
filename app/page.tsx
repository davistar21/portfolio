import React from "react";
import Hero from "@/components/Hero";
import SkillsMarquee from "@/components/SkillsMarquee";
import Projects from "@/components/projects/Projects";
import Education from "@/components/Education";
import WorkExperience from "@/components/WorkExperience";
import Achievements from "@/components/Achievements";
import Volunteering from "@/components/Volunteering";
import BlogPreview from "@/components/blog/BlogPreview";
import { supabase } from "@/lib/supabase";
import { Database } from "@/types/supabase";

export const revalidate = 60; // ISR: Revalidate every 60 seconds

type Project = Database["public"]["Tables"]["projects"]["Row"] & {
  project_images?: Database["public"]["Tables"]["project_images"]["Row"][];
};

type BlogPost = Database["public"]["Tables"]["blog_posts"]["Row"] & {
  blog_post_images?: Database["public"]["Tables"]["blog_post_images"]["Row"][];
};

type Experience = Database["public"]["Tables"]["experience"]["Row"];

async function getFeaturedProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from("projects")
    .select("*, project_images(*)")
    .eq("is_featured", true)
    .order("order_index", { ascending: true });

  if (error) {
    console.error("Error fetching featured projects:", error);
    return [];
  }

  return (data as unknown as Project[]).map((p) => ({
    ...p,
    project_images: p.project_images?.sort(
      (a, b) => a.order_index - b.order_index,
    ),
  }));
}

async function getRecentPosts(): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*, blog_post_images(*)")
    .eq("is_active", true)
    .not("published_at", "is", null)
    .order("published_at", { ascending: false })
    .limit(3);

  if (error) {
    console.error("Error fetching blog posts:", error);
    return [];
  }

  return data as unknown as BlogPost[];
}

async function getExperience(): Promise<Experience[]> {
  const { data, error } = await supabase
    .from("experience")
    .select("*")
    .order("order_index", { ascending: true });

  if (error) {
    console.error("Error fetching experience:", error);
    return [];
  }

  return data as Experience[];
}

export default async function HomePage() {
  const [featuredProjects, recentPosts, allExperience] = await Promise.all([
    getFeaturedProjects(),
    getRecentPosts(),
    getExperience(),
  ]);

  const workExperience = allExperience.filter((e) => e.type === "job");
  const volunteering = allExperience.filter((e) => e.type === "volunteering");
  const achievements = allExperience.filter((e) => e.type === "achievement");
  // await new Promise((resolve) => setTimeout(resolve, 300000));
  return (
    <section className="flex flex-col gap-24 mt-10 md:px-8 px-4 bg-background">
      <Hero />
      <SkillsMarquee />
      <Projects preview={true} initialProjects={featuredProjects} />
      <BlogPreview initialPosts={recentPosts} />
      <Education />
      <WorkExperience initialData={workExperience} />
      <Volunteering initialData={volunteering} />
      <Achievements initialData={achievements} />
    </section>
  );
}
