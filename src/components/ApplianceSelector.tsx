import React, { useState } from 'react';
import { Appliance, ApplianceUsage, TimeSlot } from '../types';
import { MinusCircleIcon, PlusCircleIcon, PlusIcon } from 'lucide-react';
import { TimeSlotInput } from './TimeSlotInput';

interface ApplianceSelectorProps {
  appliances: Appliance[];
  selectedAppliances: ApplianceUsage[];
  onApplianceChange: (appliance: ApplianceUsage) => void;
}

export default function ApplianceSelector({
  appliances,
  selectedAppliances,
  onApplianceChange
}: ApplianceSelectorProps) {
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customAppliance, setCustomAppliance] = useState({
    name: '',
    wattage: '',
    quantity: '1',
    hoursPerDay: '4'
  });

  // Set default time slots based on hours per day
  const getDefaultTimeSlots = (hoursPerDay: number): TimeSlot[] => {
    if (hoursPerDay <= 0) return [];
    
    // Default to daytime usage (8 AM to 8 PM)
    const startHour = 8;
    const endHour = Math.min(20, startHour + hoursPerDay);
    
    return [{
      start: `${startHour}:00`,
      end: `${endHour}:00`,
      isDaytime: true
    }];
  };

  // Combine default appliances with selected custom appliances for display
  const allAppliancesToDisplay = [
    ...appliances,
    ...selectedAppliances.filter(app => app.id.startsWith('custom-') && !appliances.some(defaultApp => defaultApp.id === app.id))
  ];

  // Check if an appliance is selected
  const isSelected = (applianceId: string): boolean => {
    return selectedAppliances.some(
      (selected) => selected.id === applianceId && selected.quantity > 0
    );
  };

  // Get selected appliance by ID
  const getSelectedAppliance = (applianceId: string): ApplianceUsage | undefined => {
    return selectedAppliances.find((selected) => selected.id === applianceId);
  };

  // Handle quantity change
  const handleQuantityChange = (appliance: ApplianceUsage, quantity: number) => {
    const updatedAppliance = {
      ...appliance,
      quantity,
      timeSlots: quantity > 0 ? appliance.timeSlots : []
    };
    onApplianceChange(updatedAppliance);
  };

  // Handle hours change
  const handleHoursChange = (appliance: ApplianceUsage, hours: number) => {
    const updatedAppliance = {
      ...appliance,
      hoursPerDay: hours,
      timeSlots: hours > 0 ? getDefaultTimeSlots(hours) : []
    };
    onApplianceChange(updatedAppliance);
  };

  // Handle time slots change
  const handleTimeSlotsChange = (appliance: ApplianceUsage, timeSlots: TimeSlot[]) => {
    onApplianceChange({
      ...appliance,
      timeSlots
    });
  };

  // Handle critical change
  const handleCriticalChange = (appliance: ApplianceUsage, isCritical: boolean) => {
    onApplianceChange({
      ...appliance,
      isCritical
    });
  };

  // Handle appliance selection
  const handleApplianceSelect = (appliance: Appliance) => {
    const existingAppliance = getSelectedAppliance(appliance.id);
    if (existingAppliance) {
      // If already selected, increment quantity
      handleQuantityChange(existingAppliance, existingAppliance.quantity + 1);
    } else {
      // If not selected, create new with default values
      const newAppliance: ApplianceUsage = {
        ...appliance,
        power: appliance.wattage,
        quantity: appliance.defaultQuantity,
        hoursPerDay: appliance.defaultHours,
        timeSlots: getDefaultTimeSlots(appliance.defaultHours),
        isCritical: false
      };
      onApplianceChange(newAppliance);
    }
  };

  // Handle custom appliance submission
  const handleCustomApplianceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const hoursPerDay = parseInt(customAppliance.hoursPerDay);
    const wattage = parseInt(customAppliance.wattage);
    const newAppliance: ApplianceUsage = {
      id: `custom-${Date.now()}`,
      name: customAppliance.name,
      power: wattage,
      wattage: wattage,
      defaultQuantity: parseInt(customAppliance.quantity),
      defaultHours: hoursPerDay,
      quantity: parseInt(customAppliance.quantity),
      hoursPerDay: hoursPerDay,
      timeSlots: getDefaultTimeSlots(hoursPerDay),
      isCritical: false
    };

    onApplianceChange(newAppliance);
    setCustomAppliance({
      name: '',
      wattage: '',
      quantity: '1',
      hoursPerDay: '4'
    });
    setShowCustomForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Appliance Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {allAppliancesToDisplay.map((appliance) => (
          <div
            key={appliance.id}
            className={`p-4 rounded-lg border cursor-pointer transition-colors ${
              isSelected(appliance.id)
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300'
            }`}
            onClick={() => handleApplianceSelect(appliance)}
          >
            <h3 className="text-lg font-medium text-gray-900">
              {appliance.name}
            </h3>
            <p className="text-sm text-gray-500">
              {appliance.power || appliance.wattage}W per unit
            </p>
          </div>
        ))}
      </div>

      {/* Selected Appliances */}
      {selectedAppliances.filter(a => a.quantity > 0).map((appliance) => (
        <div key={appliance.id} className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                {appliance.name}
              </h3>
              <p className="text-sm text-gray-500">
                {appliance.power || appliance.wattage}W per unit
              </p>
            </div>
            <div className="flex items-center">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={appliance.isCritical}
                  onChange={(e) => handleCriticalChange(appliance, e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Critical Load</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleQuantityChange(appliance, Math.max(0, appliance.quantity - 1))}
                  className="p-1 text-gray-500 hover:text-gray-700"
                >
                  <MinusCircleIcon className="h-5 w-5" />
                </button>
                <input
                  type="number"
                  min="0"
                  value={appliance.quantity}
                  onChange={(e) => handleQuantityChange(appliance, parseInt(e.target.value))}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <button
                  onClick={() => handleQuantityChange(appliance, appliance.quantity + 1)}
                  className="p-1 text-gray-500 hover:text-gray-700"
                >
                  <PlusCircleIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hours per Day
              </label>
              <input
                type="number"
                min="0"
                max="24"
                value={appliance.hoursPerDay}
                onChange={(e) => handleHoursChange(appliance, parseInt(e.target.value))}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Usage Time Slots
            </label>
            <TimeSlotInput
              value={appliance.timeSlots}
              onChange={(slots) => handleTimeSlotsChange(appliance, slots)}
            />
          </div>
        </div>
      ))}

      {/* Custom Appliance Form */}
      <div className="mt-6 border-t pt-6">
        {!showCustomForm ? (
          <button
            onClick={() => setShowCustomForm(true)}
            className="flex items-center text-green-600 hover:text-green-700 transition-colors"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Custom Appliance
          </button>
        ) : (
          <form onSubmit={handleCustomApplianceSubmit} className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800">Add Custom Appliance</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="custom-name" className="block text-sm font-medium text-gray-700">
                  Appliance Name
                </label>
                <input
                  type="text"
                  id="custom-name"
                  value={customAppliance.name}
                  onChange={(e) => setCustomAppliance(prev => ({ ...prev, name: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="custom-wattage" className="block text-sm font-medium text-gray-700">
                  Wattage (W)
                </label>
                <input
                  type="number"
                  id="custom-wattage"
                  value={customAppliance.wattage}
                  onChange={(e) => setCustomAppliance(prev => ({ ...prev, wattage: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  min="1"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="custom-quantity" className="block text-sm font-medium text-gray-700">
                  Quantity
                </label>
                <input
                  type="number"
                  id="custom-quantity"
                  value={customAppliance.quantity}
                  onChange={(e) => setCustomAppliance(prev => ({ ...prev, quantity: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  min="1"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="custom-hours" className="block text-sm font-medium text-gray-700">
                  Hours per Day
                </label>
                <input
                  type="number"
                  id="custom-hours"
                  value={customAppliance.hoursPerDay}
                  onChange={(e) => setCustomAppliance(prev => ({ ...prev, hoursPerDay: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  min="1"
                  max="24"
                  required
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowCustomForm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Add Appliance
              </button>
            </div>
          </form>
        )}
      </div>

      {selectedAppliances.filter(a => a.quantity > 0).length === 0 && (
        <div className="mt-4 p-3 bg-yellow-50 text-yellow-800 rounded-md">
          <p>Please select at least one appliance to continue.</p>
        </div>
      )}
    </div>
  );
}