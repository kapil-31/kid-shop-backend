import { Request, Response } from "express";
import { storeBanner ,deleteBanner, getBannerById, removeBannerImages, updateBanner, getBanners} from "./banner.service";
import { successResponse } from "@utils/helpers";

export const storeBannerHandler = async (req:Request , res:Response) => {
  const file = req.file as Express.Multer.File | undefined;

  if (!file) {
    return res.status(400).json({
      success: false,
      message: "No files uploaded",
    });
  }

 const  banner = await storeBanner({
    logo: `/uploads/${file.filename}`,
  })
  res.json(successResponse(banner,'Banner successfully uploaded'))
}

export const deleteBannerHandler = async(req:Request,res:Response) => {
    const id = req.params.id as string ;
    if(!id){
        const error:any = new Error('Banner id is required');
        error.statusCode = 404
        throw error;
    }

  
    await deleteBanner(id)
    res.json(successResponse(null,'Banner removed successfully'))

}

export const updateBannerHandler = async(req:Request,res:Response) => {
    const id = req.params.id as string ;
    const file = req.file as Express.Multer.File | undefined;

    if(!id){
        const error:any = new Error('Banner id is required');
        error.statusCode = 404
        throw error;
    }
    const existingBanner = await getBannerById(id)
    removeBannerImages(existingBanner?.logo ?? '')
    updateBanner(id,{logo:'/uploads/' + file?.filename})
    res.json(successResponse(null,'Banner removed successfully'))

}

export const getBannerHandler  = async (req: Request,res:Response) =>{
    res.json(successResponse(await getBanners()))
}
export const getBannerHandlerById = async (req: Request,res:Response) =>{
    const id  = req.params.id as string;
     if(!id){
        const error:any = new Error('Banner id is required');
        error.statusCode = 404
        throw error;
    }
    res.json(successResponse(await getBannerById(id)))
}