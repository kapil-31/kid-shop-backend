import { create } from "node:domain";
import { string, z } from "zod";

export const createCategorySchema = z.object({
  name: z
    .string()
    .min(2, "Category name must be at least 2 characters")
    .max(50),

  description: z.string().max(255).optional(),

  temLogoId: z.uuid('Image id is required'),
  isActive: z.boolean().optional().default(true),
  logo:z.string().optional()
});

export type createCategorySchema = z.infer<typeof createCategorySchema>;

export const updateCategorySchema = createCategorySchema.partial();

export type updateCategorySchema = z.infer<typeof updateCategorySchema>;
