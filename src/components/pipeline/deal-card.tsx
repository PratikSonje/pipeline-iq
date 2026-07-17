"use client";

import Link from "next/link";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { DeleteButton } from "@/components/ui/delete-button";
import { deleteDeal } from "@/actions/deal";

type DealType = {
  id: string;
  title: string;
  amount: number;
  company: {
    name: string;
  };
};

const STAGE_STYLES: Record<string, { border: string, badge: string }> = {
  "Lead / Prospect": { border: "border-l-blue-500", badge: "bg-blue-500/10 text-blue-400 ring-blue-500/30" },
  "Meeting Scheduled": { border: "border-l-purple-500", badge: "bg-purple-500/10 text-purple-400 ring-purple-500/30" },
  "Proposal Sent": { border: "border-l-amber-500", badge: "bg-amber-500/10 text-amber-400 ring-amber-500/30" },
  "Negotiation": { border: "border-l-orange-500", badge: "bg-orange-500/10 text-orange-400 ring-orange-500/30" },
  "Closed Won": { border: "border-l-emerald-500", badge: "bg-emerald-500/10 text-emerald-400 ring-emerald-500/30" },
  "Closed Lost": { border: "border-l-red-500", badge: "bg-red-500/10 text-red-400 ring-red-500/30" },
};

const FALLBACK_STYLE = { border: "border-l-slate-500", badge: "bg-slate-500/10 text-slate-400 ring-slate-500/30" };

export function DealCard({ deal, stageName }: { deal: DealType, stageName?: string }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: deal.id,
    data: {
      type: "Deal",
      deal,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const stageStyle = stageName ? STAGE_STYLES[stageName] || FALLBACK_STYLE : FALLBACK_STYLE;

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className={cn("opacity-50 border-2 border-dashed border-white/20 rounded-lg h-24 bg-white/5", stageStyle.border)}
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "deal-card touch-none bg-white/5 backdrop-blur-md p-3 rounded-lg border border-white/10 shadow-[0_0_15px_rgba(0,0,0,0.5)] group hover:bg-white/10 transition-colors cursor-grab active:cursor-grabbing flex flex-col gap-2 border-l-4",
        stageStyle.border
      )}
      {...attributes}
      {...listeners}
    >
      <div className="flex items-start justify-between gap-2">
        <Link 
          href={`/deals/${deal.id}`} 
          className="font-medium text-sm text-white leading-tight hover:text-blue-400 hover:underline transition-colors"
          onPointerDown={(e) => e.stopPropagation()}
        >
          {deal.title}
        </Link>
        <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <DeleteButton id={deal.id} action={deleteDeal} className="p-1 w-6 h-6 hover:bg-red-500/20 text-slate-400 hover:text-red-400" />
          <GripVertical className="w-4 h-4 text-slate-500" />
        </div>
      </div>
      
      <div className="flex items-center gap-1.5 text-xs text-slate-400">
        <Building2 className="w-3.5 h-3.5" />
        <span className="truncate">{deal.company.name}</span>
      </div>
      
      <div className="mt-1 flex items-center justify-between">
        <span className={cn(
          "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset",
          stageStyle.badge
        )}>
          ${deal.amount.toLocaleString()}
        </span>
      </div>
    </div>
  );
}
