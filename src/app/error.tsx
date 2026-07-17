"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global Error Boundary caught an error:", error);
  }, [error]);

  return (
    <div className="flex h-[80vh] w-full flex-col items-center justify-center space-y-4 p-8 text-center animate-in fade-in zoom-in duration-500">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10 border border-red-500/20 backdrop-blur-xl mb-4">
        <AlertCircle className="h-10 w-10 text-red-500" />
      </div>
      <h2 className="text-2xl font-bold tracking-tight text-white">
        Something went wrong!
      </h2>
      <p className="text-slate-400 max-w-md mx-auto">
        We apologize for the inconvenience. An unexpected error occurred while trying to load this page.
      </p>
      <div className="pt-4">
        <Button 
          onClick={() => reset()}
          className="bg-white text-black hover:bg-slate-200 font-medium px-8"
        >
          Try again
        </Button>
      </div>
    </div>
  );
}
