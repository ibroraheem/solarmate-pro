import { SelectedAppliance, SystemResults, State } from '../types';
import { 
  inverterSpecs, 
  tubularBattery, 
  lithiumBatteries,
  solarPanel, 
  SAFETY_MARGIN, 
  DEFAULT_PSH 
} from '../data/system';
import { calculateSystemComponents } from './systemCalculations';

export const calculateResults = (
  selectedAppliances: SelectedAppliance[],
  backupHours: number,
  selectedState: State | null
): SystemResults => {
  // Calculate peak load (all appliances that might run simultaneously)
  const peakLoad = selectedAppliances.reduce(
    (total, appliance) => total + appliance.wattage * appliance.quantity,
    0
  );

  // Add safety margin
  const adjustedPeakLoad = Math.ceil(peakLoad * SAFETY_MARGIN);

  // Determine inverter size and system voltage
  let inverterSize = 2;
  let systemVoltage = 12;

  if (adjustedPeakLoad <= 1600) {
    inverterSize = 2;
    systemVoltage = 12;
  } else if (adjustedPeakLoad <= 3200) {
    inverterSize = 3.6;
    systemVoltage = 24;
  } else if (adjustedPeakLoad <= 4000) {
    inverterSize = 4.2;
    systemVoltage = 24;
  } else if (adjustedPeakLoad <= 5500) {
    inverterSize = 6.2;
    systemVoltage = 48;
  } else if (adjustedPeakLoad <= 7500) {
    inverterSize = 8.2;
    systemVoltage = 48;
  } else {
    inverterSize = 10.2;
    systemVoltage = 48;
  }

  // Calculate daily energy consumption
  const dailyEnergy = selectedAppliances.reduce(
    (total, appliance) => 
      total + (appliance.wattage * appliance.quantity * appliance.hoursPerDay),
    0
  );

  // Calculate backup energy
  const backupEnergy = dailyEnergy * (backupHours / 24);

  // Calculate battery bank capacity for tubular battery
  const tubularBankAh = backupEnergy / (systemVoltage * tubularBattery.depthOfDischarge);
  const tubularBatteriesInSeries = systemVoltage / tubularBattery.voltage;
  const tubularStrings = Math.ceil(tubularBankAh / tubularBattery.capacity);
  const totalTubularCount = tubularBatteriesInSeries * tubularStrings;
  const totalTubularCapacity = tubularBattery.capacity * tubularBattery.voltage * totalTubularCount;
  const totalTubularPrice = totalTubularCount * tubularBattery.price;

  // Calculate battery bank for lithium
  // Find suitable lithium battery model
  let selectedLithium;
  let lithiumCount = 0;
  let totalLithiumCapacity = 0;
  let totalLithiumPrice = 0;

  if (systemVoltage === 24) {
    // For 24V systems, only use 24V 5kWh lithium
    const lithium24V = lithiumBatteries.find(b => b.voltage === 24);
    
    if (lithium24V) {
      const requiredCapacity = backupEnergy / 0.9; // 90% DoD
      lithiumCount = Math.ceil(requiredCapacity / (lithium24V.voltage * lithium24V.ampHours));
      selectedLithium = lithium24V;
      totalLithiumCapacity = lithium24V.voltage * lithium24V.ampHours * lithiumCount;
      totalLithiumPrice = lithium24V.price * lithiumCount;
    }
  } else if (systemVoltage === 48) {
    // For 48V systems, find the most cost-effective 48V lithium option
    const lithium48V = lithiumBatteries.filter(b => b.voltage === 48);
    
    // Calculate required capacity in Wh with 90% DoD
    const requiredCapacity = backupEnergy / 0.9;
    
    // Find the most cost-effective option
    let bestOption = { 
      model: null, 
      count: Infinity, 
      totalPrice: Infinity 
    };

    lithium48V.forEach(model => {
      const modelCapacityWh = model.voltage * model.ampHours;
      const neededCount = Math.ceil(requiredCapacity / modelCapacityWh);
      const totalPrice = neededCount * model.price;
      
      if (totalPrice < bestOption.totalPrice) {
        bestOption = {
          model,
          count: neededCount,
          totalPrice
        };
      }
    });
    
    if (bestOption.model) {
      selectedLithium = bestOption.model;
      lithiumCount = bestOption.count;
      totalLithiumCapacity = selectedLithium.voltage * selectedLithium.ampHours * lithiumCount;
      totalLithiumPrice = bestOption.totalPrice;
    }
  } else {
    // 12V systems (using 24V lithium in parallel if needed, though not ideal)
    const lithium24V = lithiumBatteries.find(b => b.voltage === 24);
    
    if (lithium24V) {
      const requiredCapacity = backupEnergy / 0.9;
      lithiumCount = Math.ceil(requiredCapacity / (lithium24V.voltage * lithium24V.ampHours));
      selectedLithium = lithium24V;
      totalLithiumCapacity = lithium24V.voltage * lithium24V.ampHours * lithiumCount;
      totalLithiumPrice = lithium24V.price * lithiumCount;
    }
  }

  // Calculate solar panel requirement
  const psh = selectedState ? selectedState.psh : DEFAULT_PSH;
  const panelCount = Math.ceil(backupEnergy / (solarPanel.wattage * psh));
  const panelTotalWattage = panelCount * solarPanel.wattage;
  const dailyOutput = (panelTotalWattage * psh) / 1000; // in kWh
  const panelTotalPrice = panelCount * solarPanel.price;

  // Calculate inverter price
  const selectedInverter = inverterSpecs.find(
    spec => spec.size === inverterSize && spec.voltage === systemVoltage
  );
  const inverterPrice = selectedInverter ? selectedInverter.price : 0;

  // Calculate total system price
  const totalPriceWithTubular = inverterPrice + totalTubularPrice + panelTotalPrice;
  const totalPriceWithLithium = inverterPrice + totalLithiumPrice + panelTotalPrice;

  const lithiumBatteryOption = {
    type: 'Lithium' as const,
    modelName: selectedLithium ? 
      `${selectedLithium.capacity}kWh ${selectedLithium.voltage}V Lithium` : 
      'Not available',
    voltage: selectedLithium ? selectedLithium.voltage : 0,
    capacity: selectedLithium ? selectedLithium.ampHours : 0,
    price: selectedLithium ? selectedLithium.price : 0,
    count: lithiumCount,
    totalCapacity: totalLithiumCapacity,
    totalPrice: totalLithiumPrice
  };

  const tubularBatteryOption = {
    type: 'Tubular' as const,
    modelName: `${tubularBattery.voltage}V ${tubularBattery.capacity}Ah Tubular`,
    voltage: tubularBattery.voltage,
    capacity: tubularBattery.capacity,
    price: tubularBattery.price,
    count: totalTubularCount,
    totalCapacity: totalTubularCapacity,
    totalPrice: totalTubularPrice
  };

  // Calculate system components
  const components = calculateSystemComponents(
    adjustedPeakLoad,
    inverterSize * 1000, // Convert kVA to watts
    systemVoltage
  );

  return {
    peakLoad,
    adjustedPeakLoad,
    inverterSize,
    systemVoltage,
    backupEnergy,
    batteryOptions: {
      tubular: tubularBatteryOption,
      lithium: lithiumBatteryOption
    },
    solarPanels: {
      count: panelCount,
      totalWattage: panelTotalWattage,
      dailyOutput,
      price: panelTotalPrice
    },
    totalPrice: {
      withTubular: totalPriceWithTubular,
      withLithium: totalPriceWithLithium
    },
    components
  };
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};