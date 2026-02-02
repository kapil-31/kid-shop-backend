import { Router } from "express";
import { deleteCouponHandler, getCounponController, storeCouponeHandler, updateCouponHanlder } from "./coupon.controller";

const router = Router();

router.route('/').post(storeCouponeHandler)
.get(getCounponController)

router.route('/:id').put(updateCouponHanlder).delete(deleteCouponHandler)


export default router;