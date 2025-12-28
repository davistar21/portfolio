import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";

export default function BlogPostSkeleton() {
  return (
    <div className="min-h-screen pb-24">
      {/* Hero Section Skeleton */}
      <div className="relative h-[40vh] md:h-[50vh] w-full bg-muted overflow-hidden rounded-lg">
        <Skeleton className="w-full h-full" />

        {/* Overlay Content */}
        <div className="absolute bottom-0 left-0 w-full p-4 md:p-12 max-w-4xl mx-auto z-10">
          <div className="inline-flex items-center gap-2 text-muted-foreground mb-6">
            <ArrowLeft className="w-4 h-4" />
            <Skeleton className="w-24 h-4" />
          </div>

          <Skeleton className="w-3/4 h-12 mb-4" />

          <div className="flex gap-6">
            <Skeleton className="w-32 h-6" />
            <Skeleton className="w-32 h-6" />
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="container max-w-3xl mx-auto px-4 mt-12 space-y-8">
        {/* Tagline */}
        <div className="pl-4 border-l-4 border-muted">
          <Skeleton className="w-full h-8 mb-2" />
          <Skeleton className="w-2/3 h-8" />
        </div>

        {/* Paragraphs */}
        <div className="space-y-4">
          <Skeleton className="w-full h-4" />
          <Skeleton className="w-full h-4" />
          <Skeleton className="w-5/6 h-4" />
          <Skeleton className="w-full h-4" />
        </div>

        <Skeleton className="w-full h-64 rounded-xl" />

        <div className="space-y-4">
          <Skeleton className="w-full h-4" />
          <Skeleton className="w-11/12 h-4" />
          <Skeleton className="w-full h-4" />
        </div>
      </div>
    </div>
  );
}
