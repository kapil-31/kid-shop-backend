import { z } from "zod";

export const couponTypeEnum = z.enum(["PERCENT", "FIXED"]);

export const createCouponSchema = z
  .object({
    code: z
      .string()
      .min(3)
      .max(30)
      .regex(/^[A-Z0-9_-]+$/, "Coupon code must be uppercase and URL-safe"),

    type: couponTypeEnum.default("PERCENT"),

    value: z
      .number()
      .positive("Coupon value must be greater than 0"),

    maxDiscount: z
      .number()
      .positive()
      .optional(),

    minOrderAmount: z
      .number()
      .positive()
      .optional(),

    usageLimitTotal: z
      .number()
      .int()
      .positive()
      .optional(),

    usageLimitPerUser: z
      .number()
      .int()
      .positive()
      .optional(),

    startAt: z
      .string()
      .datetime()
      .optional(),

    endAt: z
      .string()
      .datetime()
      .optional(),

    isActive: z
      .boolean()
      .optional()
      .default(false)
  })


//     .superRefine((data, ctx) => {
//     // % coupon cannot exceed 100
//     if (data.type === "PERCENT" && data.value > 100) {
//       ctx.addIssue({
//         path: ["value"],
//         message: "Percentage discount cannot exceed 100%",
//         code: z.ZodIssueCode.custom
//       });
//     }

//     // Date sanity check
//     if (data.startAt && data.endAt) {
//       if (new Date(data.startAt) >= new Date(data.endAt)) {
//         ctx.addIssue({
//           path: ["endAt"],
//           message: "End date must be after start date",
//           code: z.ZodIssueCode.custom
//         });
//       }
//     }

//     // maxDiscount only makes sense for percent coupons
//     if (data.type === "FIXED" && data.maxDiscount) {
//       ctx.addIssue({
//         path: ["maxDiscount"],
//         message: "maxDiscount is not applicable for FIXED coupons",
//         code: z.ZodIssueCode.custom
//       });
//     }
//   });


  export  type  createCouponSchema = z.infer<typeof createCouponSchema>

  export const updateCouponSchema = createCouponSchema.partial();
  export type updateCouponSchema = z.infer<typeof createCouponSchema>

