import { z } from "zod";

export const idParamSchema = z.object({
  id: z.string().uuid("Invalid ID"),
});

export const addToCartSchema = z.object({
  productId: z.string().uuid("Invalid product ID"),

  quantity: z
    .coerce.number()
    .int("Quantity must be an integer")
    .min(1, "Quantity must be at least 1")
    .max(100, "Quantity too large"),
});

export const updateCartItemSchema = z.object({
  quantity: z
    .coerce.number()
    .int("Quantity must be an integer")
    .min(1, "Quantity must be at least 1")
    .max(100, "Quantity too large"),
});


export type updateCartItemBody = z.infer<typeof updateCartItemSchema>
export type addToCartBody = z.infer<typeof addToCartSchema>