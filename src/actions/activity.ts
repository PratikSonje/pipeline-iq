"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import { createActivitySchema, deleteActivitySchema } from "@/lib/validators";

export async function createActivity(formData: FormData) {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) throw new Error("Unauthorized");

    const user = await prisma.user.findUnique({ where: { clerkUserId } });
    if (!user) throw new Error("User not found");

    const dealId = formData.get("dealId") as string;
    const type = formData.get("type") as any;
    const content = formData.get("content") as string;

    const validatedData = createActivitySchema.parse({ dealId, type, content });

    // Enforce Row-Level Security: Only the owner of the deal can add activities to it
    const deal = await prisma.deal.findUnique({ where: { id: validatedData.dealId } });
    if (!deal || deal.userId !== user.id) {
      throw new Error("Unauthorized to add activities to this deal");
    }

    await prisma.activity.create({
      data: {
        dealId: validatedData.dealId,
        type: validatedData.type as "NOTE" | "CALL" | "EMAIL" | "MEETING",
        content: validatedData.content,
        userId: user.id,
      },
    });

    revalidatePath(`/deals/${validatedData.dealId}`);
    return { success: true };
  } catch (error: any) {
    console.error("Failed to create activity:", error);
    return { success: false, error: error.message || "Failed to create activity" };
  }
}

export async function deleteActivity(id: string) {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) throw new Error("Unauthorized");

    const user = await prisma.user.findUnique({ where: { clerkUserId } });
    if (!user) throw new Error("User not found");

    const validatedData = deleteActivitySchema.parse({ activityId: id });

    const activity = await prisma.activity.findUnique({ where: { id: validatedData.activityId } });
    if (!activity) throw new Error("Activity not found");

    // Only allow admins or the creator to delete the activity
    if (user.role !== "ADMIN" && activity.userId !== user.id) {
      throw new Error("Unauthorized to delete this activity");
    }

    await prisma.activity.update({
      where: { id: validatedData.activityId },
      data: { deletedAt: new Date() },
    });

    revalidatePath(`/deals/${activity.dealId}`);
    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete activity:", error);
    return { success: false, error: error.message || "Failed to delete activity" };
  }
}
