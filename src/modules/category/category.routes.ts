import { Router } from "express";
import { createCategoryHandler, updateCategoryHandler,searchCategoryHandler, deleteCategoryHandler } from "./category.controller";
import { requireAuth } from "@middlewares/requiresAuth";

const router = Router();

// public routes;


router.route('/')
.get(searchCategoryHandler)
.post(requireAuth,createCategoryHandler)


router.use(requireAuth)
router.route('/:id').put(updateCategoryHandler)
.delete(deleteCategoryHandler)


export default  router;