"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useAcademics, CourseCatalog } from "@/hooks/useAcademics";
import { Loader2, Sparkles, Trash2, Upload, Check } from "lucide-react";
import { toast } from "sonner";
import { useLocalStorageState } from "@/hooks/useLocalStorageState";

interface ParsedCourse {
  code: string;
  title: string;
  units: number;
  semester_id: string;
  is_elective: boolean;
  department: string;
}

export default function CatalogImporter() {
  const { catalog, addToCatalog, clearCatalog, fetchData } = useAcademics();
  const [pdfText, setPdfText] = useLocalStorageState("pdfText", "");
  const [department, setDepartment] = useState("Computer Engineering");
  const [isParsing, setIsParsing] = useState(false);
  const [parsedCourses, setParsedCourses] = useState<ParsedCourse[]>([]);
  const [isImporting, setIsImporting] = useState(false);

  const handleParse = async () => {
    if (!pdfText.trim()) {
      toast.error("Please paste your course catalog text first");
      return;
    }

    setIsParsing(true);
    try {
      const response = await fetch("/api/courses/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pdfText, department }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to parse");
      }

      setParsedCourses(data.courses);
      toast.success(`Extracted ${data.count} courses!`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Parse failed");
    } finally {
      setIsParsing(false);
    }
  };

  const handleImport = async () => {
    if (parsedCourses.length === 0) {
      toast.error("No courses to import");
      return;
    }

    setIsImporting(true);
    const success = await addToCatalog(
      parsedCourses as Omit<CourseCatalog, "id" | "created_at">[],
    );
    if (success) {
      setParsedCourses([]);
      setPdfText("");
    }
    setIsImporting(false);
  };

  const handleClearCatalog = async () => {
    if (!confirm("Are you sure you want to clear the entire course catalog?"))
      return;
    await clearCatalog();
  };

  return (
    <div className="space-y-6">
      {/* Import Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            AI Course Catalog Importer
          </CardTitle>
          <CardDescription>
            Paste the text from your department's course list PDF. AI will
            extract all courses automatically.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-3">
              <Label htmlFor="pdfText">Course Catalog Text</Label>
              <Textarea
                id="pdfText"
                placeholder="Paste your PDF text here... (course codes, titles, units, etc.)"
                className="min-h-[150px] font-mono text-xs mt-1"
                value={pdfText}
                onChange={(e) => setPdfText(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="mt-1"
              />
              <button
                onClick={handleParse}
                disabled={isParsing || !pdfText.trim()}
                className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
              >
                {isParsing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Parsing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Parse with AI
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Parsed Preview */}
          {parsedCourses.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">
                  Preview ({parsedCourses.length} courses)
                </h4>
                <button
                  onClick={handleImport}
                  disabled={isImporting}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                >
                  {isImporting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
                  Import All
                </button>
              </div>
              <div className="max-h-[300px] overflow-auto border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Units</TableHead>
                      <TableHead>Semester</TableHead>
                      <TableHead>Type</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {parsedCourses.map((course, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-mono">
                          {course.code}
                        </TableCell>
                        <TableCell>{course.title}</TableCell>
                        <TableCell>{course.units}</TableCell>
                        <TableCell>{course.semester_id}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              course.is_elective ? "secondary" : "default"
                            }
                          >
                            {course.is_elective ? "Elective" : "Core"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Existing Catalog */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Course Catalog</CardTitle>
              <CardDescription>
                {catalog.length} courses in catalog
              </CardDescription>
            </div>
            {catalog.length > 0 && (
              <button
                onClick={handleClearCatalog}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-destructive border border-destructive/30 rounded-md hover:bg-destructive/10"
              >
                <Trash2 className="w-4 h-4" />
                Clear All
              </button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {catalog.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">
              No courses in catalog. Import your course list above.
            </p>
          ) : (
            <div className="max-h-[400px] overflow-auto border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Units</TableHead>
                    <TableHead>Semester</TableHead>
                    <TableHead>Type</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {catalog.map((course) => (
                    <TableRow key={course.id}>
                      <TableCell className="font-mono">{course.code}</TableCell>
                      <TableCell>{course.title}</TableCell>
                      <TableCell>{course.units}</TableCell>
                      <TableCell>{course.semester_id}</TableCell>
                      <TableCell>
                        <Badge
                          variant={course.is_elective ? "secondary" : "default"}
                        >
                          {course.is_elective ? "Elective" : "Core"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
