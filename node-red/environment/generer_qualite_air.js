function randomBetween(min, max, decimals = 2) {
  const value = Math.random() * (max - min) + min;
  return Number(value.toFixed(decimals));
}

function calculerAQIPM25(pm25) {
  // AQI basé sur PM2.5 selon l'échelle US EPA
  const breakpoints = [
    { cLow: 0.0, cHigh: 9.0, iLow: 0, iHigh: 50, status: "good" },
    { cLow: 9.1, cHigh: 35.4, iLow: 51, iHigh: 100, status: "moderate" },
    { cLow: 35.5, cHigh: 55.4, iLow: 101, iHigh: 150, status: "unhealthy_sensitive" },
    { cLow: 55.5, cHigh: 125.4, iLow: 151, iHigh: 200, status: "unhealthy" },
    { cLow: 125.5, cHigh: 225.4, iLow: 201, iHigh: 300, status: "very_unhealthy" },
    { cLow: 225.5, cHigh: 325.4, iLow: 301, iHigh: 500, status: "hazardous" }
  ];

  const bp = breakpoints.find(b => pm25 >= b.cLow && pm25 <= b.cHigh);

  if (!bp) {
    return {
      aqi: 500,
      status: "hazardous"
    };
  }

  const aqi =
    ((bp.iHigh - bp.iLow) / (bp.cHigh - bp.cLow)) *
      (pm25 - bp.cLow) +
    bp.iLow;

  return {
    aqi: Math.round(aqi),
    status: bp.status
  };
}

function facteurZone(districtId) {
  // Facteur estimé selon la zone
  const facteurs = {
    sidi_bouzid: 0.90,
    bennani: 1.05,
    el_manar: 1.05,
    sidi_moussa: 1.00,
    essaada: 1.08,
    mouilha: 1.02,
    cite_portugaise: 1.15,
    najd: 1.00,
    les_facultes: 0.95,
    quartier_jaouhara: 1.03
  };

  return facteurs[districtId] || 1.00;
}

function qualiteAirEstimee(districtId, heure) {
  const facteur = facteurZone(districtId);

  // Valeurs estimées réalistes pour El Jadida
  // PM2.5 généralement autour de 11 à 16.5 µg/m³
  let pm25Base = randomBetween(11, 16.5);

  // Variation horaire : plus de pollution pendant les heures de trafic
  if (heure >= 7 && heure <= 9) {
    pm25Base += randomBetween(2, 5);
  } else if (heure >= 17 && heure <= 20) {
    pm25Base += randomBetween(2, 6);
  } else if (heure >= 0 && heure <= 5) {
    pm25Base -= randomBetween(1, 3);
  }

  const pm25 = Math.max(3, pm25Base * facteur + randomBetween(-1.2, 1.2));
  const pm10 = pm25 * randomBetween(1.8, 2.8);
  const no2 = randomBetween(8, 32) * facteur;
  const co = randomBetween(0.2, 0.8) * facteur;
  const o3 = randomBetween(30, 75);

  const aqiResult = calculerAQIPM25(pm25);

  return {
    aqi: aqiResult.aqi,
    status: aqiResult.status,
    main_pollutant: "PM2.5",
    pm25: Number(pm25.toFixed(2)),
    pm10: Number(pm10.toFixed(2)),
    no2: Number(no2.toFixed(2)),
    co: Number(co.toFixed(2)),
    o3: Number(o3.toFixed(2)),
    units: {
      pm25: "µg/m³",
      pm10: "µg/m³",
      no2: "µg/m³",
      co: "mg/m³",
      o3: "µg/m³"
    }
  };
}

// Vérifier que msg.sensors existe
if (!Array.isArray(msg.sensors)) {
  throw new Error("msg.sensors est introuvable. Ajoute d'abord config_capteurs puis generer_temperature.");
}

const now = new Date();
const heureActuelle = now.getHours();

// Ajouter la qualité de l'air à chaque capteur
msg.sensors = msg.sensors.map(sensor => {
  return {
    ...sensor,
    air_quality: qualiteAirEstimee(sensor.districtId, heureActuelle)
  };
});

return msg;