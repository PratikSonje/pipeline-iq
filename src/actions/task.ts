"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function getTasks() {
  const { userId: clerkUserId } = await auth();
  if (!clerkUserId) return [];

  const user = await prisma.user.findUnique({
    where: { clerkUserId },
  });
  if (!user) return [];

  // Fetch incomplete tasks and recently completed tasks (completed in the last 24h)
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  return prisma.task.findMany({
    where: {
      userId: user.id,
      deletedAt: null,
      OR: [
        { completed: false },
        { completed: true, updatedAt: { gte: yesterday } }
      ]
    },
    orderBy: [
      { completed: 'asc' },
      { createdAt: 'desc' }
    ]
  });
}

import { createTaskSchema, toggleTaskSchema, deleteTaskSchema } from "@/lib/validators";

export async function createTask(formData: FormData) {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) throw new Error("Unauthorized");

    const user = await prisma.user.findUnique({ where: { clerkUserId } });
    if (!user) throw new Error("User not found");

    const title = formData.get("title") as string;
    const validatedData = createTaskSchema.parse({ title });

    await prisma.task.create({
      data: {
        title: validatedData.title,
        userId: user.id,
      },
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    console.error("Create Task Error:", error);
    return { success: false, error: error.message || "Failed to create task" };
  }
}

export async function toggleTask(taskId: string, completed: boolean) {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) throw new Error("Unauthorized");

    const user = await prisma.user.findUnique({ where: { clerkUserId } });
    if (!user) throw new Error("User not found");

    const validatedData = toggleTaskSchema.parse({ taskId, completed });

    // Enforce Row-Level Security
    const task = await prisma.task.findUnique({ where: { id: validatedData.taskId } });
    if (!task || task.userId !== user.id) {
      throw new Error("Unauthorized to modify this task");
    }

    await prisma.task.update({
      where: { id: validatedData.taskId },
      data: { completed: validatedData.completed },
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    console.error("Toggle Task Error:", error);
    return { success: false, error: error.message || "Failed to update task" };
  }
}

export async function deleteTask(taskId: string) {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) throw new Error("Unauthorized");

    const user = await prisma.user.findUnique({ where: { clerkUserId } });
    if (!user) throw new Error("User not found");

    const validatedData = deleteTaskSchema.parse({ taskId });

    // Enforce Row-Level Security
    const task = await prisma.task.findUnique({ where: { id: validatedData.taskId } });
    if (!task || task.userId !== user.id) {
      throw new Error("Unauthorized to delete this task");
    }

    // Soft delete
    await prisma.task.update({
      where: { id: validatedData.taskId },
      data: { deletedAt: new Date() },
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    console.error("Delete Task Error:", error);
    return { success: false, error: error.message || "Failed to delete task" };
  }
}
