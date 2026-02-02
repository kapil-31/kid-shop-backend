import { Response,Request } from "express";
import { CreateProductInput, createProductSchema, updateProductSchema } from "./product.schema";
import { createProduct, getProudctById, removeProduct, searchProducts, updateProduct } from "./product.service";
import z from "zod";

export async function createProductHandler (req: Request, res: Response) {
    const data =  createProductSchema.parse(req.body);
    const product = await createProduct(data);
    return res.json(product).status(200);

}

export async function searchProductHandler(req:Request,res:Response){
    const product = await searchProducts({});
    return res.json(product).status(200);
}

export async function getOnProductHandler(req:Request,res:Response){
    const id = req.params.id;   
    const product = await getProudctById(id as string)
    res.json(product)
}

export async function updateProductHandler(req:Request,res:Response){
    const id = req.params.id;   
    const data =   updateProductSchema.parse(req.body);
    const product  = await updateProduct(id as string,data)
    
    res.json(product)

}

export async function deleteProductHandler(req:Request,res:Response){
    const id = req.params.id as string;

    await removeProduct(id);
    res.json({
        message:'deleted successfully',
    }).status(200)
}