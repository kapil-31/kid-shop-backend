import path, { basename } from "path";
import { ImageProcessResult } from "./types";
import sharp from "sharp";
import { TEMP_DIR, THUMBS_DIR, UPLOAD_DIR } from "./config";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "lib/prisma";

export interface TempUpload {
  id?: string;
  filename: string;
  originalName: string;
  tempPath: string;
  size: number;
  mimetype: string;
  expiresAt: Date;
}

class ImageProcessingService {

  async processImage(filePath: string): Promise<ImageProcessResult> {
    const filename = path.basename(filePath);
    const ext = path.extname(filename);
    const nameWithoutExt = filename.replace(ext, "");

    try {
      const metadata = await sharp(filePath).metadata();

      // optimize original image here
      const optimizedFilename = `${nameWithoutExt}.webp`;
      const optimizedPath = path.join(UPLOAD_DIR, optimizedFilename);

      await sharp(filePath)
        .resize(1200, 1200, {
          fit: "inside",
          withoutEnlargement: true,
        })
        .webp({ quality: 85 })
        .toFile(optimizedPath);

      const thumbFilename = `${nameWithoutExt}-thumb.webp`;
      const thumbPath = path.join(THUMBS_DIR, thumbFilename);

      await sharp(filePath)
        .resize(300, 300, { fit: "cover" })
        .webp({ quality: 80 })
        .toFile(thumbPath);

      if (ext.toLowerCase() !== ".webp") {
        fs.unlinkSync(filePath);
      }

      const stats = fs.statSync(optimizedPath);

      return {
        url: `/uploads/${optimizedFilename}`,
        urlThumb: `/uploads/thumbs/${thumbFilename}`,
        size: stats.size,
        width: metadata.width || 0,
        height: metadata.height || 0,
      };
    } catch (error) {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      throw error;
    }
  }

  async deleteImage(url: string, urlThumb?: string | null): Promise<void> {
    try {
      const filename = path.basename(url);
      const filePath = path.join(UPLOAD_DIR, filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      if (urlThumb) {
        const thumbFilename = path.basename(urlThumb);
        const thumbPath = path.join(THUMBS_DIR, thumbFilename);
        if (fs.existsSync(thumbPath)) {
          fs.unlinkSync(thumbPath);
        }
      }
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  }

  async saveTempUpload(file: Express.Multer.File): Promise<TempUpload> {
    const expiresAt = new Date(Date.now() + 3600000);

    const data: TempUpload = {
      filename: file.filename,
      originalName: file.originalname,
      tempPath: `/uploads/temp/${file.filename}`,
      size: file.size,
      mimetype: file.mimetype,
      expiresAt,
    };

    const tempUpload = await prisma.tempUpload.create({
      data,
    });


    return {
      id: tempUpload.id,
      filename: tempUpload.filename,
      originalName: tempUpload.originalName,
      tempPath: tempUpload.tempPath,
      size: tempUpload.size,
      mimetype: tempUpload.mimetype,
      expiresAt: tempUpload.expiresAt,
    };
  }

  async getTempUpload(tempId: string) {
    return await prisma.tempUpload.findUnique({
      where: { id: tempId },
    });
  }

  async cleanupExpiredUploads() {
    const expired = await prisma.tempUpload.findMany({
      where: {
        expiresAt: { lt: new Date() },
      },
    });

    for (const upload of expired) {
      if (fs.existsSync(upload.tempPath)) {
        fs.unlinkSync(upload.tempPath);
      }
      await prisma.tempUpload.delete({
        where: { id: upload.id },
      });
    }

  }

   async moveTempToPermanent(tempId: string,returnType:'url' | 'imgObject' = 'url'): Promise<string | {name:string,url:string,size:number}> {
    const tempUpload = await prisma.tempUpload.findUnique({where:{id:tempId}})

    if (!tempUpload) {
      throw new Error(`Temp upload ${tempId} not found`);
    }

    const tempPath = path.join(TEMP_DIR,basename(tempUpload.tempPath))
    
    if (!fs.existsSync(tempPath)) {
      throw new Error(`Temp file not found: ${tempPath}`);
    }

    // Move to permanent uploads directory
    const filename = path.basename(tempPath);
    const permanentPath = path.join(UPLOAD_DIR, filename);

    fs.renameSync(tempPath, permanentPath);
    const url = `/uploads/${filename}` 

    await prisma.tempUpload.delete({where:{id:tempId}})
    
    return returnType ==='url' ? url : {
      name:tempUpload.originalName,
      url:url,
      size:tempUpload.size,
    };
  }
}

export const imageProcessingService = new ImageProcessingService();


setInterval(() => {
  imageProcessingService.cleanupExpiredUploads();
}, 600000);