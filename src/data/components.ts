import { Component, ComponentType, InverterType, BatteryType } from '../types';

export const components: Component[] = [
  // Inverters
  {
    id: 'inverter-1',
    type: 'Inverter',
    name: 'Growatt SPF 3000TL LVM',
    category: 'Hybrid',
    specifications: {
      powerRating: 3000,
      voltage: 24,
      efficiency: 0.93,
      mpptRange: '60-115V',
      maxPvInput: 2000,
      maxBatteryCurrent: 60
    },
    price: 280000,
    recommendedFor: ['small-home-basic', 'small-home-premium'],
    features: ['Pure Sine Wave', 'MPPT', 'LCD Display', 'Parallel Capable']
  },
  {
    id: 'inverter-2',
    type: 'Inverter',
    name: 'Growatt SPF 5000TL LVM',
    category: 'Hybrid',
    specifications: {
      powerRating: 5000,
      voltage: 48,
      efficiency: 0.94,
      mpptRange: '120-450V',
      maxPvInput: 4000,
      maxBatteryCurrent: 100
    },
    price: 450000,
    recommendedFor: ['medium-home-premium'],
    features: ['Pure Sine Wave', 'MPPT', 'LCD Display', 'Parallel Capable']
  },
  {
    id: 'inverter-3',
    type: 'Inverter',
    name: 'Growatt SPF 8000TL LVM',
    category: 'Hybrid',
    specifications: {
      powerRating: 8000,
      voltage: 48,
      efficiency: 0.95,
      mpptRange: '120-450V',
      maxPvInput: 8000,
      maxBatteryCurrent: 150
    },
    price: 750000,
    recommendedFor: ['large-home-luxury'],
    features: ['Pure Sine Wave', 'MPPT', 'LCD Display', 'Parallel Capable']
  },
  {
    id: 'inverter-4',
    type: 'Inverter',
    name: 'Victron MultiPlus 24/3000',
    category: 'Off-grid',
    specifications: {
      powerRating: 3000,
      voltage: 24,
      efficiency: 0.92,
      mpptRange: '60-115V',
      maxPvInput: 2000,
      maxBatteryCurrent: 50
    },
    price: 320000,
    recommendedFor: ['small-home-basic'],
    features: ['Pure Sine Wave', 'MPPT', 'LCD Display']
  },
  {
    id: 'inverter-5',
    type: 'Inverter',
    name: 'Victron MultiPlus 48/5000',
    category: 'Off-grid',
    specifications: {
      powerRating: 5000,
      voltage: 48,
      efficiency: 0.93,
      mpptRange: '120-450V',
      maxPvInput: 4000,
      maxBatteryCurrent: 90
    },
    price: 480000,
    recommendedFor: ['medium-home-premium'],
    features: ['Pure Sine Wave', 'MPPT', 'LCD Display']
  },

  // Charge Controllers
  {
    id: 'cc-1',
    type: 'ChargeController',
    name: 'Victron SmartSolar 150/35',
    category: 'MPPT',
    specifications: {
      maxPvPower: 1500,
      maxPvVoltage: 150,
      maxBatteryCurrent: 35,
      efficiency: 0.98
    },
    price: 85000,
    recommendedFor: ['small-home-basic'],
    features: ['MPPT', 'Bluetooth', 'Temperature Sensor']
  },
  {
    id: 'cc-2',
    type: 'ChargeController',
    name: 'Victron SmartSolar 150/45',
    category: 'MPPT',
    specifications: {
      maxPvPower: 2000,
      maxPvVoltage: 150,
      maxBatteryCurrent: 45,
      efficiency: 0.98
    },
    price: 95000,
    recommendedFor: ['small-home-premium'],
    features: ['MPPT', 'Bluetooth', 'Temperature Sensor']
  },
  {
    id: 'cc-3',
    type: 'ChargeController',
    name: 'Victron SmartSolar 250/60',
    category: 'MPPT',
    specifications: {
      maxPvPower: 3500,
      maxPvVoltage: 250,
      maxBatteryCurrent: 60,
      efficiency: 0.98
    },
    price: 120000,
    recommendedFor: ['medium-home-premium'],
    features: ['MPPT', 'Bluetooth', 'Temperature Sensor']
  },

  // Batteries
  {
    id: 'battery-1',
    type: 'Battery',
    name: 'Trojan T-105',
    category: 'Tubular',
    specifications: {
      capacity: 225,
      voltage: 6,
      cycles: 1200,
      warranty: '3 years'
    },
    price: 45000,
    recommendedFor: ['small-home-basic'],
    features: ['Deep Cycle', 'Flooded']
  },
  {
    id: 'battery-2',
    type: 'Battery',
    name: 'Trojan T-125',
    category: 'Tubular',
    specifications: {
      capacity: 240,
      voltage: 6,
      cycles: 1200,
      warranty: '3 years'
    },
    price: 48000,
    recommendedFor: ['small-home-premium'],
    features: ['Deep Cycle', 'Flooded']
  },
  {
    id: 'battery-3',
    type: 'Battery',
    name: 'Pylontech US3000C',
    category: 'Lithium',
    specifications: {
      capacity: 3500,
      voltage: 48,
      cycles: 4000,
      warranty: '10 years'
    },
    price: 450000,
    recommendedFor: ['medium-home-premium', 'large-home-luxury'],
    features: ['LiFePO4', 'BMS', 'Modular']
  },
  {
    id: 'battery-4',
    type: 'Battery',
    name: 'Pylontech US5000',
    category: 'Lithium',
    specifications: {
      capacity: 4800,
      voltage: 48,
      cycles: 4000,
      warranty: '10 years'
    },
    price: 600000,
    recommendedFor: ['large-home-luxury'],
    features: ['LiFePO4', 'BMS', 'Modular']
  },

  // Solar Panels
  {
    id: 'panel-1',
    type: 'SolarPanel',
    name: 'Longi 450W Mono',
    category: 'Mono',
    specifications: {
      power: 450,
      efficiency: 0.21,
      dimensions: '1765x1048x35mm',
      warranty: '25 years'
    },
    price: 45000,
    recommendedFor: ['small-home-basic', 'small-home-premium'],
    features: ['Mono PERC', 'Half-cut']
  },
  {
    id: 'panel-2',
    type: 'SolarPanel',
    name: 'Longi 550W Mono',
    category: 'Mono',
    specifications: {
      power: 550,
      efficiency: 0.22,
      dimensions: '1765x1048x35mm',
      warranty: '25 years'
    },
    price: 55000,
    recommendedFor: ['medium-home-premium', 'large-home-luxury'],
    features: ['Mono PERC', 'Half-cut']
  },

  // Accessories
  {
    id: 'cable-1',
    type: 'Accessory',
    name: 'Solar Cable 6mm²',
    category: 'Cable',
    specifications: {
      size: '6mm²',
      maxCurrent: 50,
      length: 100
    },
    price: 15000,
    recommendedFor: ['small-home-basic', 'small-home-premium'],
    features: ['UV Resistant', 'DC Rated']
  },
  {
    id: 'cable-2',
    type: 'Accessory',
    name: 'Solar Cable 10mm²',
    category: 'Cable',
    specifications: {
      size: '10mm²',
      maxCurrent: 80,
      length: 100
    },
    price: 25000,
    recommendedFor: ['medium-home-premium', 'large-home-luxury'],
    features: ['UV Resistant', 'DC Rated']
  },
  {
    id: 'switch-1',
    type: 'Accessory',
    name: 'Changeover Switch 63A',
    category: 'Switch',
    specifications: {
      current: 63,
      poles: 4
    },
    price: 25000,
    recommendedFor: ['small-home-basic', 'small-home-premium'],
    features: ['Manual', '4 Pole']
  },
  {
    id: 'switch-2',
    type: 'Accessory',
    name: 'Changeover Switch 100A',
    category: 'Switch',
    specifications: {
      current: 100,
      poles: 4
    },
    price: 35000,
    recommendedFor: ['medium-home-premium', 'large-home-luxury'],
    features: ['Manual', '4 Pole']
  },
  {
    id: 'breaker-1',
    type: 'Accessory',
    name: 'DC Breaker 32A',
    category: 'Breaker',
    specifications: {
      current: 32,
      poles: 2
    },
    price: 8000,
    recommendedFor: ['small-home-basic', 'small-home-premium'],
    features: ['DC Rated', '2 Pole']
  },
  {
    id: 'breaker-2',
    type: 'Accessory',
    name: 'DC Breaker 63A',
    category: 'Breaker',
    specifications: {
      current: 63,
      poles: 2
    },
    price: 12000,
    recommendedFor: ['medium-home-premium', 'large-home-luxury'],
    features: ['DC Rated', '2 Pole']
  }
]; 