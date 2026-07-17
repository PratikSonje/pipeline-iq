import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Layout, Building2, Users, Calendar, ChevronLeft, Activity, Mail, Phone, FileText } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { formatDistanceToNow } from "date-fns";
import { ActivityDialog } from "@/components/deals/activity-dialog";
import { DeleteButton } from "@/components/ui/delete-button";
import { deleteActivity } from "@/actions/activity";

export default async function DealDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const deal = await prisma.deal.findUnique({
    where: { id, deletedAt: null },
    include: {
      company: true,
      contact: true,
      stage: true,
      user: { select: { name: true } },
      activities: {
        where: { deletedAt: null },
        orderBy: { createdAt: "desc" },
        include: { user: { select: { name: true } } },
      },
    },
  });

  if (!deal) {
    notFound();
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "EMAIL": return <Mail className="w-4 h-4 text-blue-400" />;
      case "CALL": return <Phone className="w-4 h-4 text-emerald-400" />;
      default: return <FileText className="w-4 h-4 text-purple-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start md:items-center gap-4">
          <Link 
            href="/pipeline"
            className="p-2 rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-white/10 shrink-0 mt-1 md:mt-0"
          >
            <ChevronLeft className="w-5 h-5 text-slate-400" />
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <Layout className="w-6 h-6 md:w-8 md:h-8 text-blue-400 shrink-0" />
              <span className="truncate">{deal.title}</span>
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-slate-400 text-sm">
              <span className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer">
                <Building2 className="w-4 h-4 shrink-0" />
                <Link href={`/companies/${deal.companyId}`}>{deal.company.name}</Link>
              </span>
              {deal.contact && (
                <span className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer">
                  <Users className="w-4 h-4 shrink-0" />
                  <Link href={`/contacts/${deal.contactId}`}>{deal.contact.firstName} {deal.contact.lastName}</Link>
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 shrink-0" />
                Opened {format(new Date(deal.createdAt), "MMM d, yyyy")}
              </span>
            </div>
          </div>
        </div>
        <div className="text-left md:text-right ml-14 md:ml-0">
          <p className="text-2xl md:text-3xl font-bold text-white">${deal.amount.toLocaleString()}</p>
          <span className="inline-block mt-2 text-xs font-medium bg-white/10 text-white px-3 py-1 rounded-full border border-white/20">
            Stage: {deal.stage.name}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 max-w-4xl">
        {/* Activity Feed Section */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl overflow-hidden flex flex-col">
          <div className="p-4 md:p-6 border-b border-white/10 bg-black/40 flex items-center justify-between gap-4">
            <h3 className="text-base md:text-lg font-medium text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-400 shrink-0" />
              Activity History
            </h3>
            <ActivityDialog dealId={deal.id} />
          </div>
          
          <div className="p-4 md:p-6">
            {deal.activities.length === 0 ? (
              <div className="p-8 md:p-12 flex flex-col items-center justify-center text-slate-400 text-sm border-2 border-dashed border-white/10 rounded-xl">
                <Activity className="w-10 h-10 text-slate-500 mb-3 opacity-50" />
                <p>No activity recorded yet.</p>
                <p className="mt-1 text-xs opacity-70">Log a note, call, or email to get started.</p>
              </div>
            ) : (
              <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
                {deal.activities.map((activity, index) => (
                  <div key={activity.id} className="relative flex items-start gap-4 md:gap-0 md:items-center md:justify-normal md:odd:flex-row-reverse group is-active">
                    {/* Timeline dot */}
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-black bg-white/10 text-slate-300 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow">
                      {getActivityIcon(activity.type)}
                    </div>
                    {/* Card */}
                    <div className="flex-1 md:w-[calc(50%-2.5rem)] md:flex-none p-4 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm shadow-sm hover:bg-white/10 transition-colors group/card relative min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-1 sm:gap-4">
                        <span className="font-semibold text-white text-sm capitalize">{activity.type.toLowerCase()}</span>
                        <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-2">
                          <time className="text-xs font-medium text-slate-400 whitespace-nowrap">
                            {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                          </time>
                          <DeleteButton 
                            id={activity.id} 
                            action={deleteActivity} 
                            className="opacity-100 sm:opacity-0 group-hover/card:opacity-100 transition-opacity p-1 w-6 h-6 hover:bg-red-500/20 text-slate-400 hover:text-red-400 shrink-0" 
                          />
                        </div>
                      </div>
                      <div className="text-slate-300 text-sm whitespace-pre-wrap break-words">
                        {activity.content}
                      </div>
                      <div className="mt-2 text-xs text-slate-500 flex items-center gap-1">
                        <span>Logged by</span>
                        <span className="text-slate-400 font-medium truncate">{activity.user.name}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
