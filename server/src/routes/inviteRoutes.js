/**
 * Invite Routes
 */
import express from "express";
import * as controller from "../controllers/InviteController.js";
import { adminGaurd, memberGaurd } from "../middleware/authMiddleware.js";

const router = express.Router({ mergeParams: true });

/**
 * @swagger
 * /api/projects/{projectId}/invites:
 *   post:
 *     summary: Create a new project invitation
 *     tags: [Invites]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
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
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email address of the user to invite
 *     responses:
 *       201:
 *         description: Invitation created successfully
 *       400:
 *         description: Bad request - Invalid email or user already invited
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not authorized to invite users
 */
router.post("/", memberGaurd, adminGaurd, controller.create);

/**
 * @swagger
 * /api/projects/{projectId}/invites:
 *   get:
 *     summary: Get all invitations for a project
 *     tags: [Invites]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the project
 *         example: "69a3276fef8dabd1e64e4330"
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: string
 *           enum: [pending, accepted, rejected]
 *         description: Filter invites by status
 *         example: "pending"
 *       - in: query
 *         name: role
 *         required: false
 *         schema:
 *           type: string
 *           enum: [admin, write, read]
 *         description: Filter invites by role
 *         example: "admin"
 *       - in: query
 *         name: receiver
 *         required: false
 *         schema:
 *           type: string
 *         description: Filter invites by receiver
 *       - in: query
 *         name: sender
 *         required: false
 *         schema:
 *           type: string
 *         description: Filter invites by sender
 *       - in: query
 *         name: email
 *         required: false
 *         schema:
 *           type: email
 *         description: Filter invites by email
 *
 *     responses:
 *       200:
 *         description: List of invitations retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   email:
 *                     type: string
 *                   projectId:
 *                     type: string
 *                   invitedBy:
 *                     type: string
 *                   status:
 *                     type: string
 *                     enum: [pending, accepted, rejected]
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not a project member
 */
router.get("/",  controller.getInvites);

/**
 * @swagger
 * /api/projects/{projectId}/invites:
 *   patch:
 *     summary: Accept or reject a project invitation
 *     tags: [Invites]
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
 *             required:
 *               - action
 *             properties:
 *               action:
 *                 type: string
 *                 enum: [accept, reject]
 *                 description: Action to perform on the invitation
 *     responses:
 *       200:
 *         description: Invitation processed successfully
 *       400:
 *         description: Bad request - Invalid action
 *       404:
 *         description: Invitation not found
 */
router.patch("/", controller.accept);

/**
 * @swagger
 * /api/projects/{projectId}/invites/{inviteId}:
 *   delete:
 *     summary: Delete a project invitation
 *     tags: [Invites]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the project
 *       - in: path
 *         name: inviteId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the invitation
 *     responses:
 *       200:
 *         description: Invitation deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not authorized to delete this invitation
 *       404:
 *         description: Invitation not found
 */
router.delete("/:inviteId", memberGaurd, adminGaurd, controller.deleteById);

export default router;
