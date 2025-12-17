import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import Auth from "../middleware/authorization.middleware.js"
import { profileImage } from "../middleware/upload.middleware.js";

const router = Router();

router.get("/register", authController.renderRegister);
router.get("/login", authController.renderLogin);
router.post("/account", Auth, profileImage.single("profile"), authController.updateUser);

router.post("/user/register", authController.register);
router.post("/user/login", authController.login);

export default router;
