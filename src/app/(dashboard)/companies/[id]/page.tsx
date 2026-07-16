import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Building2, Globe, Briefcase, Mail, Phone, Layout, ChevronLeft, Users } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default async function CompanyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const company = await prisma.company.findUnique({
    where: { id, deletedAt: null },
    include: {
      contacts: {
        where: { deletedAt: null },
        orderBy: { createdAt: "desc" },
      },
      deals: {
        where: { deletedAt: null },
        include: { stage: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!company) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link 
          href="/companies"
          className="p-2 rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-white/10"
        >
          <ChevronLeft className="w-5 h-5 text-slate-400" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <Building2 className="w-8 h-8 text-emerald-400" />
            {company.name}
          </h1>
          <div className="flex items-center gap-4 mt-2 text-slate-400 text-sm">
            {company.industry && (
              <span className="flex items-center gap-1.5">
                <Briefcase className="w-4 h-4" />
                {company.industry}
              </span>
            )}
            {company.website && (
              <span className="flex items-center gap-1.5">
                <Globe className="w-4 h-4" />
                <a href={company.website} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">
                  {company.website.replace(/^https?:\/\//, '')}
                </a>
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contacts Section */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[600px]">
          <div className="p-6 border-b border-white/10 bg-black/40">
            <h3 className="text-lg font-medium text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-400" />
              Contacts ({company.contacts.length})
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto">
            {company.contacts.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-sm">No contacts associated with this company.</div>
            ) : (
              <div className="divide-y divide-white/5">
                {company.contacts.map((contact) => (
                  <Link 
                    href={`/contacts/${contact.id}`} 
                    key={contact.id}
                    className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors group"
                  >
                    <div>
                      <p className="font-medium text-white group-hover:text-blue-400 transition-colors">
                        {contact.firstName} {contact.lastName}
                      </p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                        {contact.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{contact.email}</span>}
                        {contact.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{contact.phone}</span>}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Deals Section */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[600px]">
          <div className="p-6 border-b border-white/10 bg-black/40">
            <h3 className="text-lg font-medium text-white flex items-center gap-2">
              <Layout className="w-5 h-5 text-blue-400" />
              Deals ({company.deals.length})
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto">
            {company.deals.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-sm">No deals associated with this company.</div>
            ) : (
              <div className="divide-y divide-white/5">
                {company.deals.map((deal) => (
                  <Link 
                    href={`/deals/${deal.id}`} 
                    key={deal.id}
                    className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors group"
                  >
                    <div>
                      <p className="font-medium text-white group-hover:text-blue-400 transition-colors">
                        {deal.title}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        Opened {format(new Date(deal.createdAt), "MMM d, yyyy")}
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
