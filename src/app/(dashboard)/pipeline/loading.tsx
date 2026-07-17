import { Skeleton } from "@/components/ui/skeleton";

export default function PipelineLoading() {
  return (
    <div className="flex-1 flex flex-col min-h-0 animate-in fade-in duration-500">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between shrink-0 mb-6">
        <div>
          <Skeleton className="h-8 w-32 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-32 rounded-md" />
      </div>

      {/* Kanban Board Skeleton */}
      <div className="flex-1 overflow-hidden -mx-8 relative z-10 px-8 flex gap-6">
        {/* 4 Skeleton Columns */}
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex-shrink-0 w-[350px] flex flex-col h-full bg-white/5 border border-white/10 rounded-xl overflow-hidden">
            {/* Column Header */}
            <div className="p-4 border-b border-white/10 bg-white/5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-6 rounded-full" />
              </div>
              <Skeleton className="h-5 w-16" />
            </div>
            
            {/* Column Body with Deal Card Skeletons */}
            <div className="p-3 flex-1 overflow-y-auto space-y-3">
              {[...Array(i === 0 ? 3 : i === 1 ? 5 : i === 2 ? 2 : 4)].map((_, j) => (
                <div key={j} className="bg-slate-900/80 border border-white/10 rounded-lg p-4 space-y-3">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <div className="pt-2 flex items-center justify-between">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-6 w-6 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
