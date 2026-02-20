import z from "zod";

export const deliveryDetailSchema =z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  street: z.string().min(5, "Street address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  postalCode: z.string().min(3, "Postal code is required"),
  phone: z.string().min(8, "Phone number is required"),
  email: z.string().email("Invalid email"),
  note: z.string().optional(),
});

export const createOrderSchema = z.object({
    deliveryDetail: deliveryDetailSchema,
    cartId:z.string().min(2,'Cart id is required'),
    coupon:z.string().optional().nullable(),
}) 



export  type ShippingAddress  = Omit<z.infer<typeof deliveryDetailSchema>,'note'>