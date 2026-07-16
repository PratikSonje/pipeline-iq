import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { KanbanBoard } from "@/components/pipeline/kanban-board";
import { DealDialog } from "@/components/pipeline/deal-dialog";
import { Layout } from "lucide-react";

export default async function PipelinePage() {
  const { userId } = await auth();

  // Fetch all stages ordered by their configured order
  const stages = await prisma.stage.findMany({
    orderBy: { order: "asc" },
  });

  // Fetch all deals that are not deleted
  const deals = await prisma.deal.findMany({
    where: { deletedAt: null },
    include: {
      company: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  // Fetch companies for the Add Deal dropdown
  const companies = await prisma.company.findMany({
    where: { deletedAt: null },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex items-center justify-between shrink-0 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Pipeline</h1>
          <p className="text-slate-400">Manage your deals and move them across stages.</p>
        </div>
        <DealDialog companies={companies} stages={stages} />
      </div>

      {stages.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 border-dashed">
          <Layout className="w-12 h-12 text-slate-500 mb-4" />
          <h3 className="text-lg font-medium text-white mb-1">No stages configured</h3>
          <p className="text-slate-400">Run the database seed script to generate default stages.</p>
        </div>
      ) : deals.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 border-dashed m-4 p-8 text-center animate-in fade-in zoom-in duration-500">
          <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mb-6 border border-blue-500/30">
            <Layout className="w-10 h-10 text-blue-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Your Pipeline is Empty</h3>
          <p className="text-slate-400 max-w-md mx-auto mb-8">
            You don't have any active deals yet. Create your first deal to start tracking revenue and moving prospects through your pipeline.
          </p>
          <div className="flex items-center gap-4">
            <DealDialog companies={companies} stages={stages} />
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-hidden -mx-8 relative z-10">
          <KanbanBoard initialDeals={deals} stages={stages} />
        </div>
      )}
    </div>
  );
}
