import { Router } from "express";
import { createProductHandler,updateProductImage,removeProductImage ,searchProductHandler,getOnProductHandler, updateProductHandler,deleteProductHandler} from "./product.controller";
import { requireAuth } from "@middlewares/requiresAuth";
import { uploader } from "@modules/file-upload/config";


const router = Router();


router.route('/')
.post(requireAuth,createProductHandler)
.get(searchProductHandler)


router.use(requireAuth)
router.route('/:id')
.get(getOnProductHandler)
.put(updateProductHandler)
.delete(deleteProductHandler)

router.route('/:id/images')
.put(uploader.array('images',10),updateProductImage)

router.route('/:productId/images/:imageId').delete(removeProductImage)

export default router;