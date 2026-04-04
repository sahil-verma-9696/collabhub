/**
 * PageMeta Schema for MongoDB using Mongoose
 * Based on ER Diagram - Entity
 */

import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "title is required"],
    },
    page:{
      type: mongoose.Types.ObjectId,
      required: [true, "page is required"],
      ref: "Page",
    },
    project: {
      type: mongoose.Types.ObjectId,
      required: [true, "project is required"],
      ref: "Project",
    },
    creator: {
      type: mongoose.Types.ObjectId,
      required: [true, "creator is required"],
      ref: "User",
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

/**
 * Create Account model
 */
const Model = mongoose.model("PageMeta", schema);

Model.syncIndexes();

export default Model;
