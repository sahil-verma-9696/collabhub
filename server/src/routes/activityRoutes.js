import express from "express";
import * as activityController from "../controllers/ActivityController.js";

const router = express.Router({ mergeParams: true });

/**
 * @swagger
 * /api/projects/{projectId}/activities:
 *   get:
 *     summary: Get project activity feed
 *     tags: [Activity]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         description: Project ID
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Maximum number of activity items to return
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Number of activity items to skip
 *       - in: query
 *         name: action
 *         schema:
 *           type: string
 *         description: Filter by action text
 *       - in: query
 *         name: resourceType
 *         schema:
 *           type: string
 *         description: Filter by resource type
 *     responses:
 *       200:
 *         description: List of activity entries for the project
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   project:
 *                     type: string
 *                   user:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       email:
 *                         type: string
 *                   action:
 *                     type: string
 *                   resourceType:
 *                     type: string
 *                   resourceId:
 *                     type: string
 *                   details:
 *                     type: object
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 */
router.get("/", activityController.getProjectActivities);

export default router;
