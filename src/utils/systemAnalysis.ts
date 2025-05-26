import { 
  ApplianceUsage, 
  SystemPreferences, 
  InverterSpec, 
  SolarPanel, 
  Battery, 
  ChargeController, 
  SystemResults,
  ElectricityBand 
} from '../types';
import { states } from '../data/states';
import { inverterSpecs } from '../data/inverters';
import { solarPanelSpecs } from '../data/solarPanels';
import { batterySpecs } from '../data/batteries';
import { chargeControllerSpecs } from '../data/chargeControllers';

// Calculate peak load (maximum instantaneous power demand)
export const calculatePeakLoad = (appliances: ApplianceUsage[]): number => {
  return Math.max(...appliances.map(app => app.quantity * app.power));
};

// Calculate daily consumption (total energy used per day)
export const calculateDailyConsumption = (appliances: ApplianceUsage[]): number => {
  return appliances.reduce((total, app) => total + (app.quantity * app.power * app.hoursPerDay), 0);
};

// Get grid availability hours from electricity band
const getGridAvailability = (band: ElectricityBand): number => {
  switch (band) {
    case 'A': return 20;
    case 'B': return 16;
    case 'C': return 12;
    case 'D': return 8;
    case 'E': return 4;
    case 'Off-grid': return 0;
  }
};

// Select appropriate inverter based on load and electricity band
const selectInverter = (load: number, band: ElectricityBand): InverterSpec => {
  const gridAvailability = getGridAvailability(band);
  // If grid availability is less than 12 hours or off-grid, use hybrid inverter
  const systemType = gridAvailability < 12 ? 'Hybrid' : 'Non-Hybrid';
  
  // Find all inverters matching the type
  const matchingInverters = inverterSpecs.filter(inv => 
    inv.type === systemType &&
    inv.size <= 15 // Limit to 15kVA systems
  );

  // Select the smallest inverter that can handle the load
  const selectedInverter = matchingInverters.find(inv => inv.size * 1000 >= load) || matchingInverters[matchingInverters.length - 1];

  return selectedInverter;
};

// Select appropriate solar panels based on daily consumption and state
const selectSolarPanel = (dailyConsumption: number, state: string): SolarPanel => {
  const stateData = states.find(s => s.name === state) || states[0];
  const systemEfficiency = 0.85; // 85% system efficiency

  // Convert daily consumption to kWh
  const dailyConsumptionKWh = dailyConsumption / 1000;

  // Calculate required PV capacity in kW
  const requiredCapacity = dailyConsumptionKWh / (stateData.psh * systemEfficiency);

  // Find the most efficient panel size
  // For systems requiring more than 4kW, use larger panels (550W or 600W)
  // For smaller systems, use 400W panels
  const selectedPanel = requiredCapacity >= 4 
    ? solarPanelSpecs.find(panel => panel.capacity >= 550) || solarPanelSpecs[0]
    : solarPanelSpecs[0]; // 400W panel
  
  // Calculate number of panels needed
  const count = Math.ceil((requiredCapacity * 1000) / selectedPanel.capacity);
  const totalCapacity = (count * selectedPanel.capacity) / 1000; // Convert to kWp
  const dailyProduction = totalCapacity * stateData.psh * systemEfficiency; // This is in kWh

  return {
    count,
    capacity: selectedPanel.capacity,
    totalCapacity,
    dailyProduction,
    price: selectedPanel.price
  };
};

// Select appropriate batteries based on daily consumption and backup hours
const selectBattery = (dailyConsumption: number, backupHours: number, batteryType: 'Tubular' | 'Lithium', voltage: number, peakLoad: number): Battery => {
  const dod = batteryType === 'Tubular' ? 0.5 : 0.9; // 50% DoD for tubular, 90% for lithium
  const systemEfficiency = 0.85; // 85% system efficiency
  const inverterEfficiency = 0.9; // 90% inverter efficiency

  // Calculate average load during backup hours (assuming 70% of peak load)
  const averageLoad = peakLoad * 0.7;
  
  // Calculate required battery capacity in kWh
  const requiredCapacity = (averageLoad * backupHours) / (dod * systemEfficiency * inverterEfficiency * 1000);

  // Find suitable battery that matches inverter voltage
  let selectedBattery;
  if (batteryType === 'Lithium') {
    // For lithium batteries, select based on voltage and capacity
    if (voltage === 24) {
      // For 24V systems, use 24V lithium battery
      selectedBattery = batterySpecs.find(bat => 
        bat.type === 'Lithium' && 
        bat.voltage === 24
      );
    } else if (voltage === 48) {
      // For 48V systems, find the most appropriate capacity
      const capacities = [5.0, 7.5, 10.0, 15.0]; // Available lithium capacities in kWh
      const suitableCapacity = capacities.find(cap => cap >= requiredCapacity) || capacities[capacities.length - 1];
      selectedBattery = batterySpecs.find(bat => 
        bat.type === 'Lithium' && 
        bat.voltage === 48 && 
        bat.capacity === suitableCapacity
      );
    }
  } else {
    // For tubular batteries, calculate number of 12V batteries needed to match system voltage
    const batteriesInSeries = voltage / 12; // Number of 12V batteries needed in series
    selectedBattery = batterySpecs.find(bat => 
      bat.type === 'Tubular' && 
      bat.voltage === 12
    );
    
    if (selectedBattery) {
      // Adjust the count to account for series connection
      const parallelStrings = Math.ceil(requiredCapacity / (selectedBattery.capacity * batteriesInSeries));
      return {
        count: batteriesInSeries * parallelStrings,
        type: batteryType,
        capacity: selectedBattery.capacity,
        voltage: voltage, // Use system voltage
        price: selectedBattery.price
      };
    }
  }

  if (!selectedBattery) {
    throw new Error('No suitable battery found for the system requirements');
  }

  // Calculate number of batteries needed
  const count = Math.ceil(requiredCapacity / selectedBattery.capacity);

  return {
    count,
    type: batteryType,
    capacity: selectedBattery.capacity,
    voltage: voltage, // Use system voltage
    price: selectedBattery.price
  };
};

// Select appropriate charge controller based on panel and system specifications
const selectChargeController = (solarPanels: SolarPanel, systemType: 'Hybrid' | 'Non-Hybrid', systemVoltage: number): ChargeController | null => {
  // Hybrid inverters have built-in MPPT, so no separate charge controller needed
  if (systemType === 'Hybrid') {
    return null;
  }

  // Calculate required current based on solar panel capacity and system voltage
  // Current (A) = Power (W) / Voltage (V)
  const requiredCurrent = (solarPanels.totalCapacity * 1000) / systemVoltage;

  // Add 20% safety margin
  const requiredCurrentWithMargin = requiredCurrent * 1.2;

  // Find suitable charge controller
  const selectedController = chargeControllerSpecs.find(cc => 
    cc.type === 'MPPT' && 
    cc.voltage === systemVoltage &&
    cc.current >= requiredCurrentWithMargin
  ) || chargeControllerSpecs[0];

  return {
    type: 'MPPT',
    current: selectedController.current,
    voltage: systemVoltage,
    price: selectedController.price
  };
};

export const calculateSystem = (
  appliances: ApplianceUsage[],
  preferences: SystemPreferences
): SystemResults => {
  const peakLoad = calculatePeakLoad(appliances);
  const adjustedPeakLoad = peakLoad * 1.3; // 30% safety margin
  const dailyConsumption = calculateDailyConsumption(appliances);

  const inverter = selectInverter(adjustedPeakLoad, preferences.electricityBand);
  const solarPanels = selectSolarPanel(dailyConsumption, preferences.state);
  const batteries = selectBattery(dailyConsumption, preferences.backupHours, preferences.batteryType, inverter.voltage, peakLoad);
  const chargeController = selectChargeController(solarPanels, inverter.type, inverter.voltage);

  return {
    peakLoad,
    adjustedPeakLoad,
    dailyConsumption,
    state: preferences.state,
    electricityBand: preferences.electricityBand,
    backupHours: preferences.backupHours,
    inverter,
    solarPanels,
    batteries,
    chargeController: chargeController || {
      type: 'MPPT',
      current: 0,
      voltage: 0,
      price: 0
    }
  };
}; 