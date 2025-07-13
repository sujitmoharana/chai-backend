import { Router } from "express";
import { loginuser, logoutuser, refreshacessToken, registerUser } from "../controllers/user.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { varifyjwt } from "../middlewares/auth.middlewares.js";
export const router = Router(); 

router.route("/register").post(
    upload.fields([
        {
            name:"avtar",
            maxCount:1
        },
        {
            name:"coverImage",
            maxCount:1
        }
    ]),
    registerUser
)
router.route("/login").post(loginuser)

//secured routes
router.route("/logout").post(varifyjwt,logoutuser)
router.route("/refreshtoken").get(refreshacessToken);


