import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import ApplianceSelector from './components/ApplianceSelector';
import BackupSettings from './components/BackupSettings';
import SummaryCard from './components/SummaryCard';
import SystemResults from './components/SystemResults';
import { SelectedAppliance, State, Step, SystemResults as SystemResultsType } from './types';
import { appliances } from './data/appliances';
import { nigerianStates } from './data/states';
import { calculateResults } from './utils/calculations';

function App() {
  // State for appliances
  const [selectedAppliances, setSelectedAppliances] = useState<SelectedAppliance[]>(() => {
    return appliances.map(appliance => ({
      ...appliance,
      quantity: appliance.defaultQuantity,
      hoursPerDay: appliance.defaultHours,
    }));
  });

  // State for backup settings
  const [backupHours, setBackupHours] = useState<number>(8);
  const [selectedState, setSelectedState] = useState<State | null>(null);
  
  // State for active step
  const [activeStep, setActiveStep] = useState<Step>('appliances');
  
  // State for calculated results
  const [results, setResults] = useState<SystemResultsType | null>(null);

  // Handle appliance selection change
  const handleApplianceChange = (updatedAppliance: SelectedAppliance) => {
    setSelectedAppliances(prev => {
      // Check if this is a custom appliance
      if (updatedAppliance.id.startsWith('custom-')) {
        // If it exists, update it; otherwise add it
        const exists = prev.some(a => a.id === updatedAppliance.id);
        if (exists) {
          return prev.map(appliance =>
            appliance.id === updatedAppliance.id ? updatedAppliance : appliance
          );
        } else {
          return [...prev, updatedAppliance];
        }
      } else {
        // Handle regular appliances
        return prev.map(appliance =>
          appliance.id === updatedAppliance.id ? updatedAppliance : appliance
        );
      }
    });
  };

  // Handle backup hours change
  const handleBackupHoursChange = (hours: number) => {
    setBackupHours(hours);
  };

  // Handle state selection
  const handleStateChange = (state: State | null) => {
    setSelectedState(state);
  };

  // Handle continue to results
  const handleContinue = () => {
    // Calculate system requirements
    const systemResults = calculateResults(
      selectedAppliances,
      backupHours,
      selectedState
    );
    
    setResults(systemResults);
    setActiveStep('results');
  };

  // Handle recalculate with a specific inverter size
  const handleRecalculateWithInverter = (inverterSize: number) => {
    const systemResults = calculateResults(
      selectedAppliances,
      backupHours,
      selectedState,
      inverterSize // Pass the preferred inverter size
    );
    setResults(systemResults);
    // Keep the active step as 'results'
  };

  // Handle back to calculator
  const handleBack = () => {
    setActiveStep('appliances');
  };

  // Update document title
  useEffect(() => {
    document.title = 'SolarMate Pro - Solar-Powered System Calculator';
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      
      <main className="container mx-auto px-4 py-8 flex-grow">
        {activeStep === 'appliances' ? (
          <div className="max-w-5xl mx-auto">
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                Solar-Powered System Calculator
              </h2>
              <p className="text-gray-600 max-w-3xl">
                Design your custom solar power system by selecting your appliances, 
                specifying backup hours, and indicating your location in Nigeria.
              </p>
            </div>
            
            <ApplianceSelector
              appliances={appliances}
              selectedAppliances={selectedAppliances}
              onApplianceChange={handleApplianceChange}
            />
            
            <BackupSettings
              backupHours={backupHours}
              onBackupHoursChange={handleBackupHoursChange}
              selectedState={selectedState}
              onStateChange={handleStateChange}
              states={nigerianStates}
            />
            
            <SummaryCard
              selectedAppliances={selectedAppliances}
              backupHours={backupHours}
              selectedState={selectedState}
              onContinue={handleContinue}
            />
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            {results && (
              <SystemResults 
                results={results} 
                onBack={handleBack} 
                backupHours={backupHours}
                onRecalculateWithInverter={handleRecalculateWithInverter}
              />
            )}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}

export default App;