import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Project name is required"],
      trim: true,
      maxlength: [100, "Name should not be more than 100 characters"],
    },

    description: {
      type: String,
      trim: true,
      default: null,
      maxlength: [500, "Description should not exceed 500 characters"],
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [false, "Owner is optional"],
      index: true,
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