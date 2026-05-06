/**
 * Schema for MongoDB using Mongoose
 */
import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    channel: {
      type: mongoose.Types.ObjectId,
      required: [true, "channel is required"],
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
const ChatParticipant = mongoose.model("ChannelParticipant", schema);

ChatParticipant.syncIndexes();

export default ChatParticipant;
