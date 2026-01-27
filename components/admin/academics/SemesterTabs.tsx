"use client";

import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface SemesterTabsProps {
  semesters: string[];
  activeSemester: string;
  excludedSemesterIds: Set<string>;
  onSelectSemester: (sem: string) => void;
  onToggleSemester: (sem: string) => void;
}

// Helper to format semester label: "100-1" -> "100LVL Sem 1"
const formatSemester = (semId: string) => {
  const parts = semId.split("-");
  if (parts.length !== 2) return semId;
  return `${parts[0]}LVL Sem ${parts[1]}`;
};

export default function SemesterTabs({
  semesters,
  activeSemester,
  excludedSemesterIds,
  onSelectSemester,
  onToggleSemester,
}: SemesterTabsProps) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
      {semesters.map((sem) => {
        const isExcluded = excludedSemesterIds.has(sem);
        const isActive = activeSemester === sem;
        return (
          <div
            key={sem}
            onClick={() => onSelectSemester(sem)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full border cursor-pointer transition-all whitespace-nowrap min-w-fit",
              isActive
                ? "bg-primary/10 border-primary shadow-sm"
                : "bg-card hover:bg-muted",
              isExcluded && "opacity-50",
            )}
          >
            <span
              className={cn(
                "font-medium text-sm",
                isActive ? "text-primary" : "text-muted-foreground",
              )}
            >
              {formatSemester(sem)}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleSemester(sem);
              }}
              className={cn(
                "p-1 rounded-full hover:bg-black/5 transition-colors",
                isExcluded ? "text-muted-foreground" : "text-primary",
              )}
              title={isExcluded ? "Include Semester" : "Exclude Semester"}
            >
              {isExcluded ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        );
      })}
    </div>
  );
}

export { formatSemester };
