import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      min: 2,
      max: 50,
    },
    lastName: {
      type: String,
      required: true,
      min: 2,
      max: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      max: 50,
    },
    password: {
      type: String,
      required: true,
      min: 5,
    },
    picturePath: {
      type: String,
      default: "",
    },
    friends: {
      type: Array,
      default: [],
    },
    socketId: String,
    location: String,
    views: Number,
    impressions: Number,
    occupation: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  { timestamps: true, expireAfterSeconds: 60 * 60 * 24 } 
);

export const User = mongoose.model("User", userSchema);
