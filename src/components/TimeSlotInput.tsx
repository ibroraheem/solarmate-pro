import React, { useState } from 'react';
import { TimeSlot } from '../types';
import { createTimeSlot, getTimeBlock } from '../utils/loadProfile';

interface TimeSlotInputProps {
  value: TimeSlot[];
  onChange: (slots: TimeSlot[]) => void;
  disabled?: boolean;
}

export const TimeSlotInput: React.FC<TimeSlotInputProps> = ({
  value,
  onChange,
  disabled = false
}) => {
  const [newStart, setNewStart] = useState('08:00');
  const [newEnd, setNewEnd] = useState('17:00');

  const addTimeSlot = () => {
    const newSlot = createTimeSlot(newStart, newEnd);
    onChange([...value, newSlot]);
  };

  const removeTimeSlot = (index: number) => {
    const newSlots = value.filter((_, i) => i !== index);
    onChange(newSlots);
  };

  const formatTimeSlot = (slot: TimeSlot) => {
    const startHour = parseInt(slot.start.split(':')[0]);
    const timeBlock = getTimeBlock(startHour);
    return `${slot.start} - ${slot.end} (${timeBlock}, ${slot.isDaytime ? 'Daytime' : 'Nighttime'})`;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {value.map((slot, index) => (
          <div
            key={index}
            className={`flex items-center gap-2 px-3 py-1 rounded-full ${
              slot.isDaytime ? 'bg-blue-100' : 'bg-gray-100'
            }`}
          >
            <span>{formatTimeSlot(slot)}</span>
            {!disabled && (
              <button
                onClick={() => removeTimeSlot(index)}
                className="text-red-500 hover:text-red-700"
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>

      {!disabled && (
        <div className="flex items-center gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Start Time</label>
            <input
              type="time"
              value={newStart}
              onChange={(e) => setNewStart(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">End Time</label>
            <input
              type="time"
              value={newEnd}
              onChange={(e) => setNewEnd(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={addTimeSlot}
            className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Add Time Slot
          </button>
        </div>
      )}
    </div>
  );
}; 