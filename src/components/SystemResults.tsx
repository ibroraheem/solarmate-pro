import React, { useState } from 'react';
import { ArrowLeftIcon, BatteryFullIcon, ZapIcon, SunIcon, Share2Icon } from 'lucide-react';
import { SystemResults as SystemResultsType } from '../types';
import { formatCurrency } from '../utils/calculations';
import PremiumDownloadButton from './PremiumDownloadButton';

interface SystemResultsProps {
  results: SystemResultsType;
  onBack: () => void;
  backupHours: number;
  selectedState?: { name: string; psh: number };
  onRecalculateWithInverter: (inverterSize: number) => void;
}

const SystemResults: React.FC<SystemResultsProps> = ({ 
  results, 
  onBack,
  backupHours,
  selectedState,
  onRecalculateWithInverter
}) => {
  const [selectedBatteryType, setSelectedBatteryType] = useState<'Tubular' | 'Lithium'>('Lithium');
  
  const handleBatteryTypeChange = (type: 'Tubular' | 'Lithium') => {
    setSelectedBatteryType(type);
  };

  return (
    <div className="space-y-6">
      <button 
        onClick={onBack}
        className="flex items-center text-green-600 hover:text-green-700 transition-colors"
      >
        <ArrowLeftIcon className="h-4 w-4 mr-1" />
        Back to calculator
      </button>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            <span className="font-semibold">Note:</span> Our system sizing calculator currently supports systems up to 10kVA. We are working to expand our capacity for larger systems. For systems above 10kVA, please contact us directly for a custom quote.
          </p>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">System Sizing Results</h2>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 text-white">
            <h2 className="text-2xl font-bold mb-2">Your Solar-Powered System Recommendation</h2>
            <p className="opacity-90">
              Here's your complete solar-powered system design based on your requirements.
            </p>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Inverter Section */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-center mb-3">
                  <ZapIcon className="h-5 w-5 text-yellow-500 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-800">Inverter</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Inverter Size:</span>
                    <span className="font-medium">{results.inverterSize} KVA</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">System Voltage:</span>
                    <span className="font-medium">{results.systemVoltage}V</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Peak Load:</span>
                    <span className="font-medium">{results.peakLoad.toLocaleString()} W</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">With Safety Margin:</span>
                    <span className="font-medium">{results.adjustedPeakLoad.toLocaleString()} W</span>
                  </div>
                </div>
              </div>
              
              {/* Solar Panel Section */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-center mb-3">
                  <SunIcon className="h-5 w-5 text-yellow-500 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-800">Solar Panels</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Panel Type:</span>
                    <span className="font-medium">Jinko 550W</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Number of Panels:</span>
                    <span className="font-medium">{results.solarPanels.count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Capacity:</span>
                    <span className="font-medium">{results.solarPanels.totalWattage.toLocaleString()} W</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Daily Output:</span>
                    <span className="font-medium text-green-600">{results.solarPanels.dailyOutput.toFixed(2)} kWh/day</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* PV Input Warning */}
            {results.pvInputWarning && (
              <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
                <p className="text-sm font-medium">{results.pvInputWarning}</p>
                {results.recommendedInverterSizeForPV && (
                  <button
                    onClick={() => onRecalculateWithInverter(results.recommendedInverterSizeForPV!)}
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    Recalculate with {results.recommendedInverterSizeForPV} kVA Inverter
                  </button>
                )}
              </div>
            )}
            
            {/* Battery Section */}
            <div className="mt-6">
              <div className="flex items-center mb-3">
                <BatteryFullIcon className="h-5 w-5 text-yellow-500 mr-2" />
                <h3 className="text-lg font-semibold text-gray-800">Battery Options</h3>
              </div>
              
              <div className="flex space-x-4 mb-4">
                <button
                  onClick={() => handleBatteryTypeChange('Tubular')}
                  className={`px-4 py-2 rounded-md ${
                    selectedBatteryType === 'Tubular'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } transition-colors`}
                >
                  Tubular Battery
                </button>
                <button
                  onClick={() => handleBatteryTypeChange('Lithium')}
                  className={`px-4 py-2 rounded-md ${
                    selectedBatteryType === 'Lithium'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } transition-colors`}
                >
                  Lithium Battery
                </button>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                {selectedBatteryType === 'Tubular' ? (
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Battery Type:</span>
                      <span className="font-medium">{results.batteryOptions.tubular.modelName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Number of Batteries:</span>
                      <span className="font-medium">{results.batteryOptions.tubular.count}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Capacity:</span>
                      <span className="font-medium">
                        {(results.batteryOptions.tubular.totalCapacity / 1000).toFixed(1)} kWh
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Depth of Discharge:</span>
                      <span className="font-medium">50%</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Battery Type:</span>
                      <span className="font-medium">{results.batteryOptions.lithium.modelName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Number of Batteries:</span>
                      <span className="font-medium">{results.batteryOptions.lithium.count}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Capacity:</span>
                      <span className="font-medium">
                        {(results.batteryOptions.lithium.totalCapacity / 1000).toFixed(1)} kWh
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Depth of Discharge:</span>
                      <span className="font-medium">90%</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Total Price Section */}
            <div className="mt-6 bg-green-50 p-4 rounded-lg border border-green-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Estimated System Price Range</h3>
              
              <div className="text-2xl font-bold text-green-700 mb-2">
                {selectedBatteryType === 'Tubular'
                  ? `${formatCurrency(results.totalPrice.withTubular.range.lowerBound)} - ${formatCurrency(results.totalPrice.withTubular.range.upperBound)}`
                  : `${formatCurrency(results.totalPrice.withLithium.range.lowerBound)} - ${formatCurrency(results.totalPrice.withLithium.range.upperBound)}`}
              </div>
              
              <div className="mt-4 space-y-2">
                <p className="text-sm text-gray-600 font-medium">Price Disclaimer:</p>
                <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                  {results.priceDisclaimer.factors.map((factor, index) => (
                    <li key={index}>{factor}</li>
                  ))}
                </ul>
                <p className="text-sm text-gray-600 italic mt-2">
                  *Prices shown are supplier prices for core components only. Additional costs include:
                </p>
                <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                  <li>Installation and labor charges</li>
                  <li>Additional components (cables, breakers, etc.)</li>
                  <li>Transportation and logistics</li>
                  <li>Local permits and regulations</li>
                </ul>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
              <div className="w-full">
                <PremiumDownloadButton 
                  results={results}
                  backupHours={backupHours}
                  selectedState={selectedState}
                />
              </div>
              
              <a
                href="https://wa.me/2349066730744?text=Hello,%20I%20just%20sized%20a%20solar%20system%20on%20SolarMate%20Pro.%20I'd%20like%20to%20discuss%20further."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
              >
                <Share2Icon className="h-5 w-5 mr-2" />
                Contact Us on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Development Note */}
      <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <p className="text-sm text-yellow-800">
          <span className="font-semibold">Development Note:</span> We are continuously working to enhance our solar system design tool. Future updates will include more advanced calculations, such as incorporating additional charge controllers for larger solar arrays, detailed wiring diagrams, and more nuanced financial analysis.
        </p>
      </div>
    </div>
  );
};

export default SystemResults;