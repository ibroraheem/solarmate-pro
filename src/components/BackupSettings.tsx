import React from 'react';
import { State } from '../types';

interface BackupSettingsProps {
  backupHours: number;
  onBackupHoursChange: (hours: number) => void;
  selectedState: State | null;
  onStateChange: (state: State | null) => void;
  states: State[];
}

const BackupSettings: React.FC<BackupSettingsProps> = ({
  backupHours,
  onBackupHoursChange,
  selectedState,
  onStateChange,
  states,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-4">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Backup Settings</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="backup-hours" className="block mb-2 text-sm font-medium text-gray-700">
            Backup Hours Required (4-12)
          </label>
          <div className="flex items-center">
            <input
              id="backup-hours"
              type="range"
              min="4"
              max="12"
              step="1"
              value={backupHours}
              onChange={(e) => onBackupHoursChange(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <span className="ml-4 w-10 text-center font-medium text-gray-700">
              {backupHours}
            </span>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>4 hrs</span>
            <span>8 hrs</span>
            <span>12 hrs</span>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            How many hours of power backup do you need during power outages?
          </p>
        </div>
        
        <div>
          <label htmlFor="state" className="block mb-2 text-sm font-medium text-gray-700">
            Your State (for solar sizing)
          </label>
          <select
            id="state"
            value={selectedState ? selectedState.name : ''}
            onChange={(e) => {
              const selected = states.find(state => state.name === e.target.value);
              onStateChange(selected || null);
            }}
            className="w-full p-2.5 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="">--Select your state--</option>
            {states.map((state) => (
              <option key={state.name} value={state.name}>
                {state.name} (PSH: {state.psh})
              </option>
            ))}
          </select>
          <p className="mt-2 text-sm text-gray-600">
            Your location determines solar panel count based on Peak Sun Hours (PSH).
          </p>
        </div>
      </div>
    </div>
  );
};

export default BackupSettings;