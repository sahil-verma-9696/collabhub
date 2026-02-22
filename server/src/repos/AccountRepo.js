/**
 * Account Repository
 * Handles all database operations related to Accounts
 * Based on ER Diagram Schema
 */

import Account from "../models/AccountSchema.js";
import { Types } from "mongoose";

/************************************************************************
 **************************** CREATE ************************************
 ************************************************************************/
export async function create(account, options = {}) {
  const newAccount = new Account({
    ...account,
    userId: new Types.ObjectId(account.userId),
  });

  return await newAccount.save(options);
}

/************************************************************************
 **************************** READ **************************************
 ************************************************************************/
export async function getAccountByUserId(userId) {
  return await Account.findOne({
    userId: new Types.ObjectId(userId),
  });
}

/************************************************************************
 **************************** UPDATE ************************************
 ************************************************************************/
export async function updateIsEmailVerifiedByUserId(userId, isEmailVerified) {
  return await Account.updateOne(
    { userId: new Types.ObjectId(userId) },
    { $set: { isEmailVerified, emailVerifiedAt: new Date() } },
    { upsert: true },
  );
}
/************************************************************************
 **************************** DELETE ************************************
 ************************************************************************/
