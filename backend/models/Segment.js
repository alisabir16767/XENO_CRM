const mongoose = require("mongoose");

const segmentRuleSchema = new mongoose.Schema({
  field: { type: String, required: true },
  operator: { type: String, required: true },
  value: { type: mongoose.Schema.Types.Mixed, required: true },
});

const segmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  audienceSize: { type: Number, required: true },
  segmentRule: { type: [segmentRuleSchema], required: true },
  scheduledAt: { type: Date, default: Date.now },
  active: { type: Boolean, default: true },
});

module.exports =
  mongoose.models.Segment || mongoose.model("Segment", segmentSchema);
