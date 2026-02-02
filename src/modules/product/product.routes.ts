import { Router } from "express";
import { createProductHandler ,searchProductHandler,getOnProductHandler, updateProductHandler,deleteProductHandler} from "./product.controller";


const router = Router();

router.route('/')
.post(createProductHandler)
.get(searchProductHandler)

router.route('/:id')
.get(getOnProductHandler)
.put(updateProductHandler)
.delete(deleteProductHandler)


export default router;