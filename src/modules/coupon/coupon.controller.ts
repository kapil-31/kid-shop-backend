import { Request, Response } from "express";
import { createCouponSchema, updateCouponSchema } from "./coupon.schema";
import { deleteCoupon, searchCoupon, storeCoupon, updateCoupon } from "./coupon.service";
;


export async function storeCouponeHandler(req:Request,res:Response){
    const data = createCouponSchema.parse(req.body)

    const coupon = await storeCoupon(data)

    res.json(coupon).status(200);


}

export async function getCounponController(req:Request,res:Response){

    const coupons = await searchCoupon(req.query.search as string)

    res.json(coupons).status(200)
}

export async function deleteCouponHandler(req:Request,res:Response){

   await deleteCoupon(req.params.id as string)

    res.json({message:'Coupon deleted successfully'})
}

export async function updateCouponHanlder(req:Request,res:Response){
    const data = updateCouponSchema.parse(req.body)

    const coupons = await updateCoupon(req.params.id as string,data)

    res.json(coupons).status(200)
}