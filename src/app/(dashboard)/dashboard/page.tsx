import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { DashboardCharts } from "@/components/dashboard/dashboard-charts";
import { CircleDollarSign, TrendingUp, Trophy } from "lucide-react";

export default async function DashboardPage() {
  const { userId } = await auth();

  // Fetch all active deals with their stages
  const deals = await prisma.deal.findMany({
    where: { 
      deletedAt: null,
      status: "OPEN",
    },
    include: { stage: true }
  });

  // Calculate High-level Metrics
  const totalPipeline = deals.reduce((acc, deal) => acc + deal.amount, 0);
  const weightedForecast = deals.reduce((acc, deal) => acc + (deal.amount * (deal.stage.probability / 100)), 0);
  
  const wonDealsCount = await prisma.deal.count({
    where: { deletedAt: null, status: "WON" }
  });

  // Calculate data for Pie Chart (Deals by Stage)
  const stageMap = new Map<string, number>();
  deals.forEach(deal => {
    const current = stageMap.get(deal.stage.name) || 0;
    stageMap.set(deal.stage.name, current + 1);
  });
  
  const stageDistribution = Array.from(stageMap.entries()).map(([name, value]) => ({ name, value }));

  // Calculate data for Bar Chart (Expected vs Weighted by Stage)
  const forecastMap = new Map<string, { expected: number, weighted: number }>();
  deals.forEach(deal => {
    const current = forecastMap.get(deal.stage.name) || { expected: 0, weighted: 0 };
    forecastMap.set(deal.stage.name, {
      expected: current.expected + deal.amount,
      weighted: current.weighted + (deal.amount * (deal.stage.probability / 100)),
    });
  });
  
  const forecastData = Array.from(forecastMap.entries()).map(([name, data]) => ({
    name,
    expected: data.expected,
    weighted: data.weighted,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Dashboard</h1>
        <p className="text-slate-400">Welcome to your PipelineIQ overview.</p>
      </div>
      
      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl flex items-center gap-4 hover:bg-white/10 transition-colors">
          <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center border border-blue-500/30">
            <CircleDollarSign className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-400">Total Pipeline</p>
            <h4 className="text-2xl font-bold text-white">${totalPipeline.toLocaleString()}</h4>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl flex items-center gap-4 hover:bg-white/10 transition-colors">
          <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center border border-emerald-500/30">
            <TrendingUp className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-400">Weighted Forecast</p>
            <h4 className="text-2xl font-bold text-white">${weightedForecast.toLocaleString()}</h4>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl flex items-center gap-4 hover:bg-white/10 transition-colors">
          <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center border border-amber-500/30">
            <Trophy className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-400">Deals Won</p>
            <h4 className="text-2xl font-bold text-white">{wonDealsCount}</h4>
          </div>
        </div>
      </div>

      {/* Charts */}
      <DashboardCharts 
        stageDistribution={stageDistribution} 
        forecastData={forecastData} 
      />
    </div>
  );
}
