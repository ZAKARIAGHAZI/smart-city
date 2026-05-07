const mongoose = require("mongoose");

const WaterReadingSchema = new mongoose.Schema({
  sensor_id: String,
  city: String,
  district: String,
  type: String, // e.g., hall_flow_meter
  water_flow: {
    pulses: Number,
    flow_rate_l_min: Number,
    volume_l: Number,
    flow_unit: String,
    volume_unit: String,
    status: String
  },
  water_quality: {
    ph: Number,
    turbidity_ntu: Number,
    tds_ppm: Number,
    chlorine_mg_l: Number,
    conductivity_us_cm: Number,
    water_temperature_c: Number,
    status: String,
    units: Object
  },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("WaterReading", WaterReadingSchema);
