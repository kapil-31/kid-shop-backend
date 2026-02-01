import { Router } from "express";
import { createUserHandler, searchUsersHandler } from "./user.controller";
import { searchUsers } from "./user.service";

const router = Router();
router.route('/')
.post(createUserHandler)
.get(searchUsersHandler)



export default  router;