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

export interface BatteryOption {
  type: 'Tubular' | 'Lithium';
  modelName: string;
  voltage: number;
  capacity: number; // Ah
  price: number;
  count: number;
  totalCapacity: number; // Wh
  totalPrice: number;
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
  };
  totalPrice: {
    withTubular: number;
    withLithium: number;
  };
}

export type Step = 'appliances' | 'summary' | 'results';