/**
 * Authentication Middleware
 * Verifies JWT tokens and Google OAuth
 */
import * as tokenService from "../utils/token.service.js";
import * as projectMemberRepo from "../repos/ProjectMemberRepo.js";
import projectRepo from "../repos/ProjectRepo.js";
import { PROJECT_ROLE } from "../common/constants.js";
import asyncHandler from "../utils/asyncHandler.js";

/**
 * Middleware to verify JWT token from Authorization header or cookies
 */
export const AuthGuard = asyncHandler((req, res, next) => {
  let token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    token = req.cookies?.token;
  }

  if (!token) {
    throw new Error(
      JSON.stringify({
        message: "No token provided",
        status: 401,
      }),
    );
  }

  const decoded = tokenService.verifyToken(token);

  req.user = decoded;

  next();
});

/**
 * Middleware to verify token for Socket.io
 */
export const SocketAuthGuard = asyncHandler((socket, next) => {
  const token =
    socket.handshake.auth.token ||
    socket.handshake.headers.authorization?.split(" ")[1];

  if (!token) return next(new Error("Authentication token required"));

  /**
   * GET browserInfo and deviceId from Client
   * ----------------------------------------
   */
  const { browserInfo, deviceId, projectId } = socket.handshake.auth || {};

  if (!browserInfo) return next(new Error("browserInfo required"));
  if (!deviceId) return next(new Error("deviceId required"));

  const user = tokenService.verifyToken(token);

  /**
   * Attach user to Socket
   * ---------------------
   * @description Attach user to Socket in `in-memory`.
   */
  socket.data = {
    user,
    deviceId,
    email: user.email,
    browserInfo,
  };

  next();
});

export const memberGaurd = asyncHandler(async (req, res, next) => {
  const projectId = req.params.projectId || req.params.id;
  const userId = req.user.userId;

  const project = await projectRepo.findById(projectId);

  if (!project)
    throw new Error(
      JSON.stringify({
        message: "Project not found",
        status: 404,
      }),
    );

  const isOwner = project.owner.toString() === userId;

  if (isOwner) {
    req.user.role = PROJECT_ROLE.OWNER;
    return next();
  }

  const member = await projectMemberRepo.getByUserAndProject(userId, projectId);

  if (member) {
    req.user.role = member.role;
    return next();
  }

  throw new Error(
    JSON.stringify({
      message: "Unauthorized Only Project Member Allowed",
      status: 401,
    }),
  );
});

export const ownerGaurd = asyncHandler((req, res, next) => {
  if (req.user.role !== PROJECT_ROLE.OWNER)
    throw new Error(
      JSON.stringify({
        message: `Unauthorized Only Project Owner Allowed not ${req.user.role}`,
        status: 401,
      }),
    );
  next();
});

export const adminGaurd = asyncHandler((req, res, next) => {
  if (
    req.user.role !== PROJECT_ROLE.OWNER &&
    req.user.role !== PROJECT_ROLE.ADMIN
  )
    throw new Error(
      JSON.stringify({
        message: `Unauthorized Only Project Owner or Admin Allowed not ${req.user.role}`,
        status: 401,
      }),
    );

  next();
});

export const writeGaurd = asyncHandler((req, res, next) => {
  if (
    req.user.role !== PROJECT_ROLE.OWNER &&
    req.user.role !== PROJECT_ROLE.ADMIN &&
    req.user.role !== PROJECT_ROLE.WRITE
  )
    throw new Error(
      JSON.stringify({
        message: `Unauthorized Only Project Owner, Admin or Write Allowed not ${req.user.role}`,
        status: 401,
      }),
    );

  next();
});
