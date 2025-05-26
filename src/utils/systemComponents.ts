import { SystemResults } from '../types';

interface SystemComponent {
  name: string;
  quantity: number;
  specifications: string;
}

export const calculateSystemComponents = (results: SystemResults): SystemComponent[] => {
  const components: SystemComponent[] = [];

  // Solar Panels
  components.push({
    name: 'Solar Panel',
    quantity: results.solarPanels.count,
    specifications: `${results.solarPanels.capacity}W, ${results.solarPanels.totalCapacity}kWp total`
  });

  // Batteries
  components.push({
    name: `${results.batteries.type} Battery`,
    quantity: results.batteries.count,
    specifications: `${results.batteries.capacity}kWh, ${results.batteries.voltage}V`
  });

  // Inverter
  components.push({
    name: 'Inverter',
    quantity: 1,
    specifications: `${results.inverter.size}kVA ${results.inverter.type}, ${results.inverter.voltage}V`
  });

  // Charge Controller
  if (results.chargeController) {
    components.push({
      name: 'Charge Controller',
      quantity: 1,
      specifications: `${results.chargeController.type}, ${results.chargeController.current}A, ${results.chargeController.voltage}V`
    });
  }

  // Circuit Protection
  const mainBreaker = Math.ceil(results.peakLoad / 230);
  const solarBreaker = Math.ceil(results.solarPanels.totalCapacity * 1000 / 48);
  const batteryBreaker = Math.ceil(results.batteries.count * results.batteries.capacity * 1000 / 48);

  components.push({
    name: 'Main Breaker',
    quantity: 1,
    specifications: `${mainBreaker}A, 230V`
  });

  components.push({
    name: 'Solar Array Breaker',
    quantity: 1,
    specifications: `${solarBreaker}A, 48V DC`
  });

  components.push({
    name: 'Battery Bank Breaker',
    quantity: 1,
    specifications: `${batteryBreaker}A, 48V DC`
  });

  // AVR (if needed)
  const avrSize = Math.ceil(results.peakLoad / 1000);
  if (avrSize > 0) {
    components.push({
      name: 'AVR',
      quantity: 1,
      specifications: `${avrSize}kVA, 230V`
    });
  }

  // Cables - Using common Nigerian market sizes
  const getNearestCableSize = (calculatedSize: number): number => {
    const commonSizes = [1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120, 150, 185, 240];
    return commonSizes.find(size => size >= calculatedSize) || commonSizes[commonSizes.length - 1];
  };

  const solarCable = getNearestCableSize(Math.ceil(results.solarPanels.totalCapacity * 1000 / 48 / 4));
  const batteryCable = getNearestCableSize(Math.ceil(results.batteries.count * results.batteries.capacity * 1000 / 48 / 4));
  const loadCable = getNearestCableSize(Math.ceil(results.peakLoad / 230 / 4));

  components.push({
    name: 'Solar Array Cable',
    quantity: 1,
    specifications: `${solarCable}mm², 48V DC, Double Insulated`
  });

  components.push({
    name: 'Battery Bank Cable',
    quantity: 1,
    specifications: `${batteryCable}mm², 48V DC, Double Insulated`
  });

  components.push({
    name: 'Load Distribution Cable',
    quantity: 1,
    specifications: `${loadCable}mm², 230V AC, Double Insulated`
  });

  // Accessories
  components.push({
    name: 'MC4 Connectors',
    quantity: results.solarPanels.count * 2,
    specifications: 'Male/Female pairs'
  });

  components.push({
    name: 'Battery Terminals',
    quantity: results.batteries.count * 2,
    specifications: 'Positive/Negative pairs'
  });

  components.push({
    name: 'Cable Lugs',
    quantity: Math.ceil(results.batteries.count * 2 + results.solarPanels.count * 2),
    specifications: 'Copper, crimp type'
  });

  return components;
}; 