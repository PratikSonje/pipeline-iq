"use client";

import { useTransition, useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Search, Loader2, X } from "lucide-react";

export function SearchInput({ placeholder = "Search..." }: { placeholder?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [value, setValue] = useState(searchParams.get("query")?.toString() || "");

  useEffect(() => {
    const timer = setTimeout(() => {
      const currentQuery = searchParams.get("query") || "";
      if (value === currentQuery) return; // Prevent infinite re-rendering loops

      const params = new URLSearchParams(searchParams.toString());
      
      if (value) {
        params.set("query", value);
      } else {
        params.delete("query");
      }
      
      // Always reset to page 1 when searching
      params.delete("page");

      startTransition(() => {
        router.replace(`${pathname}?${params.toString()}`);
      });
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [value, pathname, router, searchParams]);

  return (
    <div className="relative flex-1 max-w-sm">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Search className="h-4 w-4 text-slate-500" />
      </div>
      <Input
        type="text"
        className="pl-10 pr-10 bg-black/40 border-white/10 text-white placeholder:text-slate-500 rounded-lg focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:border-blue-500"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
        ) : value ? (
          <button onClick={() => setValue("")} className="text-slate-500 hover:text-white transition-colors">
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>
    </div>
  );
}
