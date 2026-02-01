import { Router } from "express";
import { loginHandler, logoutHandler, refreshHandler } from "./auth.controller";
import { requireAuth } from "@middlewares/requiresAuth";

const router =Router();

router.route('/login').post(loginHandler)

router.post('/refresh',requireAuth,refreshHandler)
router.post('/logout',requireAuth,logoutHandler)

export default router;