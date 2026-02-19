import { z } from "zod";


export const createProductSchema = z.object({
  name: z
    .string()
    .min(2, "Product name must be at least 2 characters"),

  price: z
    .number()
    .positive("Price must be greater than 0"),

  description: z
    .string()
    .min(10, "Description must be at least 10 characters"),

  isActive: z
    .boolean()
    .optional()
    .default(true),

   isFeatured: z
    .boolean()
    .optional()
    .default(true),

  categoryId: z
    .string()
    .uuid("Invalid category ID"),

  stockQty: z
    .number()
    .int()
    .nonnegative("Stock quantity cannot be negative"),

  images: z.array(z.object({id:z.string(),name:z.string(),url:z.string()})).optional(),
  tags: z
    .string()
    .optional()
});


export type CreateProductInput = z.infer<typeof createProductSchema>;


export const updateProductSchema = createProductSchema.partial();
