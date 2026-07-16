"use client";

import { useTransition } from "react";
import { Trash2, Loader2 } from "lucide-react";

export function DeleteButton({ 
  id, 
  action, 
  className 
}: { 
  id: string, 
  action: (id: string) => Promise<any>, 
  className?: string 
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        if (confirm("Are you sure you want to delete this? This action cannot be undone.")) {
          startTransition(async () => {
            try {
              await action(id);
            } catch (error) {
              console.error("Failed to delete:", error);
              alert("Failed to delete item.");
            }
          });
        }
      }}
      disabled={isPending}
      className={`p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors flex items-center justify-center ${className || ""}`}
      title="Delete"
    >
      {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
    </button>
  );
}
