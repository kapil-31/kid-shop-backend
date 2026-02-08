import { Request, Response } from "express";
import path from "path";
import fs from "fs";
import { TEMP_DIR } from "./config";
import { imageProcessingService } from "./upload.service";
import { prisma } from "lib/prisma";

export async function fileUploadHanlder(req: Request, res: Response) {
  const files = req.files as Express.Multer.File[] | undefined;
  if (!files || files.length === 0) {
    return res.status(400).json({
      success: false,
      message: "No files uploaded",
    });
  }
  const uploadedFiles = [];

  for (const file of files) {
    uploadedFiles.push(await imageProcessingService.saveTempUpload(file));
  }

  res.json({
    success: true,
    files: uploadedFiles?.map((item) => ({
      id: item.id,
      name: item.filename,
      url: item.tempPath,
    })),
  });
}

export async function deleteFileHandler(req: Request, res: Response) {
  const fileId = req.params.id as string;
  const file = await prisma.tempUpload.findUnique({
    where: { id: fileId },
  });

  if(!file) throw Error('File Not found');

  
  const filePath = path.join(TEMP_DIR  , path.basename(file?.tempPath))

 await prisma.tempUpload.delete({
    where: { id: fileId },
  });

  fs.unlinkSync(filePath);

  res.json({
    message: "file deleted successfully",
  });
}
