import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";

const router = Router();

router.get("/register", authController.renderRegister);
router.get("/login", authController.renderLogin);

router.post("/user/register", authController.register);
router.post("/user/login", authController.login);

export default router;
