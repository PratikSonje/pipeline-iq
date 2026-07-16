"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2, Building2, Users, Layout, CornerDownLeft } from "lucide-react";
import { globalSearch, SearchResult } from "@/actions/search";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isPending, startTransition] = useTransition();
  const [activeIndex, setActiveIndex] = useState(0);
  const router = useRouter();

  // Keyboard shortcut & Custom Event listener
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    const openEvent = () => setOpen(true);
    
    document.addEventListener("keydown", down);
    window.addEventListener("open-command-palette", openEvent);
    
    return () => {
      document.removeEventListener("keydown", down);
      window.removeEventListener("open-command-palette", openEvent);
    };
  }, []);

  // Reset state when closed
  useEffect(() => {
    if (!open) {
      setQuery("");
      setResults([]);
      setActiveIndex(0);
    }
  }, [open]);

  // Debounced search
  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(() => {
      startTransition(async () => {
        try {
          const res = await globalSearch(query);
          setResults(res);
          setActiveIndex(0);
        } catch (error) {
          console.error(error);
        }
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Keyboard navigation for results
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open || results.length === 0) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((prev) => (prev + 1) % results.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((prev) => (prev - 1 + results.length) % results.length);
      } else if (e.key === "Enter") {
        e.preventDefault();
        const selected = results[activeIndex];
        if (selected) {
          router.push(selected.url);
          setOpen(false);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, results, activeIndex, router]);

  const handleSelect = (url: string) => {
    router.push(url);
    setOpen(false);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "deal": return <Layout className="w-4 h-4 text-blue-400" />;
      case "company": return <Building2 className="w-4 h-4 text-emerald-400" />;
      case "contact": return <Users className="w-4 h-4 text-purple-400" />;
      default: return <Search className="w-4 h-4" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden bg-black/60 backdrop-blur-xl border border-white/10 shadow-2xl">
        {/* Hidden Title for Accessibility */}
        <DialogTitle className="sr-only">Global Search Command Palette</DialogTitle>
        
        <div className="flex items-center border-b border-white/10 px-4">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            className="flex h-14 w-full bg-transparent px-3 py-4 text-base text-white outline-none placeholder:text-slate-500"
            placeholder="Search deals, companies, or contacts..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          {isPending && <Loader2 className="w-5 h-5 text-slate-400 animate-spin shrink-0" />}
          <div className="hidden sm:flex items-center gap-1 shrink-0 bg-white/5 px-1.5 py-0.5 rounded text-xs text-slate-400 font-medium border border-white/10">
            ESC
          </div>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {query.length >= 2 && results.length === 0 && !isPending && (
            <div className="p-12 text-center text-sm text-slate-400">
              No results found for "{query}".
            </div>
          )}

          {query.length < 2 && (
            <div className="p-8 text-center text-sm text-slate-500 flex flex-col items-center gap-3">
              <Search className="w-8 h-8 opacity-20" />
              <p>Type at least 2 characters to search across PipelineIQ.</p>
            </div>
          )}

          {results.length > 0 && (
            <div className="p-2 space-y-1">
              {results.map((result, index) => (
                <div
                  key={`${result.type}-${result.id}`}
                  onClick={() => handleSelect(result.url)}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors ${
                    activeIndex === index 
                      ? "bg-white/10 border border-white/10 shadow-sm" 
                      : "border border-transparent hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 border border-white/10">
                      {getIcon(result.type)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{result.title}</p>
                      <p className="text-xs text-slate-400">{result.subtitle}</p>
                    </div>
                  </div>
                  
                  {activeIndex === index && (
                    <div className="hidden sm:flex items-center gap-1 text-xs text-slate-400 font-medium mr-2">
                      <span className="opacity-70">Jump to</span>
                      <CornerDownLeft className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
