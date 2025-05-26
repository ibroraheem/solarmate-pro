import React from 'react';
import { LoadProfile } from '../types';

interface LoadProfileChartProps {
  loadProfile: LoadProfile;
}

export const LoadProfileChart: React.FC<LoadProfileChartProps> = ({
  loadProfile
}) => {
  const { hourlyLoad, daytimeLoad, nighttimeLoad, peakDaytimeLoad, peakNighttimeLoad } = loadProfile;

  // Calculate max load for scaling
  const maxLoad = Math.max(...hourlyLoad);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Load Profile
      </h2>

      {/* Hourly Load Chart */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Hourly Load Distribution
        </h3>
        <div className="h-64 flex items-end space-x-1">
          {hourlyLoad.map((load, hour) => (
            <div
              key={hour}
              className="flex-1 bg-blue-500 hover:bg-blue-600 transition-colors"
              style={{
                height: `${(load / maxLoad) * 100}%`,
                minHeight: '2px'
              }}
              title={`${hour}:00 - ${load.toFixed(0)}W`}
            />
          ))}
        </div>
        <div className="flex justify-between text-sm text-gray-500 mt-2">
          <span>00:00</span>
          <span>12:00</span>
          <span>23:00</span>
        </div>
      </div>

      {/* Load Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">
            Daytime Load
          </h4>
          <div className="space-y-2">
            <p className="text-2xl font-bold text-blue-600">
              {daytimeLoad.toFixed(0)}W
            </p>
            <p className="text-sm text-gray-600">
              Peak: {peakDaytimeLoad.toFixed(0)}W
            </p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">
            Nighttime Load
          </h4>
          <div className="space-y-2">
            <p className="text-2xl font-bold text-blue-600">
              {nighttimeLoad.toFixed(0)}W
            </p>
            <p className="text-sm text-gray-600">
              Peak: {peakNighttimeLoad.toFixed(0)}W
            </p>
          </div>
        </div>
      </div>

      {/* Load Distribution */}
      <div className="mt-6">
        <h4 className="text-sm font-medium text-gray-900 mb-2">
          Load Distribution
        </h4>
        <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500"
            style={{
              width: `${(daytimeLoad / (daytimeLoad + nighttimeLoad)) * 100}%`
            }}
          />
        </div>
        <div className="flex justify-between text-sm text-gray-600 mt-2">
          <span>Daytime: {((daytimeLoad / (daytimeLoad + nighttimeLoad)) * 100).toFixed(0)}%</span>
          <span>Nighttime: {((nighttimeLoad / (daytimeLoad + nighttimeLoad)) * 100).toFixed(0)}%</span>
        </div>
      </div>
    </div>
  );
}; 