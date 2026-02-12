import { Request, Response } from "express";
import { successResponse } from "@utils/helpers";
import { deleteGallery,getGallery, getGalleryById, removeGalleryImage, storeGallery, updateGallery } from "./gallery.service";

export const storeGalleryHanlder = async (req:Request , res:Response) => {
  const file = req.file as Express.Multer.File | undefined;

  if (!file) {
    return res.status(400).json({
      success: false,
      message: "No files uploaded",
    });
  }

 const  banner = await storeGallery({
    photo: `/uploads/${file.filename}`,
  })
  res.json(successResponse(banner,'Gallery successfully uploaded'))
}

export const deleteGalleryHandler = async(req:Request,res:Response) => {
    const id = req.params.id as string ;
    if(!id){
        const error:any = new Error('Banner id is required');
        error.statusCode = 404
        throw error;
    }

  
    await deleteGallery(id)
    res.json(successResponse(null,'Banner removed successfully'))

}

export const updateGalleryHandler = async(req:Request,res:Response) => {
    const id = req.params.id as string ;
    const file = req.file as Express.Multer.File | undefined;

    if(!id){
        const error:any = new Error('Gallery id is required');
        error.statusCode = 404
        throw error;
    }
    const existingBanner = await getGalleryById(id)
    removeGalleryImage(existingBanner?.photo ?? '')
    await updateGallery(id,{logo:'/uploads/' + file?.filename})
    res.json(successResponse(null,'Gallery removed successfully'))

}

export const getGalleryHandlerById  = async (req: Request,res:Response) =>{
    const id  = req.params.id as string;
     if(!id){
        const error:any = new Error('Gallery id is required');
        error.statusCode = 404
        throw error;
    }
    res.json(successResponse(await getGalleryById(id)))
}
export const getGalleryHandler  = async (req: Request,res:Response) =>{
     
    res.json(successResponse(await getGallery()))
}