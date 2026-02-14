import { Request, Response } from "express";
import { addToCart, deleteCartItem, getCartByUser, updateCartItem } from "./cart.service";
import { successResponse } from "@utils/helpers";
import { addToCartBody, updateCartItemBody } from "./cart.schema";

export const addToCartHandler = async (req: Request<{},{},addToCartBody>, res: Response) => {
  const userId = req.user?.userId;
  const { productId,quantity  } = req.body;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });
  const result = await addToCart(userId, productId, quantity);
  return res.json(successResponse(result));
};

export const getCartByAuthUserHandler = async (req:Request,res:Response) =>{
  const userId = req.user?.userId as string;
  res.json(successResponse(await getCartByUser(userId )))
}

export const updateCartItemsHandler = async (req: Request<{id:string},{},updateCartItemBody>, res: Response) => {
  const id = req.params.id as string;
  const { quantity } = req.body;
  res.json(successResponse(await updateCartItem(id, quantity as number)))
};
export const deleteCartItemHandler = async (req: Request<{id:string}>, res: Response) => {
  const id = req.params.id as string;
  res.json(successResponse(await deleteCartItem(id)))

};