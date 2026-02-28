import express from "express";
import { createProject } from "../controllers/ProjectController.js";
import { getAllProjects } from "../controllers/ProjectController.js";
import { getProject } from "../controllers/ProjectController.js";
import { updateProject } from "../controllers/ProjectController.js";
import { deleteProject } from "../controllers/ProjectController.js";
import asyncHandler from "../utils/asyncHandler.js";
const router = express.Router();

router.post("/" , asyncHandler(createProject));
router.get("/", asyncHandler(getAllProjects));
router.get("/:id",asyncHandler(getProject));
router.put("/:id",asyncHandler(updateProject));
router.delete("/:id",asyncHandler(deleteProject));

export default router;