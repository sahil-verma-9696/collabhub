/**
 * Schema for MongoDB using Mongoose
 */
import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    chat: {
      type: mongoose.Types.ObjectId,
      required: [true, "chat is required"],
      ref: "Chat",
    },
    content: {
      type: String,
      required: [
        function () {
          return !this.mediaUri;
        },
        "content is required if mediaUri not present",
      ],
    },
    sender: {
      type: mongoose.Types.ObjectId,
      required: [true, "sender is required"],
    },
    mediaUri: {
      type: String,
      default: null,
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
const Message = mongoose.model("Message", messageSchema);

Message.syncIndexes();

export default Message;
