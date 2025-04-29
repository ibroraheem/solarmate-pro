import React from 'react';
import { SelectedAppliance, State } from '../types';
import { ArrowRightIcon } from 'lucide-react';

interface SummaryCardProps {
  selectedAppliances: SelectedAppliance[];
  backupHours: number;
  selectedState: State | null;
  onContinue: () => void;
}

const SummaryCard: React.FC<SummaryCardProps> = ({
  selectedAppliances,
  backupHours,
  selectedState,
  onContinue,
}) => {
  const activeAppliances = selectedAppliances.filter(a => a.quantity > 0);
  const totalApplianceCount = activeAppliances.reduce((sum, a) => sum + a.quantity, 0);
  
  const totalDailyEnergy = activeAppliances.reduce(
    (total, appliance) => total + (appliance.wattage * appliance.quantity * appliance.hoursPerDay),
    0
  );

  const isValid = activeAppliances.length > 0 && selectedState;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Summary</h2>
      
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <div className="mb-2 md:mb-0">
            <span className="font-medium text-gray-700">Selected Appliances:</span>{' '}
            <span className="text-gray-900">{activeAppliances.length} types ({totalApplianceCount} units)</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Total Daily Energy:</span>{' '}
            <span className="text-gray-900">{totalDailyEnergy.toLocaleString()} Wh/day</span>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <div className="mb-2 md:mb-0">
            <span className="font-medium text-gray-700">Backup Time:</span>{' '}
            <span className="text-gray-900">{backupHours} hours</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Location:</span>{' '}
            <span className="text-gray-900">
              {selectedState ? selectedState.name : 'Not selected'}
              {selectedState && <span className="text-sm text-gray-500"> (PSH: {selectedState.psh})</span>}
            </span>
          </div>
        </div>
      </div>
      
      <div className="mt-6 flex justify-end">
        <button
          onClick={onContinue}
          disabled={!isValid}
          className={`
            flex items-center px-6 py-3 rounded-lg font-medium text-white 
            ${isValid 
              ? 'bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2' 
              : 'bg-gray-400 cursor-not-allowed'}
            transition-colors shadow-sm
          `}
        >
          Calculate System
          <ArrowRightIcon className="ml-2 h-5 w-5" />
        </button>
      </div>
      
      {!isValid && (
        <div className="mt-4 p-3 bg-yellow-50 text-yellow-800 rounded-md">
          {!activeAppliances.length && <p>Please select at least one appliance.</p>}
          {!selectedState && <p>Please select your state for accurate solar sizing.</p>}
        </div>
      )}
    </div>
  );
};

export default SummaryCard;