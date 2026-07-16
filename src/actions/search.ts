"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export type SearchResult = {
  id: string;
  title: string;
  subtitle: string;
  type: "deal" | "company" | "contact";
  url: string;
};

export async function globalSearch(query: string): Promise<SearchResult[]> {
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error("Unauthorized");
  }

  if (!query || query.length < 2) {
    return [];
  }

  // Search across all entities in parallel
  const [deals, companies, contacts] = await Promise.all([
    prisma.deal.findMany({
      where: {
        title: { contains: query, mode: "insensitive" },
        deletedAt: null,
      },
      include: { company: { select: { name: true } } },
      take: 5,
    }),
    prisma.company.findMany({
      where: {
        name: { contains: query, mode: "insensitive" },
        deletedAt: null,
      },
      take: 5,
    }),
    prisma.contact.findMany({
      where: {
        OR: [
          { firstName: { contains: query, mode: "insensitive" } },
          { lastName: { contains: query, mode: "insensitive" } },
          { email: { contains: query, mode: "insensitive" } },
        ],
        deletedAt: null,
      },
      include: { company: { select: { name: true } } },
      take: 5,
    }),
  ]);

  const results: SearchResult[] = [];

  deals.forEach(d => {
    results.push({
      id: d.id,
      title: d.title,
      subtitle: `Deal • ${d.company.name}`,
      type: "deal",
      url: `/deals/${d.id}`,
    });
  });

  companies.forEach(c => {
    results.push({
      id: c.id,
      title: c.name,
      subtitle: `Company${c.industry ? ` • ${c.industry}` : ""}`,
      type: "company",
      url: `/companies/${c.id}`,
    });
  });

  contacts.forEach(c => {
    results.push({
      id: c.id,
      title: `${c.firstName} ${c.lastName}`,
      subtitle: `Contact • ${c.company.name}`,
      type: "contact",
      url: `/contacts/${c.id}`,
    });
  });

  return results;
}
