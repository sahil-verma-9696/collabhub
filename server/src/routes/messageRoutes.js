import express from "express";
import * as controller from "../controllers/MessageController.js";

// Import common middleware
// import { AuthGuard, memberGaurd, adminGaurd } from "../middleware/authMiddleware.js";
// import { validateRequest } from "../middleware/validationMiddleware.js"; // If you have validation middleware
// import { rateLimit } from "../middleware/rateLimitMiddleware.js"; // If you have rate limiting

const router = express.Router({ mergeParams: true });

/**
 * @swagger
 * /api/projects/{projectId}/channels:
 *   post:
 *     summary: Create a new channel
 *     tags: [Channels]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name:
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the channel
 *                 example: "Frontend Development"
 *     responses:
 *       201:
 *         description: channel created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Bad request - Invalid input data
 *       401:
 *         description: Unauthorized
 *       409:
 *         description: Conflict - channel already exists in this project.
 *       500:
 *         description: Internal server error
 */
// router.post("/", controller.postChannels);

/**
 * @swagger
 * /api/projects/{projectId}/channels:
 *   get:
 *     summary: Get all the channels of a project
 *     tags: [Channels]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *     responses:
 *       201:
 *         description: channel created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Bad request - Invalid input data
 *       401:
 *         description: Unauthorized
 *       409:
 *         description: Conflict - channel already exists in this project.
 *       500:
 *         description: Internal server error
 */
router.get("/", controller.getMessagesByChannel);

/**
 * @swagger
 * /api/projects/{projectId}/channels/{channelId}:
 *   get:
 *     summary: Get a channel
 *     tags: [Channels]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *     responses:
 *       201:
 *         description: channel created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Bad request - Invalid input data
 *       401:
 *         description: Unauthorized
 *       409:
 *         description: Conflict - channel already exists in this project.
 *       500:
 *         description: Internal server error
 */
// router.get("/:channelId", controller.getChannel);

/**
 * @swagger
 * /api/projects/{projectId}/channels/{channelId}:
 *   delete:
 *     summary: Delete a channel
 *     tags: [Channels]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *     responses:
 *       201:
 *         description: channel created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Bad request - Invalid input data
 *       401:
 *         description: Unauthorized
 *       409:
 *         description: Conflict - channel already exists in this project.
 *       500:
 *         description: Internal server error
 */
// router.delete("/:channelId", controller.deleteChannel);

export default router;
