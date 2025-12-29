import { Skeleton } from "@/components/ui/skeleton";

export default function ProjectSkeleton() {
  return (
    <div className="min-h-screen container px-4 py-24">
      <div className="max-w-4xl mx-auto space-y-8">
        <Skeleton className="w-full h-[50vh] rounded-xl" />
        <div className="flex gap-4">
          <Skeleton className="w-32 h-10 rounded-md" />
          <Skeleton className="w-32 h-10 rounded-md" />
        </div>
        <Skeleton className="w-3/4 h-12" />
        <div className="space-y-4">
          <Skeleton className="w-full h-4" />
          <Skeleton className="w-full h-4" />
          <Skeleton className="w-full h-4" />
          <Skeleton className="w-2/3 h-4" />
        </div>
      </div>
    </div>
  );
}
