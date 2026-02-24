import * as filterRepo from "../repos/FilterRepo.js";

export const createFilter = async (req, res) => {
  const createdFilter = await filterRepo.create(req.body);
  res.status(201).json(createdFilter);
};
