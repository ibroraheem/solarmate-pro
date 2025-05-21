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
import { petrolGenerators } from '../data/system';

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

// Calculate required solar panels based on both daily energy needs and battery charging
const calculateRequiredPanels = (
  dailyEnergyNeeded: number,
  batteryCapacity: number,
  psh: number
): SolarPanelResult => {
  // Calculate energy needed for daily consumption
  const dailyConsumptionEnergy = dailyEnergyNeeded;

  // Calculate energy needed to charge batteries (80% depth of discharge)
  const batteryChargingEnergy = (batteryCapacity * 0.8) / 0.9; // 0.9 is charging efficiency

  // Total daily energy requirement
  const totalDailyEnergyNeeded = dailyConsumptionEnergy + batteryChargingEnergy;

  // Add 20% buffer for system losses and future expansion
  const energyWithBuffer = totalDailyEnergyNeeded * 1.2;

  // Calculate required panel wattage
  const requiredWattage = Math.ceil(energyWithBuffer / psh);

  // Round up to nearest standard panel size (400W)
  const panelCount = Math.ceil(requiredWattage / 400);
  const totalWattage = panelCount * 400;

  // Calculate daily output with the actual panel configuration
  const dailyOutput = (totalWattage * psh) / 1000; // Convert to kWh

  return {
    count: panelCount,
    totalWattage,
    dailyOutput,
    modelName: '400W Monocrystalline',
    price: panelCount * 45000 // NGN 45,000 per panel
  };
};

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

  // Get state-specific PSH or use default
  const psh = selectedState ? STATE_PSH_DATA[selectedState.name] || DEFAULT_PSH : DEFAULT_PSH;

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
  const inverterPrice = selectedInverter ? selectedInverter.price : 0;

  // Calculate total system price with ranges
  const calculatePriceRange = (basePrice: number) => {
    const lowerBound = Math.floor(basePrice * 0.85); // 15% lower
    const upperBound = Math.ceil(basePrice * 1.15); // 15% higher
    return { lowerBound, upperBound };
  };

  const totalPriceWithTubular = inverterPrice + totalTubularPrice + solarPanels.price;
  const totalPriceWithLithium = inverterPrice + totalLithiumPrice + solarPanels.price;

  const tubularPriceRange = calculatePriceRange(totalPriceWithTubular);
  const lithiumPriceRange = calculatePriceRange(totalPriceWithLithium);

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
    totalPrice: totalLithiumPrice,
    priceRange: calculatePriceRange(totalLithiumPrice) // Use totalLithiumPrice
  };

  const tubularBatteryOption = {
    type: 'Tubular' as const,
    modelName: `${tubularBattery.voltage}V ${tubularBattery.capacity}Ah Tubular`,
    voltage: tubularBattery.voltage,
    capacity: tubularBattery.capacity,
    price: tubularBattery.price,
    count: totalTubularCount,
    totalCapacity: totalTubularCapacity,
    totalPrice: totalTubularPrice,
    priceRange: calculatePriceRange(totalTubularPrice) // Use totalTubularPrice
  };

  // Calculate system components
  const components = calculateSystemComponents(
    adjustedPeakLoad,
    inverterSize * 1000, // Convert kVA to watts
    systemVoltage
  );

  // --- Generator Comparison Calculation ---
  // Find a comparable petrol generator based on inverter size
  // Find the generator with capacity closest to or just above the inverter size
  // If multiple match inverter size, take the smallest kVA. If none match, take the largest available below inverter size.
  const comparableGenerator = petrolGenerators.reduce((prev, curr) => {
    // If current generator capacity is >= inverter size
    if (curr.capacitykVA >= inverterSize) {
      // If no previous generator found >= inverter size, or current is smaller than previous
      if (!prev || (prev.capacitykVA < inverterSize || curr.capacitykVA < prev.capacitykVA)) {
        return curr; // This is the best match so far >= inverter size
      }
    } else { // Current generator capacity is < inverter size
      // If no previous generator found < inverter size, or current is larger than previous < inverter size
      if (!prev || (prev.capacitykVA < inverterSize && curr.capacitykVA > prev.capacitykVA)){
           return curr; // This is the largest match so far < inverter size
       }
    }
     return prev; // Keep the previous best match
  }, null as typeof petrolGenerators[0] | null);

  let generatorComparisonData = null; // Use a different variable name
  if (comparableGenerator) {
      // Calculate annual running cost for the comparable generator based on daily energy consumption
      const estimatedAnnualGeneratorCost = calculateGeneratorRunningCost(
          comparableGenerator,
          dailyEnergy // Use total daily energy consumption
      );
      generatorComparisonData = {
          generator: comparableGenerator,
          estimatedAnnualCost: estimatedAnnualGeneratorCost,
      };
  }

  // Calculate net savings
  const netSavings = 0; // Placeholder for actual net savings calculation

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
    solarPanels,
    totalPrice: {
      withTubular: {
        base: totalPriceWithTubular,
        range: tubularPriceRange
      },
      withLithium: {
        base: totalPriceWithLithium,
        range: lithiumPriceRange
      }
    },
    components,
    priceDisclaimer: {
      factors: [
        'Market conditions and exchange rates',
        'Installation complexity and location',
        'Additional components and accessories',
        'Transportation and logistics costs',
        'Seasonal variations in component availability',
        'Note: Generator fuel costs are estimates based on average petrol prices and typical consumption rates, which can fluctuate.'
      ]
    },
    generatorComparison: generatorComparisonData,
    netSavings,
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