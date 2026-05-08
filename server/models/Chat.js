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
    requestStatus: {
      type: String,
      enum: ["accepted", "pending"],
      default: "pending",
    },
    requestSenderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    pendingExpiresAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// TTL index: auto-delete pending requests after 2 weeks 
chatSchema.index({ pendingExpiresAt: 1 }, { expireAfterSeconds: 0 });

export const Chat = mongoose.model("Chat", chatSchema);