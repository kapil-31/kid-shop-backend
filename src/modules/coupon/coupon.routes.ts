import { Router } from "express";
import { deleteCouponHandler,getCouponByIdHandler, getCounponController, storeCouponeHandler, updateCouponHanlder } from "./coupon.controller";

const router = Router();

router.route('/').post(storeCouponeHandler)
.get(getCounponController)


router.route('/:id')
.get(getCouponByIdHandler)
.put(updateCouponHanlder).delete(deleteCouponHandler)


export default router;