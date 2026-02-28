/**
 * Schema for MongoDB using Mongoose
 */
import mongoose from "mongoose";

const chatParticipantSchema = new mongoose.Schema(
  {
    chat: {
      type: mongoose.Types.ObjectId,
      required: [true, "chat is required"],
      ref: "Chat",
    },
    user: {
      type: mongoose.Types.ObjectId,
      required: [true, "user is required"],
      ref: "User",
    },
    addBy: {
      type: mongoose.Types.ObjectId,
      required: [true, "addBy is required"],
      ref: "User",
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
const ChatParticipant = mongoose.model("ChatParticipant", chatParticipantSchema);

ChatParticipant.syncIndexes();

export default ChatParticipant;
