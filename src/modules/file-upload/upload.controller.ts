import { Request, Response } from "express";
import path from "path";
import { UPLOAD_DIR } from "./upload.schema";
import fs from "fs";

export async function fileUploadHanlder(req: Request, res: Response) {
  const files = req.files as Express.Multer.File[] | undefined;
  if (!files || files.length === 0) {
    return res.status(400).json({
      success: false,
      message: "No files uploaded",
    });
  }
  const uploadedFiles = files.map((file) => ({
      name: file.originalname,
      url: `/uploads/${file.filename}`,
      size: file.size,
      type: file.mimetype,
    }));

    res.json({
      success: true,
      files: uploadedFiles,
    });
}


export async function deleteFileHandler(req:Request,res:Response){

    const fileId = req.params.id


    const filePath = UPLOAD_DIR + '/' + fileId;

     fs.unlinkSync(filePath);

     res.json({
        message:'file deleted successfully'
     })

}