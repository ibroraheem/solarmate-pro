// Nigerian standard breaker sizes
const BREAKER_SIZES = [10, 16, 20, 32, 40, 63, 100, 125, 160];

// Nigerian standard AVR sizes in kVA
const AVR_SIZES = [0.5, 1, 2, 3.5, 5, 10, 15, 20, 30, 50];

// Cable size guide (current rating to cross-sectional area in mm²)
const CABLE_SIZES = [
  { maxCurrent: 10, size: 1.5 },
  { maxCurrent: 20, size: 2.5 },
  { maxCurrent: 25, size: 4 },
  { maxCurrent: 32, size: 6 },
  { maxCurrent: 40, size: 10 },
  { maxCurrent: 63, size: 16 },
  { maxCurrent: 100, size: 25 },
  { maxCurrent: 125, size: 35 },
  { maxCurrent: 160, size: 50 }
];

// Helper function to round up to nearest standard size
const roundUpToStandard = (value: number, standards: number[]): number => {
  return standards.find(size => size >= value) || standards[standards.length - 1];
};

// Helper function to get cable size for current
const getCableSize = (current: number): number => {
  const cable = CABLE_SIZES.find(cable => cable.maxCurrent >= current);
  return cable ? cable.size : CABLE_SIZES[CABLE_SIZES.length - 1].size;
};

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

export const calculateSystemComponents = (
  loadPower: number,
  inverterPower: number,
  batteryVoltage: number
): SystemComponents => {
  // AC Side Breaker Calculation
  const acCurrent = (loadPower / (230 * 0.8));
  const acCurrentWithAllowance = acCurrent * 1.25;
  const acBreakerSize = roundUpToStandard(acCurrent, BREAKER_SIZES);
  const acCableSize = getCableSize(acCurrentWithAllowance);

  // DC Side Breaker Calculation
  const dcCurrent = (inverterPower / batteryVoltage);
  const dcCurrentWithAllowance = dcCurrent * 1.25;
  const dcBreakerSize = roundUpToStandard(dcCurrent, BREAKER_SIZES);
  const dcCableSize = getCableSize(dcCurrentWithAllowance);

  // AVR Calculation
  const avrKva = (loadPower / (1000 * 0.8));
  const avrKvaWithAllowance = avrKva * 1.25;
  const avrSize = roundUpToStandard(avrKvaWithAllowance, AVR_SIZES);

  // Changeover Switch Calculation
  const switchCurrent = (inverterPower / (230 * 0.8));
  const switchCurrentWithAllowance = switchCurrent * 1.25;
  const switchSize = roundUpToStandard(switchCurrent, [32, 63, 100, 125, 160]);
  const switchType = inverterPower >= 5000 ? 'Automatic' : 'Manual';

  return {
    acBreaker: {
      current: acCurrentWithAllowance,
      size: acBreakerSize,
      cableSize: acCableSize
    },
    dcBreaker: {
      current: dcCurrentWithAllowance,
      size: dcBreakerSize,
      cableSize: dcCableSize
    },
    avr: {
      kva: avrKvaWithAllowance,
      size: avrSize
    },
    changeoverSwitch: {
      current: switchCurrentWithAllowance,
      size: switchSize,
      type: switchType
    },
    standardSizes: {
      breakerSizes: BREAKER_SIZES,
      avrSizes: AVR_SIZES,
      cableSizes: CABLE_SIZES
    }
  };
}; 