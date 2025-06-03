const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true, // ✅ Required for Google login
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    avatar: {
      type: String, // URL to profile picture
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user", // ✅ Best practice
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
