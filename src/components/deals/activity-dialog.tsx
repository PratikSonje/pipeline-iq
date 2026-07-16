"use client";

import { useState, useTransition } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createActivity } from "@/actions/activity";
import { FileText, Phone, Mail, Loader2, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

export function ActivityDialog({ dealId }: { dealId: string }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [type, setType] = useState<"NOTE" | "CALL" | "EMAIL">("NOTE");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    formData.append("type", type);
    formData.append("dealId", dealId);

    startTransition(async () => {
      const result = await createActivity(formData);
      if (result.error) {
        setError(result.error);
      } else {
        setOpen(false);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen} disablePointerDismissal>
      <DialogTrigger className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1.5">
        <Activity className="w-4 h-4" />
        Log Activity
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-black/60 backdrop-blur-xl border border-white/10 text-white shadow-2xl">
        <DialogHeader>
          <DialogTitle>Log Activity</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setType("NOTE")}
              className={cn(
                "flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-300",
                type === "NOTE" 
                  ? "bg-purple-500/20 border-purple-500/50 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.15)]" 
                  : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10"
              )}
            >
              <FileText className="w-5 h-5 mb-2" />
              <span className="text-xs font-medium">Note</span>
            </button>
            <button
              type="button"
              onClick={() => setType("CALL")}
              className={cn(
                "flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-300",
                type === "CALL" 
                  ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)]" 
                  : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10"
              )}
            >
              <Phone className="w-5 h-5 mb-2" />
              <span className="text-xs font-medium">Call</span>
            </button>
            <button
              type="button"
              onClick={() => setType("EMAIL")}
              className={cn(
                "flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-300",
                type === "EMAIL" 
                  ? "bg-blue-500/20 border-blue-500/50 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.15)]" 
                  : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10"
              )}
            >
              <Mail className="w-5 h-5 mb-2" />
              <span className="text-xs font-medium">Email</span>
            </button>
          </div>

          <div className="space-y-2">
            <label htmlFor="content" className="text-sm font-medium text-slate-300">
              Details
            </label>
            <textarea
              id="content"
              name="content"
              required
              rows={4}
              placeholder={`Log details about this ${type.toLowerCase()}...`}
              className="flex w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 resize-none"
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="bg-transparent border-white/10 text-white hover:bg-white/5"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isPending}
              className="bg-blue-600 hover:bg-blue-700 text-white border-0"
            >
              {isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Save Activity
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
