"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { auth } from "@clerk/nextjs/server";

const companySchema = z.object({
  name: z.string().min(1, "Company name is required"),
  website: z.string().optional(),
  industry: z.string().optional(),
});

export async function createCompany(data: z.infer<typeof companySchema>) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const validatedData = companySchema.parse(data);

  await prisma.company.create({
    data: {
      name: validatedData.name,
      website: validatedData.website || null,
      industry: validatedData.industry || null,
    },
  });

  revalidatePath("/companies");
}

export async function updateCompany(id: string, data: z.infer<typeof companySchema>) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const validatedData = companySchema.parse(data);

  await prisma.company.update({
    where: { id },
    data: {
      name: validatedData.name,
      website: validatedData.website || null,
      industry: validatedData.industry || null,
    },
  });

  revalidatePath("/companies");
}

export async function deleteCompany(id: string) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const now = new Date();

    // Soft delete company and cascade to related records sequentially
    // Avoiding $transaction to prevent connection pool timeouts with pgBouncer
    await prisma.company.update({
      where: { id },
      data: { deletedAt: now },
    });
    
    await prisma.contact.updateMany({
      where: { companyId: id },
      data: { deletedAt: now },
    });
    
    await prisma.deal.updateMany({
      where: { companyId: id },
      data: { deletedAt: now },
    });

    revalidatePath("/companies");
    revalidatePath("/contacts");
    revalidatePath("/pipeline");
    revalidatePath("/dashboard");
    
    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete company:", error);
    return { success: false, error: error.message || "Failed to delete company" };
  }
}
