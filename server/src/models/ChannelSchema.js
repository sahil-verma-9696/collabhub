/**
 * Schema for MongoDB using Mongoose
 */
import mongoose from "mongoose";


const schema = new mongoose.Schema(
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
    name: {
      type: String,
      maxLength: [100, "name must not exceed 100 characters"],
      default: "Unnamed Channel",
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
const Chat = mongoose.model("Channel", schema);

Chat.syncIndexes();

export default Chat;
