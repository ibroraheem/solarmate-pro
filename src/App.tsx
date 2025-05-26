import React, { useState, useEffect } from 'react';
import { LandingPage } from './components/LandingPage';
import SystemPreferences from './components/SystemPreferences';
import ApplianceSelector from './components/ApplianceSelector';
import SystemResults from './components/SystemResults';
import { ApplianceUsage, SystemPreferences as SystemPreferencesType, SystemResults as SystemResultsType, Appliance } from './types';
import { applianceTemplates } from './data/templates';
import { calculateSystem } from './utils/systemAnalysis';

// Default appliances list
const defaultAppliances: Appliance[] = [
  // Entertainment
  {
    id: 'tv32',
    name: '32" LED TV',
    wattage: 60,
    defaultQuantity: 1,
    defaultHours: 4
  },
  {
    id: 'tv43',
    name: '43" LED TV',
    wattage: 100,
    defaultQuantity: 1,
    defaultHours: 4
  },
  {
    id: 'tv55',
    name: '55" LED TV',
    wattage: 150,
    defaultQuantity: 1,
    defaultHours: 4
  },
  // Fans
  {
    id: 'standingFan',
    name: 'Standing Fan',
    wattage: 65,
    defaultQuantity: 1,
    defaultHours: 8
  },
  {
    id: 'ceilingFan',
    name: 'Ceiling Fan',
    wattage: 90,
    defaultQuantity: 1,
    defaultHours: 8
  },
  {
    id: 'tableFan',
    name: 'Table Fan',
    wattage: 50,
    defaultQuantity: 1,
    defaultHours: 8
  },
  // Air Conditioners
  {
    id: 'ac1hp',
    name: '1 HP Air Conditioner',
    wattage: 950,
    defaultQuantity: 1,
    defaultHours: 8
  },
  {
    id: 'ac1.5hp',
    name: '1.5 HP Air Conditioner',
    wattage: 1200,
    defaultQuantity: 1,
    defaultHours: 8
  },
  {
    id: 'ac2hp',
    name: '2 HP Air Conditioner',
    wattage: 1800,
    defaultQuantity: 1,
    defaultHours: 8
  },
  // Refrigerators
  {
    id: 'fridgeSmall',
    name: 'Small Refrigerator',
    wattage: 100,
    defaultQuantity: 1,
    defaultHours: 24
  },
  {
    id: 'fridgeMedium',
    name: 'Medium Refrigerator',
    wattage: 130,
    defaultQuantity: 1,
    defaultHours: 24
  },
  {
    id: 'fridgeLarge',
    name: 'Large Refrigerator',
    wattage: 180,
    defaultQuantity: 1,
    defaultHours: 24
  },
  // Kitchen Appliances
  {
    id: 'washingMachine',
    name: 'Basic Washing Machine',
    wattage: 500,
    defaultQuantity: 1,
    defaultHours: 2
  },
  {
    id: 'washingMachineDryer',
    name: 'Washing Machine with Dryer',
    wattage: 2000,
    defaultQuantity: 1,
    defaultHours: 2
  },
  {
    id: 'electricKettle',
    name: 'Electric Kettle',
    wattage: 2200,
    defaultQuantity: 1,
    defaultHours: 1
  },
  {
    id: 'microwave',
    name: 'Microwave Oven',
    wattage: 1200,
    defaultQuantity: 1,
    defaultHours: 1
  },
  {
    id: 'toaster',
    name: 'Toaster',
    wattage: 1000,
    defaultQuantity: 1,
    defaultHours: 1
  },
  {
    id: 'blender',
    name: 'Blender',
    wattage: 800,
    defaultQuantity: 1,
    defaultHours: 1
  },
  {
    id: 'electricCooker',
    name: 'Electric Cooker (1 plate)',
    wattage: 2500,
    defaultQuantity: 1,
    defaultHours: 2
  },
  {
    id: 'riceCooker',
    name: 'Rice Cooker',
    wattage: 1000,
    defaultQuantity: 1,
    defaultHours: 1
  },
  // Other Appliances
  {
    id: 'electricIron',
    name: 'Electric Iron',
    wattage: 1500,
    defaultQuantity: 1,
    defaultHours: 1
  },
  {
    id: 'waterHeater',
    name: 'Water Heater (10L)',
    wattage: 1800,
    defaultQuantity: 1,
    defaultHours: 1
  },
  {
    id: 'waterPump',
    name: 'Water Pump (1 HP)',
    wattage: 1100,
    defaultQuantity: 1,
    defaultHours: 2
  },
  {
    id: 'laptop',
    name: 'Laptop',
    wattage: 65,
    defaultQuantity: 1,
    defaultHours: 6
  },
  {
    id: 'desktop',
    name: 'Desktop Computer',
    wattage: 250,
    defaultQuantity: 1,
    defaultHours: 6
  },
  {
    id: 'hairDryer',
    name: 'Hair Dryer',
    wattage: 1200,
    defaultQuantity: 1,
    defaultHours: 1
  },
  {
    id: 'ledBulb',
    name: 'LED Bulb (Energy Saver)',
    wattage: 10,
    defaultQuantity: 4,
    defaultHours: 6
  },
  {
    id: 'incandescentBulb',
    name: 'Incandescent Bulb',
    wattage: 100,
    defaultQuantity: 1,
    defaultHours: 6
  }
];

// Default system preferences
const defaultPreferences: SystemPreferencesType = {
  batteryType: 'Lithium',
  backupHours: 8,
  state: 'Lagos',
  electricityBand: 'C'
};

function App() {
  const [currentStep, setCurrentStep] = useState<'landing' | 'appliances' | 'preferences' | 'results'>('landing');
  const [appliances, setAppliances] = useState<ApplianceUsage[]>([]);
  const [preferences, setPreferences] = useState<SystemPreferencesType>(defaultPreferences);
  const [systemResults, setSystemResults] = useState<SystemResultsType | null>(null);

  useEffect(() => {
    document.title = 'SolarMate - Solar System Calculator';
  }, []);

  const handleStartFromScratch = () => {
    setCurrentStep('appliances');
  };

  const handleSelectTemplate = (templateId: string) => {
    const template = applianceTemplates.find(t => t.id === templateId);
    if (template) {
      setAppliances(template.appliances);
      setCurrentStep('appliances');
        }
  };

  const handleApplianceSubmit = (selectedAppliances: ApplianceUsage[]) => {
    setAppliances(selectedAppliances);
    setPreferences(defaultPreferences);
    setCurrentStep('preferences');
  };

  const handleApplianceChange = (appliance: ApplianceUsage) => {
    setAppliances(prevAppliances => {
      const index = prevAppliances.findIndex(a => a.id === appliance.id);
      if (index === -1) {
        return [...prevAppliances, appliance];
      }
      const newAppliances = [...prevAppliances];
      newAppliances[index] = appliance;
      return newAppliances;
    });
  };

  const handlePreferencesSubmit = (systemPreferences: SystemPreferencesType) => {
    const calculatedResults = calculateSystem(appliances, systemPreferences);
    setSystemResults(calculatedResults);
    setCurrentStep('results');
  };

  const handleBack = () => {
    switch (currentStep) {
      case 'appliances':
        setCurrentStep('landing');
        break;
      case 'preferences':
        setCurrentStep('appliances');
        break;
      case 'results':
        setCurrentStep('preferences');
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {currentStep === 'landing' && (
        <LandingPage
          onStartFromScratch={handleStartFromScratch}
          onSelectTemplate={handleSelectTemplate}
        />
      )}

      {currentStep === 'appliances' && (
        <div className="max-w-4xl mx-auto p-6">
          <button
            onClick={handleBack}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Home
          </button>
            <ApplianceSelector
            appliances={defaultAppliances}
            selectedAppliances={appliances}
              onApplianceChange={handleApplianceChange}
            />
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => handleApplianceSubmit(appliances)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Continue to Preferences
            </button>
          </div>
        </div>
      )}

      {currentStep === 'preferences' && (
        <div className="max-w-4xl mx-auto p-6">
          <button
            onClick={handleBack}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Appliances
          </button>
          <SystemPreferences
            preferences={preferences}
            onPreferencesChange={setPreferences}
            onNext={() => handlePreferencesSubmit(preferences)}
            onBack={handleBack}
              />
          </div>
        )}

      {currentStep === 'results' && systemResults && (
        <SystemResults
          results={systemResults}
          onBack={handleBack}
          onRestart={() => setCurrentStep('landing')}
        />
      )}
    </div>
  );
}

export default App;