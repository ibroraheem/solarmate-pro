export interface Appliance {
  id: string;
  name: string;
  wattage: number;
  defaultQuantity: number;
  defaultHours: number;
}

export interface SelectedAppliance extends Appliance {
  quantity: number;
  hoursPerDay: number;
}

export interface State {
  name: string;
  psh: number;
  pvout: number;
}

export interface PriceRange {
  lowerBound: number;
  upperBound: number;
}

export interface BatteryOption {
  type: 'Tubular' | 'Lithium';
  modelName: string;
  voltage: number;
  capacity: number; // Ah
  price: number;
  count: number;
  totalCapacity: number; // Wh
  totalPrice: number;
  priceRange: PriceRange;
}

export interface SystemComponents {
  acBreaker: {
    current: number;
    size: number;
    cableSize: number;
  };
  dcBreaker: {
    current: number;
    size: number;
    cableSize: number;
  };
  avr: {
    kva: number;
    size: number;
  };
  changeoverSwitch: {
    current: number;
    size: number;
    type: 'Manual' | 'Automatic';
  };
  standardSizes: {
    breakerSizes: number[];
    avrSizes: number[];
    cableSizes: { maxCurrent: number; size: number }[];
  };
}

export type ElectricityBand = 'A' | 'B' | 'C' | 'D' | 'E' | 'Off-grid';

export interface InverterSpec {
  size: number;
  voltage: number;
  type: 'Hybrid' | 'Non-Hybrid';
  maxPvVoltage?: {
    min: number;
    max: number;
  };
  maxMpptCurrent?: number;
  explanation: string;
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
  type: 'Tubular' | 'Lithium';
  capacity: number;
  voltage: number;
  price: number;
}

export interface ChargeController {
  type: 'MPPT' | 'PWM';
  current: number;
  voltage: number;
  price?: number;
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

export interface PetrolGenerator {
  capacitykVA: number;
  brandModel: string;
  priceRange: string;
  fuelConsumptionLph: number;
  fuelCost8Hrs: number;
}

export type Step = 'landing' | 'appliances' | 'preferences' | 'results';

export interface SolarPanelResult {
  count: number;
  totalWattage: number;
  dailyOutput: number;
  modelName: string;
  price: number;
  priceRange: PriceRange;
}

export type TimeBlock = 'Morning' | 'Afternoon' | 'Evening' | 'Night';
export type SystemType = 'Off-grid' | 'Hybrid' | 'Grid-tied';
export type BatteryType = 'Lithium' | 'Tubular';
export type HybridMode = 'Backup' | 'Energy Saving';

export interface TimeSlot {
  start: string;
  end: string;
  isDaytime: boolean;
}

export interface ApplianceUsage {
  id: string;
  name: string;
  power: number;
  quantity: number;
  hoursPerDay: number;
  timeSlots: TimeSlot[];
  isCritical: boolean;
}

export interface LoadProfile {
  peakLoad: number;
  dailyConsumption: number;
}

export interface SystemPreferences {
  batteryType: 'Lithium' | 'Tubular';
  backupHours: number;
  state: string;
  electricityBand: ElectricityBand;
}

export interface ApplianceTemplate {
  id: string;
  name: string;
  description: string;
  appliances: ApplianceUsage[];
}

export interface Component {
  id: string;
  name: string;
  type: 'Inverter' | 'ChargeController' | 'Battery' | 'SolarPanel' | 'Accessory';
  category: string;
  specifications: Record<string, string | number>;
  price: number;
}

export interface BOMItem {
  component: Component;
  quantity: number;
  totalPrice: number;
}

export interface BOM {
  name: string;
  quantity: number;
  price: number;
}

export interface LandingPageProps {
  onStart: () => void;
  onViewExamples: () => void;
}