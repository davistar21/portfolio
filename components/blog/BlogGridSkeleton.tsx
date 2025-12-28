import { Skeleton } from "@/components/ui/skeleton";

export default function BlogGridSkeleton() {
  // Create an array of 6 items to simulate multiple posts loading
  const items = Array.from({ length: 6 });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[minmax(300px,auto)]">
      {items.map((_, i) => {
        // Match the bento grid pattern for skeletons roughly
        // Index % 7 === 0: col-span-2 (Wide)
        // Index % 7 === 3: col-span-1 row-span-2 (Tall)
        const isWide = i % 7 === 0;
        const isTall = i % 7 === 3;

        let spanClass = "";
        if (isWide) spanClass = "md:col-span-2";
        else if (isTall) spanClass = "row-span-2";

        return (
          <div
            key={i}
            className={`group relative overflow-hidden rounded-xl bg-card border shadow-sm flex flex-col ${spanClass}`}
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
      })}
    </div>
  );
}
