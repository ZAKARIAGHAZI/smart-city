import waterSensorsDataJson from "./json/water_sensors.json";

export interface WaterSensorLocation {
  id: string;
  districtId: string;
  districtName: string;
  lat: number;
  lng: number;
}

export const waterSensorsData = waterSensorsDataJson as WaterSensorLocation[];
