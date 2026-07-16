"use client";

import { useState, useTransition } from "react";
import { Plus, Loader2 } from "lucide-react";
import { createDeal } from "@/actions/deal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function DealDialog({ 
  companies, 
  stages 
}: { 
  companies: { id: string, name: string }[],
  stages: { id: string, name: string }[]
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title") as string,
      amount: formData.get("amount") as string,
      companyId: formData.get("companyId") as string,
      stageId: formData.get("stageId") as string,
    };

    if (!data.companyId || !data.stageId) {
      setError("Please select a company and a stage.");
      return;
    }

    startTransition(async () => {
      try {
        await createDeal({
          ...data,
          amount: parseFloat(data.amount) || 0
        });
        setOpen(false);
      } catch (err: any) {
        setError(err.message || "Something went wrong.");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (!newOpen) setError("");
      setOpen(newOpen);
    }} disablePointerDismissal>
      <DialogTrigger 
        render={
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Deal
          </Button>
        }
      />
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add new deal</DialogTitle>
          <DialogDescription>
            Create a new sales opportunity in your pipeline.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {error && (
              <div className="text-sm font-medium text-red-500 bg-red-50 p-3 rounded-md">
                {error}
              </div>
            )}
            
            <div className="grid gap-2">
              <Label htmlFor="title">Deal Title *</Label>
              <Input
                id="title"
                name="title"
                placeholder="Enterprise License"
                required
                disabled={isPending}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="amount">Amount ($) *</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                min="0"
                step="0.01"
                placeholder="10000"
                required
                disabled={isPending}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="companyId">Company *</Label>
              <select 
                id="companyId" 
                name="companyId" 
                required
                disabled={isPending}
                className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-base ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="" className="bg-black text-white">Select a company...</option>
                {companies.map(company => (
                  <option key={company.id} value={company.id} className="bg-black text-white">{company.name}</option>
                ))}
              </select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="stageId">Starting Stage *</Label>
              <select 
                id="stageId" 
                name="stageId" 
                required
                disabled={isPending}
                className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-base ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="" className="bg-black text-white">Select a stage...</option>
                {stages.map(stage => (
                  <option key={stage.id} value={stage.id} className="bg-black text-white">{stage.name}</option>
                ))}
              </select>
            </div>
            
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending} className="bg-blue-600 hover:bg-blue-700">
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Deal
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
