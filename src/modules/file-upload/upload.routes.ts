import { Router } from "express";
import { deleteFileHandler, fileUploadHanlder } from "./upload.controller";
import { multerUploader } from "./upload.schema";


const router = Router();

router.route('/').post(multerUploader.array('images',10),fileUploadHanlder)

router.delete('/:id',deleteFileHandler)


export default router;