import { Request } from "express";

export interface MulterRequest extends Request {
  file?: Express.Multer.File;
  files?: Express.Multer.File[];
}

export interface ImageProcessResult {
  url: string;
  urlThumb: string;
  size: number;
  width?: number;
  height?: number;
}

export interface UploadResponse {
  success: boolean;
  message?: string;
  image?: any;
  images?: any[];
  error?: string;
}