import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    description: {
      type: String,
      trim: true,
      default: null,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "private",
    },

    teamLimit: {
      type: Number,
      default: 6,
      min: 1,
    },

    
    members: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        role: {
          type: String,
          enum: ["Admin", "Write", "Read"],
          default: "Read",
        },
        joinedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },

    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // automatically manages createdAt & updatedAt
  }
);

// Index for faster queries
ProjectSchema.index({ owner: 1, isDeleted: 1 });

const Project = mongoose.model("Project", ProjectSchema);

export default Project;