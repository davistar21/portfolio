import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div
      className={`group relative overflow-hidden rounded-xl bg-card border shadow-sm flex flex-col`}
    >
      {/* Image Skeleton */}
      <div className="relative w-full h-48 sm:h-56 overflow-hidden">
        <Skeleton className="w-full h-full" />
      </div>

      {/* Content Skeleton */}
      <div className="p-5 flex flex-col flex-1 gap-3">
        <div className="flex gap-2 mb-1">
          <Skeleton className="w-16 h-4 rounded-full" />
          <Skeleton className="w-20 h-4 rounded-full" />
        </div>

        <Skeleton className="w-3/4 h-8" />
        <Skeleton className="w-full h-4" />
        <Skeleton className="w-2/3 h-4" />

        <div className="mt-auto pt-4 flex items-center justify-between">
          <Skeleton className="w-24 h-4" />
          <Skeleton className="w-8 h-8 rounded-full" />
        </div>
      </div>
    </div>
  );
}
