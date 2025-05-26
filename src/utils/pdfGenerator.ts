import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { BOM, SystemPreferences, ApplianceUsage } from '../types';

interface AutoTableOptions {
  startY: number;
  head: string[][];
  body: (string | number)[][];
  theme: string;
  styles: {
    fontSize: number;
    cellPadding: number;
  };
  headStyles: {
    fillColor: number[];
    textColor: number[];
    fontStyle: string;
  };
}

interface AutoTableDoc extends jsPDF {
  lastAutoTable: {
    finalY: number;
  };
  autoTable: (options: AutoTableOptions) => void;
}

export function generatePDF(
  bom: BOM,
  preferences: SystemPreferences,
  appliances: ApplianceUsage[],
  location: string = 'Lagos, Nigeria'
): void {
  const doc = new jsPDF() as AutoTableDoc;
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;

  // Add header with logo and title
  doc.setFontSize(24);
  doc.text('Solar System Design Report', pageWidth / 2, 20, { align: 'center' });
  
  // Add location and date
      doc.setFontSize(12);
  const date = new Date().toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  doc.text(`Location: ${location}`, margin, 35);
  doc.text(`Generated on: ${date}`, pageWidth - margin, 35, { align: 'right' });

  // Add system overview
  doc.setFontSize(16);
  doc.text('System Overview', margin, 50);
  doc.setFontSize(11);
  doc.text(`System Type: ${preferences.systemType}`, margin, 60);
  doc.text(`Battery Type: ${preferences.batteryType}`, margin, 67);
  doc.text(`Autonomy Days: ${preferences.autonomyDays}`, margin, 74);
  doc.text(`Backup Hours: ${preferences.backupHours}`, margin, 81);

  // Add load analysis
  doc.setFontSize(16);
  doc.text('Load Analysis', margin, 95);
  
  // Create load profile table
  const loadTableData = appliances.map(appliance => [
    appliance.name,
    `${appliance.quantity} units`,
    `${appliance.power}W`,
    `${appliance.hoursPerDay} hours`,
    `${appliance.quantity * appliance.power * appliance.hoursPerDay}Wh`
  ]);

  doc.autoTable({
    startY: 100,
    head: [['Appliance', 'Quantity', 'Power Rating', 'Hours/Day', 'Daily Consumption']],
    body: loadTableData,
    theme: 'grid',
    styles: { fontSize: 10, cellPadding: 5 },
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    }
  });

  // Add system components
  const componentsY = doc.lastAutoTable.finalY + 20;
  doc.setFontSize(16);
  doc.text('System Components', margin, componentsY);

  // Add inverter details
  doc.setFontSize(12);
  doc.text('Inverter Configuration', margin, componentsY + 10);
  bom.components.inverters.forEach((inverter, index) => {
    doc.setFontSize(11);
    doc.text(`• ${inverter.name}`, margin + 5, componentsY + 20 + (index * 7));
  });

  // Add battery bank details
  const batteryY = componentsY + 20 + (bom.components.inverters.length * 7) + 10;
  doc.setFontSize(12);
  doc.text('Battery Bank Configuration', margin, batteryY);
  bom.components.batteries.forEach((battery, index) => {
    doc.setFontSize(11);
    doc.text(`• ${battery.name} (${battery.quantity} units)`, margin + 5, batteryY + 10 + (index * 7));
  });

  // Add solar array details
  const solarY = batteryY + 10 + (bom.components.batteries.length * 7) + 10;
  doc.setFontSize(12);
  doc.text('Solar Array Configuration', margin, solarY);
  bom.components.solarPanels.forEach((panel, index) => {
    doc.setFontSize(11);
    doc.text(`• ${panel.name} (${panel.quantity} units)`, margin + 5, solarY + 10 + (index * 7));
  });

  // Add charge controller details if present
  if (bom.components.chargeControllers && bom.components.chargeControllers.length > 0) {
    const controllerY = solarY + 10 + (bom.components.solarPanels.length * 7) + 10;
    doc.setFontSize(12);
    doc.text('Charge Controller Configuration', margin, controllerY);
    bom.components.chargeControllers.forEach((controller, index) => {
      doc.setFontSize(11);
      doc.text(`• ${controller.name}`, margin + 5, controllerY + 10 + (index * 7));
    });
  }

  // Add system recommendations
  const recommendationsY = doc.lastAutoTable.finalY + 20;
  doc.setFontSize(16);
  doc.text('System Recommendations', margin, recommendationsY);
  doc.setFontSize(11);
  bom.recommendations.forEach((recommendation, index) => {
    doc.text(`• ${recommendation}`, margin + 5, recommendationsY + 10 + (index * 7));
  });

  // Add installation guidelines
  const guidelinesY = recommendationsY + 10 + (bom.recommendations.length * 7) + 20;
  doc.setFontSize(16);
  doc.text('Installation Guidelines', margin, guidelinesY);
  doc.setFontSize(11);
  const guidelines = [
    '1. Solar panels should be installed at an optimal angle for maximum sun exposure',
    '2. Battery bank should be installed in a well-ventilated area',
    '3. All DC cables should be properly sized and protected',
    '4. System should be properly grounded',
    '5. Regular maintenance schedule should be followed'
  ];
  guidelines.forEach((guideline, index) => {
    doc.text(guideline, margin, guidelinesY + 10 + (index * 7));
  });

  // Add maintenance schedule
  const maintenanceY = guidelinesY + 10 + (guidelines.length * 7) + 20;
  doc.setFontSize(16);
  doc.text('Maintenance Schedule', margin, maintenanceY);
  doc.setFontSize(11);
  const maintenance = [
    'Daily: Check system status and battery levels',
    'Weekly: Clean solar panels and check connections',
    'Monthly: Inspect battery terminals and cable connections',
    'Quarterly: Perform system efficiency test',
    'Annually: Complete system inspection and maintenance'
  ];
  maintenance.forEach((item, index) => {
    doc.text(item, margin, maintenanceY + 10 + (index * 7));
  });

  // Add footer
  const footerY = doc.internal.pageSize.getHeight() - 20;
  doc.setFontSize(8);
  doc.text(
    'This is a computer-generated document. For detailed pricing and installation, please contact our sales team.',
    pageWidth / 2,
    footerY,
    { align: 'center' }
  );

  // Save the PDF
  doc.save('solar-system-design.pdf');
}