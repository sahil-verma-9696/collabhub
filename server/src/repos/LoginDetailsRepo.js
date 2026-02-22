/**
 * User Repository
 * Handles all database operations related to users
 * Based on ER Diagram Schema
 */

import LoginDetails from "../models/LoginDetailsSchema.js";
import { Types } from "mongoose";

/************************************************************************
 **************************** CREATE ************************************
 ************************************************************************/
export async function create(loginDetails, options = {}) {
  const newLoginDetails = new LoginDetails({
    ...loginDetails,
    accountId: new Types.ObjectId(loginDetails.accountId),
  });

  return await newLoginDetails.save(options);
}

/************************************************************************
 **************************** READ **************************************
 ************************************************************************/
export async function getLoginDetailsByAccountId(accountId) {
  return await LoginDetails.findOne({
    accountId: new Types.ObjectId(accountId),
  });
}
/************************************************************************
 **************************** UPDATE ************************************
 ************************************************************************/
/************************************************************************
 **************************** DELETE ************************************
 ************************************************************************/
