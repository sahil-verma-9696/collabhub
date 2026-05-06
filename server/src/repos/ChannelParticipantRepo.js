/**
 * Repository
 * Handles all database operations
 * Based on ER Diagram Schema
 */

import model from "../models/ChannelParticipantSchema.js";
import { Types } from "mongoose";
import { ObjectId } from "../utils/ObjectId.js";

/************************************************************************
 **************************** CREATE ************************************
 ************************************************************************/
export function create(payload) {
  return model.create({
    channel: ObjectId(payload.channel),
    user: ObjectId(payload.user),
    addBy: ObjectId(payload.addBy),
  });
}
/************************************************************************
 **************************** READ **************************************
 ************************************************************************/
export function getMembersByChannelId(channelId) {
  return model.find({ channel: ObjectId(channelId) }).populate("user");
}

/************************************************************************
 **************************** UPDATE ************************************
 ************************************************************************/
/************************************************************************
 **************************** DELETE ************************************
 ************************************************************************/
export function deleteByChannelId(channelId) {
  return model.deleteMany({ channel: ObjectId(channelId) });
}
