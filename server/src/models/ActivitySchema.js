import mongoose from "mongoose";

const ActivitySchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: [true, "project is required"],
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "user is required"],
      index: true,
    },
    action: {
      type: String,
      required: [true, "action is required"],
      trim: true,
    },
    resourceType: {
      type: String,
      trim: true,
      default: "other",
      index: true,
    },
    resourceId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

ActivitySchema.index({ project: 1, createdAt: -1 });
ActivitySchema.index({ user: 1, project: 1, createdAt: -1 });

const Activity = mongoose.model("Activity", ActivitySchema);

export default Activity;
