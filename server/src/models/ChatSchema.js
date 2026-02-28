/**
 * Schema for MongoDB using Mongoose
 */
import mongoose from "mongoose";

export const MESSAGE_TYPE = {
  GROUP: "group",
  DIRECT: "direct",
};

const chatSchema = new mongoose.Schema(
  {
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
    type: {
      type: String,
      enum: {
        values: [MESSAGE_TYPE.GROUP, MESSAGE_TYPE.DIRECT],
        message: "{VALUE} is not supported",
      },
      required: [true, "type is required"],
    },
    name: {
      type: String,
      maxLength: [100, "name must not exceed 100 characters"],
      default: "Unnamed Chat",
    },
  },
  {
    timestamps: true,
    methods: {},
  },
);

/**
 * Create model
 */
const Chat = mongoose.model("Chat", chatSchema);

Chat.syncIndexes();

export default Chat;
