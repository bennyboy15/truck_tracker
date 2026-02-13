import { z } from "zod";

export const customerSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.string().email("Invalid email format").optional().or(z.literal("")),
});