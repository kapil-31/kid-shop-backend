import { Router } from "express";
import { createProductHandler } from "./product.controller";


const router = Router();

router.route('/')
.post(createProductHandler)


export default router;