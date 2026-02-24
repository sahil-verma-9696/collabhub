import express from "express";
import * as filterController from "../controllers/FilterController.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = express.Router();

router.post("/", asyncHandler(filterController.createFilter));
export default router;
