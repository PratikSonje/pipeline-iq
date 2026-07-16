"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { DealCard } from "./deal-card";

type DealType = {
  id: string;
  title: string;
  amount: number;
  company: {
    name: string;
  };
};

type StageType = {
  id: string;
  name: string;
  order: number;
  probability: number;
};

export function KanbanColumn({ 
  stage, 
  deals 
}: { 
  stage: StageType; 
  deals: DealType[] 
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: stage.id,
    data: {
      type: "Column",
      stage,
    },
  });

  const totalAmount = deals.reduce((sum, deal) => sum + deal.amount, 0);

  return (
    <div className="flex flex-col bg-white/5 backdrop-blur-md rounded-2xl w-[320px] shrink-0 border border-white/10 h-full max-h-full shadow-xl">
      {/* Column Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/40 rounded-t-2xl shrink-0">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-white">{stage.name}</h3>
          <span className="bg-white/10 border border-white/20 text-white text-xs px-2 py-0.5 rounded-full font-medium">
            {deals.length}
          </span>
        </div>
        <div className="text-sm font-medium text-slate-400">
          ${totalAmount.toLocaleString()}
        </div>
      </div>

      {/* Droppable Area */}
      <div 
        ref={setNodeRef} 
        className={`flex-1 p-3 overflow-y-auto flex flex-col gap-3 transition-colors ${
          isOver ? "bg-white/10" : ""
        }`}
      >
        <SortableContext items={deals.map(d => d.id)} strategy={verticalListSortingStrategy}>
          {deals.map(deal => (
            <DealCard key={deal.id} deal={deal} stageName={stage.name} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}
