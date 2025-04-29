import React from 'react';
import { Appliance, SelectedAppliance } from '../types';
import { MinusCircleIcon, PlusCircleIcon } from 'lucide-react';

interface ApplianceSelectorProps {
  appliances: Appliance[];
  selectedAppliances: SelectedAppliance[];
  onApplianceChange: (updatedAppliance: SelectedAppliance) => void;
}

const ApplianceSelector: React.FC<ApplianceSelectorProps> = ({
  appliances,
  selectedAppliances,
  onApplianceChange,
}) => {
  // Check if an appliance is selected
  const isSelected = (applianceId: string): boolean => {
    return selectedAppliances.some(
      (selected) => selected.id === applianceId && selected.quantity > 0
    );
  };

  // Get selected appliance by ID
  const getSelectedAppliance = (applianceId: string): SelectedAppliance | undefined => {
    return selectedAppliances.find((selected) => selected.id === applianceId);
  };

  // Handle quantity change
  const handleQuantityChange = (appliance: Appliance, newQuantity: number) => {
    const selected = getSelectedAppliance(appliance.id);
    
    // Ensure newQuantity is not negative
    const validQuantity = Math.max(0, newQuantity);
    
    if (selected) {
      onApplianceChange({
        ...selected,
        quantity: validQuantity,
      });
    } else {
      onApplianceChange({
        ...appliance,
        quantity: validQuantity,
        hoursPerDay: appliance.defaultHours,
      });
    }
  };

  // Handle hours change
  const handleHoursChange = (applianceId: string, hours: number) => {
    const selected = getSelectedAppliance(applianceId);
    
    // Ensure hours is between 1 and 24
    const validHours = Math.min(24, Math.max(1, hours));
    
    if (selected) {
      onApplianceChange({
        ...selected,
        hoursPerDay: validHours,
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Select Your Appliances
      </h2>
      <div className="overflow-hidden overflow-y-auto max-h-[60vh]">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Appliance</th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Wattage</th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Quantity</th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Hours/Day</th>
              <th className="py-3 px-4 text-right text-sm font-medium text-gray-600">Daily Energy</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {appliances.map((appliance) => {
              const selected = getSelectedAppliance(appliance.id);
              const quantity = selected ? selected.quantity : 0;
              const hours = selected ? selected.hoursPerDay : appliance.defaultHours;
              const isActive = quantity > 0;
              const dailyEnergy = appliance.wattage * quantity * hours;

              return (
                <tr 
                  key={appliance.id}
                  className={`hover:bg-gray-50 transition-colors ${
                    isActive ? 'bg-green-50' : ''
                  }`}
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <span className={`${isActive ? 'font-medium text-gray-900' : 'text-gray-600'}`}>
                        {appliance.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-gray-700">{appliance.wattage}W</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleQuantityChange(appliance, quantity - 1)}
                        className="text-gray-500 hover:text-red-500 focus:outline-none transition-colors"
                        disabled={quantity === 0}
                      >
                        <MinusCircleIcon className="h-5 w-5" />
                      </button>
                      <span className="w-6 text-center font-medium">{quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(appliance, quantity + 1)}
                        className="text-gray-500 hover:text-green-500 focus:outline-none transition-colors"
                      >
                        <PlusCircleIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    {isActive ? (
                      <input
                        type="number"
                        min="1"
                        max="24"
                        value={hours}
                        onChange={(e) =>
                          handleHoursChange(appliance.id, parseInt(e.target.value) || 1)
                        }
                        className="w-16 p-1 border rounded text-center"
                      />
                    ) : (
                      <span className="text-gray-400">{appliance.defaultHours}</span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-right">
                    {isActive ? (
                      <span className="font-medium">
                        {dailyEnergy.toLocaleString()} Wh
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {selectedAppliances.filter(a => a.quantity > 0).length === 0 && (
        <div className="mt-4 p-3 bg-yellow-50 text-yellow-800 rounded-md">
          <p>Please select at least one appliance to continue.</p>
        </div>
      )}
    </div>
  );
};

export default ApplianceSelector;