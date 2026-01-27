"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useAcademics, getGradePoint } from "@/hooks/useAcademics";
import GpaHeader from "./GpaHeader";
import SemesterTabs, { formatSemester } from "./SemesterTabs";
import CourseTable from "./CourseTable";
import AcademicsSkeleton from "./AcademicsSkeleton";

import AcademicsInsights from "./AcademicsInsights";

export default function AcademicsManager() {
  const {
    courses,
    catalog,
    updateCourse,
    deleteCourse,
    getSemesters,
    stats,
    excludedCourseIds,
    excludedSemesterIds,
    toggleCourseExclusion,
    toggleSemesterExclusion,
    isLoading,
    syncFromCatalog,
  } = useAcademics();

  const [activeSemester, setActiveSemester] = useState<string>("");
  const [hasSynced, setHasSynced] = useState(false);
  const [showInsights, setShowInsights] = useState(false);

  const semesters = getSemesters();

  // Auto-sync from catalog on first load if courses are empty
  useEffect(() => {
    if (
      !isLoading &&
      !hasSynced &&
      courses.length === 0 &&
      catalog.length > 0
    ) {
      setHasSynced(true);
      syncFromCatalog();
    }
  }, [isLoading, hasSynced, courses.length, catalog.length, syncFromCatalog]);

  // Set initial active semester
  useEffect(() => {
    if (!activeSemester && semesters.length > 0) {
      setActiveSemester(semesters[0]);
    }
  }, [semesters, activeSemester]);

  // Current semester courses
  const currentCourses = useMemo(
    () => courses.filter((c) => c.semester_id === activeSemester),
    [courses, activeSemester],
  );

  // Semester GPA calculation
  const semesterGPA = useMemo(() => {
    let points = 0;
    let units = 0;
    currentCourses.forEach((c) => {
      // Fix: Use strict null check so F grade (0) is NOT skipped
      if (excludedCourseIds.has(c.id) || c.grade_point === null || !c.units)
        return;
      points += c.grade_point * c.units;
      units += c.units;
    });
    return units > 0 ? (points / units).toFixed(2) : "0.00";
  }, [currentCourses, excludedCourseIds]);

  // Handlers
  const handleGradeChange = async (courseId: string, grade: string) => {
    const gradePoint = getGradePoint(grade);
    await updateCourse(courseId, { grade, grade_point: gradePoint });
  };

  const handleDelete = async (courseId: string) => {
    if (!confirm("Delete this course?")) return;
    await deleteCourse(courseId);
  };

  // Loading state
  if (isLoading) return <AcademicsSkeleton />;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <GpaHeader
        cgpa={stats.cgpa}
        totalUnits={stats.totalUnits}
        onToggleInsights={() => setShowInsights(!showInsights)}
      />

      {showInsights && (
        <AcademicsInsights
          courses={courses}
          excludedCourseIds={excludedCourseIds}
        />
      )}

      <SemesterTabs
        semesters={semesters}
        activeSemester={activeSemester}
        excludedSemesterIds={excludedSemesterIds}
        onSelectSemester={setActiveSemester}
        onToggleSemester={toggleSemesterExclusion}
      />

      <CourseTable
        courses={currentCourses}
        excludedCourseIds={excludedCourseIds}
        semesterGPA={semesterGPA}
        semesterLabel={formatSemester(activeSemester)}
        onGradeChange={handleGradeChange}
        onUpdateCourse={updateCourse}
        onToggleCourse={toggleCourseExclusion}
        onDeleteCourse={handleDelete}
      />
    </div>
  );
}
