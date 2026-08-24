import { Suspense } from "react";
import Hero from "@/components/Hero";
import SkillsMarquee from "@/components/SkillsMarquee";
import Projects from "@/components/projects/Projects";
import BlogPreview from "@/components/blog/BlogPreview";
import { Ask } from "@/components/Ask";
import { supabase } from "@/lib/supabase";
import { Database } from "@/types/supabase";
import { Skeleton } from "@/components/ui/skeleton";
import { SectionErrorBoundary } from "@/components/SectionErrorBoundary";

export const revalidate = 60; // ISR: Revalidate every 60 seconds

type Project = Database["public"]["Tables"]["projects"]["Row"] & {
  project_images?: Database["public"]["Tables"]["project_images"]["Row"][];
};

type BlogPost = Database["public"]["Tables"]["blog_posts"]["Row"] & {
  blog_post_images?: Database["public"]["Tables"]["blog_post_images"]["Row"][];
};

async function FeaturedProjectsSection() {
  const { data, error } = await supabase
    .from("projects")
    .select("*, project_images(*)")
    .eq("is_featured", true)
    .order("order_index", { ascending: true });

  if (error) {
    console.error("Error fetching featured projects:", error);
  }

  const projects = ((data as unknown as Project[] | null) ?? []).map((p) => ({
    ...p,
    project_images: p.project_images?.sort(
      (a, b) => a.order_index - b.order_index,
    ),
  }));

  return <Projects preview={true} initialProjects={projects} />;
}

async function RecentBlogSection() {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*, blog_post_images(*)")
    .eq("is_active", true)
    .not("published_at", "is", null)
    .order("published_at", { ascending: false })
    .limit(3);

  if (error) {
    console.error("Error fetching blog posts:", error);
  }

  return (
    <BlogPreview initialPosts={(data as unknown as BlogPost[] | null) ?? []} />
  );
}

export default function HomePage() {
  return (
    <section className="flex flex-col gap-24 mt-10 md:px-8 px-4 bg-background">
      <Hero />
      <SkillsMarquee />
      <SectionErrorBoundary name="Featured Projects">
        <Suspense
          fallback={
            <div className="py-12" id="projects">
              <h2 className="font-semibold text-xl md:text-2xl mb-8 flex items-center gap-2">
                {/* <span className="bg-primary/20 text-primary p-1.5 rounded-lg">
              ⚡
            </span> */}
                Featured Projects
              </h2>
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-80 rounded-xl border bg-card p-4 space-y-4"
                  >
                    <Skeleton className="w-full h-48 rounded-lg" />
                    <Skeleton className="w-3/4 h-6" />
                    <Skeleton className="w-full h-4" />
                  </div>
                ))}
              </div>
            </div>
          }
        >
          <FeaturedProjectsSection />
        </Suspense>
      </SectionErrorBoundary>
      <SectionErrorBoundary name="Blog">
        <Suspense
          fallback={
            <div>
              <h2 className="font-semibold text-xl md:text-2xl mb-8 flex items-center gap-3">
                {/* <span className="bg-primary/20 text-primary p-2 rounded-xl text-xl">
                  ⚡
                </span> */}
                Blog
              </h2>
              <div className="group relative overflow-hidden rounded-xl bg-card border shadow-sm flex flex-col">
                <div className="relative w-full h-48 sm:h-56 overflow-hidden">
                  <Skeleton className="w-full h-full" />
                </div>
                <div className="p-5 flex flex-col flex-1 gap-3">
                  <div className="flex gap-2 mb-1">
                    <Skeleton className="w-16 h-4 rounded-full" />
                    <Skeleton className="w-20 h-4 rounded-full" />
                  </div>
                  <Skeleton className="w-3/4 h-8" />
                  <Skeleton className="w-full h-4" />
                  <Skeleton className="w-2/3 h-4" />
                  <div className="mt-auto pt-4 flex items-center justify-between">
                    <Skeleton className="w-24 h-4" />
                    <Skeleton className="w-8 h-8 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          }
        >
          <RecentBlogSection />
        </Suspense>
      </SectionErrorBoundary>
      {/* <Ask /> */}
      {/* <Education /> */}
    </section>
  );
}
