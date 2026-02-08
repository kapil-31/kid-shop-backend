import { Response, Request } from "express";
import { createProductSchema, updateProductSchema } from "./product.schema";
import {
  createProduct,
  getProudctById,
  ProductImage,
  removeProduct,
  searchProducts,
  updateProduct,
} from "./product.service";
import { imageProcessingService } from "@modules/file-upload/upload.service";

export async function createProductHandler(req: Request, res: Response) {
  const {images,...data} = createProductSchema.parse(req.body);

  const sanitizedImages: ProductImage[] = [];

  for (const img of images || []) {
    const imageObj = await imageProcessingService.moveTempToPermanent(
      img.id,
      "imgObject",
    );
    typeof imageObj === "object" && sanitizedImages.push(imageObj);
  }
  const product = await createProduct(data,sanitizedImages);
  return res.json(product).status(200);
}

export async function searchProductHandler(req: Request, res: Response) {
  const product = await searchProducts({});
  return res.json(product).status(200);
}

export async function getOnProductHandler(req: Request, res: Response) {
  const id = req.params.id;
  const product = await getProudctById(id as string);
  res.json(product);
}

export async function updateProductHandler(req: Request, res: Response) {
  const id = req.params.id;
  const data = updateProductSchema.parse(req.body);
  const product = await updateProduct(id as string, data);

  res.json(product);
}

export async function deleteProductHandler(req: Request, res: Response) {
  const id = req.params.id as string;

  await removeProduct(id);
  res
    .json({
      message: "deleted successfully",
    })
    .status(200);
}
