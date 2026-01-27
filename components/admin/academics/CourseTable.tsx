"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Eye, EyeOff, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Course, GRADE_SCALE } from "@/hooks/useAcademics";

const GRADES = Object.keys(GRADE_SCALE);

interface CourseTableProps {
  courses: Course[];
  excludedCourseIds: Set<string>;
  semesterGPA: string;
  semesterLabel: string;
  onGradeChange: (courseId: string, grade: string) => void;
  onUpdateCourse: (courseId: string, updates: Partial<Course>) => void;
  onToggleCourse: (courseId: string) => void;
  onDeleteCourse: (courseId: string) => void;
}

export default function CourseTable({
  courses,
  excludedCourseIds,
  semesterGPA,
  semesterLabel,
  onGradeChange,
  onUpdateCourse,
  onToggleCourse,
  onDeleteCourse,
}: CourseTableProps) {
  const [expandedCourseId, setExpandedCourseId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedCourseId(expandedCourseId === id ? null : id);
  };

  return (
    <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 md:px-6 py-4 border-b bg-muted/30">
        <h2 className="text-base md:text-lg font-semibold">{semesterLabel}</h2>
        <div className="flex items-center gap-2">
          <span className="text-xs md:text-sm text-muted-foreground">GPA:</span>
          <span className="text-lg md:text-xl font-bold">{semesterGPA}</span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[30px]"></TableHead>
              <TableHead className="w-[100px]">Code</TableHead>
              <TableHead className="hidden md:table-cell">Title</TableHead>
              <TableHead className="w-[80px]">Grade</TableHead>
              <TableHead className="w-[78px] text-center">
                Units (
                {courses
                  .filter((course) => !excludedCourseIds.has(course.id))
                  .reduce((acc, sum) => acc + sum.units, 0)}
                )
              </TableHead>
              <TableHead className="w-[90px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-24 text-center text-muted-foreground"
                >
                  No courses in this semester.
                </TableCell>
              </TableRow>
            ) : (
              courses.map((course) => {
                const isExcluded = excludedCourseIds.has(course.id);
                const isExpanded = expandedCourseId === course.id;

                return (
                  <>
                    <TableRow
                      key={course.id}
                      className={cn(
                        "cursor-pointer hover:bg-muted/50 transition-colors",
                        isExcluded && "opacity-40 bg-muted/30",
                        isExpanded && "bg-muted/30 border-b-0",
                      )}
                      onClick={() => toggleExpand(course.id)}
                    >
                      <TableCell className="flex flex-col items-center justify-center">
                        {course.category[0] != "e" ? (
                          <div className="rounded-full w-2 h-2 bg-primary" />
                        ) : (
                          <div className="rounded-full w-2 h-2 bg-secondary" />
                        )}
                        {isExpanded ? (
                          <ChevronUp
                            size={16}
                            className="text-muted-foreground"
                          />
                        ) : (
                          <ChevronDown
                            size={16}
                            className="text-muted-foreground"
                          />
                        )}
                      </TableCell>
                      <TableCell className="font-medium font-mono text-sm">
                        {course.code}
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                        {course.title}
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Select
                          value={course.grade || ""}
                          onValueChange={(val) => onGradeChange(course.id, val)}
                          disabled={isExcluded}
                        >
                          <SelectTrigger className="w-[65px] h-8 text-sm">
                            <SelectValue placeholder="-" />
                          </SelectTrigger>
                          <SelectContent>
                            {GRADES.map((g) => (
                              <SelectItem key={g} value={g}>
                                {g}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-center text-sm">
                        {course.units}
                      </TableCell>
                      <TableCell
                        className="text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onToggleCourse(course.id)}
                            className={cn(
                              "p-1.5 rounded-md transition-colors",
                              isExcluded
                                ? "text-muted-foreground hover:text-foreground"
                                : "text-primary/70 hover:text-primary hover:bg-primary/10",
                            )}
                            title={isExcluded ? "Include" : "Exclude"}
                          >
                            {isExcluded ? (
                              <EyeOff size={15} />
                            ) : (
                              <Eye size={15} />
                            )}
                          </button>
                          <button
                            onClick={() => onDeleteCourse(course.id)}
                            className="p-1.5 text-destructive/60 hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>

                    {/* Expanded Details Row */}
                    {isExpanded && (
                      <TableRow className="bg-muted/30 hover:bg-muted/30 border-t-0">
                        <TableCell colSpan={6} className="p-4 md:p-6">
                          <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-6">
                              <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                  <label className="text-xs font-medium text-muted-foreground">
                                    Study Hours (Total)
                                  </label>
                                  <span className="text-xs font-mono bg-background px-2 py-0.5 rounded border">
                                    {course.study_hours || 0} hrs
                                  </span>
                                </div>
                                <Slider
                                  defaultValue={[course.study_hours || 0]}
                                  max={200}
                                  step={1}
                                  min={0}
                                  onValueCommit={(val) =>
                                    onUpdateCourse(course.id, {
                                      study_hours: val[0],
                                    })
                                  }
                                />
                              </div>

                              <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                  <label className="text-xs font-medium text-muted-foreground">
                                    Difficulty (1-5)
                                  </label>
                                  <span className="text-xs font-mono bg-background px-2 py-0.5 rounded border">
                                    {course.difficulty || 1}/5
                                  </span>
                                </div>
                                <Slider
                                  defaultValue={[course.difficulty || 3]}
                                  max={5}
                                  min={1}
                                  step={1}
                                  onValueCommit={(val) =>
                                    onUpdateCourse(course.id, {
                                      difficulty: val[0],
                                    })
                                  }
                                />
                              </div>
                            </div>

                            <div className="space-y-6">
                              <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                  <label className="text-xs font-medium text-muted-foreground">
                                    Attendance (%)
                                  </label>
                                  <span className="text-xs font-mono bg-background px-2 py-0.5 rounded border">
                                    {course.attendance || 0}%
                                  </span>
                                </div>
                                <Slider
                                  defaultValue={[course.attendance || 0]}
                                  max={100}
                                  min={0}
                                  step={5}
                                  onValueCommit={(val) =>
                                    onUpdateCourse(course.id, {
                                      attendance: val[0],
                                    })
                                  }
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-xs font-medium text-muted-foreground">
                                  Notes
                                </label>
                                <Textarea
                                  className="h-20 text-xs resize-none bg-background"
                                  placeholder="Reflections on this course..."
                                  defaultValue={course.notes || ""}
                                  // Use onBlur to save to database only when finished typing
                                  onBlur={(e) =>
                                    onUpdateCourse(course.id, {
                                      notes: e.target.value,
                                    })
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
