/**
 * Repository
 * Handles all database operations
 * Based on ER Diagram Schema
 */

import model from "../models/MessageSchema.js";
import { ObjectId } from "../utils/ObjectId.js";

/************************************************************************
 **************************** CREATE ************************************
 ************************************************************************/
export function create(payload) {
  return model.create({
    ...payload,
    channel: ObjectId(payload.channel),
    sender: ObjectId(payload.sender),
  });
}
/************************************************************************
 **************************** READ **************************************
 ************************************************************************/
export function getMessagesByChannelId(channelId) {
  return model.find({ channel: ObjectId(channelId) });
}

/************************************************************************
 **************************** UPDATE ************************************
 ************************************************************************/
/************************************************************************
 **************************** DELETE ************************************
 ************************************************************************/
export function hardDeleteByChannelId(channelId) {
  return model.deleteMany({ channel: ObjectId(channelId) });
}
