import { jsPDF } from 'jspdf';
import { SystemResults } from '../types';
import { formatCurrency } from './calculations';

export const generatePDF = (results: SystemResults, selectedBatteryType: 'Tubular' | 'Lithium') => {
  const doc = new jsPDF();
  const margin = 20;
  let yPos = margin;
  const lineHeight = 10;
  const pageHeight = 297; // A4 height in mm
  const pageWidth = 210; // A4 width in mm

  // Colors
  const colors = {
    primary: '#16a34a', // green-600
    secondary: '#15803d', // green-700
    accent: '#fbbf24', // yellow-400
    text: '#1f2937', // gray-800
    lightText: '#6b7280', // gray-500
    background: '#f8fafc', // slate-50
    border: '#e2e8f0', // slate-200
  };

  // Helper function to add text and move position
  const addText = (text: string, fontSize = 12, isBold = false, color = colors.text, align: 'left' | 'center' | 'right' = 'left') => {
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', isBold ? 'bold' : 'normal');
    doc.setTextColor(color);
    doc.text(text, margin, yPos, { align });
    yPos += lineHeight;
  };

  // Helper function to add section
  const addSection = (title: string) => {
    // Check if we need a new page
    if (yPos > pageHeight - 40) {
      doc.addPage();
      yPos = margin;
    }
    
    yPos += 5;
    // Add colored section header with background
    doc.setFillColor(colors.background);
    doc.rect(margin - 5, yPos - 5, pageWidth - (margin * 2) + 10, lineHeight + 10, 'F');
    doc.setFillColor(colors.primary);
    doc.rect(margin - 5, yPos - 5, 5, lineHeight + 10, 'F');
    addText(title, 14, true, colors.primary);
    yPos += 5;
  };

  // Helper function to add a divider
  const addDivider = () => {
    yPos += 5;
    doc.setDrawColor(colors.border);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 5;
  };

  // Helper function to add a box
  const addBox = (content: string[], title?: string) => {
    const boxHeight = (content.length + (title ? 1 : 0)) * lineHeight + 20;
    const boxWidth = pageWidth - (margin * 2);
    
    // Check if we need a new page
    if (yPos + boxHeight > pageHeight - margin) {
      doc.addPage();
      yPos = margin;
    }

    // Draw box
    doc.setFillColor(colors.background);
    doc.roundedRect(margin, yPos, boxWidth, boxHeight, 3, 3, 'F');
    doc.setDrawColor(colors.border);
    doc.roundedRect(margin, yPos, boxWidth, boxHeight, 3, 3, 'S');

    // Add title if provided
    if (title) {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(colors.primary);
      doc.text(title, margin + 5, yPos + 10);
      yPos += lineHeight;
    }

    // Add content
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(colors.text);
    content.forEach(line => {
      doc.text(line, margin + 5, yPos + 10);
      yPos += lineHeight;
    });

    yPos += 10;
  };

  // Add header with logo and title
  doc.setFillColor(colors.primary);
  doc.rect(0, 0, pageWidth, 40, 'F');
  doc.setTextColor('#ffffff');
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('SOLARMATE', pageWidth / 2, 20, { align: 'center' });
  doc.setFontSize(16);
  doc.text('SOLAR SYSTEM SIZING REPORT', pageWidth / 2, 30, { align: 'center' });
  yPos = 50;

  // System Overview
  addSection('System Overview');
  addBox([
    `Total Load: ${results.peakLoad.toLocaleString()} W`,
    `Inverter Size: ${results.inverterSize} KVA`,
    `System Voltage: ${results.systemVoltage}V`,
    `Battery Bank: ${results.batteryOptions[selectedBatteryType.toLowerCase() as 'tubular' | 'lithium'].count} x ${results.batteryOptions[selectedBatteryType.toLowerCase() as 'tubular' | 'lithium'].modelName}`,
    `Solar Panels: ${results.solarPanels.count} x ${results.solarPanels.totalWattage / results.solarPanels.count}W`,
    `Daily Output: ${results.solarPanels.dailyOutput.toFixed(2)} kWh/day`
  ]);

  // Battery Specifications
  addSection('Battery Specifications');
  const battery = results.batteryOptions[selectedBatteryType.toLowerCase() as 'tubular' | 'lithium'];
  addBox([
    `Battery Type: ${battery.type}`,
    `Model: ${battery.modelName}`,
    `Voltage: ${battery.voltage}V`,
    `Capacity: ${battery.capacity}Ah`,
    `Total Capacity: ${(battery.totalCapacity / 1000).toFixed(1)} kWh`,
    `Depth of Discharge: ${battery.type === 'Tubular' ? '50%' : '90%'}`,
    `Battery Price: ${formatCurrency(battery.totalPrice).replace('₦', 'NGN ')}`
  ]);

  // Solar Panel Specifications
  addSection('Solar Panel Specifications');
  addBox([
    `Panel Type: Jinko 550W`,
    `Total Capacity: ${results.solarPanels.totalWattage.toLocaleString()} W`,
    `Panel Price: ${formatCurrency(results.solarPanels.price).replace('₦', 'NGN ')}`
  ]);

  // System Components
  addSection('System Components');
  
  // AC Side Components
  addBox([
    `Breaker: ${results.components.acBreaker.size}A MCB`,
    `Current Rating: ${results.components.acBreaker.current.toFixed(1)}A`,
    `Cable: ${results.components.acBreaker.cableSize}mm² Copper`,
    `Changeover Switch: ${results.components.changeoverSwitch.size}A ${results.components.changeoverSwitch.type}`,
    `Switch Current Rating: ${results.components.changeoverSwitch.current.toFixed(1)}A`,
    `AVR: ${results.components.avr.size}kVA`,
    `AVR Rating: ${results.components.avr.kva.toFixed(1)}kVA`
  ], 'AC Side Components');

  // DC Side Components
  addBox([
    `Breaker: ${results.components.dcBreaker.size}A MCB`,
    `Current Rating: ${results.components.dcBreaker.current.toFixed(1)}A`,
    `Cable: ${results.components.dcBreaker.cableSize}mm² Copper`
  ], 'DC Side Components');

  // Core Components Price
  addSection('Core Components Price');
  const totalPrice = selectedBatteryType === 'Tubular' 
    ? results.totalPrice.withTubular 
    : results.totalPrice.withLithium;
  
  addBox([
    'This price includes:',
    '• Inverter',
    '• Solar Panels',
    '• Battery Bank'
  ]);

  // Add total price with emphasis
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(colors.primary);
  doc.text(formatCurrency(totalPrice).replace('₦', 'NGN '), pageWidth / 2, yPos + 10, { align: 'center' });
  yPos += lineHeight * 2;

  // Add pricing disclaimer
  doc.setFontSize(10);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(colors.lightText);
  doc.text('*Prices shown are supplier prices for core components only. Additional costs include:', margin, yPos);
  yPos += lineHeight;
  doc.text('• Installation and labor charges', margin + 5, yPos);
  yPos += lineHeight;
  doc.text('• Additional components (cables, breakers, etc.)', margin + 5, yPos);
  yPos += lineHeight;
  doc.text('• Transportation and logistics', margin + 5, yPos);
  yPos += lineHeight;
  doc.text('Final price may vary based on market conditions and specific requirements.', margin, yPos);

  // Add footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setTextColor(colors.lightText);
    doc.text(
      `Generated by SolarMate • Page ${i} of ${pageCount}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
  }

  // Save the PDF
  doc.save('solar-system-report.pdf');
};