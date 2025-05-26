import { InverterSpec } from '../types';

// System component data for calculations

// Inverter specifications
export const inverterSpecs: InverterSpec[] = [
  // 12V System Inverters
  {
    size: 0.8,
    voltage: 12,
    type: 'Non-Hybrid',
    maxPvVoltage: null,
    maxMpptCurrent: null,
    brandModel: 'Entry-level backup inverter',
    explanation: 'Basic inverter for small backup systems',
    capacity: 800,
    price: 80000,
    name: 'Entry-level backup inverter'
  },
  {
    size: 1.0,
    voltage: 12,
    type: 'Non-Hybrid',
    maxPvVoltage: null,
    maxMpptCurrent: null,
    brandModel: 'Basic home use',
    explanation: 'Suitable for basic home backup needs',
    capacity: 1000,
    price: 100000,
    name: 'Basic home use'
  },
  {
    size: 1.0,
    voltage: 12,
    type: 'Hybrid',
    maxPvVoltage: { min: 100, max: 145 },
    maxMpptCurrent: 40,
    brandModel: 'SMKSOLAR 1.5kW with 40A MPPT',
    explanation: 'Hybrid inverter with MPPT for solar integration',
    capacity: 1000,
    price: 150000,
    name: 'SMKSOLAR 1.5kW with 40A MPPT'
  },
  {
    size: 1.5,
    voltage: 12,
    type: 'Non-Hybrid',
    maxPvVoltage: null,
    maxMpptCurrent: null,
    brandModel: 'Common for small setups',
    explanation: 'Popular choice for small residential setups',
    capacity: 1500,
    price: 150000,
    name: '1.5kVA Off-grid Inverter'
  },
  {
    size: 1.5,
    voltage: 12,
    type: 'Hybrid',
    maxPvVoltage: { min: 100, max: 145 },
    maxMpptCurrent: 40,
    brandModel: 'SMKSOLAR 1.5kW Hybrid',
    explanation: 'Hybrid inverter with solar charging capability',
    capacity: 1500,
    price: 180000,
    name: 'SMKSOLAR 1.5kW Hybrid'
  },

  // 24V System Inverters
  {
    size: 2.0,
    voltage: 24,
    type: 'Non-Hybrid',
    maxPvVoltage: null,
    maxMpptCurrent: null,
    brandModel: 'Suitable for small offices',
    explanation: 'Ideal for small office backup systems',
    capacity: 2000,
    price: 200000,
    name: '2.0kVA Non-Hybrid Inverter'
  },
  {
    size: 2.0,
    voltage: 24,
    type: 'Hybrid',
    maxPvVoltage: { min: 145, max: 200 },
    maxMpptCurrent: 50,
    brandModel: 'NB Hybrid 2kW MPPT Inverter',
    explanation: 'Hybrid inverter with enhanced MPPT for solar systems',
    capacity: 2000,
    price: 250000,
    name: '2.4kVA Hybrid Inverter'
  },
  {
    size: 3.0,
    voltage: 24,
    type: 'Hybrid',
    maxPvVoltage: { min: 145, max: 200 },
    maxMpptCurrent: 60,
    brandModel: 'SRNE 3.3kW-24Vdc Inverter',
    explanation: 'High-capacity hybrid inverter for medium-sized systems',
    capacity: 3000,
    price: 300000,
    name: 'SRNE 3.3kW-24Vdc Inverter'
  },
  {
    size: 3.5,
    voltage: 24,
    type: 'Hybrid',
    maxPvVoltage: { min: 145, max: 200 },
    maxMpptCurrent: 60,
    brandModel: 'ITEL 3.6kW-24V Hybrid Inverter',
    explanation: 'Advanced hybrid inverter for residential use',
    capacity: 3500,
    price: 350000,
    name: 'ITEL 3.6kW-24V Hybrid Inverter'
  },
  {
    size: 3.5,
    voltage: 24,
    type: 'Non-Hybrid',
    maxPvVoltage: null,
    maxMpptCurrent: null,
    brandModel: 'For moderate residential use',
    explanation: 'Suitable for moderate residential power needs',
    capacity: 3500,
    price: 320000,
    name: '3.5kVA Non-Hybrid Inverter'
  },

  // 48V System Inverters
  {
    size: 4.0,
    voltage: 48,
    type: 'Hybrid',
    maxPvVoltage: { min: 145, max: 250 },
    maxMpptCurrent: 80,
    brandModel: 'ITEL 4kW-24V Hybrid Inverter',
    explanation: 'High-capacity hybrid inverter for larger homes',
    capacity: 4000,
    price: 400000,
    name: 'ITEL 4kW-24V Hybrid Inverter'
  },
  {
    size: 5.0,
    voltage: 48,
    type: 'Hybrid',
    maxPvVoltage: { min: 145, max: 250 },
    maxMpptCurrent: 80,
    brandModel: 'SRNE 5kW-48Vdc Inverter',
    explanation: 'Professional-grade hybrid inverter',
    capacity: 5000,
    price: 500000,
    name: 'SRNE 5kW-48Vdc Inverter'
  },
  {
    size: 6.0,
    voltage: 48,
    type: 'Hybrid',
    maxPvVoltage: { min: 145, max: 450 },
    maxMpptCurrent: 100,
    brandModel: 'SRNE 6.0kW-48V Hybrid Inverter',
    explanation: 'High-performance hybrid inverter for large systems',
    capacity: 6000,
    price: 600000,
    name: 'SRNE 6.0kW-48V Hybrid Inverter'
  },
  {
    size: 7.5,
    voltage: 48,
    type: 'Hybrid',
    maxPvVoltage: { min: 145, max: 450 },
    maxMpptCurrent: 100,
    brandModel: 'Lento 7.5kVA Inverter',
    explanation: 'Commercial-grade hybrid inverter',
    capacity: 7500,
    price: 750000,
    name: 'Lento 7.5kVA Inverter'
  },

  // High Voltage System Inverters
  {
    size: 10.0,
    voltage: 48,
    type: 'Hybrid',
    maxPvVoltage: { min: 500, max: 600 },
    maxMpptCurrent: 120,
    brandModel: 'Felicity Solar 10KVA Hybrid Inverter',
    explanation: 'Industrial-grade hybrid inverter for large installations',
    capacity: 10000,
    price: 1000000,
    name: 'Felicity Solar 10KVA Hybrid Inverter'
  },
  {
    size: 10.0,
    voltage: 96,
    type: 'Hybrid',
    maxPvVoltage: { min: 500, max: 600 },
    maxMpptCurrent: 120,
    brandModel: 'Felicity Solar 10KVA Hybrid Inverter',
    explanation: 'High-voltage hybrid inverter for industrial use',
    capacity: 10000,
    price: 1100000,
    name: 'Felicity Solar 10KVA Hybrid Inverter'
  },
  {
    size: 15.0,
    voltage: 96,
    type: 'Hybrid',
    maxPvVoltage: { min: 500, max: 600 },
    maxMpptCurrent: 160,
    brandModel: 'Industrial-grade applications',
    explanation: 'Heavy-duty hybrid inverter for industrial applications',
    capacity: 15000,
    price: 1500000,
    name: '15kVA Hybrid Inverter'
  },
  {
    size: 15.0,
    voltage: 120,
    type: 'Hybrid',
    maxPvVoltage: { min: 500, max: 600 },
    maxMpptCurrent: 160,
    brandModel: 'Industrial-grade applications',
    explanation: 'High-capacity industrial hybrid inverter',
    capacity: 15000,
    price: 1600000,
    name: '15kVA Hybrid Inverter'
  },
  {
    size: 20.0,
    voltage: 120,
    type: 'Hybrid',
    maxPvVoltage: { min: 600, max: 800 },
    maxMpptCurrent: 200,
    brandModel: 'Large-scale or commercial setups',
    explanation: 'Ultra-high-capacity hybrid inverter for large commercial installations',
    capacity: 20000,
    price: 2000000,
    name: '20kVA Hybrid Inverter'
  }
];

// Solar panel specifications
export const solarPanels = [
  {
    wattage: 400,
    brand: 'Trina Solar',
    type: 'Monocrystalline',
    efficiency: 19.5,
    features: ['Available on major platforms', '25-year warranty'],
    price: 45000
  },
  {
    wattage: 550,
    brand: 'Jinko Solar',
    type: 'Monocrystalline',
    efficiency: 21.2,
    features: ['IP67 rated', 'anodized aluminum frame'],
    price: 55000
  },
  {
    wattage: 600,
    brand: 'Canadian Solar',
    type: 'Monocrystalline',
    efficiency: 21.6,
    features: ['HiKu7 Super High Power Mono PERC', '25-year warranty'],
    price: 60000
  }
];

// Charge controller specifications
export const chargeControllers = [
  {
    model: 'PowMr 40A',
    voltageSupport: [12, 24, 36, 48],
    maxPvVoltage: 100,
    mpptCurrent: 40,
    features: ['LCD display', 'dual USB', 'suitable for lead-acid and lithium batteries']
  },
  {
    model: 'PowMr 60A',
    voltageSupport: [12, 24, 36, 48],
    maxPvVoltage: 100,
    mpptCurrent: 60,
    features: ['High efficiency', 'durable design']
  },
  {
    model: 'PowMr 80A',
    voltageSupport: [12, 24, 36, 48],
    maxPvVoltage: 100,
    mpptCurrent: 80,
    features: ['Intelligent regulator', 'weather-resistant']
  },
  {
    model: 'PowMr 100A',
    voltageSupport: [12, 24, 36, 48],
    maxPvVoltage: 100,
    mpptCurrent: 100,
    features: ['Suitable for large-scale solar installations']
  }
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