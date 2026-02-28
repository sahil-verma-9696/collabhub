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
    account: new Types.ObjectId(loginDetails.account),
  });

  return await newLoginDetails.save(options);
}

/************************************************************************
 **************************** READ **************************************
 ************************************************************************/
export async function getLoginDetailsByAccountId(accountId) {
  if (!accountId) throw new Error("Account ID is required");
  
  return await LoginDetails.findOne({
    account: new Types.ObjectId(accountId),
  });
}
/************************************************************************
 **************************** UPDATE ************************************
 ************************************************************************/
/************************************************************************
 **************************** DELETE ************************************
 ************************************************************************/
