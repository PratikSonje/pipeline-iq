"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { auth } from "@clerk/nextjs/server";

const contactSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Must be a valid email").optional().or(z.literal("")),
  phone: z.string().optional(),
  companyId: z.string().min(1, "Company is required"),
});

export async function createContact(data: z.infer<typeof contactSchema>) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const validatedData = contactSchema.parse(data);

  await prisma.contact.create({
    data: {
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      email: validatedData.email || null,
      phone: validatedData.phone || null,
      companyId: validatedData.companyId,
    },
  });

  revalidatePath("/contacts");
  revalidatePath("/companies");
}

export async function updateContact(id: string, data: z.infer<typeof contactSchema>) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const validatedData = contactSchema.parse(data);

  await prisma.contact.update({
    where: { id },
    data: {
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      email: validatedData.email || null,
      phone: validatedData.phone || null,
      companyId: validatedData.companyId,
    },
  });

  revalidatePath("/contacts");
  revalidatePath("/companies");
}

export async function deleteContact(id: string) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    // Soft delete
    await prisma.contact.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    revalidatePath("/contacts");
    revalidatePath("/companies");
    
    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete contact:", error);
    return { success: false, error: error.message || "Failed to delete contact" };
  }
}
