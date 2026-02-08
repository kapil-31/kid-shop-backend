import { Router } from "express";
import { createCategoryHandler, updateCategoryHandler,searchCategoryHandler, deleteCategoryHandler } from "./category.controller";
import { requireAuth } from "@middlewares/requiresAuth";

const router = Router();

router.route('/')
.get(requireAuth,searchCategoryHandler)
.post(createCategoryHandler)


router.route('/:id').put(updateCategoryHandler)
.delete(deleteCategoryHandler)


export default  router;