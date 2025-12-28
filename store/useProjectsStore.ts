import { create } from "zustand";
import { supabase } from "@/lib/supabase";
import { Database } from "@/types/supabase";

type Project = Database["public"]["Tables"]["projects"]["Row"] & {
  project_images?: Database["public"]["Tables"]["project_images"]["Row"][];
};

interface ProjectsState {
  projects: Project[];
  activeProject: Project | null;
  isLoading: boolean;
  hasLoaded: boolean;
  fetchProjects: () => Promise<void>;
  fetchFeaturedProjects: () => Promise<void>;
  fetchProjectById: (id: string) => Promise<Project | null>;
  getProjectBySlug: (slug: string) => Promise<Project | null>; // Helper if we decide to use slugs later, for now ID is fine
}

export const useProjectsStore = create<ProjectsState>((set, get) => ({
  projects: [],
  activeProject: null,
  isLoading: false,
  hasLoaded: false,

  fetchProjects: async () => {
    // If already loaded, don't re-fetch unless forced (simple cache)
    // if (get().hasLoaded) return; // Disabling cache to ensure fresh data for now

    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*, project_images(*)")
        .order("order_index", { ascending: true });

      if (error) throw error;

      // Type assertion as requested
      const typedData = data as unknown as Project[];

      // Sort images by order_index for each project
      const projectsWithSortedImages = typedData?.map((project) => ({
        ...project,
        project_images: project.project_images?.sort(
          (a: { order_index: number }, b: { order_index: number }) =>
            a.order_index - b.order_index
        ),
      }));

      set({ projects: projectsWithSortedImages || [], hasLoaded: true });
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchFeaturedProjects: async () => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*, project_images(*)")
        .eq("is_featured", true)
        .order("order_index", { ascending: true });

      if (error) throw error;

      const typedData = data as unknown as Project[];

      const projectsWithSortedImages = typedData?.map((project) => ({
        ...project,
        project_images: project.project_images?.sort(
          (a: { order_index: number }, b: { order_index: number }) =>
            a.order_index - b.order_index
        ),
      }));

      // Update state but maybe keep separate "featured" list?
      // For now, user implied "load only featured", so we can overwrite 'projects' if preview mode
      // But typically stores keep lists separate.
      // User said: "load only the featured projects from the database... and render them"
      // I'll update 'projects' state so components consuming it see only featured.
      set({ projects: projectsWithSortedImages || [] });
    } catch (error) {
      console.error(error);
    } finally {
      set({ isLoading: false });
    }
  },

  // Combined fetch by ID or Slug
  fetchProjectById: async (idOrSlug: string) => {
    set({ isLoading: true });
    try {
      // First check if we already have it in store (by id or slug)
      const existing = get().projects.find(
        (p) => p.id === idOrSlug || p.slug === idOrSlug
      );
      if (existing) {
        set({ activeProject: existing, isLoading: false });
        return existing;
      }

      // If not, fetch it
      // Logic: Try to fetch by slug first (typical use case), if not UUID format.
      // But simpler: just OR query? Supabase doesn't support "OR" easily in one chained call mix like that without building a filter string.
      // Let's assume it's a slug if it's not a UUID, or just try slug first.

      let query = supabase
        .from("projects")
        .select("*, project_images(*)")
        .single();

      // Simple heuristic: UUIDs are 36 chars. Slugs are usually not.
      // But stricter: Just try eq 'slug' first.

      // Actually, user said "load the slug as the route instead. if slug is unavailable, fall back to the id."
      // This implies handling both.

      // Attempt 1: By Slug
      const { data: slugData, error: slugError } = await supabase
        .from("projects")
        .select("*, project_images(*)")
        .eq("slug", idOrSlug)
        .single();

      if (slugData) {
        const typedData = slugData as unknown as Project;
        const projectWithSortedImages = {
          ...typedData,
          project_images: typedData.project_images?.sort(
            (a: { order_index: number }, b: { order_index: number }) =>
              a.order_index - b.order_index
          ),
        };
        set({ activeProject: projectWithSortedImages });
        return projectWithSortedImages;
      }

      // Attempt 2: By ID (Fallback)
      const { data: idData, error: idError } = await supabase
        .from("projects")
        .select("*, project_images(*)")
        .eq("id", idOrSlug)
        .single();

      if (idError) throw idError;

      const typedData = idData as unknown as Project;

      const projectWithSortedImages = {
        ...typedData,
        project_images: typedData.project_images?.sort(
          (a: { order_index: number }, b: { order_index: number }) =>
            a.order_index - b.order_index
        ),
      };

      set({ activeProject: projectWithSortedImages });
      return projectWithSortedImages;
    } catch (error) {
      console.error("Error fetching project:", error);
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  getProjectBySlug: async (slug: string) => {
    // Forward to main function
    return get().fetchProjectById(slug);
  },
}));
