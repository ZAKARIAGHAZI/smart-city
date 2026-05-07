import sensorsDataJson from "./json/temperature_sensors.json";

export interface SensorLocation {
  id: string;
  districtId: string;
  districtName: string;
  lat: number;
  lng: number;
}

export const sensorsData = sensorsDataJson as SensorLocation[];
