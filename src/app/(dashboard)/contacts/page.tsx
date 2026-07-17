import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { Users, Mail, Phone, Building2 } from "lucide-react";
import { ContactDialog } from "@/components/contacts/contact-dialog";
import { DeleteButton } from "@/components/ui/delete-button";
import { deleteContact } from "@/actions/contact";
import { SearchInput } from "@/components/ui/search-input";
import { Pagination } from "@/components/ui/pagination";

export default async function ContactsPage({
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
    ...(query
      ? {
          OR: [
            { firstName: { contains: query, mode: "insensitive" as const } },
            { lastName: { contains: query, mode: "insensitive" as const } },
            { email: { contains: query, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [contacts, totalCount] = await Promise.all([
    prisma.contact.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      skip: (currentPage - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
      include: {
        company: { select: { id: true, name: true } },
      },
    }),
    prisma.contact.count({ where: whereClause }),
  ]);

  const companies = await prisma.company.findMany({
    where: { deletedAt: null },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Contacts</h1>
          <p className="text-slate-400">Manage the people at your target accounts.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
          <SearchInput placeholder="Search contacts..." />
          <ContactDialog companies={companies} />
        </div>
      </div>

      {contacts.length === 0 && !query ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 border-dashed">
          <Users className="w-12 h-12 text-slate-500 mb-4" />
          <h3 className="text-lg font-medium text-white mb-1">No contacts yet</h3>
          <p className="text-slate-400 mb-4">Get started by adding people you are selling to.</p>
          <ContactDialog companies={companies} />
        </div>
      ) : contacts.length === 0 && query ? (
        <div className="flex-1 flex flex-col items-center justify-center bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 border-dashed m-4 p-12 text-center">
          <h3 className="text-xl font-bold text-white mb-2">No results found</h3>
          <p className="text-slate-400">No contacts matched your search "{query}".</p>
        </div>
      ) : (
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl flex flex-col overflow-hidden">
          {/* Mobile Card Layout (< 768px) */}
          <div className="block md:hidden divide-y divide-white/5">
            {contacts.map((contact) => (
              <div key={contact.id} className="p-5 space-y-4 hover:bg-white/5 transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <Link href={`/contacts/${contact.id}`} className="text-lg font-semibold text-white hover:text-blue-400 hover:underline">
                      {contact.firstName} {contact.lastName}
                    </Link>
                    <div className="flex items-center gap-2 mt-1 text-sm text-slate-400">
                      <Building2 className="w-4 h-4" />
                      {contact.company.name}
                    </div>
                  </div>
                  <DeleteButton id={contact.id} action={deleteContact} />
                </div>
                
                <div className="grid grid-cols-1 gap-3 text-sm">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-slate-500 shrink-0" />
                    {contact.email ? (
                      <a href={`mailto:${contact.email}`} className="text-blue-400 hover:text-blue-300 truncate">
                        {contact.email}
                      </a>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-slate-500 shrink-0" />
                    <span className="text-slate-300">{contact.phone || "—"}</span>
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
                  <th className="px-6 py-4">Company</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Phone</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {contacts.map((contact) => (
                  <tr key={contact.id} className="hover:bg-white/5 transition-colors group cursor-pointer">
                    <td className="px-6 py-4 font-medium text-white relative">
                      <Link href={`/contacts/${contact.id}`} className="hover:text-blue-400 hover:underline transition-colors before:absolute before:inset-0">
                        {contact.firstName} {contact.lastName}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-slate-300">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-slate-500 shrink-0" />
                        {contact.company.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-300">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-slate-500 shrink-0" />
                        {contact.email ? (
                          <a href={`mailto:${contact.email}`} className="text-blue-400 hover:text-blue-300 hover:underline relative z-10">
                            {contact.email}
                          </a>
                        ) : (
                          "—"
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-300">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-slate-500 shrink-0" />
                        {contact.phone || "—"}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right relative z-10">
                      <DeleteButton id={contact.id} action={deleteContact} />
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
