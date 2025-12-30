import { supabase } from "@/lib/supabase";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://eyitayobembe.vercel.app";

  // 1. Static Routes
  const staticRoutes = [
    "",
    "/projects",
    "/blog",
    // "/about", // If you have a separate about page
    // "/contact", // If you have a separate contact page
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "monthly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  // 2. Fetch Blog Posts
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("slug, published_at")
    .eq("is_active", true)
    .not("published_at", "is", null);

  const blogRoutes =
    posts?.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.published_at || new Date().toISOString(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })) || [];

  // 3. Fetch Projects
  const { data: projects } = await supabase
    .from("projects")
    .select("slug, updated_at") // Ensure 'updated_at' exists or use created_at
    .eq("is_featured", true); // Or fetch all? Usually all public projects.

  // Fetch ALL projects for sitemap, not just featured
  const { data: allProjects } = await supabase
    .from("projects")
    .select("slug, created_at"); // Fallback to created_at if updated_at missing?

  const projectRoutes =
    allProjects?.map((project) => ({
      url: `${baseUrl}/projects/${project.slug}`,
      lastModified: project.created_at || new Date().toISOString(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })) || [];

  return [...staticRoutes, ...blogRoutes, ...projectRoutes];
}
