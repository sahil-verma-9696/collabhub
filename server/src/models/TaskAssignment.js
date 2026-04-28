/**
 * Schema for MongoDB using Mongoose
 * Based on ER Diagram - Entity
 */

import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Types.ObjectId,
      required: [true, "project is required"],
      ref: "Project",
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "user is required"],
    },
    assignor: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "assignor is required"],
    },
    task: {
      type: mongoose.Types.ObjectId,
      ref: "Task",
      required: [true, "task is required"],
    },


    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletor: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      default: null,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    methods: {},
  },
);

// schema.index(
//   { project: 1, user: 1 },
//   { unique: true, partialFilterExpression: { isDeleted: false } },
// );

/**
 * Create Account model
 */
const Model = mongoose.model("TaskAssignment", schema);

Model.syncIndexes();

export default Model;
