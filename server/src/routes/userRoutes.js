/**
 * User Routes
 */
import express from "express";
import * as userController from "../controllers/UserController.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = express.Router();

router.get("/", asyncHandler(userController.getAll));

router.get("/", asyncHandler(userController.getByEmail));

router.delete("/", asyncHandler(userController.deleteByEmail));

router.delete("/:id", asyncHandler(userController.deleteUser));

export default router;
