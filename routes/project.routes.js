import { Router } from "express";
import Auth from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";
import * as projectController from "../controllers/project.controller.js";

const router = Router();

router.get("/home", Auth, projectController.listProjects);
router.get("/project/:id", projectController.getProject);
router.get("/account/:name", Auth, projectController.getAccount);

router.get("/add", Auth, projectController.renderAdd);
router.post("/add", Auth, upload.single("image"), projectController.addProject);

router.post("/project/edit/:id", Auth, projectController.editProject);
router.post("/project/delete/:id", Auth, projectController.deleteProject);

export default router;
