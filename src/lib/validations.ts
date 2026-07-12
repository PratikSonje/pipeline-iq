import * as z from "zod";

export const companySchema = z.object({
  name: z.string().min(1, "Company name is required"),
  website: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  industry: z.string().optional(),
});

export const contactSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Must be a valid email").optional().or(z.literal("")),
  phone: z.string().optional(),
  companyId: z.string().uuid("Invalid company ID"),
});

export const dealSchema = z.object({
  title: z.string().min(1, "Deal title is required"),
  amount: z.coerce.number().min(0, "Amount must be positive"),
  expectedCloseDate: z.date().optional().or(z.string().transform(str => new Date(str))),
  companyId: z.string().uuid("Invalid company ID"),
  contactId: z.string().uuid("Invalid contact ID").optional().or(z.literal("")),
  stageId: z.string().uuid("Invalid stage ID"),
});

export const activitySchema = z.object({
  type: z.enum(["NOTE", "CALL", "EMAIL"]),
  content: z.string().min(1, "Content cannot be empty"),
  dealId: z.string().uuid("Invalid deal ID"),
});
