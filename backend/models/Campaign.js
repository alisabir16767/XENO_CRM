const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    segmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Segment",
      required: true,
    },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "sent", "delivered", "failed"],
      default: "pending",
    },
  },
  {
    timestamps: true, 
  }
);

module.exports = mongoose.model("Campaign", campaignSchema);
