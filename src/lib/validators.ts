import { z } from "zod";

// --- DEALS ---
export const dealSchema = z.object({
  title: z.string().min(1, "Deal title is required"),
  amount: z.coerce.number().min(0, "Amount must be a positive number"),
  companyId: z.string().min(1, "Company is required"),
  stageId: z.string().min(1, "Stage is required"),
});

export const updateDealStageSchema = z.object({
  dealId: z.string().uuid("Invalid deal ID"),
  newStageId: z.string().uuid("Invalid stage ID"),
});

export const deleteDealSchema = z.object({
  dealId: z.string().uuid("Invalid deal ID"),
});

// --- TASKS ---
export const createTaskSchema = z.object({
  title: z.string().min(1, "Task title is required").max(255, "Task title is too long"),
});

export const toggleTaskSchema = z.object({
  taskId: z.string().uuid("Invalid task ID"),
  completed: z.boolean(),
});

export const deleteTaskSchema = z.object({
  taskId: z.string().uuid("Invalid task ID"),
});

// --- ACTIVITIES ---
export const createActivitySchema = z.object({
  content: z.string().min(1, "Content is required"),
  dealId: z.string().uuid("Invalid deal ID"),
  type: z.enum(["NOTE", "CALL", "EMAIL", "MEETING"]).default("NOTE"),
});

export const deleteActivitySchema = z.object({
  activityId: z.string().uuid("Invalid activity ID"),
});
