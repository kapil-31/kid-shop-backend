import { Router } from "express";
import {
  addToCartSchema,
  idParamSchema,
  updateCartItemSchema,
} from "./cart.schema";
import {
  addToCartHandler,
  updateCartItemsHandler,
  deleteCartItemHandler,
  getCartByAuthUserHandler,
} from "./cart.controller";
import { validate, validateParams } from "@middlewares/validateRequest";
import { requireAuth } from "@middlewares/requiresAuth";

const router = Router();

router.use(requireAuth);
router.post("/", validate(addToCartSchema), addToCartHandler);
router.get('/',getCartByAuthUserHandler)

router
  .route("/item/:id")
  .delete(validateParams(idParamSchema), deleteCartItemHandler);

router.patch(
  "/item/:id",
  validateParams(idParamSchema),
  validate(updateCartItemSchema),
  updateCartItemsHandler,
);

export default router;
