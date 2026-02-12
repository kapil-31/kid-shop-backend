import { Router } from "express";
import { uploader } from "@modules/file-upload/config";
import { deleteGalleryHandler, getGalleryHandler, storeGalleryHanlder, updateGalleryHandler } from "./gallery.controller";
import { requireAuth } from "@middlewares/requiresAuth";
import { deflate } from "node:zlib";


const router = Router();
router.get('/',getGalleryHandler)

router.use(requireAuth)

router.post('/',uploader.single('image'),storeGalleryHanlder)
router.put('/',uploader.single('image'),updateGalleryHandler)
router.delete('/:id',deleteGalleryHandler)

export default router;