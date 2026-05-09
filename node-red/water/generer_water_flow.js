function zoneFactor(districtId) {
  const factors = {
    sidi_bouzid: 2.0,
    bennani: 1.5,
    el_manar: 2.5,
    sidi_moussa: 1.0,
    essaada: 1.7,
    mouilha: 1.6,
    cite_portugaise: 1.9,
    najd: 1.8,
    les_facultes: 1.4,
    quartier_jaouhara: 1.6
  };

  return factors[districtId] || 1.0;
}

function waterFlowEstimated(hour, districtId) {
  let baseFlow = 3;

  // Consommation plus élevée le matin et le soir
  if ((hour >= 6 && hour <= 9) || (hour >= 18 && hour <= 22)) {
    baseFlow += 7;
  }

  const factor = zoneFactor(districtId);
  const variation = Math.random() * 1.5 - 0.75;

  const flowRate = baseFlow + factor + variation;

  let status = "normal";

  // Fuite possible : débit trop élevé pendant la nuit
  if (hour >= 1 && hour <= 5 && flowRate > 5) {
    status = "possible_leak";
  }

  // Forte consommation
  if (flowRate > 15) {
    status = "high_consumption";
  }

  const pulses = Math.round(flowRate * 7.5);
  const volume = flowRate / 60;

  return {
    pulses: pulses,
    flow_rate_l_min: Number(flowRate.toFixed(2)),
    volume_l: Number(volume.toFixed(3)),
    flow_unit: "L/min",
    volume_unit: "L",
    status: status
  };
}

// Vérifier que le node précédent a créé msg.waterSensors
if (!Array.isArray(msg.waterSensors)) {
  throw new Error("msg.waterSensors est introuvable. Ajoute d'abord le node config_capteurs_water.");
}

const now = new Date();
const hour = now.getHours();

// Ajouter les données de débit à chaque capteur
msg.waterSensors = msg.waterSensors.map(sensor => {
  return {
    ...sensor,
    type: "hall_flow_meter",
    water_flow: waterFlowEstimated(hour, sensor.districtId)
  };
});

return msg;