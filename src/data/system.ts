// System component data for calculations

// Inverter specifications
export const inverterSpecs = [
  { size: 2, voltage: 12, price: 288000 },
  { size: 3.6, voltage: 24, price: 396000 },
  { size: 4.2, voltage: 24, price: 396000 },
  { size: 6.2, voltage: 48, price: 456000 },
  { size: 8.2, voltage: 48, price: 816000 },
  { size: 10.2, voltage: 48, price: 840000 },
];

// Battery specifications
export const tubularBattery = {
  voltage: 12,
  capacity: 220, // Ah
  price: 240000, // Per battery
  depthOfDischarge: 0.5,
};

export const lithiumBatteries = [
  { capacity: 5, voltage: 24, ampHours: 200, price: 1080000 },
  { capacity: 5, voltage: 48, ampHours: 100, price: 1080000 },
  { capacity: 7.6, voltage: 48, ampHours: 150, price: 1320000 },
  { capacity: 10, voltage: 48, ampHours: 200, price: 1920000 },
  { capacity: 15.5, voltage: 48, ampHours: 300, price: 2400000 },
];

// Solar panel specifications
export const solarPanel = {
  wattage: 550, // Watts per panel
  price: 150000, // Price per panel
};

// Constants
export const SAFETY_MARGIN = 1.3; // 30% safety margin
export const DEFAULT_PSH = 5.0; // Default Peak Sun Hours