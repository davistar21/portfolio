"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAcademics } from "@/hooks/useAcademics";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7300",
  "#00C49F",
  "#0088FE",
];
const GRADE_COLORS: Record<string, string> = {
  A: "#22c55e",
  B: "#3b82f6",
  C: "#f59e0b",
  D: "#f97316",
  E: "#ef4444",
  F: "#dc2626",
};

export default function AcademicsDashboard() {
  const { courses, semesterGPAs, cumulativeGPA } = useAcademics();

  // GPA Trend Data
  const gpaTrendData = semesterGPAs.map((sem) => ({
    semester: sem.semester_id,
    gpa: sem.gpa,
    units: sem.total_units,
  }));

  // Grade Distribution
  const gradeDistribution = courses.reduce(
    (acc, course) => {
      if (course.grade) {
        acc[course.grade] = (acc[course.grade] || 0) + 1;
      }
      return acc;
    },
    {} as Record<string, number>,
  );

  const gradeDistData = Object.entries(gradeDistribution).map(
    ([grade, count]) => ({
      grade,
      count,
      fill: GRADE_COLORS[grade] || "#888",
    }),
  );

  // Category Performance
  const categoryData = courses.reduce(
    (acc, course) => {
      if (course.grade_point !== null) {
        if (!acc[course.category]) {
          acc[course.category] = { total: 0, count: 0 };
        }
        acc[course.category].total += course.grade_point;
        acc[course.category].count += 1;
      }
      return acc;
    },
    {} as Record<string, { total: number; count: number }>,
  );

  const radarData = Object.entries(categoryData).map(([category, data]) => ({
    category: category.charAt(0).toUpperCase() + category.slice(1),
    gpa: data.count > 0 ? +(data.total / data.count).toFixed(2) : 0,
    fullMark: 5,
  }));

  // Units by Semester (Area Chart)
  const unitsData = semesterGPAs.map((sem) => ({
    semester: sem.semester_id,
    passed: sem.passed_units,
    failed: sem.total_units - sem.passed_units,
  }));

  // Study Hours Correlation (if data exists)
  const studyData = courses
    .filter((c) => c.study_hours && c.grade_point !== null)
    .map((c) => ({
      hours: c.study_hours,
      gp: c.grade_point,
      name: c.code,
    }));

  if (courses.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          <p>No course data yet. Add courses to see visualizations.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* GPA Trend Line Chart */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>GPA Trend</CardTitle>
          <CardDescription>
            Your semester-by-semester performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={gpaTrendData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="semester" className="text-xs" />
              <YAxis domain={[0, 5]} className="text-xs" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Line
                type="monotone"
                dataKey="gpa"
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Grade Distribution Pie Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Grade Distribution</CardTitle>
          <CardDescription>Breakdown of your grades</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={gradeDistData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ grade, count }) => `${grade}: ${count}`}
                outerRadius={80}
                dataKey="count"
              >
                {gradeDistData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Category Performance Radar */}
      <Card>
        <CardHeader>
          <CardTitle>Category Performance</CardTitle>
          <CardDescription>Performance by course type</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="category" className="text-xs" />
              <PolarRadiusAxis domain={[0, 5]} />
              <Radar
                name="GPA"
                dataKey="gpa"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary))"
                fillOpacity={0.5}
              />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Units Progress Area Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Units by Semester</CardTitle>
          <CardDescription>Passed vs failed units</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={unitsData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="semester" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Area
                type="monotone"
                dataKey="passed"
                stackId="1"
                stroke="#22c55e"
                fill="#22c55e"
                fillOpacity={0.6}
              />
              <Area
                type="monotone"
                dataKey="failed"
                stackId="1"
                stroke="#ef4444"
                fill="#ef4444"
                fillOpacity={0.6}
              />
              <Legend />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Study Hours Correlation (if data exists) */}
      {studyData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Study Hours vs Grade</CardTitle>
            <CardDescription>
              Does more study time = better grades?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="hours" name="Hours" className="text-xs" />
                <YAxis
                  dataKey="gp"
                  domain={[0, 5]}
                  name="GP"
                  className="text-xs"
                />
                <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                <Scatter data={studyData} fill="hsl(var(--primary))" />
              </ScatterChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
