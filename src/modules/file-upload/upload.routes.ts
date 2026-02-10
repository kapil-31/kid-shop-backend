import { Router } from "express";
import { deleteFileFromTempHandler, fileUploadHanlder } from "./upload.controller";
import { tempMulterUploader } from "./config";


const router = Router();

router.route('/temp').post(tempMulterUploader.array('images',10),fileUploadHanlder)

router.delete('/temp/:id',deleteFileFromTempHandler)





export default router;