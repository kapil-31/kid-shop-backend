import { Request, Response } from "express";
import { createCategorySchema, updateCategorySchema } from "./category.schema";
import {
  storeCategory,
  updateCategory,
  searchCategory,
  deleteCategory,
} from "./category.service";
import { imageProcessingService } from "@modules/file-upload/upload.service";

export async function createCategoryHandler(req: Request, res: Response) {
  const {temLogoId,...data} = createCategorySchema.parse(req.body);
  let url = await imageProcessingService.moveTempToPermanent(temLogoId,'url');
  
  const cat = await storeCategory({
    ...data,
    logo:url as string
  });
  res
    .json({
      ...cat,
      logo: url,
    })
    .status(200);
}

export async function updateCategoryHandler(req: Request, res: Response) {
  const id = req.params.id as string;
  const data = updateCategorySchema.parse(req.body);
  const cat = await updateCategory(id, data);
  res.json(cat).status(200);
}
export async function searchCategoryHandler(req: Request, res: Response) {
  const cat = await searchCategory(req.query.search as string);
  res.json(cat).status(200);
}

export async function deleteCategoryHandler(req: Request, res: Response) {
  await deleteCategory(req.params.id as string);
  res.json({
    message: "Delete successfully",
  });
}
