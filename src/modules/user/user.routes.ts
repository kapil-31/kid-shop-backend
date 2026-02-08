import { Router } from "express";
import { createUserHandler, searchUsersHandler } from "./user.controller";
import { requireAuth } from "@middlewares/requiresAuth";


const router = Router();
router.use(requireAuth)

router.route('/')
.post(createUserHandler)
.get(requireAuth, searchUsersHandler)



export default  router;