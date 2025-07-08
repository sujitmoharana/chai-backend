import { Router } from "express";
import { registerUser } from "../controllers/user.controllers.js";

export const router = Router(); 

router.route("/register").post(registerUser)
