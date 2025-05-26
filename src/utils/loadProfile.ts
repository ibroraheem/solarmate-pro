import { ApplianceUsage, LoadProfile, TimeSlot } from '../types';

const DAYTIME_START = 6; // 6 AM
const DAYTIME_END = 18;  // 6 PM

export function calculateLoadProfile(appliances: ApplianceUsage[]): LoadProfile {
  const hourlyLoad = new Array(24).fill(0);
  let daytimeLoad = 0;
  let nighttimeLoad = 0;
  let peakDaytimeLoad = 0;
  let peakNighttimeLoad = 0;

  appliances.forEach(appliance => {
    appliance.timeSlots.forEach(slot => {
      const startHour = parseInt(slot.start.split(':')[0]);
      const endHour = parseInt(slot.end.split(':')[0]);
      
      // Handle overnight slots
      const hoursToProcess = endHour < startHour ? 
        (24 - startHour + endHour) : 
        (endHour - startHour);
      
      for (let i = 0; i < hoursToProcess; i++) {
        const currentHour = (startHour + i) % 24;
        const load = appliance.quantity * appliance.wattage;
        hourlyLoad[currentHour] += load;
        
        // Update daytime/nighttime loads
        if (currentHour >= DAYTIME_START && currentHour < DAYTIME_END) {
          daytimeLoad += load;
          peakDaytimeLoad = Math.max(peakDaytimeLoad, load);
        } else {
          nighttimeLoad += load;
          peakNighttimeLoad = Math.max(peakNighttimeLoad, load);
        }
      }
    });
  });

  // Calculate averages
  const daytimeHours = DAYTIME_END - DAYTIME_START;
  const nighttimeHours = 24 - daytimeHours;
  const averageDaytimeLoad = daytimeLoad / daytimeHours;
  const averageNighttimeLoad = nighttimeLoad / nighttimeHours;

  return {
    hourlyLoad,
    daytimeLoad,
    nighttimeLoad,
    peakDaytimeLoad,
    peakNighttimeLoad,
    averageDaytimeLoad,
    averageNighttimeLoad
  };
}

export const createTimeSlot = (start: string, end: string): TimeSlot => {
  const startHour = parseInt(start.split(':')[0]);
  const endHour = parseInt(end.split(':')[0]);
  
  return {
    start,
    end,
    isDaytime: startHour >= DAYTIME_START && endHour < DAYTIME_END
  };
};

export const getTimeBlock = (hour: number): string => {
  if (hour >= 0 && hour < 6) return 'Night';
  if (hour >= 6 && hour < 12) return 'Morning';
  if (hour >= 12 && hour < 18) return 'Afternoon';
  return 'Evening';
};

export const validateTimeSlot = (slot: TimeSlot): boolean => {
  const startHour = parseInt(slot.start.split(':')[0]);
  const startMinute = parseInt(slot.start.split(':')[1]);
  const endHour = parseInt(slot.end.split(':')[0]);
  const endMinute = parseInt(slot.end.split(':')[1]);

  if (isNaN(startHour) || isNaN(startMinute) || isNaN(endHour) || isNaN(endMinute)) {
    return false;
  }

  if (startHour < 0 || startHour > 23 || endHour < 0 || endHour > 23) {
    return false;
  }

  if (startMinute < 0 || startMinute > 59 || endMinute < 0 || endMinute > 59) {
    return false;
  }

  const startTime = startHour * 60 + startMinute;
  const endTime = endHour * 60 + endMinute;

  return startTime < endTime;
};

export const formatTimeSlot = (slot: TimeSlot): string => {
  return `${slot.start} - ${slot.end}`;
};

export function getCriticalLoad(appliances: ApplianceUsage[]): number {
  return appliances
    .filter(app => app.isCritical)
    .reduce((total, app) => total + (app.quantity * app.wattage), 0);
}

export function calculateBatteryRequirements(
  loadProfile: LoadProfile,
  systemPreferences: {
    batteryType: 'Lithium' | 'Tubular';
    autonomyDays: number;
    systemVoltage: number;
  }
): {
  requiredCapacityWh: number;
  requiredCapacityAh: number;
  recommendedBatteryCount: number;
} {
  const { batteryType, autonomyDays, systemVoltage } = systemPreferences;
  
  // Set depth of discharge based on battery type
  const depthOfDischarge = batteryType === 'Lithium' ? 0.9 : 0.5;
  
  // Calculate required battery capacity
  const requiredCapacityWh = (loadProfile.nighttimeLoad * autonomyDays) / depthOfDischarge;
  const requiredCapacityAh = requiredCapacityWh / systemVoltage;
  
  // For now, we'll use a simple recommendation for battery count
  // This should be enhanced with actual battery specifications
  const recommendedBatteryCount = Math.ceil(requiredCapacityAh / 100); // Assuming 100Ah batteries
  
  return {
    requiredCapacityWh,
    requiredCapacityAh,
    recommendedBatteryCount
  };
} 