import { z } from "zod";

export const truckSchema = z.object({
  model: z.string().trim().min(1, "Model is required"),
  customer: z.string().trim().min(1, "Customer is required"),
  salesman: z.string().trim().min(1, "Salesman is required"),
  chassis: z.coerce.number({invalid_type_error: "Chassis must contain only numbers",}),
  stock: z.string().trim().min(1, "Stock is required"),
  registration: z.string().trim().min(1, "Registration is required"),
});