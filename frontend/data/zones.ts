export interface ZoneProperties {
  id: string;
  name: string;
  nameAr: string;
  energy: number;
  water: number;
  vehicles: number;
  temperature: number;
  humidity: number;
  aqi: number;
  noise: number;
  wasteFill: number;
  parkingOccupancy: number;
  sensorCount: number;
}

export type MetricKey = keyof Pick<
  ZoneProperties,
  "energy" | "water" | "vehicles" | "aqi" | "noise" | "temperature"
>;

export interface MetricConfig {
  key: MetricKey;
  label: string;
  unit: string;
  icon: string;
  colors: string[];
  thresholds: { label: string; color: string }[];
}

export const METRICS: MetricConfig[] = [
  {
    key: "energy",
    label: "Énergie",
    unit: "kWh",
    icon: "⚡",
    colors: ["#fef3c7", "#fde68a", "#fbbf24", "#f59e0b", "#d97706", "#b45309"],
    thresholds: [
      { label: "Faible", color: "#fef3c7" },
      { label: "Élevée", color: "#b45309" },
    ],
  },
  {
    key: "water",
    label: "Eau",
    unit: "m³",
    icon: "💧",
    colors: ["#dbeafe", "#93c5fd", "#60a5fa", "#3b82f6", "#2563eb", "#1d4ed8"],
    thresholds: [
      { label: "Faible", color: "#dbeafe" },
      { label: "Élevée", color: "#1d4ed8" },
    ],
  },
  {
    key: "vehicles",
    label: "Véhicules",
    unit: "",
    icon: "🚗",
    colors: ["#d1fae5", "#6ee7b7", "#34d399", "#10b981", "#059669", "#047857"],
    thresholds: [
      { label: "Faible", color: "#d1fae5" },
      { label: "Dense", color: "#047857" },
    ],
  },
  {
    key: "aqi",
    label: "Qualité Air",
    unit: "AQI",
    icon: "🌬️",
    colors: ["#d1fae5", "#a7f3d0", "#fde68a", "#fdba74", "#f87171", "#dc2626"],
    thresholds: [
      { label: "Bon", color: "#d1fae5" },
      { label: "Dangereux", color: "#dc2626" },
    ],
  },
  {
    key: "noise",
    label: "Bruit",
    unit: "dB",
    icon: "🔊",
    colors: ["#ede9fe", "#c4b5fd", "#a78bfa", "#8b5cf6", "#7c3aed", "#6d28d9"],
    thresholds: [
      { label: "Calme", color: "#ede9fe" },
      { label: "Fort", color: "#6d28d9" },
    ],
  },
  {
    key: "temperature",
    label: "Température",
    unit: "°C",
    icon: "🌡️",
    colors: ["#dbeafe", "#bfdbfe", "#fde68a", "#fdba74", "#f87171", "#ef4444"],
    thresholds: [
      { label: "Froid", color: "#dbeafe" },
      { label: "Chaud", color: "#ef4444" },
    ],
  },
];

// GeoJSON — coordinates are [lng, lat]
export const zonesGeoJSON = {
  type: "FeatureCollection" as const,
  features: [
    {
      type: "Feature" as const,
      properties: {
        id: "sidi_bouzid",
        name: "Sidi Bouzid",
        nameAr: "سيدي بوزيد",
        energy: 2800,
        water: 2100,
        vehicles: 920,
        temperature: 24,
        humidity: 78,
        aqi: 35,
        noise: 48,
        wasteFill: 40,
        parkingOccupancy: 55,
        sensorCount: 28,
      } as ZoneProperties,
      geometry: {
        type: "Polygon" as const,
        coordinates: [
          [
            [-8.538832, 33.245541],
            [-8.541232, 33.242765],
            [-8.540579, 33.236725],
            [-8.536035, 33.233948],
            [-8.545171, 33.226899],
            [-8.556032, 33.215254],
            [-8.5602673, 33.211417],
            [-8.5620283, 33.211987],
            [-8.5625214, 33.211648],
            [-8.565944, 33.213449],
            [-8.566827, 33.212616],
            [-8.567995, 33.213633],
            [-8.568543, 33.213454],
            [-8.570900, 33.215547],
            [-8.569994, 33.216165],
            [-8.573077, 33.216294],
            [-8.568869, 33.217463],
            [-8.568707, 33.217955],
            [-8.564147, 33.217469],
            [-8.561566, 33.219504],
            [-8.560094, 33.220884],
            [-8.560122, 33.221847],
            [-8.558716, 33.221963],
            [-8.557112, 33.223068],
            [-8.555357, 33.225994],
            [-8.554272, 33.228904],
            [-8.554831, 33.231243],
            [-8.555669, 33.232486],
            [-8.554296, 33.232957],
            [-8.549648, 33.235432],
            [-8.548642, 33.236923],
            [-8.547429, 33.238144],
            [-8.547175, 33.239060],
            [-8.546563, 33.239839],
            [-8.546716, 33.241760],
            [-8.545514, 33.242718],
            [-8.545021, 33.243794],
            [-8.538832, 33.245541],
          ],
        ],
      },
    },
    {
      type: "Feature" as const,
      properties: {
        id: "bennani",
        name: "Bennani",
        nameAr: "بناني",
        energy: 3100,
        water: 2800,
        vehicles: 1200,
        temperature: 27,
        humidity: 62,
        aqi: 68,
        noise: 65,
        wasteFill: 72,
        parkingOccupancy: 70,
        sensorCount: 35,
      } as ZoneProperties,
      geometry: {
        type: "Polygon" as const,
        coordinates: [
          [
            [-8.533693, 33.239877],
            [-8.536478, 33.238579],
            [-8.537275, 33.239772],
            [-8.539244, 33.242788],
            [-8.538204, 33.243498],
            [-8.538502, 33.243849],
            [-8.537949, 33.244163],
            [-8.537496, 33.244108],
            [-8.536883, 33.244750],
            [-8.536740, 33.244577],
            [-8.535361, 33.242392],
            [-8.533693, 33.239877],

          ],
        ],
      },
    },
    {
      type: "Feature" as const,
      properties: {
        id: "el_manar",
        name: "El Manar",
        nameAr: "المنار",
        energy: 1800,
        water: 1500,
        vehicles: 520,
        temperature: 25,
        humidity: 72,
        aqi: 30,
        noise: 38,
        wasteFill: 28,
        parkingOccupancy: 30,
        sensorCount: 15,
      } as ZoneProperties,
      geometry: {
        type: "Polygon" as const,
        coordinates: [
          [
            [-8.522390, 33.243704],
            [-8.523999, 33.245138],
            [-8.527428, 33.245341],
            [-8.530902, 33.248754],
            [-8.531327, 33.249211],
            [-8.532268, 33.250873],
            [-8.530144, 33.251406],
            [-8.527261, 33.253525],
            [-8.524317, 33.252371],
            [-8.523852, 33.251864],
            [-8.521164, 33.246027],
            [-8.520484, 33.245189],
            [-8.522390, 33.243704],
          ],
        ],
      },
    },
    {
      type: "Feature" as const,
      properties: {
        id: "sidi_moussa",
        name: "Sidi Moussa",
        nameAr: "سيدي موسى",
        energy: 1200,
        water: 900,
        vehicles: 350,
        temperature: 24,
        humidity: 80,
        aqi: 28,
        noise: 55,
        wasteFill: 45,
        parkingOccupancy: 95,
        sensorCount: 22,
      } as ZoneProperties,
      geometry: {
        type: "Polygon" as const,
        coordinates: [
          [
            [-8.485087, 33.233933],
            [-8.488211, 33.229866],
            [-8.488408, 33.229966],
            [-8.489917, 33.231362],
            [-8.493384, 33.233271],
            [-8.493681, 33.234304],
            [-8.494093, 33.235253],
            [-8.492285, 33.235967],
            [-8.491193, 33.236719],
            [-8.490941, 33.236730],
            [-8.487516, 33.235084],
            [-8.485087, 33.233933],
          ],
        ],
      },
    },
    {
      type: "Feature" as const,
      properties: {
        id: "essaada",
        name: "Essaada",
        nameAr: "السعادة",
        energy: 1200,
        water: 900,
        vehicles: 350,
        temperature: 24,
        humidity: 80,
        aqi: 28,
        noise: 55,
        wasteFill: 45,
        parkingOccupancy: 95,
        sensorCount: 22,
      } as ZoneProperties,
      geometry: {
        type: "Polygon" as const,
        coordinates: [
          [
            [-8.522390, 33.243704],
            [-8.523999, 33.245138],
            [-8.527428, 33.245341],
            [-8.528683, 33.244503],
            [-8.529502, 33.245192],
            [-8.532742, 33.243491],
            [-8.530239, 33.240535],
            [-8.529378, 33.239697],
            [-8.524695, 33.242098],
            [-8.523713, 33.242659],
            [-8.522437, 33.243699],
            [-8.522390, 33.243704],
          ],
        ],
      },
    },
    {
      type: "Feature" as const,
      properties: {
        id: "mouilha",
        name: "Mouilha",
        nameAr: "المويلحة",
        energy: 1200,
        water: 900,
        vehicles: 350,
        temperature: 24,
        humidity: 80,
        aqi: 28,
        noise: 55,
        wasteFill: 45,
        parkingOccupancy: 95,
        sensorCount: 22,
      } as ZoneProperties,
      geometry: {
        type: "Polygon" as const,
        coordinates: [
          [
            [-8.517747, 33.249778],
            [-8.522055, 33.248010],
            [-8.523321, 33.250985],
            [-8.523798, 33.251891],
            [-8.524404, 33.252434],
            [-8.523305, 33.251985],
            [-8.521384, 33.251106],
            [-8.517924, 33.249948],
            [-8.517747, 33.249778]
          ],
        ],
      },
    },
    {
      type: "Feature" as const,
      properties: {
        id: "cite_portugaise",
        name: "Cité Portugaise",
        nameAr: "المدينة البرتغالية",
        energy: 1200,
        water: 900,
        vehicles: 350,
        temperature: 24,
        humidity: 80,
        aqi: 28,
        noise: 55,
        wasteFill: 45,
        parkingOccupancy: 95,
        sensorCount: 22,
      } as ZoneProperties,
      geometry: {
        type: "Polygon" as const,
        coordinates: [
          [
            [-8.500279, 33.255961],
            [-8.500699, 33.255881],
            [-8.500702, 33.255966],
            [-8.502015, 33.255878],
            [-8.503339, 33.255339],
            [-8.503704, 33.256182],
            [-8.504353, 33.256815],
            [-8.504868, 33.257209],
            [-8.504283, 33.257326],
            [-8.502942, 33.257600],
            [-8.501907, 33.258228],
            [-8.501381, 33.258515],
            [-8.501253, 33.258017],
            [-8.500943, 33.256738],
            [-8.501232, 33.256678],
            [-8.500844, 33.256338],
            [-8.500591, 33.256323],
            [-8.500279, 33.255961]
          ],
        ],
      },
    },
    {
      type: "Feature" as const,
      properties: {
        id: "Najd",
        name: "Najd",
        nameAr: "نجد",
        energy: 1200,
        water: 900,
        vehicles: 350,
        temperature: 24,
        humidity: 80,
        aqi: 28,
        noise: 55,
        wasteFill: 45,
        parkingOccupancy: 95,
        sensorCount: 22,
      } as ZoneProperties,
      geometry: {
        type: "Polygon" as const,
        coordinates: [
          [
            [-8.502290, 33.224916],
            [-8.503722, 33.225082],
            [-8.510706, 33.226042],
            [-8.509955, 33.229076],
            [-8.504470, 33.228255],
            [-8.502231, 33.226186],
            [-8.502290, 33.224916],
          ],
        ],
      },
    },
    {
      type: "Feature" as const,
      properties: {
        id: "Les Facultés",
        name: "Les Facultés",
        nameAr: "الكليات",
        energy: 1200,
        water: 900,
        vehicles: 350,
        temperature: 24,
        humidity: 80,
        aqi: 28,
        noise: 55,
        wasteFill: 45,
        parkingOccupancy: 95,
        sensorCount: 22,
      } as ZoneProperties,
      geometry: {
        type: "Polygon" as const,
        coordinates: [
          [
            [-8.483070, 33.222347],
            [-8.483513, 33.220724],
            [-8.485190, 33.221289],
            [-8.488247, 33.222863],
            [-8.490144, 33.221404],
            [-8.490698, 33.220423],
            [-8.491373, 33.217456],
            [-8.491665, 33.217174],
            [-8.492143, 33.217266],
            [-8.492202, 33.219403],
            [-8.492435, 33.221584],
            [-8.492620, 33.223200],
            [-8.492890, 33.224746],
            [-8.493212, 33.226168],
            [-8.491858, 33.226421],
            [-8.490769, 33.226751],
            [-8.489855, 33.227529],
            [-8.488323, 33.229601],
            [-8.488061, 33.229563],
            [-8.487022, 33.228455],
            [-8.486415, 33.227342],
            [-8.485948, 33.226291],
            [-8.485254, 33.225574],
            [-8.485191, 33.224486],
            [-8.485410, 33.222597],
            [-8.484732, 33.222623],
            [-8.483077, 33.222317],
            [-8.483070, 33.222347]
          ],
        ],
      },
    },
    {
      type: "Feature" as const,
      properties: {
        id: "Quatier Jaouhara",
        name: "Quatier Jaouhara",
        nameAr: "حي جوهرة",
        energy: 1200,
        water: 900,
        vehicles: 350,
        temperature: 24,
        humidity: 80,
        aqi: 28,
        noise: 55,
        wasteFill: 45,
        parkingOccupancy: 95,
        sensorCount: 22,
      } as ZoneProperties,
      geometry: {
        type: "Polygon" as const,
        coordinates: [
          [
            [-8.493212, 33.226168],
            [-8.491858, 33.226421],
            [-8.490769, 33.226751],
            [-8.489855, 33.227529],
            [-8.488323, 33.229601],
            [-8.489802, 33.231199],
            [-8.493312, 33.233143],
            [-8.493185, 33.231916],
            [-8.493222, 33.230860],
            [-8.493406, 33.229667],
            [-8.493618, 33.228351],
            [-8.493240, 33.226547],
            [-8.493212, 33.226168],
          ],
        ],
      },
    }
  ],
};

export interface Landmark {
  id: string;
  name: string;
  position: [number, number];
  icon: string;
  type: string;
}
