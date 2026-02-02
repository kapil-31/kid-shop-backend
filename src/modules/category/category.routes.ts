import { Router } from "express";
import { createCategoryHandler, updateCategoryHandler,searchCategoryHandler, deleteCategoryHandler } from "./category.controller";

const router = Router();

router.route('/')
.get(searchCategoryHandler)
.post(createCategoryHandler)


router.route('/:id').put(updateCategoryHandler)
.delete(deleteCategoryHandler)


export default  router;