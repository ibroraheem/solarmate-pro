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
  };
  totalPrice: {
    withTubular: number;
    withLithium: number;
  };
  components: SystemComponents;
}

export type Step = 'appliances' | 'summary' | 'results';