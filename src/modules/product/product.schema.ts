import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(1),
  price: z.number().positive(),
  attributes: z.record(z.any(),z.any()).optional()
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
