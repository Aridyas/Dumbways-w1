import { Router } from "express";
import Auth from "../middleware/authorization.middleware.js";
import { projectImage, profileImage } from "../middleware/upload.middleware.js";
import * as projectController from "../controllers/project.controller.js";

const router = Router();

router.get("/home", Auth, projectController.listProjects);
router.post("/home", Auth, projectController.filter)
router.get("/project/:id", projectController.getProject);
router.get("/account/:id", Auth, projectController.getAccount);
router.post("/account/:id", Auth, profileImage.single("image"), projectController.addProject);

router.get("/add", Auth, projectController.renderAdd);
router.post("/add", Auth, projectImage.single("image"), projectController.addProject);

router.post("/project/edit/:id", Auth, projectController.editProject);
router.post("/project/delete/:id", Auth, projectController.deleteProject);

export default router;
