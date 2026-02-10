import path from "path";
import multer, { FileFilterCallback } from "multer";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import { Request } from "express";
export const UPLOAD_DIR = path.join(process.cwd(), "uploads");
export const THUMBS_DIR = path.join(UPLOAD_DIR, "thumbs");
export const TEMP_DIR = path.join(UPLOAD_DIR, "temp");


[UPLOAD_DIR, THUMBS_DIR,TEMP_DIR].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});
const tempStorage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, TEMP_DIR);
  },
  filename: (_, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  },
});

const uploadStorage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (_, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  },
});


const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];

  if (!allowedTypes.includes(file.mimetype)) {
    const error:any =  new Error(
        "Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.",
      );
      error.statusCode = 400;

    cb(
     error
    );
    return;
  }
  cb(null, true);
};

export const tempMulterUploader = multer({
  storage:tempStorage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || "10485760"),
  },
});


export const uploader = multer({
  storage:uploadStorage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || "10485760"),
  },
});
