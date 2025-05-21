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
}

export interface SystemResults {
  peakLoad: number;
  adjustedPeakLoad: number;
  inverterSize: number;
  systemVoltage: number;
  backupEnergy: number;
  batteryOptions: {
    tubular: BatteryOption;
    lithium: BatteryOption;
  };
  solarPanels: {
    count: number;
    totalWattage: number;
    dailyOutput: number;
    price: number;
    priceRange: PriceRange;
  };
  totalPrice: {
    withTubular: {
      base: number;
      range: PriceRange;
    };
    withLithium: {
      base: number;
      range: PriceRange;
    };
  };
  components: SystemComponents;
  priceDisclaimer: {
    factors: string[];
  };
  generatorComparison: {
    generator: PetrolGenerator;
    estimatedAnnualCost: number;
  } | null;
  netSavings: number;
  pvInputWarning?: string;
  recommendedInverterSizeForPV?: number;
}

export interface PetrolGenerator {
  capacitykVA: number;
  brandModel: string;
  priceRange: string;
  fuelConsumptionLph: number;
  fuelCost8Hrs: number;
}

export type Step = 'appliances' | 'summary' | 'results';

export interface SolarPanelResult {
  count: number;
  totalWattage: number;
  dailyOutput: number;
  modelName: string;
  price: number;
  priceRange: PriceRange;
}