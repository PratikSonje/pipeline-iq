"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { auth, currentUser } from "@clerk/nextjs/server";

const dealSchema = z.object({
  title: z.string().min(1, "Deal title is required"),
  amount: z.coerce.number().min(0, "Amount must be a positive number"),
  companyId: z.string().min(1, "Company is required"),
  stageId: z.string().min(1, "Stage is required"),
});

import { updateDealStageSchema, deleteDealSchema } from "@/lib/validators";

export async function createDeal(data: z.infer<typeof dealSchema>) {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) throw new Error("Unauthorized");

    let dbUser = await prisma.user.findUnique({
      where: { clerkUserId: clerkUser.id },
    });

    const email = clerkUser.emailAddresses[0]?.emailAddress || "no-email@example.com";

    // Fallback: If webhook failed to create the user (common in local dev), create or link them now
    if (!dbUser) {
      const existingEmailUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingEmailUser) {
        dbUser = await prisma.user.update({
          where: { id: existingEmailUser.id },
          data: { clerkUserId: clerkUser.id },
        });
      } else {
        dbUser = await prisma.user.create({
          data: {
            clerkUserId: clerkUser.id,
            email: email,
            name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || "Unknown User",
          },
        });
      }
    }

    const validatedData = dealSchema.parse(data);

    await prisma.deal.create({
      data: {
        title: validatedData.title,
        amount: validatedData.amount,
        companyId: validatedData.companyId,
        stageId: validatedData.stageId,
        userId: dbUser.id,
      },
    });

    revalidatePath("/pipeline");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    console.error("Create Deal Error:", error);
    return { success: false, error: error.message || "Failed to create deal" };
  }
}

export async function updateDealStage(dealId: string, newStageId: string) {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) throw new Error("Unauthorized");

    const dbUser = await prisma.user.findUnique({ where: { clerkUserId } });
    if (!dbUser) throw new Error("User not found");

    const validatedData = updateDealStageSchema.parse({ dealId, newStageId });

    // Enforce Row-Level Security: Only the owner can update this deal
    const deal = await prisma.deal.findUnique({ where: { id: validatedData.dealId } });
    if (!deal || deal.userId !== dbUser.id) {
      throw new Error("Unauthorized to modify this deal");
    }

    // Determine the deal status based on the new stage
    const targetStage = await prisma.stage.findUnique({ where: { id: validatedData.newStageId } });
    let newStatus = "OPEN";
    if (targetStage) {
      if (targetStage.name === "Closed Won") newStatus = "WON";
      else if (targetStage.name === "Closed Lost") newStatus = "LOST";
    }

    await prisma.deal.update({
      where: { id: validatedData.dealId },
      data: { 
        stageId: validatedData.newStageId,
        status: newStatus as any
      },
    });

    revalidatePath("/pipeline");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    console.error("Update Deal Stage Error:", error);
    return { success: false, error: error.message || "Failed to update deal stage" };
  }
}

export async function deleteDeal(id: string) {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) throw new Error("Unauthorized");

    const dbUser = await prisma.user.findUnique({ where: { clerkUserId } });
    if (!dbUser) throw new Error("User not found");

    const validatedData = deleteDealSchema.parse({ dealId: id });

    // Enforce Row-Level Security: Only the owner can delete this deal
    const deal = await prisma.deal.findUnique({ where: { id: validatedData.dealId } });
    if (!deal || deal.userId !== dbUser.id) {
      throw new Error("Unauthorized to delete this deal");
    }

    // Soft delete
    await prisma.deal.update({
      where: { id: validatedData.dealId },
      data: { deletedAt: new Date() },
    });

    revalidatePath("/pipeline");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    console.error("Delete Deal Error:", error);
    return { success: false, error: error.message || "Failed to delete deal" };
  }
}
