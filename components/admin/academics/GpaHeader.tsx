"use client";

import { cn } from "@/lib/utils";
import { BarChart3 } from "lucide-react";

interface GpaHeaderProps {
  cgpa: number;
  totalUnits: number;
  onToggleInsights: () => void;
}

export default function GpaHeader({
  cgpa,
  totalUnits,
  onToggleInsights,
}: GpaHeaderProps) {
  // Color based on GPA range
  const getGpaColor = (gpa: number) => {
    if (gpa >= 4.5) return "text-green-500 border-green-500";
    if (gpa >= 3.5) return "text-blue-500 border-blue-500";
    if (gpa >= 2.5) return "text-yellow-500 border-yellow-500";
    if (gpa >= 1.5) return "text-orange-500 border-orange-500";
    return "text-red-500 border-red-500";
  };

  return (
    <div className="flex flex-col items-center justify-center py-8 bg-card border rounded-2xl shadow-sm">
      <div
        className={cn(
          "relative flex items-center justify-center w-36 h-36 rounded-full border-8",
          getGpaColor(cgpa),
        )}
      >
        <div className="text-center">
          <h1
            className={cn(
              "text-4xl font-bold",
              getGpaColor(cgpa).split(" ")[0],
            )}
          >
            {cgpa.toFixed(2)}
          </h1>
          <p className="text-sm text-muted-foreground font-medium">CGPA</p>
        </div>
      </div>
      <div className="mt-4 text-center">
        <p className="text-lg font-medium text-muted-foreground">
          Units Total:{" "}
          <span className="text-foreground font-bold">{totalUnits}</span>
        </p>
      </div>

      <button
        onClick={onToggleInsights}
        className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-primary transition-colors hover:bg-muted/50 rounded-full"
        title="Toggle Analytics"
      >
        <BarChart3 size={20} />
      </button>
    </div>
  );
}
