"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  useAcademics,
  Course,
  getGradePoint,
  GRADE_SCALE,
} from "@/hooks/useAcademics";
import { Plus, Pencil, Trash2, BookPlus } from "lucide-react";
import { toast } from "sonner";

const CATEGORIES = ["core", "elective", "general", "audit"] as const;
const GRADES = Object.keys(GRADE_SCALE);

export default function CourseList() {
  const {
    courses,
    catalog,
    addCourse,
    updateCourse,
    deleteCourse,
    getSemesters,
  } = useAcademics();
  const [filterSemester, setFilterSemester] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [selectedCatalogId, setSelectedCatalogId] = useState<string>("");

  const semesters = getSemesters();
  const filteredCourses =
    filterSemester === "all"
      ? courses
      : courses.filter((c) => c.semester_id === filterSemester);

  const handleAddFromCatalog = async () => {
    const catalogCourse = catalog.find((c) => c.id === selectedCatalogId);
    if (!catalogCourse) return;

    await addCourse({
      catalog_id: catalogCourse.id,
      code: catalogCourse.code,
      title: catalogCourse.title,
      units: catalogCourse.units,
      semester_id: catalogCourse.semester_id,
      grade: null,
      grade_point: null,
      category: catalogCourse.is_elective ? "elective" : "core",
      difficulty: null,
      study_hours: null,
      attendance: null,
      exam_score: null,
      assignment_avg: null,
      notes: null,
      professor: null,
      is_retake: false,
      academic_year:
        new Date().getFullYear() + "/" + (new Date().getFullYear() + 1),
    });

    setSelectedCatalogId("");
    setIsAddDialogOpen(false);
  };

  const handleGradeChange = async (courseId: string, grade: string) => {
    const gradePoint = getGradePoint(grade);
    await updateCourse(courseId, { grade, grade_point: gradePoint });
  };

  const handleDelete = async (courseId: string) => {
    if (!confirm("Delete this course?")) return;
    await deleteCourse(courseId);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Select value={filterSemester} onValueChange={setFilterSemester}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by semester" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Semesters</SelectItem>
              {semesters.map((sem) => (
                <SelectItem key={sem} value={sem}>
                  {sem}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-sm text-muted-foreground">
            {filteredCourses.length} courses
          </span>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
              <BookPlus className="w-4 h-4" />
              Add Course
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Course</DialogTitle>
              <DialogDescription>
                Select a course from your catalog to enroll in.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label>Select Course</Label>
                <Select
                  value={selectedCatalogId}
                  onValueChange={setSelectedCatalogId}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Choose a course..." />
                  </SelectTrigger>
                  <SelectContent className="overflow-y-auto">
                    {catalog.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.code} - {c.title} ({c.units} units)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <button
                onClick={handleAddFromCatalog}
                disabled={!selectedCatalogId}
                className="w-full py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
              >
                Add to My Courses
              </button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Course Table */}
      <Card>
        <CardContent className="p-0">
          {filteredCourses.length === 0 ? (
            <p className="text-center py-12 text-muted-foreground">
              No courses yet. Add courses from your catalog.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Units</TableHead>
                  <TableHead>Semester</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>GP</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCourses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell className="font-mono font-medium">
                      {course.code}
                    </TableCell>
                    <TableCell>{course.title}</TableCell>
                    <TableCell>{course.units}</TableCell>
                    <TableCell>{course.semester_id}</TableCell>
                    <TableCell>
                      <Select
                        value={course.grade || ""}
                        onValueChange={(val) =>
                          handleGradeChange(course.id, val)
                        }
                      >
                        <SelectTrigger className="w-[80px]">
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
                    <TableCell>
                      <Badge
                        variant={
                          course.grade_point === null
                            ? "outline"
                            : course.grade_point >= 4
                              ? "default"
                              : course.grade_point >= 3
                                ? "secondary"
                                : "destructive"
                        }
                      >
                        {course.grade_point?.toFixed(1) || "-"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {course.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <button
                        onClick={() => handleDelete(course.id)}
                        className="p-1.5 text-destructive hover:bg-destructive/10 rounded-md"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
