import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { Users, Mail, Phone, Building2 } from "lucide-react";
import { ContactDialog } from "@/components/contacts/contact-dialog";
import { DeleteButton } from "@/components/ui/delete-button";
import { deleteContact } from "@/actions/contact";

export default async function ContactsPage() {
  const { userId } = await auth();

  const contacts = await prisma.contact.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: "desc" },
    include: {
      company: { select: { id: true, name: true } },
    },
  });

  const companies = await prisma.company.findMany({
    where: { deletedAt: null },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Contacts</h1>
          <p className="text-slate-400">Manage the people at your target accounts.</p>
        </div>
        <ContactDialog companies={companies} />
      </div>

      {contacts.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 border-dashed">
          <Users className="w-12 h-12 text-slate-500 mb-4" />
          <h3 className="text-lg font-medium text-white mb-1">No contacts yet</h3>
          <p className="text-slate-400 mb-4">Get started by adding people you are selling to.</p>
          <ContactDialog companies={companies} />
        </div>
      ) : (
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl overflow-hidden">
          <table className="w-full text-sm text-left">
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
                      <Building2 className="w-4 h-4 text-slate-500" />
                      {contact.company.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-300">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-slate-500" />
                      {contact.email ? (
                        <a href={`mailto:${contact.email}`} className="text-blue-400 hover:text-blue-300 hover:underline">
                          {contact.email}
                        </a>
                      ) : (
                        "—"
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-300">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-slate-500" />
                      {contact.phone || "—"}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <DeleteButton id={contact.id} action={deleteContact} />
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
