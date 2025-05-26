import React from 'react';
import { SystemPreferences as SystemPreferencesType, ElectricityBand } from '../types';
import { states } from '../data/states';

interface SystemPreferencesProps {
  preferences: SystemPreferencesType;
  onPreferencesChange: (preferences: SystemPreferencesType) => void;
  onNext: () => void;
  onBack: () => void;
}

const SystemPreferences: React.FC<SystemPreferencesProps> = ({
  preferences,
  onPreferencesChange,
  onNext,
  onBack,
}) => {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">System Preferences</h2>
      
      <div className="space-y-6">
        {/* State Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Location
          </label>
          <select
            value={preferences.state}
            onChange={(e) => onPreferencesChange({ ...preferences, state: e.target.value })}
            className="w-full p-2 border rounded-lg"
          >
            {states.map((state) => (
              <option key={state.name} value={state.name}>
                {state.name}
              </option>
            ))}
          </select>
          <p className="mt-1 text-sm text-gray-500">
            Select your state to calculate solar potential
          </p>
        </div>

        {/* Electricity Band */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Electricity Band
          </label>
          <select
            value={preferences.electricityBand}
            onChange={(e) => onPreferencesChange({ ...preferences, electricityBand: e.target.value as ElectricityBand })}
            className="w-full p-2 border rounded-lg"
          >
            <option value="A">Band A (20 hours daily)</option>
            <option value="B">Band B (16 hours daily)</option>
            <option value="C">Band C (12 hours daily)</option>
            <option value="D">Band D (8 hours daily)</option>
            <option value="E">Band E (4 hours daily)</option>
            <option value="Off-grid">Off-grid (0 hours daily)</option>
          </select>
          <p className="mt-1 text-sm text-gray-500">
            Select your electricity band based on daily grid availability
          </p>
        </div>

        {/* Battery Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Battery Type
          </label>
          <select
            value={preferences.batteryType}
            onChange={(e) => onPreferencesChange({ ...preferences, batteryType: e.target.value as 'Lithium' | 'Tubular' })}
            className="w-full p-2 border rounded-lg"
          >
            <option value="Lithium">Lithium (Longer Life, Higher Cost)</option>
            <option value="Tubular">Tubular (Lower Cost, Shorter Life)</option>
          </select>
          <p className="mt-1 text-sm text-gray-500">
            Choose between lithium (longer life) or tubular (lower cost) batteries
          </p>
        </div>

        {/* Backup Hours */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Desired Backup Hours
          </label>
          <select
            value={preferences.backupHours}
            onChange={(e) => onPreferencesChange({ ...preferences, backupHours: Number(e.target.value) })}
            className="w-full p-2 border rounded-lg"
          >
            <option value={2}>2 hours (Basic Backup)</option>
            <option value={4}>4 hours (Standard Backup)</option>
            <option value={6}>6 hours (Extended Backup)</option>
            <option value={8}>8 hours (Full Day Backup)</option>
          </select>
          <p className="mt-1 text-sm text-gray-500">
            How many hours of backup power do you need when grid is down?
          </p>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Back
        </button>
        <button
          onClick={onNext}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Calculate System
        </button>
      </div>
    </div>
  );
};

export default SystemPreferences; 