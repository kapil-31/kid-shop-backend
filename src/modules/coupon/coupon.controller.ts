import { Request, Response } from "express";
import { createCouponSchema, updateCouponSchema } from "./coupon.schema";
import {
  deleteCoupon,
  searchCoupon,
  findCouponByCode,
  storeCoupon,
  updateCoupon,
  getCouponById,
} from "./coupon.service";
import { successResponse } from "@utils/helpers";
export async function storeCouponeHandler(req: Request, res: Response) {
  const data = createCouponSchema.parse(req.body);
  const couponAlreadyExists = await findCouponByCode(data.code);
  if (couponAlreadyExists) {
    const error: any = new Error("Coupon already exists");
    error.statusCode = 409;
    throw error;
  }

  const coupon = await storeCoupon(data);

  res.json(successResponse(coupon)).status(200);
}

export async function getCounponController(req: Request, res: Response) {
  const coupons = await searchCoupon();

  res.json(successResponse(coupons)).status(200);
}

export async function deleteCouponHandler(req: Request, res: Response) {
  await deleteCoupon(req.params.id as string);

  res.json({ message: "Coupon deleted successfully" });
}

export async function updateCouponHanlder(req: Request, res: Response) {
  const data = updateCouponSchema.parse(req.body);

  const coupons = await updateCoupon(req.params.id as string, data);

  res.json(coupons).status(200);
}

export async function getCouponByIdHandler(req: Request, res: Response) {
  return res.json(
    successResponse(await getCouponById(req.params.id as string)),
  );
}

