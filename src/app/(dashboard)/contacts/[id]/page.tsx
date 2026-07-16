import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Users, Mail, Phone, Building2, Layout, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default async function ContactDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const contact = await prisma.contact.findUnique({
    where: { id, deletedAt: null },
    include: {
      company: true,
      deals: {
        where: { deletedAt: null },
        include: { stage: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!contact) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link 
          href="/contacts"
          className="p-2 rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-white/10"
        >
          <ChevronLeft className="w-5 h-5 text-slate-400" />
        </Link>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 text-2xl font-semibold">
            {contact.firstName[0]}{contact.lastName[0]}
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              {contact.firstName} {contact.lastName}
            </h1>
            <div className="flex items-center gap-4 mt-2 text-slate-400 text-sm">
              <span className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer">
                <Building2 className="w-4 h-4" />
                <Link href={`/companies/${contact.companyId}`}>{contact.company.name}</Link>
              </span>
              {contact.email && (
                <span className="flex items-center gap-1.5">
                  <Mail className="w-4 h-4" />
                  <a href={`mailto:${contact.email}`} className="text-blue-400 hover:underline">
                    {contact.email}
                  </a>
                </span>
              )}
              {contact.phone && (
                <span className="flex items-center gap-1.5">
                  <Phone className="w-4 h-4" />
                  {contact.phone}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Deals Section */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl overflow-hidden flex flex-col">
          <div className="p-6 border-b border-white/10 bg-black/40">
            <h3 className="text-lg font-medium text-white flex items-center gap-2">
              <Layout className="w-5 h-5 text-blue-400" />
              Associated Deals ({contact.deals.length})
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto max-h-[600px]">
            {contact.deals.length === 0 ? (
              <div className="p-12 flex flex-col items-center justify-center text-slate-400 text-sm border-2 border-dashed border-white/10 m-6 rounded-xl">
                <Layout className="w-10 h-10 text-slate-500 mb-3 opacity-50" />
                <p>No active deals directly linked to this contact.</p>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {contact.deals.map((deal) => (
                  <Link 
                    href={`/deals/${deal.id}`} 
                    key={deal.id}
                    className="flex items-center justify-between p-4 px-6 hover:bg-white/5 transition-colors group"
                  >
                    <div>
                      <p className="font-medium text-white group-hover:text-blue-400 transition-colors">
                        {deal.title}
                      </p>
                      <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                        <span>Opened {format(new Date(deal.createdAt), "MMM d, yyyy")}</span>
                        <span>•</span>
                        <span>{contact.company.name}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-white">${deal.amount.toLocaleString()}</p>
                      <span className="inline-block mt-1 text-[10px] font-medium bg-white/10 text-slate-300 px-2 py-0.5 rounded border border-white/10">
                        {deal.stage.name}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
