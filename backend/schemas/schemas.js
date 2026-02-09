import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signupSchema = z.object({
  email: z.string().trim().toLowerCase().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
});

export const createTruckSchema = z.object({
  model: z.string().trim().min(1, "Model is required"),
  customer: z.string().trim().min(1, "Customer is required"),
  salesman: z.string().trim().min(1, "Salesman is required"),
  chassis: z.coerce.number({invalid_type_error: "Chassis must contain only numbers",}),
  stock: z.string().trim().min(1, "Stock is required"),
  registration: z.string().trim().min(1, "Registration is required"),
});