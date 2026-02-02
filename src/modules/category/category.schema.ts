import { create } from "node:domain";
import { z } from "zod";

export const createCategorySchema = z.object({
  name: z
    .string()
    .min(2, "Category name must be at least 2 characters")
    .max(50),

  logo: z
    .string()
    .url()
    .optional(),

  description: z
    .string()
    .max(255)
    .optional(),

  isActive: z
    .boolean()
    .optional()
    .default(true)
});


export type createCategorySchema = z.infer<typeof createCategorySchema>

export const  updateCategorySchema = createCategorySchema.partial();

export type updateCategorySchema = z.infer<typeof updateCategorySchema>