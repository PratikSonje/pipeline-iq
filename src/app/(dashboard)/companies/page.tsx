import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { Building2, Globe, Briefcase } from "lucide-react";
import { CompanyDialog } from "@/components/companies/company-dialog";
import { DeleteButton } from "@/components/ui/delete-button";
import { deleteCompany } from "@/actions/company";
import { SearchInput } from "@/components/ui/search-input";
import { Pagination } from "@/components/ui/pagination";

export default async function CompaniesPage({
  searchParams,
}: {
  searchParams?: Promise<{ query?: string; page?: string }>;
}) {
  const { userId } = await auth();

  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams?.query || "";
  const currentPage = Number(resolvedSearchParams?.page) || 1;
  const ITEMS_PER_PAGE = 25;

  const whereClause = {
    deletedAt: null,
    ...(query ? { name: { contains: query, mode: "insensitive" as const } } : {}),
  };

  const [companies, totalCount] = await Promise.all([
    prisma.company.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      skip: (currentPage - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
      include: {
        _count: {
          select: { contacts: true, deals: true },
        },
      },
    }),
    prisma.company.count({ where: whereClause }),
  ]);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Companies</h1>
          <p className="text-slate-400">Manage your accounts and target organizations.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
          <SearchInput placeholder="Search companies..." />
          <CompanyDialog />
        </div>
      </div>

      {companies.length === 0 && !query ? (
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
      ) : companies.length === 0 && query ? (
        <div className="flex-1 flex flex-col items-center justify-center bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 border-dashed m-4 p-12 text-center mt-10">
          <h3 className="text-xl font-bold text-white mb-2">No results found</h3>
          <p className="text-slate-400">No companies matched your search "{query}".</p>
        </div>
      ) : (
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl flex flex-col overflow-hidden">
          {/* Mobile Card Layout (< 768px) */}
          <div className="block md:hidden divide-y divide-white/5">
            {companies.map((company) => (
              <div key={company.id} className="p-5 space-y-4 hover:bg-white/5 transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <Link href={`/companies/${company.id}`} className="text-lg font-semibold text-white hover:text-blue-400 hover:underline">
                      {company.name}
                    </Link>
                    <div className="flex items-center gap-2 mt-1 text-sm text-slate-400">
                      <Briefcase className="w-4 h-4" />
                      {company.industry || "No Industry"}
                    </div>
                  </div>
                  <DeleteButton id={company.id} action={deleteCompany} />
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-slate-500 mb-1">Website</p>
                    {company.website ? (
                      <a href={company.website} target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300 flex items-center gap-1">
                        <Globe className="w-3 h-3" />
                        Link
                      </a>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </div>
                  <div>
                    <p className="text-slate-500 mb-1">Pipeline</p>
                    <p className="text-slate-300">{company._count.deals} Deals</p>
                  </div>
                  <div>
                    <p className="text-slate-500 mb-1">Contacts</p>
                    <p className="text-slate-300">{company._count.contacts} People</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table Layout (>= 768px) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm text-left whitespace-nowrap">
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
                        <Briefcase className="w-4 h-4 text-slate-500 shrink-0" />
                        {company.industry || "—"}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-300">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-slate-500 shrink-0" />
                        {company.website ? (
                          <a href={company.website} target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300 hover:underline z-10 relative">
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
                    <td className="px-6 py-4 text-right relative z-10">
                      <DeleteButton id={company.id} action={deleteCompany} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination totalPages={totalPages} />
        </div>
      )}
    </div>
  );
}
