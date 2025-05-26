import { SystemPreferences, ApplianceUsage } from '../types';

interface ExampleSystem {
  id: string;
  name: string;
  description: string;
  preferences: SystemPreferences;
  appliances: ApplianceUsage[];
  totalCost: number;
  savings: {
    monthly: number;
    yearly: number;
    paybackPeriod: number;
  };
}

export const exampleSystems: ExampleSystem[] = [
  {
    id: 'small-home-basic',
    name: 'Small Home Basic',
    description: 'Basic setup for a small home with essential appliances',
    preferences: {
      systemType: 'Off-grid',
      batteryType: 'Tubular',
      autonomyDays: 2,
      gridAvailabilityHours: 0,
      preferredBackupHours: 8,
      hybridMode: 'Backup'
    },
    appliances: [
      {
        id: 'fan',
        name: 'Ceiling Fan',
        wattage: 75,
        defaultQuantity: 2,
        defaultHours: 8,
        quantity: 2,
        hoursPerDay: 8,
        timeSlots: [
          { start: '08:00', end: '16:00', isDaytime: true }
        ],
        isCritical: false
      },
      {
        id: 'fridge',
        name: 'Refrigerator',
        wattage: 150,
        defaultQuantity: 1,
        defaultHours: 24,
        quantity: 1,
        hoursPerDay: 24,
        timeSlots: [
          { start: '00:00', end: '24:00', isDaytime: true }
        ],
        isCritical: true
      },
      {
        id: 'lights',
        name: 'LED Lights',
        wattage: 10,
        defaultQuantity: 5,
        defaultHours: 6,
        quantity: 5,
        hoursPerDay: 6,
        timeSlots: [
          { start: '18:00', end: '24:00', isDaytime: false }
        ],
        isCritical: false
      }
    ],
    totalCost: 450000,
    savings: {
      monthly: 15000,
      yearly: 180000,
      paybackPeriod: 2.5
    }
  },
  {
    id: 'medium-home-premium',
    name: 'Medium Home Premium',
    description: 'Premium setup for a medium-sized home with modern appliances',
    preferences: {
      systemType: 'Hybrid',
      batteryType: 'Lithium',
      autonomyDays: 3,
      gridAvailabilityHours: 12,
      preferredBackupHours: 12,
      hybridMode: 'Energy Saving'
    },
    appliances: [
      {
        id: 'fan',
        name: 'Ceiling Fan',
        wattage: 75,
        defaultQuantity: 4,
        defaultHours: 12,
        quantity: 4,
        hoursPerDay: 12,
        timeSlots: [
          { start: '08:00', end: '20:00', isDaytime: true }
        ],
        isCritical: false
      },
      {
        id: 'ac',
        name: 'Air Conditioner',
        wattage: 1200,
        defaultQuantity: 1,
        defaultHours: 8,
        quantity: 1,
        hoursPerDay: 8,
        timeSlots: [
          { start: '22:00', end: '06:00', isDaytime: false }
        ],
        isCritical: false
      },
      {
        id: 'fridge',
        name: 'Refrigerator',
        wattage: 150,
        defaultQuantity: 1,
        defaultHours: 24,
        quantity: 1,
        hoursPerDay: 24,
        timeSlots: [
          { start: '00:00', end: '24:00', isDaytime: true }
        ],
        isCritical: true
      },
      {
        id: 'lights',
        name: 'LED Lights',
        wattage: 10,
        defaultQuantity: 8,
        defaultHours: 8,
        quantity: 8,
        hoursPerDay: 8,
        timeSlots: [
          { start: '17:00', end: '01:00', isDaytime: false }
        ],
        isCritical: false
      }
    ],
    totalCost: 1200000,
    savings: {
      monthly: 45000,
      yearly: 540000,
      paybackPeriod: 2.2
    }
  },
  {
    id: 'large-home-luxury',
    name: 'Large Home Luxury',
    description: 'Luxury setup for a large home with comprehensive power needs',
    preferences: {
      systemType: 'Hybrid',
      batteryType: 'Lithium',
      autonomyDays: 3,
      gridAvailabilityHours: 8,
      preferredBackupHours: 16,
      hybridMode: 'Energy Saving'
    },
    appliances: [
      {
        id: 'fan',
        name: 'Ceiling Fan',
        wattage: 75,
        defaultQuantity: 6,
        defaultHours: 16,
        quantity: 6,
        hoursPerDay: 16,
        timeSlots: [
          { start: '06:00', end: '22:00', isDaytime: true }
        ],
        isCritical: false
      },
      {
        id: 'ac',
        name: 'Air Conditioner',
        wattage: 1200,
        defaultQuantity: 2,
        defaultHours: 12,
        quantity: 2,
        hoursPerDay: 12,
        timeSlots: [
          { start: '20:00', end: '08:00', isDaytime: false }
        ],
        isCritical: false
      },
      {
        id: 'fridge',
        name: 'Refrigerator',
        wattage: 150,
        defaultQuantity: 2,
        defaultHours: 24,
        quantity: 2,
        hoursPerDay: 24,
        timeSlots: [
          { start: '00:00', end: '24:00', isDaytime: true }
        ],
        isCritical: true
      },
      {
        id: 'lights',
        name: 'LED Lights',
        wattage: 10,
        defaultQuantity: 12,
        defaultHours: 10,
        quantity: 12,
        hoursPerDay: 10,
        timeSlots: [
          { start: '17:00', end: '03:00', isDaytime: false }
        ],
        isCritical: false
      },
      {
        id: 'washing-machine',
        name: 'Washing Machine',
        wattage: 500,
        defaultQuantity: 1,
        defaultHours: 2,
        quantity: 1,
        hoursPerDay: 2,
        timeSlots: [
          { start: '10:00', end: '12:00', isDaytime: true }
        ],
        isCritical: false
      }
    ],
    totalCost: 2500000,
    savings: {
      monthly: 95000,
      yearly: 1140000,
      paybackPeriod: 2.2
    }
  }
]; 