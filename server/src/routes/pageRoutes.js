/**
 * Page Routes
 */

import * as controller from "../controllers/PageController.js";
import express from "express";
import asyncHandler from "../utils/asyncHandler.js";
import { adminGaurd } from "../middleware/authMiddleware.js";

const router = express.Router({ mergeParams: true });

/**
 * @swagger
 * /api/projects/{projectId}/pages:
 *   post:
 *     summary: Create a page inside a project
 *     tags: [Pages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the project
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Page created successfully
 */
router.post("/", adminGaurd, asyncHandler(controller.create));

/**
 * @swagger
 * /api/projects/{projectId}/pages:
 *   get:
 *     summary: Get all pages of a project
 *     tags: [Pages]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the project
 *     responses:
 *       200:
 *         description: List of pages
 */
router.get("/", asyncHandler(controller.getPagesMetaByProjectId));

router.get("/:pageId", asyncHandler(controller.getPageById));

router.patch("/:pageId", asyncHandler(controller.updateByPageId));
/**
 * @swagger
 * /api/projects/{projectId}/pages/{pageId}:
 *   put:
 *     summary: Update a page
 *     tags: [Pages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: pageId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Page updated successfully
 */
router.put("/:pageId", adminGaurd, asyncHandler(controller.updateById));

/**
 * @swagger
 * /api/projects/{projectId}/pages/{pageId}:
 *   delete:
 *     summary: Delete a page
 *     tags: [Pages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: pageId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Page deleted successfully
 */
router.delete("/:pageId", adminGaurd, asyncHandler(controller.deletePage));

export default router;
