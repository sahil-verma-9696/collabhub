import express from "express";
import { createProject } from "../controllers/ProjectController.js";
import { getAllProjects } from "../controllers/ProjectController.js";
import { getProject } from "../controllers/ProjectController.js";
import { updateProject } from "../controllers/ProjectController.js";
import { deleteProject } from "../controllers/ProjectController.js";

const router = express.Router();

router.post("/" , createProject);
router.get("/", getAllProjects);
router.get("/:id",getProject);
router.put("/:id",updateProject);
router.delete("/:id", deleteProject);

export default router;