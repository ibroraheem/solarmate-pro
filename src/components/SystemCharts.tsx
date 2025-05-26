import React from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface SystemChartsProps {
  peakLoad: number;
  dailyConsumption: number;
  solarPanels: {
    count: number;
    capacity: number;
    totalCapacity: number;
    dailyProduction: number;
  };
  batteries: {
    count: number;
    capacity: number;
    type: 'Lithium' | 'Tubular';
    voltage: number;
  };
  backupHours: number;
}

const SystemCharts: React.FC<SystemChartsProps> = ({
  peakLoad,
  dailyConsumption,
  solarPanels,
  batteries,
  backupHours,
}) => {
  // Load Profile Chart with Solar Production
  const loadProfileData = {
    labels: ['6AM', '7AM', '8AM', '9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM', '4PM', '5PM', '6PM', '7PM', '8PM', '9PM', '10PM', '11PM', '12AM', '1AM', '2AM', '3AM'],
    datasets: [
      {
        label: 'Load Profile',
        data: [
          0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1
        ].map(value => (value * peakLoad) / 1000), // Convert to kW
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.4,
        fill: false
      },
      {
        label: 'Solar Production',
        data: [
          0.1, 0.3, 0.5, 0.7, 0.8, 0.9, 1.0, 0.9, 0.8, 0.7, 0.5, 0.3, 0.1, 0, 0, 0, 0, 0, 0, 0, 0, 0
        ].map(value => (value * solarPanels.totalCapacity * 1000) / 1000), // Convert to kW
        borderColor: 'rgb(255, 159, 64)',
        tension: 0.4,
        fill: false
      }
    ]
  };

  // Calculate energy distribution
  const calculateEnergyDistribution = () => {
    // Convert daily consumption from Wh to kWh
    const dailyConsumptionKWh = dailyConsumption / 1000;

    // Solar energy available
    const solarEnergy = solarPanels.dailyProduction;

    // Battery energy contribution (how much energy the batteries can provide)
    const batteryEnergy = batteries.count * batteries.capacity * (batteries.type === 'Lithium' ? 0.9 : 0.5);

    // Calculate solar production period based on PSH
    const solarHours = solarPanels.dailyProduction / (solarPanels.totalCapacity * 0.85);
    const nonSolarHours = 24 - solarHours;

    // Calculate average load during solar and non-solar periods
    const averageLoad = dailyConsumptionKWh / 24;
    const energyNeededAtNight = averageLoad * nonSolarHours;

    // Calculate energy from each source
    const energyFromSolar = Math.min(solarEnergy, dailyConsumptionKWh);
    const energyFromBattery = Math.min(batteryEnergy, energyNeededAtNight);

    return {
      solar: energyFromSolar,
      battery: energyFromBattery,
      solarHours,
      nonSolarHours
    };
  };

  const energyDistribution = calculateEnergyDistribution();

  // Daily Energy Flow Chart
  const dailyEnergyFlowData = {
    labels: ['6AM', '9AM', '12PM', '3PM', '6PM', '9PM', '12AM', '3AM'],
    datasets: [
      {
        label: 'Solar to Load',
        data: [
          solarPanels.dailyProduction * 0.1 * 0.7,  // 70% of solar goes to load
          solarPanels.dailyProduction * 0.6 * 0.7,
          solarPanels.dailyProduction * 1.0 * 0.7,
          solarPanels.dailyProduction * 0.7 * 0.7,
          solarPanels.dailyProduction * 0.2 * 0.7,
          0, 0, 0
        ],
        backgroundColor: 'rgba(255, 206, 86, 0.8)', // Yellow
      },
      {
        label: 'Solar to Battery',
        data: [
          solarPanels.dailyProduction * 0.1 * 0.3,  // 30% of solar goes to battery
          solarPanels.dailyProduction * 0.6 * 0.3,
          solarPanels.dailyProduction * 1.0 * 0.3,
          solarPanels.dailyProduction * 0.7 * 0.3,
          solarPanels.dailyProduction * 0.2 * 0.3,
          0, 0, 0
        ],
        backgroundColor: 'rgba(54, 162, 235, 0.8)', // Blue
      },
      {
        label: 'Battery to Load',
        data: [
          0, 0, 0, 0,
          energyDistribution.battery * 0.2,  // Evening
          energyDistribution.battery * 0.4,  // Night
          energyDistribution.battery * 0.3,  // Midnight
          energyDistribution.battery * 0.1,  // Early Morning
        ],
        backgroundColor: 'rgba(75, 192, 192, 0.8)', // Teal
      }
    ],
  };

  // Energy Distribution Chart
  const energyDistributionData = {
    labels: ['Direct Solar Use', 'Battery Storage'],
    datasets: [
      {
        data: [
          energyDistribution.solar,
          energyDistribution.battery
        ],
        backgroundColor: [
          'rgba(255, 206, 86, 0.8)', // Solar - Yellow
          'rgba(54, 162, 235, 0.8)',  // Battery - Blue
        ],
        borderColor: [
          'rgba(255, 206, 86, 1)',
          'rgba(54, 162, 235, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Battery Capacity Chart
  const totalBatteryCapacity = batteries.count * batteries.capacity;
  const dod = batteries.type === 'Lithium' ? 0.9 : 0.5;
  const usableCapacity = totalBatteryCapacity * dod;
  const requiredCapacity = (peakLoad * backupHours) / 1000 * 1.3; // Convert to kWh and add 30% safety factor
  const usedCapacityPercentage = Math.min(100, (requiredCapacity / usableCapacity) * 100);

  // Nigerian market standard battery sizes (kWh)
  const standardBatterySizes = {
    '12V': {
      'Tubular': [
        { capacity: 2.64, model: '2.64kWh' }
      ],
      'Lithium': [] // No 12V lithium batteries available
    },
    '24V': {
      'Tubular': [], // No 24V tubular batteries available
      'Lithium': [
        { capacity: 5.0, model: '5kWh' }
      ]
    },
    '48V': {
      'Tubular': [], // No 48V tubular batteries available
      'Lithium': [
        { capacity: 5.0, model: '5kWh' },
        { capacity: 7.5, model: '7.5kWh' },
        { capacity: 10.0, model: '10kWh' },
        { capacity: 12.5, model: '12.5kWh' },
        { capacity: 15.0, model: '15kWh' }
      ]
    }
  };

  // Find recommended battery size based on system voltage and type
  const voltageKey = batteries.voltage.toString() + 'V';
  const typeKey = batteries.type;
  const availableSizes = standardBatterySizes[voltageKey as keyof typeof standardBatterySizes][typeKey];
  
  // If no batteries available for the selected voltage/type, find the next best match
  let recommendedBattery;
  if (availableSizes.length === 0) {
    // Find the next available voltage/type combination
    const allVoltages = Object.keys(standardBatterySizes);
    const currentVoltageIndex = allVoltages.indexOf(voltageKey);
    
    // Try next voltage up
    if (currentVoltageIndex < allVoltages.length - 1) {
      const nextVoltage = allVoltages[currentVoltageIndex + 1];
      const nextVoltageSizes = standardBatterySizes[nextVoltage][typeKey];
      if (nextVoltageSizes.length > 0) {
        recommendedBattery = nextVoltageSizes[0];
      }
    }
    
    // If still no match, try different battery type
    if (!recommendedBattery) {
      const otherType = typeKey === 'Lithium' ? 'Tubular' : 'Lithium';
      const otherTypeSizes = standardBatterySizes[voltageKey][otherType];
      if (otherTypeSizes.length > 0) {
        recommendedBattery = otherTypeSizes[0];
      }
    }
  } else {
    // Find the next available battery size that meets or exceeds the required capacity
    recommendedBattery = availableSizes.find(bat => bat.capacity >= requiredCapacity) || availableSizes[availableSizes.length - 1];
  }
  
  const recommendedBatteryCount = Math.ceil(requiredCapacity / recommendedBattery.capacity);
  
  const batteryCapacityData = {
    labels: ['Required Capacity', 'Available Capacity'],
    datasets: [
      {
        data: [
          usedCapacityPercentage,
          100 - usedCapacityPercentage,
        ],
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',  // Used - Red
          'rgba(75, 192, 192, 0.8)',  // Available - Teal
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(75, 192, 192, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {/* Load Profile Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Daily Load Profile</h3>
        <Line
          data={loadProfileData}
          options={{
            responsive: true,
            plugins: {
              title: {
                display: true,
                text: 'Power Consumption Throughout the Day',
              },
              legend: {
                display: true,
                position: 'top',
              },
            },
            scales: {
              y: {
                title: {
                  display: true,
                  text: 'Power (kW)',
                },
                ticks: {
                  callback: function(value) {
                    return (Number(value) / 1000).toFixed(1);
                  }
                }
              },
            },
          }}
        />
      </div>

      {/* Daily Energy Flow Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Daily Energy Flow</h3>
        <Bar
          data={dailyEnergyFlowData}
          options={{
            responsive: true,
            plugins: {
              title: {
                display: true,
                text: 'Energy Flow Throughout the Day (kWh)',
              },
              tooltip: {
                mode: 'index',
                intersect: false,
              },
              stacked: true,
            },
            scales: {
              x: {
                stacked: true,
              },
              y: {
                stacked: true,
                title: {
                  display: true,
                  text: 'Energy (kWh)',
                },
              },
            },
          }}
        />
        <div className="mt-4 text-sm text-gray-600">
          <p>Battery Discharge: {energyDistribution.battery.toFixed(1)} kWh</p>
          <p>Direct Solar Use: {energyDistribution.solar.toFixed(1)} kWh</p>
        </div>
      </div>

      {/* Energy Distribution Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Energy Distribution</h3>
        <Doughnut
          data={energyDistributionData}
          options={{
            responsive: true,
            plugins: {
              title: {
                display: true,
                text: 'Daily Energy Sources (kWh)',
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    const value = context.raw as number;
                    const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                    const percentage = ((value / total) * 100).toFixed(1);
                    return `${context.label}: ${value.toFixed(1)} kWh (${percentage}%)`;
                  }
                }
              }
            },
          }}
        />
        <div className="mt-4 text-sm text-gray-600">
          <p>Daily Consumption: {(dailyConsumption / 1000).toFixed(1)} kWh</p>
          <p>Solar Production: {solarPanels.dailyProduction.toFixed(1)} kWh</p>
          <p>Effective Solar Hours: {energyDistribution.solarHours.toFixed(1)} hours</p>
          <p>Battery Capacity: {(batteries.count * batteries.capacity).toFixed(1)} kWh</p>
          <p>Usable Battery: {(batteries.count * batteries.capacity * (batteries.type === 'Lithium' ? 0.9 : 0.5)).toFixed(1)} kWh</p>
        </div>
      </div>

      {/* Battery Capacity Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Battery Capacity</h3>
        <Doughnut
          data={batteryCapacityData}
          options={{
            responsive: true,
            plugins: {
              title: {
                display: true,
                text: 'Battery Capacity Utilization',
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    const value = context.raw as number;
                    return `${context.label}: ${value.toFixed(1)}%`;
                  }
                }
              }
            },
          }}
        />
        <div className="mt-4 text-sm text-gray-600">
          <p>Total Capacity: {totalBatteryCapacity.toFixed(1)} kWh</p>
          <p>Usable Capacity: {usableCapacity.toFixed(1)} kWh</p>
        </div>
      </div>

      {/* System Summary */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold mb-4">System Summary</h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600">Peak Load</p>
            <p className="text-xl font-semibold">{(peakLoad / 1000).toFixed(1)} kW</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Daily Consumption</p>
            <p className="text-xl font-semibold">{(dailyConsumption / 1000).toFixed(1)} kWh</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Solar Production</p>
            <p className="text-xl font-semibold">{solarPanels.dailyProduction.toFixed(1)} kWh</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Battery Capacity</p>
            <p className="text-xl font-semibold">{(batteries.count * batteries.capacity).toFixed(1)} kWh</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemCharts; 