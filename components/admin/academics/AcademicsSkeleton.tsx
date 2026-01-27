"use client";

export default function AcademicsSkeleton() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-pulse">
      {/* GPA Header Skeleton */}
      <div className="flex flex-col items-center justify-center py-8 bg-card border rounded-2xl">
        <div className="w-36 h-36 rounded-full border-8 border-muted bg-muted/50" />
        <div className="mt-4 h-5 w-32 bg-muted rounded" />
      </div>

      {/* Semester Tabs Skeleton */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-10 w-32 rounded-full bg-muted shrink-0" />
        ))}
      </div>

      {/* Table Skeleton */}
      <div className="bg-card rounded-xl border overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b bg-muted/30">
          <div className="h-5 w-32 bg-muted rounded" />
          <div className="h-6 w-16 bg-muted rounded" />
        </div>
        <div className="p-4 space-y-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="h-4 w-20 bg-muted rounded" />
              <div className="h-4 flex-1 bg-muted rounded hidden md:block" />
              <div className="h-8 w-16 bg-muted rounded" />
              <div className="h-4 w-8 bg-muted rounded" />
              <div className="h-8 w-16 bg-muted rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
