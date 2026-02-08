import { Router } from "express";
import { loginHandler, logoutHandler, refreshHandler,getMeHandler } from "./auth.controller";
import { requireAuth } from "@middlewares/requiresAuth";

const router =Router();

router.route('/login').post(loginHandler)

router.post('/refresh',refreshHandler)
router.post('/logout',requireAuth,logoutHandler)
router.get('/me',requireAuth,getMeHandler)

export default router;