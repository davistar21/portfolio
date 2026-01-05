import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container px-4 py-14 min-h-screen">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold pb-4 bg-clip-text text-transparent bg-gradient-to-br from-primary to-secondary">
          Projects
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          A collection of my work, experiments, and side projects.
        </p>
      </div>

      <div className="py-6">
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-[minmax(300px,auto)]">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-64 rounded-xl border bg-card p-4 space-y-4"
            >
              <Skeleton className="w-full h-32 rounded-lg" />
              <Skeleton className="w-3/4 h-6" />
              <Skeleton className="w-full h-4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
