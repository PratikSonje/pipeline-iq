"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  totalPages: number;
}

export function Pagination({ totalPages }: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentPage = Number(searchParams.get("page")) || 1;

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between px-4 py-3 sm:px-6 bg-black/40 border-t border-white/10 rounded-b-2xl">
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-slate-400">
            Showing page <span className="font-medium text-white">{currentPage}</span> of{" "}
            <span className="font-medium text-white">{totalPages}</span>
          </p>
        </div>
        <div>
          <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            <Button
              variant="outline"
              size="icon"
              className="relative inline-flex items-center rounded-l-md px-2 py-2 border-white/10 bg-white/5 hover:bg-white/10 text-slate-400"
              onClick={() => router.push(createPageURL(currentPage - 1))}
              disabled={currentPage <= 1}
            >
              <span className="sr-only">Previous</span>
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </Button>
            <div className="px-4 py-2 border-y border-white/10 bg-white/5 text-sm font-medium text-white">
              {currentPage}
            </div>
            <Button
              variant="outline"
              size="icon"
              className="relative inline-flex items-center rounded-r-md px-2 py-2 border-white/10 bg-white/5 hover:bg-white/10 text-slate-400"
              onClick={() => router.push(createPageURL(currentPage + 1))}
              disabled={currentPage >= totalPages}
            >
              <span className="sr-only">Next</span>
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </nav>
        </div>
      </div>
    </div>
  );
}
