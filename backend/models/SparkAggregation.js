const mongoose = require("mongoose");

const SparkAggregationSchema = new mongoose.Schema({
  type: { type: String, required: true, enum: ["environment", "water", "traffic"] },
  district: { type: String },
  route_id: { type: String },
  data: { type: mongoose.Schema.Types.Mixed, required: true },
  window_start: { type: Date },
  window_end: { type: Date },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("SparkAggregation", SparkAggregationSchema);
