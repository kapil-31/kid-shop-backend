import { Router } from "express";
import { deleteBannerHandler, getBannerHandler, storeBannerHandler, updateBannerHandler } from "./banner.controller";
import { uploader } from "@modules/file-upload/config";
import { requireAuth } from "@middlewares/requiresAuth";


const router = Router();
router.get('/',getBannerHandler)

router.use(requireAuth)

router.post('/',uploader.single('image'),storeBannerHandler)
router.put('/',uploader.single('image'),updateBannerHandler)
router.delete('/:id',deleteBannerHandler)
export default router;
