import { z } from "zod";

export const worksheetSchema = z.object({
  salesman: z.string().trim().min(1, "Salesman is required").optional(),
  customer: z.string().trim().min(1, "Customer is required").optional(),
  truck: z.string().trim().min(1, "Truck is required").optional(),
  extras: z.string().trim().optional(),
  status: z.enum(["draft", "new", "submitted", "modified", "archive"]).optional(),
});

export const worksheetOptionSchema = z.object({
  worksheet: z.string().trim().min(1, "Worksheet is required"),
  option: z.string().trim().min(1, "Option is required"),
  isCompleted: z.boolean().optional(),
  note: z.string().trim().optional(),
});

export const headingSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  section: z.string().trim().min(1, "Section is required"),
});

export const sectionSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
});

export const optionSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  heading: z.string().trim().min(1, "Heading is required"),
  applyTo: z.string().trim().min(1, "ApplyTo is required"),
  BOM: z.string().trim().optional(),
  description: z.string().trim().optional(),
  isFab: z.boolean().optional(),
  isGroup: z.boolean().optional(),
  labour: z.string().trim().optional(),
  labourCost: z.number().min(0, "Labour cost must be >= 0"),
  labourHours: z.number().min(0, "Labour hours must be >= 0"),
});
