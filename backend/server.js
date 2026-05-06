const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const mongoose = require("mongoose");
const { Kafka } = require("kafkajs");

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// MongoDB
mongoose.connect("mongodb://localhost:27017/smartcity")
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB error:", err));

const TemperatureSchema = new mongoose.Schema({
  sensor_id: String,
  city: String,
  district: String,
  temperature: Number,
  unit: String,
  timestamp: Date
});

const Temperature = mongoose.model("Temperature", TemperatureSchema);

// Kafka
const kafka = new Kafka({
  clientId: "smartcity-analysis-service",
  brokers: ["localhost:9092"]
});

const consumer = kafka.consumer({
  groupId: "temperature-analysis-group"
});

// API pour récupérer les dernières données
app.get("/api/temperatures/latest", async (req, res) => {
  try {
    const data = await Temperature.find()
      .sort({ timestamp: -1 })
      .limit(50);

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// API pour récupérer la température moyenne par district
app.get("/api/temperatures/avg-by-district", async (req, res) => {
  try {
    const result = await Temperature.aggregate([
      {
        $group: {
          _id: "$district",
          avgTemperature: { $avg: "$temperature" },
          maxTemperature: { $max: "$temperature" },
          minTemperature: { $min: "$temperature" },
          count: { $sum: 1 },
          lastUpdate: { $max: "$timestamp" } // Ajout du timestamp max pour Next.js
        }
      },
      {
        $sort: { avgTemperature: -1 }
      }
    ]);

    // Formatage exact pour l'interface DistrictTemperature de Next.js
    const formattedResult = result.map(item => ({
      district: item._id,
      avg_temperature: item.avgTemperature,
      max_temperature: item.maxTemperature,
      min_temperature: item.minTemperature,
      sensor_count: item.count,
      last_update: item.lastUpdate
    }));

    res.json(formattedResult);
  } catch (error) {
    res.status(500).json({ error: "Erreur analyse" });
  }
});

async function startKafkaConsumer() {
  await consumer.connect();

  await consumer.subscribe({
    topic: "smartcity.temperature.readings",
    fromBeginning: false
  });

  await consumer.run({
    eachMessage: async ({ message }) => {
      try {
        const value = message.value.toString();
        const parsedData = JSON.parse(value);

        // Gère le fait que Node-RED puisse envoyer un tableau OU un seul objet
        const dataArray = Array.isArray(parsedData) ? parsedData : [parsedData];

        if (dataArray.length === 0) return;

        const docsToInsert = dataArray.map(data => ({
          sensor_id: data.sensor_id,
          city: data.city,
          district: data.district,
          temperature: data.temperature,
          unit: data.unit,
          timestamp: data.timestamp ? new Date(data.timestamp) : new Date()
        }));

        // Insertion en masse dans MongoDB
        const savedData = await Temperature.insertMany(docsToInsert);
        console.log(`Received and saved ${savedData.length} temperatures.`);

        // Envoyer le tableau en temps réel vers Next.js
        io.emit("temperature:new", savedData);

        // Vérifier les alertes (temp >= 35°C)
        savedData.forEach(data => {
          if (data.temperature >= 35) {
            io.emit("temperature:alert", {
              sensor_id: data.sensor_id,
              district: data.district,
              temperature: data.temperature,
              timestamp: data.timestamp
            });
          }
        });

      } catch (error) {
        console.error("Kafka message error:", error);
      }
    }
  });
}

startKafkaConsumer();

server.listen(4000, "0.0.0.0", () => {
  console.log("Backend running on http://0.0.0.0:4000");
});
