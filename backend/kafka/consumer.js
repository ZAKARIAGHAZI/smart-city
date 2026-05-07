const { Kafka } = require("kafkajs");
const EnvironmentReading = require("../models/EnvironmentReading");
const WaterReading = require("../models/WaterReading");

const kafka = new Kafka({
  clientId: "smartcity-multi-service",
  brokers: ["localhost:9092"]
});

const consumer = kafka.consumer({
  groupId: "smartcity-aggregator-group"
});

const TOPICS = {
  ENVIRONMENT: "smartcity.environment.readings",
  WATER: "smartcity.water.readings"
};

async function startKafkaConsumer(io) {
  await consumer.connect();
  console.log("Kafka Consumer Connected");

  await consumer.subscribe({ topics: Object.values(TOPICS), fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      try {
        const value = JSON.parse(message.value.toString());
        const dataArray = Array.isArray(value) ? value : [value];

        if (topic === TOPICS.ENVIRONMENT) {
          const docs = dataArray.map(data => ({
            sensor_id: data.sensor_id,
            city: data.city,
            district: data.district,
            temperature: Number(data.temperature),
            unit: data.temperature_unit || data.unit,
            air_quality: data.air_quality,
            timestamp: data.timestamp ? new Date(data.timestamp) : new Date()
          }));
          const saved = await EnvironmentReading.insertMany(docs);
          io.emit("temperature:new", saved);
          
          // Alerts
          saved.forEach(d => {
            if (d.temperature >= 35) io.emit("temperature:alert", d);
          });
          console.log(`[Kafka] Processed ${saved.length} Environment readings`);
        } 
        
        else if (topic === TOPICS.WATER) {
          const docs = dataArray.map(data => ({
            sensor_id: data.sensor_id,
            city: data.city,
            district: data.district,
            type: data.type,
            water_flow: data.water_flow,
            water_quality: data.water_quality,
            timestamp: data.timestamp ? new Date(data.timestamp) : new Date()
          }));
          const saved = await WaterReading.insertMany(docs);
          io.emit("water:new", saved);
          
          // Alerts (e.g., pH out of range)
          saved.forEach(d => {
            if (d.water_quality && (d.water_quality.ph < 6.5 || d.water_quality.ph > 8.5)) {
              io.emit("water:alert", {
                sensor_id: d.sensor_id,
                district: d.district,
                type: "pH Alert",
                value: d.water_quality.ph,
                timestamp: d.timestamp
              });
            }
          });
          console.log(`[Kafka] Processed ${saved.length} Water readings`);
        }
      } catch (error) {
        console.error(`[Kafka] Error processing topic ${topic}:`, error);
      }
    }
  });
}

module.exports = { startKafkaConsumer };
