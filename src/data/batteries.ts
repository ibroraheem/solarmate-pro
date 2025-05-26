import { Battery } from '../types';

export const batterySpecs: Battery[] = [
  {
    count: 1,
    type: 'Tubular',
    capacity: 2.64, // 220Ah * 12V = 2.64kWh
    voltage: 12,
    price: 150000
  },
  {
    count: 1,
    type: 'Lithium',
    capacity: 5.0, // 5kWh
    voltage: 24,
    price: 350000
  },
  {
    count: 1,
    type: 'Lithium',
    capacity: 5.0, // 5kWh
    voltage: 48,
    price: 350000
  },
  {
    count: 1,
    type: 'Lithium',
    capacity: 7.5, // 7.5kWh
    voltage: 48,
    price: 500000
  },
  {
    count: 1,
    type: 'Lithium',
    capacity: 10.0, // 10kWh
    voltage: 48,
    price: 600000
  },
  {
    count: 1,
    type: 'Lithium',
    capacity: 15.0, // 15kWh
    voltage: 48,
    price: 900000
  }
]; 