import mongoose from "mongoose";

const chatSchema = mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    lastMessage: {
      senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      text: String,
      timestamp: Date,
    },
  },
  { timestamps: true }
);

export const Chat = mongoose.model("Chat", chatSchema);