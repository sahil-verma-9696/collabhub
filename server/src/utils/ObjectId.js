import { Types } from "mongoose";

export function ObjectId(property) {
  if (!property) return undefined;

  return new Types.ObjectId(property);
}
