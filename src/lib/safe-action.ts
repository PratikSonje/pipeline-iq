import { createSafeActionClient, DEFAULT_SERVER_ERROR_MESSAGE } from "next-safe-action";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "./prisma";

// Base action client without authentication
export const actionClient = createSafeActionClient({
  handleServerError(e) {
    console.error("Action error:", e.message);
    return DEFAULT_SERVER_ERROR_MESSAGE;
  },
});

// Middleware for authenticated actions
export const authActionClient = actionClient.use(async ({ next }) => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized: Please sign in");
  }

  // Fetch the user from our database to verify they exist and get their ID
  const dbUser = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!dbUser) {
    throw new Error("User not found in database");
  }

  // Return the dbUser to the context so actions can use it
  return next({ ctx: { user: dbUser } });
});

// Middleware for Admin-only actions (RBAC)
export const adminActionClient = authActionClient.use(async ({ next, ctx }) => {
  if (ctx.user.role !== "ADMIN") {
    throw new Error("Forbidden: Admin privileges required");
  }

  return next({ ctx });
});
