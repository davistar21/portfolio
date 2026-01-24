"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAcademics } from "@/hooks/useAcademics";
import {
  Loader2,
  GraduationCap,
  BookOpen,
  Library,
  BarChart3,
} from "lucide-react";
import CatalogImporter from "./CatalogImporter";
import CourseList from "./CourseList";
import AcademicsDashboard from "./AcademicsDashboard";

export default function AcademicsManager() {
  const { isLoading, cumulativeGPA, courses, catalog } = useAcademics();
  const [activeTab, setActiveTab] = useState("dashboard");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>CGPA</CardDescription>
            <CardTitle className="text-3xl font-bold text-primary">
              {cumulativeGPA?.cgpa?.toFixed(2) || "0.00"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Nigerian 5.0 Scale</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Units</CardDescription>
            <CardTitle className="text-3xl font-bold">
              {cumulativeGPA?.total_units_passed || 0}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              {cumulativeGPA?.total_units_attempted || 0} attempted
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Courses</CardDescription>
            <CardTitle className="text-3xl font-bold">
              {courses.length}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              {cumulativeGPA?.total_failed || 0} failed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Catalog</CardDescription>
            <CardTitle className="text-3xl font-bold">
              {catalog.length}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">courses imported</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="courses" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            My Courses
          </TabsTrigger>
          <TabsTrigger value="catalog" className="flex items-center gap-2">
            <Library className="w-4 h-4" />
            Catalog
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="mt-6">
          <AcademicsDashboard />
        </TabsContent>

        <TabsContent value="courses" className="mt-6">
          <CourseList />
        </TabsContent>

        <TabsContent value="catalog" className="mt-6">
          <CatalogImporter />
        </TabsContent>
      </Tabs>
    </div>
  );
}
