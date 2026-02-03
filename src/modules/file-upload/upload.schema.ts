import multer, { FileFilterCallback } from 'multer'
import path from 'path';
import { v4 as uuid } from "uuid";
import fs from 'fs'
import { Request } from 'express';
import z from 'zod';

export const UPLOAD_DIR = path.join(process.cwd(), "uploads");

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (_, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuid()}${ext}`);
  },
});


 const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (!file.mimetype.startsWith("image/")) {
    cb(new Error("Only image files are allowed"));
    return;
  }
  cb(null, true);
};


export const multerUploader = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});


export const createFileSchema = z.object({
    name:z.string(),
    url:z.string(),
    size:z.number().positive(),
    type:z.string(),
    entity:z.string(),
    entityId:z.uuid(),
  })


  export type createFileSchema = z.infer<typeof createFileSchema>