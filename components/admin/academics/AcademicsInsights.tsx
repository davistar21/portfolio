"use client";

import { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Course } from "@/hooks/useAcademics";

interface AcademicsInsightsProps {
  courses: Course[];
  excludedCourseIds: Set<string>;
}

export default function AcademicsInsights({
  courses,
  excludedCourseIds,
}: AcademicsInsightsProps) {
  // Filter active courses
  const activeCourses = useMemo(
    () => courses.filter((c) => !excludedCourseIds.has(c.id)),
    [courses, excludedCourseIds],
  );

  // 1. GPA Trend Data
  const gpaTrendData = useMemo(() => {
    const semesterMap = new Map<
      string,
      { points: number; units: number; semester: string }
    >();

    activeCourses.forEach((c) => {
      // Fix: Check for null strictly, as 0 (F grade) is valid
      if (c.grade_point === null || !c.units || !c.semester_id) return;

      const current = semesterMap.get(c.semester_id) || {
        points: 0,
        units: 0,
        semester: c.semester_id,
      };

      current.points += c.grade_point * c.units;
      current.units += c.units;
      semesterMap.set(c.semester_id, current);
    });

    return Array.from(semesterMap.values())
      .map((d) => ({
        semester: d.semester,
        gpa: d.units > 0 ? parseFloat((d.points / d.units).toFixed(2)) : 0,
      }))
      .sort((a, b) => {
        const [lvlA, semA] = a.semester.split("-").map(Number);
        const [lvlB, semB] = b.semester.split("-").map(Number);
        if (lvlA !== lvlB) return lvlA - lvlB;
        return semA - semB;
      });
  }, [activeCourses]);

  // 2. Study vs Grade Data
  const studyVsGradeData = useMemo(() => {
    return activeCourses
      .filter((c) => c.study_hours !== null && c.grade_point !== null)
      .map((c) => ({
        name: c.code,
        studyHours: c.study_hours || 0,
        gradePoint: c.grade_point, // Don't default to 0 here to distinguish
        // Color code based on effectiveness
        fill:
          (c.grade_point || 0) >= 4.5
            ? "#22c55e" // Green
            : (c.grade_point || 0) >= 3.5
              ? "#3b82f6" // Blue
              : "#ef4444", // Red
      }));
  }, [activeCourses]);

  // 3. Difficulty vs. Grade Data
  const difficultyData = useMemo(() => {
    const byDifficulty = new Map<number, { totalGP: number; count: number }>();

    activeCourses.forEach((c) => {
      // Fix: Check for null strictly
      if (!c.difficulty || c.grade_point === null) return;
      const diff = Math.round(c.difficulty);
      const current = byDifficulty.get(diff) || { totalGP: 0, count: 0 };
      current.totalGP += c.grade_point;
      current.count += 1;
      byDifficulty.set(diff, current);
    });

    return Array.from(byDifficulty.entries())
      .map(([diff, data]) => ({
        difficulty: diff,
        avgGrade: parseFloat((data.totalGP / data.count).toFixed(2)),
      }))
      .sort((a, b) => a.difficulty - b.difficulty);
  }, [activeCourses]);

  if (activeCourses.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
      {/* GPA Trend (Area Chart) */}
      <Card className="bg-card/50 col-span-1 md:col-span-2 border shadow-sm backdrop-blur-sm">
        <CardHeader>
          <CardTitle>GPA Trajectory</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={gpaTrendData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                {/* Vertical Gradient for the Area Fill - Transparent to match theme */}
                <linearGradient id="colorGpaFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.15} />
                  <stop offset="35%" stopColor="#3b82f6" stopOpacity={0.1} />
                  <stop offset="65%" stopColor="#eab308" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0.05} />
                </linearGradient>

                {/* Vertical Gradient for the Stroke Line (Green -> Yellow -> Red) */}
                <linearGradient id="colorGpaStroke" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" />{" "}
                  {/* High GPA - Green */}
                  <stop offset="35%" stopColor="#3b82f6" />{" "}
                  {/* Good GPA - Blue */}
                  <stop offset="65%" stopColor="#eab308" />{" "}
                  {/* Warning - Yellow */}
                  <stop offset="95%" stopColor="#ef4444" />{" "}
                  {/* Low GPA - Red */}
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="hsl(var(--border))"
                opacity={0.3}
              />
              <XAxis
                dataKey="semester"
                tick={{ fontSize: 11, fill: "currentColor" }}
                axisLine={false}
                tickLine={false}
                dy={10}
              />
              <YAxis
                domain={[0, 5]}
                tick={{ fontSize: 11, fill: "currentColor" }}
                axisLine={false}
                tickLine={false}
                dx={-10}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  borderColor: "hsl(var(--border))",
                  borderRadius: "12px",
                  fontSize: "12px",
                  color: "hsl(var(--foreground))",
                  boxShadow:
                    "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                  border: "1px solid hsl(var(--border))",
                }}
                itemStyle={{
                  color: "hsl(var(--foreground))",
                  fontWeight: "bold",
                }}
                cursor={{
                  stroke: "hsl(var(--primary))",
                  strokeWidth: 1,
                  strokeDasharray: "5 5",
                  opacity: 0.5,
                }}
              />
              <Area
                type="monotone"
                dataKey="gpa"
                stroke="url(#colorGpaStroke)"
                strokeWidth={3}
                fillOpacity={1}
                dot={false}
                activeDot={{
                  r: 5,
                  stroke: "currentColor",
                  strokeWidth: 2,
                  fill: "currentColor",
                  className: "shadow-lg",
                }}
                fill="url(#colorGpaFill)"
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Effort vs Output */}
      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle>Study Hours vs. Grade</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis
                type="number"
                dataKey="studyHours"
                name="Study Hours"
                unit="h"
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="number"
                dataKey="gradePoint"
                name="Grade Point"
                domain={[0, 5]}
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  borderColor: "hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Scatter name="Courses" data={studyVsGradeData}>
                {studyVsGradeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Difficulty vs Success */}
      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle>Avg Grade by Course Difficulty</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={difficultyData}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                opacity={0.1}
              />
              <XAxis
                dataKey="difficulty"
                name="Difficulty (1-5)"
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[0, 5]}
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                cursor={{ fill: "hsl(var(--muted)/0.2)" }}
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  borderColor: "hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="avgGrade" radius={[4, 4, 0, 0]}>
                {difficultyData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      entry.avgGrade >= 4.0
                        ? "#22c55e"
                        : entry.avgGrade >= 3.0
                          ? "#3b82f6"
                          : entry.avgGrade >= 2.0
                            ? "#eab308"
                            : "#ef4444"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
