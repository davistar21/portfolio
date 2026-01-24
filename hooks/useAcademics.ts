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

export function getGradePoint(grade: string): number {
  return GRADE_SCALE[grade.toUpperCase()] ?? 0;
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

    toast.success("Course added!");
    await fetchData();
    return data;
  };

  // Update course
  const updateCourse = async (id: string, updates: Partial<Course>) => {
    const { error } = await supabase
      .from("courses")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      toast.error("Failed to update course: " + error.message);
      return false;
    }

    toast.success("Course updated!");
    await fetchData();
    return true;
  };

  // Delete course
  const deleteCourse = async (id: string) => {
    const { error } = await supabase.from("courses").delete().eq("id", id);

    if (error) {
      toast.error("Failed to delete course: " + error.message);
      return false;
    }

    toast.success("Course deleted!");
    await fetchData();
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

  // Get unique semesters
  const getSemesters = (): string[] => {
    const all = [
      ...new Set([
        ...courses.map((c) => c.semester_id),
        ...catalog.map((c) => c.semester_id),
      ]),
    ];
    return all.sort();
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
    semesterGPAs,
    cumulativeGPA,
    isLoading,
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
  };
}
