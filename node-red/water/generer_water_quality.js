function randomBetween(min, max, decimals = 2) {
  const value = Math.random() * (max - min) + min;
  return Number(value.toFixed(decimals));
}

function zoneQualityFactor(districtId) {
  const factors = {
    sidi_bouzid: 1.00,
    bennani: 1.03,
    el_manar: 1.02,
    sidi_moussa: 1.01,
    essaada: 1.03,
    mouilha: 1.02,
    cite_portugaise: 1.04,
    najd: 1.01,
    les_facultes: 1.00,
    quartier_jaouhara: 1.02
  };

  return factors[districtId] || 1.00;
}

function waterQualityEstimated(districtId) {
  const factor = zoneQualityFactor(districtId);

  // Valeurs réalistes pour eau potable surveillée
  const ph = randomBetween(7.0, 7.8);
  const turbidity = randomBetween(0.2, 2.0) * factor;
  const tds = randomBetween(250, 650, 0) * factor;
  const chlorine = randomBetween(0.2, 0.8);
  const conductivity = tds * randomBetween(1.5, 2.0);
  const temperature = randomBetween(16, 24);

  let status = "safe";

  if (ph < 6.5 || ph > 8.5) {
    status = "ph_alert";
  } else if (turbidity > 5) {
    status = "turbidity_alert";
  } else if (tds > 1000) {
    status = "tds_alert";
  } else if (chlorine < 0.1 || chlorine > 1.0) {
    status = "chlorine_alert";
  }

  return {
    ph: Number(ph.toFixed(2)),
    turbidity_ntu: Number(turbidity.toFixed(2)),
    tds_ppm: Math.round(tds),
    chlorine_mg_l: Number(chlorine.toFixed(2)),
    conductivity_us_cm: Math.round(conductivity),
    water_temperature_c: Number(temperature.toFixed(2)),
    status: status,
    units: {
      ph: "pH",
      turbidity: "NTU",
      tds: "ppm",
      chlorine: "mg/L",
      conductivity: "µS/cm",
      water_temperature: "°C"
    }
  };
}

// Vérifier que le node précédent a créé msg.waterSensors
if (!Array.isArray(msg.waterSensors)) {
  throw new Error("msg.waterSensors est introuvable. Ajoute d'abord config_capteurs_water puis generer_water_flow.");
}

// Ajouter la qualité de l'eau à chaque capteur
msg.waterSensors = msg.waterSensors.map(sensor => {
  return {
    ...sensor,
    water_quality: waterQualityEstimated(sensor.districtId)
  };
});

return msg;