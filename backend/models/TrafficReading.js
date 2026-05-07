const mongoose = require("mongoose");

const TrafficReadingSchema = new mongoose.Schema({
  sensor_id: String,
  route_id: String,
  city: String,
  sensor_type: String,
  observation_time_s: Number,
  occupied_time_s: Number,
  occupancy_rate: Number,
  congestion_index: Number,
  average_speed_kmh: Number,
  vehicle_count: Number,
  vehicle_detected: Number,
  traffic_status: { type: String, enum: ["fluide", "dense", "congestion", "forte_congestion"] },
  timestamp: { type: Date, default: Date.now }
});

TrafficReadingSchema.index({ timestamp: -1 });
TrafficReadingSchema.index({ route_id: 1, timestamp: -1 });

module.exports = mongoose.model("TrafficReading", TrafficReadingSchema);
