import { ChargeController } from '../types';

export const chargeControllerSpecs: ChargeController[] = [
  {
    type: 'PWM',
    current: 40,
    voltage: 12,
    price: 30000
  },
  {
    type: 'PWM',
    current: 60,
    voltage: 24,
    price: 45000
  },
  {
    type: 'MPPT',
    current: 40,
    voltage: 12,
    price: 80000
  },
  {
    type: 'MPPT',
    current: 60,
    voltage: 24,
    price: 120000
  },
  {
    type: 'MPPT',
    current: 80,
    voltage: 48,
    price: 160000
  }
]; 