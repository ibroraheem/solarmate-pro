import { ApplianceUsage, SystemResults, State, SystemPreferences } from '../types';
import { 
  inverterSpecs, 
  tubularBattery, 
  lithiumBatteries,
  solarPanel, 
  SAFETY_MARGIN, 
  DEFAULT_PSH 
} from '../data/system';

// State-specific PSH data from Zenevista (updated from user screenshots)
const STATE_PSH_DATA: { [key: string]: number } = {
  'Adamawa': 6.4,
  'Akwa Ibom': 5.8,
  'Anambra': 5.6,
  'Bauchi': 6.2,
  'Bayelsa': 5.4,
  'Benue': 6.0,
  'Borno': 5.8,
  'Cross River': 5.6,
  'Delta': 5.4,
  'Ebonyi': 6.0,
  'Edo': 5.6,
  'Ekiti': 5.4,
  'Enugu': 6.0,
  'Gombe': 5.4,
  'Imo': 5.6,
  'Jigawa': 5.6,
  'Kaduna': 6.8,
  'Kano': 6.6,
  'Katsina': 6.2,
  'Kebbi': 6.0,
  'Kogi': 5.8,
  'Kwara': 5.6,
  'Lagos': 5.4,
  'Niger': 5.8,
  'Ogun': 5.6,
  'Ondo': 5.4,
  'Yobe': 7.2
};

const DAYS_IN_YEAR = 365;

// Helper function to estimate generator running cost based on daily energy needed
const calculateGeneratorRunningCost = (generator: typeof petrolGenerators[0], dailyEnergyWh: number): number => {
  // Estimate the hours needed to generate dailyEnergyWh using the generator's capacity
  // Assuming generator operates at roughly its rated capacity when running
  const generatorHourlyOutputWh = generator.capacitykVA * 1000; // Convert kVA to VA, assume power factor 1 for simplicity initially
  
  // This is a simplification. A more accurate model would consider load variations and generator efficiency curves.
  // Based on the provided data which includes 8-hour fuel cost, let's scale based on daily energy vs energy produced in 8 hours
  const energyProducedIn8Hrs = generatorHourlyOutputWh * 8; // Simplified
  
  if (energyProducedIn8Hrs === 0) return 0; // Avoid division by zero

  const scalingFactor = dailyEnergyWh / energyProducedIn8Hrs;
  const estimatedDailyCost = generator.fuelCost8Hrs * scalingFactor;
  
  // Ensure minimum cost if daily energy is greater than 0, assuming a minimum run time cost.
  // Let's apply a minimum cost equivalent to running for 1 hour at capacity if dailyEnergyWh > 0.
  const minDailyCost = dailyEnergyWh > 0 ? (generator.fuelCost8Hrs / 8) : 0; // Cost for 1 hour
  
  const adjustedDailyCost = Math.max(estimatedDailyCost, minDailyCost);

  // Calculate annual cost
  const estimatedAnnualCost = adjustedDailyCost * DAYS_IN_YEAR;
  return estimatedAnnualCost;
};

const calculatePriceRange = (basePrice: number) => {
  const lowerBound = Math.floor(basePrice * 0.85); // 15% lower
  const upperBound = Math.ceil(basePrice * 1.15); // 15% higher
  return { lowerBound, upperBound };
};

function calculateRequiredPanels(
  dailyEnergy: number,
  backupEnergy: number,
  psh: number
): {
  count: number;
  wattage: number;
  totalWattage: number;
  dailyOutput: number;
} {
  const requiredDailyOutput = Math.max(dailyEnergy, backupEnergy) * 1.2; // Add 20% for system losses
  const panelDailyOutput = solarPanel.wattage * psh;
  const count = Math.ceil(requiredDailyOutput / panelDailyOutput);
  
  return {
    count,
    wattage: solarPanel.wattage,
    totalWattage: count * solarPanel.wattage,
    dailyOutput: count * panelDailyOutput
  };
}

export function calculateResults(
  appliances: ApplianceUsage[],
  preferences: SystemPreferences,
  state: State | null
): SystemResults {
  // Calculate peak load (all appliances that might run simultaneously)
  const peakLoad = appliances.reduce(
    (total, appliance) => total + appliance.power * appliance.quantity,
    0
  );

  // Add safety margin
  const adjustedPeakLoad = Math.ceil(peakLoad * SAFETY_MARGIN);

  // Determine inverter size and system voltage
  let inverterSize: number;
  let systemVoltage: number;

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
  const dailyEnergy = appliances.reduce(
    (total, appliance) => 
      total + (appliance.power * appliance.quantity * appliance.hoursPerDay),
    0
  );

  // Calculate backup energy
  const backupEnergy = dailyEnergy * (preferences.backupHours / 24);

  // Get state-specific PSH or use default
  const psh = state ? STATE_PSH_DATA[state.name] || DEFAULT_PSH : DEFAULT_PSH;

  // Calculate battery bank capacity for tubular battery
  const tubularBankAh = backupEnergy / (systemVoltage * tubularBattery.depthOfDischarge);
  const tubularBatteriesInSeries = systemVoltage / tubularBattery.voltage;
  const tubularStrings = Math.ceil(tubularBankAh / tubularBattery.capacity);
  const totalTubularCount = tubularBatteriesInSeries * tubularStrings;
  const totalTubularCapacity = tubularBattery.capacity * tubularBattery.voltage * totalTubularCount;
  const totalTubularPrice = totalTubularCount * tubularBattery.price;

  // Calculate battery bank for lithium
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
    let bestOption: { 
      model: typeof lithiumBatteries[0] | null; 
      count: number; 
      totalPrice: number 
    } = { 
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
  }

  // Calculate required solar panels
  const solarPanels = calculateRequiredPanels(
    dailyEnergy,
    backupEnergy,
    psh
  );

  // Calculate inverter price
  const selectedInverter = inverterSpecs.find(
    spec => spec.size === inverterSize && spec.voltage === systemVoltage
  );
  const maxPvInputWattage = selectedInverter?.maxPvInputWattage || 0;

  // Check if solar panel wattage exceeds inverter's max PV input
  let pvInputWarning = undefined;

  if (selectedInverter && solarPanels.totalWattage > maxPvInputWattage) {
    // Find a larger inverter that can handle the PV wattage
    const largerInverter = inverterSpecs.find(
      (spec) => spec.maxPvInputWattage >= solarPanels.totalWattage
    );

    // Base message about clipping
    pvInputWarning =
      `Note: The recommended total solar panel wattage (${solarPanels.totalWattage}W) is calculated to meet your daily energy needs and battery charging. However, it exceeds the current ${selectedInverter.size} kVA inverter's estimated maximum PV input capacity (${maxPvInputWattage}W). This means the inverter can only utilize up to ${maxPvInputWattage}W from the solar array at any given time, leading to 'clipping' and reduced overall energy harvest.`;

    if (largerInverter) {
      // If a suitable larger inverter exists in our data, recommend it and mention extra controller
      pvInputWarning += ` To fully utilize the ${solarPanels.totalWattage}W solar array, we recommend using a larger inverter, such as the ${largerInverter.size} kVA model, which has an estimated maximum PV input capacity of ${largerInverter.maxPvInputWattage}W. An alternative solution involves using an extra charge controller for the excess panels; please contact us directly for calculations and details on this approach.`;
    } else {
      // If no suitable larger inverter exists in our data, ask user to contact for custom solution
      pvInputWarning += ` Utilizing this solar array requires a larger inverter than available in this tool's current data. Please contact us directly for a custom solution.`;
    }
  }

  // Calculate net savings
  const netSavings = 0; // Placeholder for actual net savings calculation

  return {
    peakLoad,
    adjustedPeakLoad,
    dailyConsumption: dailyEnergy,
    inverter: {
      name: selectedInverter ? `${selectedInverter.size}kVA ${selectedInverter.voltage}V` : 'Not available',
      pvInputWarning
    },
    solarPanels: {
      count: solarPanels.count,
      wattage: solarPanels.wattage,
      totalWattage: solarPanels.totalWattage,
      dailyOutput: solarPanels.dailyOutput
    },
    batteries: {
      tubular: {
        count: totalTubularCount,
        totalCapacity: totalTubularCapacity
      },
      lithium: {
        count: lithiumCount,
        totalCapacity: totalLithiumCapacity
      }
    },
    costAnalysis: {
      tubularPrice: totalTubularPrice,
      lithiumPrice: totalLithiumPrice
    },
    netSavings
  };
}

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};