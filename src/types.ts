export type SystemType = 'Hybrid' | 'Non-Hybrid';
export type BatteryType = 'Tubular' | 'Lithium';

export interface ApplianceUsage {
  name: string;
  quantity: number;
  power: number;
  hoursPerDay: number;
}

export interface SystemPreferences {
  systemType: SystemType;
  batteryType: 'Lithium' | 'Tubular';
  backupHours: number;
  state: string;
  electricityBand: ElectricityBand;
}

export interface InverterSpec {
  size: number;
  voltage: number;
  type: SystemType;
  price: number;
}

export interface SolarPanel {
  count: number;
  capacity: number;
  totalCapacity: number;
  dailyProduction: number;
  price: number;
}

export interface Battery {
  count: number;
  type: BatteryType;
  capacity: number;
  voltage: number;
  price: number;
}

export interface ChargeController {
  type: 'MPPT' | 'PWM';
  current: number;
  voltage: number;
  price: number;
}

export interface CostAnalysis {
  breakdown: {
    inverter: number;
    solarPanels: number;
    batteries: number;
    chargeController: number;
    installation: number;
  };
  totalCost: number;
}

export interface NetSavings {
  monthly: number;
  yearly: number;
  paybackPeriod: number;
}

export interface SystemResults {
  peakLoad: number;
  adjustedPeakLoad: number;
  dailyConsumption: number;
  state: string;
  electricityBand: ElectricityBand;
  backupHours: number;
  inverter: InverterSpec;
  solarPanels: SolarPanel;
  batteries: Battery;
  chargeController: ChargeController;
} 