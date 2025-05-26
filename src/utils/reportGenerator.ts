import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { SystemResults } from '../types';
import { calculateSystemComponents } from './systemComponents';

interface CustomerInfo {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  installationAddress: string;
  state: string;
}

// Nigerian market standard components
const NIGERIAN_COMPONENTS = {
  breakers: {
    ac: [6, 10, 16, 20, 25, 32, 40, 50, 63, 80, 100, 125, 160, 200, 250, 400, 630],
    dc: [10, 16, 20, 25, 32, 40, 50, 63, 80, 100, 125, 160, 200, 250, 400, 630]
  },
  avr: [1, 2, 3, 5, 7.5, 10, 15, 20, 25, 30, 40, 50, 60, 75, 100],
  changeover: [32, 63, 100, 125, 160, 200, 250, 400, 630],
  cables: [
    { size: 1.5, current: 13 },
    { size: 2.5, current: 17.5 },
    { size: 4, current: 24 },
    { size: 6, current: 32 },
    { size: 10, current: 45 },
    { size: 16, current: 60 },
    { size: 25, current: 80 },
    { size: 35, current: 100 },
    { size: 50, current: 125 },
    { size: 70, current: 160 },
    { size: 95, current: 200 },
    { size: 120, current: 240 },
    { size: 150, current: 280 },
    { size: 185, current: 320 },
    { size: 240, current: 380 }
  ]
};

const findNearestComponent = (value: number, components: number[]): number => {
  return components.reduce((prev, curr) => 
    Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev
  );
};

const findNearestCable = (current: number): number => {
  return NIGERIAN_COMPONENTS.cables.reduce((prev, curr) => 
    Math.abs(curr.current - current) < Math.abs(prev.current - current) ? curr : prev
  ).size;
};

const calculatePanelStringing = (panelCount: number, panelVoltage: number, systemVoltage: number) => {
  const maxPanelsPerString = Math.floor(systemVoltage / panelVoltage);
  const minStrings = Math.ceil(panelCount / maxPanelsPerString);
  const optimalStrings = Math.ceil(panelCount / Math.floor(panelCount / minStrings));
  
  return {
    strings: optimalStrings,
    panelsPerString: Math.ceil(panelCount / optimalStrings),
    totalPanels: panelCount
  };
};

export const generatePDFReport = async (
  results: SystemResults,
  customerInfo: CustomerInfo
): Promise<Blob> => {
  try {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    // Add footer function
    const addFooter = () => {
      const footerY = pageHeight - 10;
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text('Contact: https://wa.me/2349066730744 | X: @ibroraheem', pageWidth/2, footerY, { align: 'center' });
    };

    // Title Page
    doc.setFillColor(41, 128, 185);
    doc.rect(0, 0, pageWidth, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text('Solar System Design Report', pageWidth/2, 25, { align: 'center' });
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.text('Professional Solar System Analysis', pageWidth/2, 60, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text(`Location: ${customerInfo.state}`, pageWidth/2, 80, { align: 'center' });
    doc.text(`Date: ${new Date().toLocaleDateString()}`, pageWidth/2, 90, { align: 'center' });
    
    doc.setFontSize(10);
    doc.text('Designed by: Ibrahim Raheem', pageWidth/2, 110, { align: 'center' });
    doc.text('Solar System Engineer', pageWidth/2, 115, { align: 'center' });
    doc.text('Generated using SolarMate Professional', pageWidth/2, 125, { align: 'center' });
    
    addFooter();
    
    // System Overview Page
    doc.addPage();
    doc.setFillColor(41, 128, 185);
    doc.rect(0, 0, pageWidth, 20, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.text('System Overview', 20, 15);
    
    // System specifications
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.text('System Specifications:', 20, 35);
    
    autoTable(doc, {
      startY: 45,
      head: [['Parameter', 'Value']],
      body: [
        ['Peak Load', `${(results.peakLoad / 1000).toFixed(1)}kW`],
        ['Daily Consumption', `${(results.dailyConsumption / 1000).toFixed(1)}kWh`],
        ['Backup Hours', `${results.backupHours} hours`],
        ['System Voltage', `${results.batteries.voltage}V`],
        ['System Phase', 'Single Phase']
      ],
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185] }
    });
    
    // Add Load Profile Chart
    doc.setFontSize(14);
    doc.text('Daily Load Profile', 20, 100);
    doc.setFontSize(10);
    doc.text('Power Consumption Throughout the Day', 20, 110);
    
    // Create a simple line chart for load profile
    const loadProfileData = [
      { hour: '6AM', load: 0.3, solar: 0.1 },
      { hour: '9AM', load: 0.6, solar: 0.7 },
      { hour: '12PM', load: 0.9, solar: 1.0 },
      { hour: '3PM', load: 0.8, solar: 0.7 },
      { hour: '6PM', load: 0.5, solar: 0.2 },
      { hour: '9PM', load: 0.3, solar: 0 },
      { hour: '12AM', load: 0.2, solar: 0 },
      { hour: '3AM', load: 0.1, solar: 0 }
    ];
    
    const chartWidth = 150;
    const chartHeight = 80;
    const chartX = 30;
    const chartY = 120;
    const maxValue = Math.max(...loadProfileData.map(d => Math.max(d.load, d.solar)));
    
    // Draw axes
    doc.line(chartX, chartY + chartHeight, chartX + chartWidth, chartY + chartHeight);
    doc.line(chartX, chartY, chartX, chartY + chartHeight);
    
    // Draw load profile line
    loadProfileData.forEach((data, index) => {
      const x = chartX + (index * (chartWidth / (loadProfileData.length - 1)));
      const y = chartY + chartHeight - (data.load * chartHeight / maxValue);
      
      if (index > 0) {
        const prevX = chartX + ((index - 1) * (chartWidth / (loadProfileData.length - 1)));
        const prevY = chartY + chartHeight - (loadProfileData[index - 1].load * chartHeight / maxValue);
        doc.line(prevX, prevY, x, y);
      }
      
      // Draw hour labels
      doc.text(data.hour, x - 5, chartY + chartHeight + 5);
    });
    
    // Add Energy Flow Chart
    doc.addPage();
    doc.setFillColor(41, 128, 185);
    doc.rect(0, 0, pageWidth, 20, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.text('Energy Flow Analysis', 20, 15);
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.text('Daily Energy Flow', 20, 35);
    
    // Create a simple bar chart for energy flow
    const energyFlowData = [
      { hour: '6AM', solarToLoad: 0.1, solarToBattery: 0.05, batteryToLoad: 0 },
      { hour: '9AM', solarToLoad: 0.6, solarToBattery: 0.3, batteryToLoad: 0 },
      { hour: '12PM', solarToLoad: 1.0, solarToBattery: 0.5, batteryToLoad: 0 },
      { hour: '3PM', solarToLoad: 0.7, solarToBattery: 0.3, batteryToLoad: 0 },
      { hour: '6PM', solarToLoad: 0.2, solarToBattery: 0.1, batteryToLoad: 0.2 },
      { hour: '9PM', solarToLoad: 0, solarToBattery: 0, batteryToLoad: 0.4 },
      { hour: '12AM', solarToLoad: 0, solarToBattery: 0, batteryToLoad: 0.3 },
      { hour: '3AM', solarToLoad: 0, solarToBattery: 0, batteryToLoad: 0.1 }
    ];
    
    const barChartWidth = 150;
    const barChartHeight = 80;
    const barChartX = 30;
    const barChartY = 45;
    const barWidth = 15;
    const maxBarValue = Math.max(...energyFlowData.map(d => d.solarToLoad + d.solarToBattery + d.batteryToLoad));
    
    // Draw bars
    energyFlowData.forEach((data, index) => {
      const x = barChartX + (index * (barChartWidth / (energyFlowData.length - 1)));
      
      // Solar to Load (yellow)
      const solarToLoadHeight = (data.solarToLoad / maxBarValue) * barChartHeight;
      doc.setFillColor(255, 206, 86);
      doc.rect(x - barWidth/2, barChartY + barChartHeight - solarToLoadHeight, barWidth, solarToLoadHeight, 'F');
      
      // Solar to Battery (blue)
      const solarToBatteryHeight = (data.solarToBattery / maxBarValue) * barChartHeight;
      doc.setFillColor(54, 162, 235);
      doc.rect(x - barWidth/2, barChartY + barChartHeight - solarToLoadHeight - solarToBatteryHeight, barWidth, solarToBatteryHeight, 'F');
      
      // Battery to Load (teal)
      const batteryToLoadHeight = (data.batteryToLoad / maxBarValue) * barChartHeight;
      doc.setFillColor(75, 192, 192);
      doc.rect(x - barWidth/2, barChartY + barChartHeight - solarToLoadHeight - solarToBatteryHeight - batteryToLoadHeight, barWidth, batteryToLoadHeight, 'F');
      
      // Draw hour labels
      doc.setTextColor(0, 0, 0);
      doc.text(data.hour, x - 5, barChartY + barChartHeight + 5);
    });
    
    // Add legend
    doc.setFontSize(8);
    doc.setTextColor(255, 206, 86);
    doc.text('Solar to Load', barChartX + barChartWidth + 10, barChartY + 10);
    doc.setTextColor(54, 162, 235);
    doc.text('Solar to Battery', barChartX + barChartWidth + 10, barChartY + 20);
    doc.setTextColor(75, 192, 192);
    doc.text('Battery to Load', barChartX + barChartWidth + 10, barChartY + 30);
    
    // Add Energy Distribution Chart
    doc.addPage();
    doc.setFillColor(41, 128, 185);
    doc.rect(0, 0, pageWidth, 20, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.text('Energy Distribution', 20, 15);
    
    // Create a simple pie chart for energy distribution
    const energyDistributionData = [
      { label: 'Direct Solar Use', value: results.solarPanels.dailyProduction * 0.7 },
      { label: 'Battery Storage', value: results.batteries.capacity * results.batteries.count }
    ];
    
    const pieChartX = pageWidth / 2;
    const pieChartY = 80;
    const pieChartRadius = 50;
    let startAngle = 0;
    
    // Draw pie segments
    energyDistributionData.forEach((data, index) => {
      const percentage = data.value / energyDistributionData.reduce((sum, d) => sum + d.value, 0);
      const endAngle = startAngle + (percentage * 360);
      
      // Draw segment
      doc.setFillColor(index === 0 ? [255, 206, 86] : [54, 162, 235]);
      doc.circle(pieChartX, pieChartY, pieChartRadius, 'F');
      
      // Draw label
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      doc.text(data.label, pieChartX + pieChartRadius + 10, pieChartY - 20 + (index * 20));
      doc.text(`${data.value.toFixed(1)} kWh`, pieChartX + pieChartRadius + 10, pieChartY - 10 + (index * 20));
      
      startAngle = endAngle;
    });
    
    // Add Battery Capacity Chart
    doc.addPage();
    doc.setFillColor(41, 128, 185);
    doc.rect(0, 0, pageWidth, 20, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.text('Battery Capacity Analysis', 20, 15);
    
    // Create a simple doughnut chart for battery capacity
    const batteryCapacityData = [
      { label: 'Required Capacity', value: requiredCapacity },
      { label: 'Available Capacity', value: usableCapacity - requiredCapacity }
    ];
    
    const doughnutChartX = pageWidth / 2;
    const doughnutChartY = 80;
    const doughnutChartRadius = 50;
    const doughnutChartInnerRadius = 30;
    startAngle = 0;
    
    // Draw doughnut segments
    batteryCapacityData.forEach((data, index) => {
      const percentage = data.value / batteryCapacityData.reduce((sum, d) => sum + d.value, 0);
      const endAngle = startAngle + (percentage * 360);
      
      // Draw segment
      doc.setFillColor(index === 0 ? [255, 99, 132] : [75, 192, 192]);
      doc.circle(doughnutChartX, doughnutChartY, doughnutChartRadius, 'F');
      doc.setFillColor(255, 255, 255);
      doc.circle(doughnutChartX, doughnutChartY, doughnutChartInnerRadius, 'F');
      
      // Draw label
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      doc.text(data.label, doughnutChartX + doughnutChartRadius + 10, doughnutChartY - 20 + (index * 20));
      doc.text(`${data.value.toFixed(1)} kWh`, doughnutChartX + doughnutChartRadius + 10, doughnutChartY - 10 + (index * 20));
      
      startAngle = endAngle;
    });

    addFooter();
    
    // Bill of Materials Page
    doc.addPage();
    doc.setFillColor(41, 128, 185);
    doc.rect(0, 0, pageWidth, 20, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.text('System Components', 20, 15);
    
    const components = calculateSystemComponents(results);
    const tableData = components.map(comp => [
      comp.name,
      comp.quantity.toString(),
      comp.specifications
    ]);
    
    doc.setTextColor(0, 0, 0);
    autoTable(doc, {
      startY: 35,
      head: [['Component', 'Quantity', 'Specifications']],
      body: tableData,
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [41, 128, 185] }
    });
    
    addFooter();
    
    // Recommendations Page
    doc.addPage();
    doc.setFillColor(41, 128, 185);
    doc.rect(0, 0, pageWidth, 20, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.text('System Recommendations', 20, 15);
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.text('1. Regular Maintenance:', 20, 35);
    doc.setFontSize(10);
    doc.text('• Clean solar panels monthly', 25, 45);
    doc.text('• Check battery terminals quarterly', 25, 50);
    doc.text('• Inspect cable connections regularly', 25, 55);
    
    doc.setFontSize(12);
    doc.text('2. Safety Guidelines:', 20, 75);
    doc.setFontSize(10);
    doc.text('• Keep system components dry', 25, 85);
    doc.text('• Ensure proper ventilation', 25, 90);
    doc.text('• Follow manufacturer guidelines', 25, 95);
    
    doc.setFontSize(12);
    doc.text('3. Performance Optimization:', 20, 115);
    doc.setFontSize(10);
    doc.text('• Monitor system performance', 25, 125);
    doc.text('• Check battery charge levels', 25, 130);
    doc.text('• Maintain optimal panel angle', 25, 135);
    
    // Add stringing recommendations
    doc.setFontSize(12);
    doc.text('4. Panel Stringing Configuration:', 20, 155);
    doc.setFontSize(10);
    doc.text(`• ${stringing.strings} parallel strings of ${stringing.panelsPerString} panels each`, 25, 165);
    doc.text(`• Total panels: ${stringing.totalPanels}`, 25, 170);
    doc.text(`• System voltage: ${results.batteries.voltage}V`, 25, 175);
    
    // Installation Note
    doc.setFontSize(12);
    doc.text('Installation Note:', 20, 195);
    doc.setFontSize(10);
    doc.text('This system design is optimized for your location and energy needs.', 25, 205);
    doc.text('For professional installation and support, please contact:', 25, 210);
    doc.text('Ibrahim Raheem - Solar System Engineer', 25, 215);
    doc.text('WhatsApp: https://wa.me/2349066730744', 25, 220);
    doc.text('X: @ibroraheem', 25, 225);
    
    addFooter();
    
    // Batteries
    doc.setFontSize(14);
    doc.text('Batteries', 20, 110);
    autoTable(doc, {
      startY: 120,
      head: [['Specification', 'Value']],
      body: [
        ['Battery Type', results.batteries.type],
        ['Battery Count', `${results.batteries.count}x`],
        ['Capacity per Battery', `${results.batteries.capacity}kWh`],
        ['Total Capacity', `${results.batteries.count * results.batteries.capacity}kWh`],
        ['System Voltage', `${results.batteries.voltage}V`]
      ],
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185] }
    });
    
    addFooter();
    
    return doc.output('blob');
  } catch (error) {
    console.error('Error generating PDF report:', error);
    throw new Error('Failed to generate PDF report. Please try again.');
  }
}; 