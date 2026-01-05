import React from "react";
import BlogGridSkeleton from "@/components/blog/BlogGridSkeleton";

export default function Loading() {
  return (
    <div className="container px-4 py-14 min-h-screen">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold pb-4 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
          Thoughts & Stories
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Exploring code, design, and the journey of building products.
        </p>
      </div>
      <BlogGridSkeleton />
    </div>
  );
}
