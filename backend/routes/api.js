const express = require("express");
const router = express.Router();
const EnvironmentReading = require("../models/EnvironmentReading");
const WaterReading = require("../models/WaterReading");

// ── ENVIRONMENT ENDPOINTS ──

router.get("/temperatures/latest", async (req, res) => {
  try {
    const data = await EnvironmentReading.find().sort({ timestamp: -1 }).limit(100);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/temperatures/avg-by-district", async (req, res) => {
  try {
    const result = await EnvironmentReading.aggregate([
      {
        $group: {
          _id: "$district",
          avgTemperature: { $avg: "$temperature" },
          maxTemperature: { $max: "$temperature" },
          minTemperature: { $min: "$temperature" },
          avgAqi: { $avg: "$air_quality.aqi" },
          count: { $sum: 1 },
          lastUpdate: { $max: "$timestamp" }
        }
      }
    ]);
    res.json(result.map(item => ({
      district: item._id,
      avg_temperature: item.avgTemperature,
      max_temperature: item.maxTemperature,
      min_temperature: item.minTemperature,
      avg_aqi: item.avgAqi,
      sensor_count: item.count,
      last_update: item.lastUpdate
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/temperatures/history", async (req, res) => {
  try {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const history = await EnvironmentReading.aggregate([
      { $match: { timestamp: { $gte: twentyFourHoursAgo } } },
      {
        $group: {
          _id: {
            year: { $year: "$timestamp" },
            month: { $month: "$timestamp" },
            day: { $dayOfMonth: "$timestamp" },
            hour: { $hour: "$timestamp" }
          },
          avgTemperature: { $avg: "$temperature" },
          avgAqi: { $avg: "$air_quality.aqi" },
          timestamp: { $min: "$timestamp" }
        }
      },
      { $sort: { timestamp: 1 } }
    ]);
    res.json(history.map(h => ({
      time: h.timestamp,
      temperature: h.avgTemperature,
      aqi: h.avgAqi
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── WATER ENDPOINTS ──

router.get("/water/latest", async (req, res) => {
  try {
    const data = await WaterReading.find().sort({ timestamp: -1 }).limit(100);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/water/stats-by-district", async (req, res) => {
  try {
    const result = await WaterReading.aggregate([
      {
        $group: {
          _id: "$district",
          avgFlow: { $avg: "$water_flow.flow_rate_l_min" },
          totalVolume: { $sum: "$water_flow.volume_l" },
          avgPh: { $avg: "$water_quality.ph" },
          avgTurbidity: { $avg: "$water_quality.turbidity_ntu" },
          count: { $sum: 1 },
          lastUpdate: { $max: "$timestamp" }
        }
      }
    ]);
    res.json(result.map(item => ({
      district: item._id,
      avg_flow: item.avgFlow,
      total_volume: item.totalVolume,
      avg_ph: item.avgPh,
      avg_turbidity: item.avgTurbidity,
      sensor_count: item.count,
      last_update: item.lastUpdate
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/water/history", async (req, res) => {
  try {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const history = await WaterReading.aggregate([
      { $match: { timestamp: { $gte: twentyFourHoursAgo } } },
      {
        $group: {
          _id: {
            year: { $year: "$timestamp" },
            month: { $month: "$timestamp" },
            day: { $dayOfMonth: "$timestamp" },
            hour: { $hour: "$timestamp" }
          },
          avgFlow: { $avg: "$water_flow.flow_rate_l_min" },
          timestamp: { $min: "$timestamp" }
        }
      },
      { $sort: { timestamp: 1 } }
    ]);
    res.json(history.map(h => ({
      time: h.timestamp,
      flow: h.avgFlow
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
