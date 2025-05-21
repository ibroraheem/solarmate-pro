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

export const petrolGenerators = [
  { capacitykVA: 1.2, brandModel: 'Tiger TG1850', priceRange: '₦80,000 – ₦120,800', fuelConsumptionLph: 0.6, fuelCost8Hrs: 4320 },
  { capacitykVA: 2.5, brandModel: 'Sumec Firman SPG3000', priceRange: '₦250,000 – ₦280,000', fuelConsumptionLph: 1.0, fuelCost8Hrs: 7200 },
  { capacitykVA: 3.1, brandModel: 'MAXI EK25GKWH', priceRange: '₦304,750', fuelConsumptionLph: 1.2, fuelCost8Hrs: 8640 },
  { capacitykVA: 4.5, brandModel: 'Elepaq SV5200', priceRange: '₦300,000 – ₦350,000', fuelConsumptionLph: 1.5, fuelCost8Hrs: 10800 },
  { capacitykVA: 5.5, brandModel: 'Lutian 5GF-LDE', priceRange: '₦345,000 – 450,000', fuelConsumptionLph: 1.8, fuelCost8Hrs: 12960 },
  { capacitykVA: 6.5, brandModel: 'Hyundai HY6500', priceRange: '₦295,000', fuelConsumptionLph: 2.0, fuelCost8Hrs: 14400 },
  { capacitykVA: 7.5, brandModel: 'MAXI EK75', priceRange: '₦202,500 – 295,000', fuelConsumptionLph: 2.5, fuelCost8Hrs: 18000 },
  { capacitykVA: 8.0, brandModel: 'Honda EM10000', priceRange: '₦1,250,000', fuelConsumptionLph: 2.8, fuelCost8Hrs: 20160 },
  { capacitykVA: 10.0, brandModel: 'Elepaq SV22000E2', priceRange: '₦225,000', fuelConsumptionLph: 3.0, fuelCost8Hrs: 21600 },
];