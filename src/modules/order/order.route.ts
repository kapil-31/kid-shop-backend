import { requireAuth } from "@middlewares/requiresAuth";
import { Router } from "express";
import { createOrderHandler } from "./order.controller";

const router = Router();
router.use(requireAuth)
router.post('/',createOrderHandler)

export default router;