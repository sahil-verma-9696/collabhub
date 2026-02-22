/**
 * User Controller
 * Handles all user-related operations
 */

import * as userRepo from "../repos/UserRepo.js";

export async function getAll(_, res) {
  const users = await userRepo.getAll();
  return res.status(200).json(users);
}

export async function getByEmail(req, res) {
  const user = await userRepo.getByEmail(req.query.email);
  return res.status(200).json(user);
}

export async function deleteUser(req, res) {
  await userRepo.deleteOne(req.params.id);
  return res.sendStatus(200);
}

export async function deleteByEmail(req, res) {
  await userRepo.deleteByEmail(req.query.email);
  return res.sendStatus(200);
}
