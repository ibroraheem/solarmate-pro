import { ApplianceUsage } from '../types';

export const applianceTemplates: { id: string; name: string; description: string; appliances: ApplianceUsage[] }[] = [
  {
    id: 'basic-home',
    name: 'Basic Home',
    description: 'Essential appliances for a small home with basic power needs.',
    appliances: [
      {
        id: 'fan',
        name: 'Ceiling Fan',
        power: 75,
        quantity: 2,
        hoursPerDay: 8,
        timeSlots: [
          { start: '08:00', end: '16:00', isDaytime: true }
        ],
        isCritical: false
      },
      {
        id: 'tv',
        name: 'LED TV',
        power: 100,
        quantity: 1,
        hoursPerDay: 4,
        timeSlots: [
          { start: '19:00', end: '23:00', isDaytime: false }
        ],
        isCritical: false
      },
      {
        id: 'fridge',
        name: 'Refrigerator',
        power: 150,
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
        power: 10,
        quantity: 5,
        hoursPerDay: 6,
        timeSlots: [
          { start: '18:00', end: '24:00', isDaytime: false }
        ],
        isCritical: false
      }
    ]
  },
  {
    id: 'medium-home',
    name: 'Medium Home',
    description: 'Comfortable setup for a medium-sized home with moderate power needs.',
    appliances: [
      {
        id: 'fan',
        name: 'Ceiling Fan',
        power: 75,
        quantity: 4,
        hoursPerDay: 12,
        timeSlots: [
          { start: '08:00', end: '20:00', isDaytime: true }
        ],
        isCritical: false
      },
      {
        id: 'tv',
        name: 'LED TV',
        power: 100,
        quantity: 2,
        hoursPerDay: 6,
        timeSlots: [
          { start: '18:00', end: '24:00', isDaytime: false }
        ],
        isCritical: false
      },
      {
        id: 'fridge',
        name: 'Refrigerator',
        power: 150,
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
        power: 10,
        quantity: 8,
        hoursPerDay: 8,
        timeSlots: [
          { start: '17:00', end: '01:00', isDaytime: false }
        ],
        isCritical: false
      },
      {
        id: 'ac',
        name: 'Air Conditioner',
        power: 1200,
        quantity: 1,
        hoursPerDay: 8,
        timeSlots: [
          { start: '22:00', end: '06:00', isDaytime: false }
        ],
        isCritical: false
      }
    ]
  },
  {
    id: 'large-home',
    name: 'Large Home',
    description: 'Comprehensive setup for a large home with high power needs.',
    appliances: [
      {
        id: 'fan',
        name: 'Ceiling Fan',
        power: 75,
        quantity: 6,
        hoursPerDay: 16,
        timeSlots: [
          { start: '06:00', end: '22:00', isDaytime: true }
        ],
        isCritical: false
      },
      {
        id: 'tv',
        name: 'LED TV',
        power: 100,
        quantity: 3,
        hoursPerDay: 8,
        timeSlots: [
          { start: '16:00', end: '24:00', isDaytime: false }
        ],
        isCritical: false
      },
      {
        id: 'fridge',
        name: 'Refrigerator',
        power: 150,
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
        power: 10,
        quantity: 12,
        hoursPerDay: 10,
        timeSlots: [
          { start: '17:00', end: '03:00', isDaytime: false }
        ],
        isCritical: false
      },
      {
        id: 'ac',
        name: 'Air Conditioner',
        power: 1200,
        quantity: 2,
        hoursPerDay: 12,
        timeSlots: [
          { start: '20:00', end: '08:00', isDaytime: false }
        ],
        isCritical: false
      },
      {
        id: 'washing-machine',
        name: 'Washing Machine',
        power: 500,
        quantity: 1,
        hoursPerDay: 2,
        timeSlots: [
          { start: '10:00', end: '12:00', isDaytime: true }
        ],
        isCritical: false
      }
    ]
  }
]; 