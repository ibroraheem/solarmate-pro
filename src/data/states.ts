export interface StateData {
  name: string;
  psh: number;
  pvout: number;
}

export const states: StateData[] = [
  { name: 'Abia', psh: 4.0, pvout: 3.8 },
  { name: 'Adamawa', psh: 5.5, pvout: 4.8 },
  { name: 'Akwa Ibom', psh: 4.0, pvout: 3.7 },
  { name: 'Anambra', psh: 4.2, pvout: 4.0 },
  { name: 'Bauchi', psh: 5.5, pvout: 4.9 },
  { name: 'Bayelsa', psh: 4.0, pvout: 3.6 },
  { name: 'Benue', psh: 4.5, pvout: 4.3 },
  { name: 'Borno', psh: 5.5, pvout: 5.0 },
  { name: 'Cross River', psh: 4.0, pvout: 3.7 },
  { name: 'Delta', psh: 4.0, pvout: 3.8 },
  { name: 'Ebonyi', psh: 4.2, pvout: 4.0 },
  { name: 'Edo', psh: 4.2, pvout: 4.1 },
  { name: 'Ekiti', psh: 4.0, pvout: 3.9 },
  { name: 'Enugu', psh: 4.2, pvout: 4.0 },
  { name: 'Gombe', psh: 5.5, pvout: 4.8 },
  { name: 'Imo', psh: 4.0, pvout: 3.9 },
  { name: 'Jigawa', psh: 5.5, pvout: 5.0 },
  { name: 'Kaduna', psh: 5.0, pvout: 4.7 },
  { name: 'Kano', psh: 5.5, pvout: 5.0 },
  { name: 'Katsina', psh: 5.5, pvout: 5.0 },
  { name: 'Kebbi', psh: 5.0, pvout: 4.8 },
  { name: 'Kogi', psh: 4.5, pvout: 4.2 },
  { name: 'Kwara', psh: 4.5, pvout: 4.3 },
  { name: 'Lagos', psh: 4.0, pvout: 3.9 },
  { name: 'Nasarawa', psh: 4.5, pvout: 4.4 },
  { name: 'Niger', psh: 4.5, pvout: 4.5 },
  { name: 'Ogun', psh: 4.0, pvout: 3.9 },
  { name: 'Ondo', psh: 4.0, pvout: 3.9 },
  { name: 'Osun', psh: 4.0, pvout: 3.9 },
  { name: 'Oyo', psh: 4.0, pvout: 4.0 },
  { name: 'Plateau', psh: 4.5, pvout: 4.5 },
  { name: 'Rivers', psh: 4.0, pvout: 3.7 },
  { name: 'Sokoto', psh: 5.5, pvout: 5.0 },
  { name: 'Taraba', psh: 5.0, pvout: 4.6 },
  { name: 'Yobe', psh: 5.5, pvout: 5.0 },
  { name: 'Zamfara', psh: 5.5, pvout: 5.0 },
  { name: 'Federal Capital Territory (FCT)', psh: 4.5, pvout: 4.4 }
];

export const DEFAULT_PSH = 5.0;