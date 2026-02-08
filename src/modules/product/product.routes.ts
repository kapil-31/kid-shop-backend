import { Router } from "express";
import { createProductHandler ,searchProductHandler,getOnProductHandler, updateProductHandler,deleteProductHandler} from "./product.controller";
import { requireAuth } from "@middlewares/requiresAuth";


const router = Router();

router.use(requireAuth)

router.route('/')
.post(createProductHandler)
.get(searchProductHandler)

router.route('/:id')
.get(getOnProductHandler)
.put(updateProductHandler)
.delete(deleteProductHandler)


export default router;