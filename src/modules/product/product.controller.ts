import { Response,Request } from "express";
import { createProductSchema } from "./product.schema";
import { createProduct } from "./product.service";

export async function createProductHandler (req: Request, res: Response) {
    const data =  createProductSchema.parse(req.body);
    const product = await createProduct(data);
    return res.json(product).status(200);

}