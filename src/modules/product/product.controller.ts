import { Response, Request } from "express";
import { createProductSchema, updateProductSchema } from "./product.schema";
import {
  createProduct,
  getProudctById,
  ProductImage,
  ProductSearchQuery,
  removeProduct,
  searchProducts,
  updateProduct,
} from "./product.service";
import { imageProcessingService } from "@modules/file-upload/upload.service";
import { toProductDto } from "./dto/response.dto";
import { successResponse } from "@utils/helpers";
import { prisma } from "lib/prisma";

export async function createProductHandler(req: Request, res: Response) {
  const { images, ...data } = createProductSchema.parse(req.body);

  const sanitizedImages: ProductImage[] = [];

  for (const img of images || []) {
    const imageObj = await imageProcessingService.moveTempToPermanent(
      img.id,
      "imgObject",
    );
    typeof imageObj === "object" && sanitizedImages.push(imageObj);
  }
  const product = await createProduct(data, sanitizedImages);
  return res.json(product).status(200);
}

export async function searchProductHandler(req: Request, res: Response) {
  const query = req.query as unknown as ProductSearchQuery;
  const products = await searchProducts(query);
  return res
    .json({
      cursor: products.nextCursor,
      data: products.data?.map(toProductDto),
    })
    .status(200);
}

export async function getOnProductHandler(req: Request, res: Response) {
  const id = req.params.id;
  const product = await getProudctById(id as string);
  res.json(successResponse(product));
}

export async function updateProductHandler(req: Request, res: Response) {
  const id = req.params.id as string;
  if (!id) {
    const error: any = new Error("Invalid Product Id");
    error.statusCode = 400;
    throw error;
  }
  const { images, ...data } = updateProductSchema.parse(req.body);
  const product = await getProudctById(id);
  if (!product) {
    const error: any = new Error("Product Not found");
    error.statusCode = 404;
    throw error;
  }
  const updatedProduct = await updateProduct(id as string, data);
  res.json(successResponse(updatedProduct));
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

export async function updateProductImage(req: Request, res: Response) {
  const files = req.files as Express.Multer.File[] | undefined;
  if (!files || files.length === 0) {
    return res.status(400).json({
      success: false,
      message: "No files uploaded",
    });
  }
  const uploadedFiles = [];

  for (const file of files) {
    uploadedFiles.push(
      await imageProcessingService.saveToProduct(file, req.params.id as string),
    );
  }

  res.json({
    success: true,
    files: uploadedFiles?.map((item) => ({
      id: item.id,
      name: item.name,
      url: item.url,
    })),
  });
}

export async function removeProductImage(req: Request, res: Response) {
  const productId = req.params.productId as string;
  const imageId = req.params.imageId as string;
  if (productId && imageId) {
    await imageProcessingService.deleteProductImage(productId, imageId);
    res.json(successResponse(null, "Successfully remove "));
  }

  const error: any = new Error("Invalid Product and Image id");
  error.statusCode = 500;

  throw error;
}
