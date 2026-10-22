// Goa Geographic Constants and Waypoints
export const GOA_CENTER = [15.4850, 73.8400]; // Between Panaji and Bambolim

export const GOA_LANDMARKS = {
  PANAJI_KTC: {
    id: "panaji_ktc",
    name: "Panaji KTC Bus Stand",
    coords: [15.4989, 73.8278],
    type: "pickup",
    description: "Main intercity bus terminal in Panaji"
  },
  GMC_BAMBOLIM: {
    id: "gmc_bambolim",
    name: "Goa Medical College (GMC) Bambolim",
    coords: [15.4616, 73.8567],
    type: "hospital",
    description: "Premier super-speciality hospital in Goa"
  },
  MAPUSA_MARKET: {
    id: "mapusa_market",
    name: "Mapusa Municipal Market",
    coords: [15.5925, 73.8145],
    type: "market",
    description: "Historic Friday market & shopping hub"
  },
  MARGAO_STATION: {
    id: "margao_station",
    name: "Margao Railway Station (Madgaon Junction)",
    coords: [15.2736, 73.9680],
    type: "railway",
    description: "Major railway hub of South Goa"
  }
};

// Route polyline waypoints along NH66 corridor from Panaji KTC to GMC Bambolim
export const PANAJI_TO_GMC_ROUTE = [
  [15.4989, 73.8278], // Panaji KTC Bus Stand
  [15.4912, 73.8320], // Patto Plaza / Ourem Creek
  [15.4840, 73.8395], // Ribandar Bypass Junction
  [15.4760, 73.8450], // Merces Junction
  [15.4690, 73.8510], // Santa Cruz / Bambolim approach
  [15.4640, 73.8545], // GMC Circle
  [15.4616, 73.8567]  // GMC Main OPD Entrance
];
