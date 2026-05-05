import * as controller from "../controllers/TaskAssignmentController.js";
import express from "express";

const router = express.Router({ mergeParams: true });

/**
 * @swagger
 * /api/projects/{projectId}/tasks/{taskId}:
 *   post:
 *     summary: Create a task assignment
 *     tags: [TaskAssignments]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the project
 *         example: "69a3276fef8dabd1e64e4330"
 *
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID of the project
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user
 *             properties:
 *               user:
 *                 type: string
 *                 description: Assign user
 *
 *     responses:
 *       201:
 *         description: Task assigned successfully
 *       400:
 *         description: Bad request - Invalid input data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Project or Task not found
 *       500:
 *         description: Internal server error
 */
router.post("/", controller.postTaskAssignment);

/**
 * @swagger
 * /api/projects/{projectId}/tasks/{taskId}:
 *   delete:
 *     summary: Delete a task assignment
 *     tags: [TaskAssignments]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the project
 *
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user
 *             properties:
 *               user:
 *                 type: string
 *                 description: User to remove from assignment
 *
 *     responses:
 *       200:
 *         description: Task assignment deleted successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal server error
 */
router.delete("/", controller.deleteTaskAssignment);

export default router;
