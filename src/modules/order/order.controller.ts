import { Request, Response } from "express";
import { createOrder } from "./order.service";
import { createOrderSchema } from "./orderSchema";
import { successResponse } from "@utils/helpers";

export const createOrderHandler = async  (req:Request,res:Response) => {
    const {cartId,deliveryDetail,coupon} = createOrderSchema.parse(req.body)
    const {note,...shippingAddress} = deliveryDetail
    const order = await createOrder({
        cartId: cartId.trim(),
        userId: req.user?.userId as string,
        note,
        shippingAddress,
        coupon,
    })
  
    res.json(successResponse(order))
}