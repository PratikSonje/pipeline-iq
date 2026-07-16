"use client";

import { useState, useTransition, useEffect, useRef } from "react";
import { 
  DndContext, 
  DragOverlay, 
  closestCorners, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { KanbanColumn } from "./kanban-column";
import { DealCard } from "./deal-card";
import { updateDealStage } from "@/actions/deal";

type DealType = {
  id: string;
  title: string;
  amount: number;
  stageId: string;
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

export function KanbanBoard({ 
  initialDeals, 
  stages 
}: { 
  initialDeals: DealType[]; 
  stages: StageType[];
}) {
  const [deals, setDeals] = useState<DealType[]>(initialDeals);
  const [activeDeal, setActiveDeal] = useState<DealType | null>(null);
  const [isPending, startTransition] = useTransition();

  // Panning State
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  useEffect(() => {
    setDeals(initialDeals);
  }, [initialDeals]);

  // Handle Wheel to Scroll Horizontally
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      if (e.deltaY !== 0 && Math.abs(e.deltaX) < Math.abs(e.deltaY)) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    // Only pan if we aren't clicking a deal card
    if ((e.target as HTMLElement).closest('.deal-card')) return;
    
    if (!scrollRef.current) return;
    setIsPanning(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => setIsPanning(false);
  const handleMouseUp = () => setIsPanning(false);
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Fast scrolling
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Requires a 5px movement before dragging starts (prevents accidental drags when clicking)
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    const deal = deals.find(d => d.id === active.id);
    if (deal) setActiveDeal(deal);
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveDeal = active.data.current?.type === "Deal";
    const isOverDeal = over.data.current?.type === "Deal";
    const isOverColumn = over.data.current?.type === "Column";

    if (!isActiveDeal) return;

    // Moving deal over another deal
    if (isOverDeal) {
      setDeals((prev) => {
        const activeIndex = prev.findIndex(d => d.id === activeId);
        const overIndex = prev.findIndex(d => d.id === overId);
        
        if (prev[activeIndex].stageId !== prev[overIndex].stageId) {
          const newDeals = [...prev];
          newDeals[activeIndex] = { ...newDeals[activeIndex], stageId: prev[overIndex].stageId };
          return newDeals;
        }
        return prev;
      });
    }

    // Moving deal over an empty column
    if (isOverColumn) {
      setDeals((prev) => {
        const activeIndex = prev.findIndex(d => d.id === activeId);
        
        if (prev[activeIndex].stageId !== overId) {
          const newDeals = [...prev];
          newDeals[activeIndex] = { ...newDeals[activeIndex], stageId: overId as string };
          return newDeals;
        }
        return prev;
      });
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveDeal(null);
    const { active, over } = event;
    
    if (!over) return;

    const activeId = active.id as string;
    const deal = deals.find(d => d.id === activeId);
    
    if (!deal) return;
    
    const originalDeal = initialDeals.find(d => d.id === activeId);
    
    if (originalDeal && originalDeal.stageId !== deal.stageId) {
      // Trigger the server action if the stage changed
      startTransition(async () => {
        try {
          await updateDealStage(activeId, deal.stageId);
        } catch (error) {
          console.error("Failed to update deal stage:", error);
          // Rollback on error
          setDeals(initialDeals);
        }
      });
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div 
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className={`flex gap-6 h-full overflow-x-auto pb-4 px-8 min-h-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] ${isPanning ? "cursor-grabbing" : "cursor-grab"}`}
      >
        {stages.map(stage => (
          <KanbanColumn 
            key={stage.id} 
            stage={stage} 
            deals={deals.filter(d => d.stageId === stage.id)} 
          />
        ))}
      </div>

      <DragOverlay>
        {activeDeal ? <DealCard deal={activeDeal} /> : null}
      </DragOverlay>
    </DndContext>
  );
}
