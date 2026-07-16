import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { Building2, Globe, Briefcase, Plus } from "lucide-react";
import { CompanyDialog } from "@/components/companies/company-dialog";
import { DeleteButton } from "@/components/ui/delete-button";
import { deleteCompany } from "@/actions/company";

export default async function CompaniesPage() {
  const { userId } = await auth();

  const companies = await prisma.company.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { contacts: true, deals: true },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Companies</h1>
          <p className="text-slate-400">Manage your accounts and target organizations.</p>
        </div>
        <CompanyDialog />
      </div>

      {companies.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 border-dashed m-4 p-12 text-center animate-in fade-in zoom-in duration-500 mt-10">
          <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mb-6 border border-blue-500/30 shadow-[0_0_40px_rgba(59,130,246,0.3)]">
            <Building2 className="w-10 h-10 text-blue-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">No Companies Yet</h3>
          <p className="text-slate-400 max-w-md mx-auto mb-8">
            You don't have any organizations in your CRM. Get started by adding your first target company to build your account list.
          </p>
          <div className="flex items-center gap-4 relative z-20">
            <CompanyDialog />
          </div>
        </div>
      ) : (
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-black/40 border-b border-white/10 text-slate-400 font-medium">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Industry</th>
                <th className="px-6 py-4">Website</th>
                <th className="px-6 py-4">Contacts</th>
                <th className="px-6 py-4">Deals</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {companies.map((company) => (
                <tr key={company.id} className="hover:bg-white/5 transition-colors group cursor-pointer">
                  <td className="px-6 py-4 font-medium text-white relative">
                    <Link href={`/companies/${company.id}`} className="hover:text-blue-400 hover:underline transition-colors before:absolute before:inset-0">
                      {company.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-slate-300">
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-slate-500" />
                      {company.industry || "—"}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-300">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-slate-500" />
                      {company.website ? (
                        <a href={company.website} target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300 hover:underline">
                          {company.website.replace(/^https?:\/\//, '')}
                        </a>
                      ) : (
                        "—"
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-300">
                    {company._count.contacts}
                  </td>
                  <td className="px-6 py-4 text-slate-300">
                    {company._count.deals}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <DeleteButton id={company.id} action={deleteCompany} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
