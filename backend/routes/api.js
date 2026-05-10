const express = require("express");
const router = express.Router();
const EnvironmentReading = require("../models/EnvironmentReading");
const WaterReading = require("../models/WaterReading");
const TrafficReading = require("../models/TrafficReading");

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
    const SparkAggregation = require("../models/SparkAggregation");
    const result = await SparkAggregation.aggregate([
      { $match: { type: "environment" } },
      { $sort: { timestamp: -1 } },
      {
        $group: {
          _id: "$district",
          avgTemperature: { $first: "$data.avg_temperature" },
          avgAqi: { $first: "$data.avg_air_quality" },
          lastUpdate: { $first: "$timestamp" }
        }
      }
    ]);
    res.json(result.map(item => ({
      district: item._id,
      avg_temperature: item.avgTemperature,
      max_temperature: item.avgTemperature, // Spark provides avg
      min_temperature: item.avgTemperature,
      avg_aqi: item.avgAqi,
      sensor_count: 1, // Aggregated window
      last_update: item.lastUpdate
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/temperatures/history", async (req, res) => {
  try {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const SparkAggregation = require("../models/SparkAggregation");
    
    // Group by hour from Spark aggregated windows
    const history = await SparkAggregation.aggregate([
      { 
        $match: { 
          type: "environment",
          timestamp: { $gte: twentyFourHoursAgo } 
        } 
      },
      {
        $group: {
          _id: {
            year: { $year: "$timestamp" },
            month: { $month: "$timestamp" },
            day: { $dayOfMonth: "$timestamp" },
            hour: { $hour: "$timestamp" }
          },
          avgTemp: { $avg: "$data.avg_temperature" },
          avgAqi: { $avg: "$data.avg_air_quality" },
          timestamp: { $min: "$timestamp" }
        }
      },
      { $sort: { timestamp: 1 } }
    ]);
    
    res.json(history.map(h => ({
      time: h.timestamp,
      temperature: h.avgTemp,
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
    const SparkAggregation = require("../models/SparkAggregation");
    const result = await SparkAggregation.aggregate([
      { $match: { type: "water" } },
      { $sort: { timestamp: -1 } },
      {
        $group: {
          _id: "$district",
          avgFlow: { $first: "$data.avg_flow_rate" },
          avgPh: { $first: "$data.avg_ph" },
          avgTurbidity: { $first: "$data.avg_turbidity" },
          lastUpdate: { $first: "$timestamp" }
        }
      }
    ]);
    res.json(result.map(item => ({
      district: item._id,
      avg_flow: item.avgFlow,
      total_volume: 0, // Spark provides rates
      avg_ph: item.avgPh,
      avg_turbidity: item.avgTurbidity,
      sensor_count: 1,
      last_update: item.lastUpdate
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/water/history", async (req, res) => {
  try {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const SparkAggregation = require("../models/SparkAggregation");
    
    const history = await SparkAggregation.aggregate([
      { 
        $match: { 
          type: "water",
          timestamp: { $gte: twentyFourHoursAgo } 
        } 
      },
      {
        $group: {
          _id: {
            year: { $year: "$timestamp" },
            month: { $month: "$timestamp" },
            day: { $dayOfMonth: "$timestamp" },
            hour: { $hour: "$timestamp" }
          },
          avgFlow: { $avg: "$data.avg_flow_rate" },
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

// ── TRAFFIC ENDPOINTS ──

router.get("/traffic/latest", async (req, res) => {
  try {
    const data = await TrafficReading.find().sort({ timestamp: -1 }).limit(100);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/traffic/stats-by-route", async (req, res) => {
  try {
    const SparkAggregation = require("../models/SparkAggregation");
    const result = await SparkAggregation.aggregate([
      { $match: { type: "traffic" } },
      { $sort: { timestamp: -1 } },
      {
        $group: {
          _id: "$route_id",
          avgSpeed: { $first: "$data.avg_speed" },
          maxCongestion: { $first: "$data.max_congestion" },
          lastUpdate: { $first: "$timestamp" }
        }
      }
    ]);
    res.json(result.map(item => ({
      route_id: item._id,
      avg_speed: item.avgSpeed,
      avg_occupancy: 0,
      avg_congestion: item.maxCongestion,
      total_vehicles: 0,
      sensor_count: 1,
      last_update: item.lastUpdate
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/traffic/history", async (req, res) => {
  try {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const SparkAggregation = require("../models/SparkAggregation");
    
    const history = await SparkAggregation.aggregate([
      { 
        $match: { 
          type: "traffic",
          timestamp: { $gte: twentyFourHoursAgo } 
        } 
      },
      {
        $group: {
          _id: {
            year: { $year: "$timestamp" },
            month: { $month: "$timestamp" },
            day: { $dayOfMonth: "$timestamp" },
            hour: { $hour: "$timestamp" }
          },
          avgSpeed: { $avg: "$data.avg_speed" },
          avgCongestion: { $avg: "$data.max_congestion" },
          timestamp: { $min: "$timestamp" }
        }
      },
      { $sort: { timestamp: 1 } }
    ]);
    res.json(history.map(h => ({
      time: h.timestamp,
      avg_speed: h.avgSpeed,
      avg_congestion: h.avgCongestion
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
