"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

// Types
export interface CourseCatalog {
  id: string;
  code: string;
  title: string;
  units: number;
  semester_id: string;
  department: string;
  is_elective: boolean;
  created_at: string;
}

export interface Course {
  id: string;
  catalog_id: string | null;
  code: string;
  title: string;
  units: number;
  semester_id: string;
  grade: string | null;
  grade_point: number | null;
  passed: boolean | null;
  category: "core" | "elective" | "general" | "audit";
  difficulty: number | null;
  study_hours: number | null;
  attendance: number | null;
  exam_score: number | null;
  assignment_avg: number | null;
  notes: string | null;
  professor: string | null;
  is_retake: boolean;
  academic_year: string | null;
  created_at: string;
  updated_at: string;
}

export interface SemesterGPA {
  semester_id: string;
  academic_year: string;
  gpa: number;
  total_units: number;
  passed_units: number;
  course_count: number;
  failed_count: number;
}

export interface CumulativeGPA {
  cgpa: number;
  total_units_attempted: number;
  total_units_passed: number;
  total_courses: number;
  total_failed: number;
}

// Nigerian 5.0 GPA Scale
export const GRADE_SCALE: Record<string, number> = {
  A: 5.0,
  B: 4.0,
  C: 3.0,
  D: 2.0,
  E: 1.0,
  F: 0.0,
};

export function getGradePoint(grade: string): number | null {
  if (!grade || grade === "-") return null;
  return GRADE_SCALE[grade.toUpperCase()] ?? null;
}

export function useAcademics() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [catalog, setCatalog] = useState<CourseCatalog[]>([]);
  const [semesterGPAs, setSemesterGPAs] = useState<SemesterGPA[]>([]);
  const [cumulativeGPA, setCumulativeGPA] = useState<CumulativeGPA | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all data
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Fetch courses
      const { data: coursesData, error: coursesError } = await supabase
        .from("courses")
        .select("*")
        .order("semester_id", { ascending: true });

      if (coursesError) throw coursesError;
      setCourses(coursesData || []);

      // Fetch catalog
      const { data: catalogData, error: catalogError } = await supabase
        .from("course_catalog")
        .select("*")
        .order("semester_id", { ascending: true });

      if (catalogError) throw catalogError;
      setCatalog(catalogData || []);

      // Fetch semester GPAs (from view)
      const { data: gpaData, error: gpaError } = await supabase
        .from("semester_gpa")
        .select("*");

      if (!gpaError) setSemesterGPAs(gpaData || []);

      // Fetch cumulative GPA (from view)
      const { data: cgpaData, error: cgpaError } = await supabase
        .from("cumulative_gpa")
        .select("*")
        .single();

      if (!cgpaError && cgpaData) setCumulativeGPA(cgpaData);
    } catch (error) {
      console.error("Error fetching academics data:", error);
      toast.error("Failed to fetch academic data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Add course to enrolled
  const addCourse = async (
    course: Omit<Course, "id" | "created_at" | "updated_at" | "passed">,
  ) => {
    const { data, error } = await supabase
      .from("courses")
      .insert([course])
      .select()
      .single();

    if (error) {
      toast.error("Failed to add course: " + error.message);
      return null;
    }

    // Optimistic: add to local state
    setCourses((prev) => [...prev, data]);
    toast.success("Course added!");
    return data;
  };

  // Update course (OPTIMISTIC - no reload)
  const updateCourse = async (id: string, updates: Partial<Course>) => {
    // Optimistic: update local state immediately
    setCourses((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, ...updates, updated_at: new Date().toISOString() }
          : c,
      ),
    );

    const { error } = await supabase
      .from("courses")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      toast.error("Failed to update course: " + error.message);
      // Rollback: refetch on error
      await fetchData();
      return false;
    }

    return true;
  };

  // Delete course (OPTIMISTIC - no reload)
  const deleteCourse = async (id: string) => {
    // Optimistic: remove from local state immediately
    const previousCourses = courses;
    setCourses((prev) => prev.filter((c) => c.id !== id));

    const { error } = await supabase.from("courses").delete().eq("id", id);

    if (error) {
      toast.error("Failed to delete course: " + error.message);
      // Rollback on error
      setCourses(previousCourses);
      return false;
    }

    toast.success("Course deleted!");
    return true;
  };

  // Add to catalog (bulk) - uses upsert to handle duplicates
  const addToCatalog = async (
    items: Omit<CourseCatalog, "id" | "created_at">[],
  ) => {
    // Use upsert: if code exists, update; if not, insert
    const { error } = await supabase
      .from("course_catalog")
      .upsert(items, { onConflict: "code", ignoreDuplicates: false });

    if (error) {
      toast.error("Failed to import catalog: " + error.message);
      return false;
    }

    toast.success(`Imported/updated ${items.length} courses in catalog!`);
    await fetchData();
    return true;
  };

  // Clear catalog
  const clearCatalog = async () => {
    const { error } = await supabase
      .from("course_catalog")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000");

    if (error) {
      toast.error("Failed to clear catalog: " + error.message);
      return false;
    }

    toast.success("Catalog cleared!");
    await fetchData();
    return true;
  };

  // Sync all catalog courses to enrolled courses table (bulk import)
  const syncFromCatalog = async () => {
    if (catalog.length === 0) {
      toast.error("No courses in catalog to sync");
      return false;
    }

    // Get existing course codes to avoid duplicates
    const existingCodes = new Set(courses.map((c) => c.code));

    // Filter out courses that already exist
    const newCourses = catalog
      .filter((c) => !existingCodes.has(c.code))
      .map((c) => ({
        catalog_id: c.id,
        code: c.code,
        title: c.title,
        units: c.units,
        semester_id: c.semester_id,
        grade: null,
        grade_point: null,
        category: c.is_elective ? "elective" : "core",
        difficulty: null,
        study_hours: null,
        attendance: null,
        exam_score: null,
        assignment_avg: null,
        notes: null,
        professor: null,
        is_retake: false,
        academic_year: null,
      }));

    if (newCourses.length === 0) {
      toast.info("All catalog courses are already synced!");
      return true;
    }

    const { error } = await supabase.from("courses").insert(newCourses);

    if (error) {
      toast.error("Failed to sync courses: " + error.message);
      return false;
    }

    toast.success(`Synced ${newCourses.length} courses from catalog!`);
    await fetchData();
    return true;
  };

  // Client-side Exclusions for "What-if" Analysis
  const [excludedCourseIds, setExcludedCourseIds] = useState<Set<string>>(
    new Set(),
  );
  const [excludedSemesterIds, setExcludedSemesterIds] = useState<Set<string>>(
    new Set(),
  );

  const toggleCourseExclusion = (courseId: string) => {
    const newSet = new Set(excludedCourseIds);
    if (newSet.has(courseId)) {
      newSet.delete(courseId);
    } else {
      newSet.add(courseId);
    }
    setExcludedCourseIds(newSet);
  };

  const toggleSemesterExclusion = (semesterId: string) => {
    const newSet = new Set(excludedSemesterIds);
    if (newSet.has(semesterId)) {
      newSet.delete(semesterId);
    } else {
      newSet.add(semesterId);
    }
    setExcludedSemesterIds(newSet);
  };

  // Client-side GPA Calculation
  const calculateStats = () => {
    if (courses.length === 0)
      return { cgpa: 0, totalUnits: 0, totalCourses: 0 };

    let totalPoints = 0;
    let totalUnits = 0;
    let courseCount = 0;

    courses.forEach((course) => {
      // Skip if course or semester is excluded
      if (
        excludedCourseIds.has(course.id) ||
        excludedSemesterIds.has(course.semester_id)
      ) {
        return;
      }

      // Skip if no grade
      // Fix: Use strict null check so F grade (0) is NOT skipped
      if (course.grade_point === null || course.units === 0) return;

      totalPoints += course.grade_point * course.units;
      totalUnits += course.units;
      courseCount++;
    });

    const cgpa = totalUnits > 0 ? totalPoints / totalUnits : 0.0;

    return {
      cgpa,
      totalUnits,
      totalCourses: courseCount,
    };
  };

  const stats = calculateStats();

  // Get unique semesters
  const getSemesters = (): string[] => {
    const sessionMap: Record<string, number> = {};
    const semesters = [
      ...new Set([
        ...courses.map((c) => c.semester_id),
        ...catalog.map((c) => c.semester_id),
      ]),
    ];

    // Helper to sort semesters: 100-1, 100-2, 200-1...
    return semesters.sort((a, b) => {
      const [lvlA, semA] = a.split("-").map(Number);
      const [lvlB, semB] = b.split("-").map(Number);
      if (lvlA !== lvlB) return lvlA - lvlB;
      return semA - semB;
    });
  };

  // Get courses for a semester
  const getCoursesBySemester = (semesterId: string) => {
    return courses.filter((c) => c.semester_id === semesterId);
  };

  // Get catalog by semester
  const getCatalogBySemester = (semesterId: string) => {
    return catalog.filter((c) => c.semester_id === semesterId);
  };

  return {
    courses,
    catalog,
    isLoading,
    stats,
    excludedCourseIds,
    excludedSemesterIds,
    fetchData,
    addCourse,
    updateCourse,
    deleteCourse,
    addToCatalog,
    clearCatalog,
    getSemesters,
    getCoursesBySemester,
    getCatalogBySemester,
    getGradePoint,
    toggleCourseExclusion,
    toggleSemesterExclusion,
    syncFromCatalog,
  };
}
