/**
 * Page Schema for MongoDB using Mongoose
 * Based on ER Diagram - Entity
 */

import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    content: {
      type: Object,
      required: [true, "content is required"],
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
const Model = mongoose.model("Page", schema);

Model.syncIndexes();

export default Model;
