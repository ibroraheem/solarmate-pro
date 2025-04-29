import { jsPDF } from 'jspdf';
import { SystemResults } from '../types';
import { formatCurrency } from './calculations';

export const generatePDF = (results: SystemResults, selectedBatteryType: 'Tubular' | 'Lithium') => {
  const doc = new jsPDF();
  const margin = 20;
  let yPos = margin;
  const lineHeight = 10;

  // Helper function to add text and move position
  const addText = (text: string, fontSize = 12, isBold = false) => {
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', isBold ? 'bold' : 'normal');
    doc.text(text, margin, yPos);
    yPos += lineHeight;
  };

  // Title
  addText('SolarMate Pro - System Recommendation', 18, true);
  yPos += 5;

  // Inverter Details
  addText('Inverter Specifications:', 14, true);
  addText(`Inverter Size: ${results.inverterSize} KVA`);
  addText(`System Voltage: ${results.systemVoltage}V`);
  addText(`Peak Load: ${results.peakLoad.toLocaleString()} W`);
  addText(`With Safety Margin: ${results.adjustedPeakLoad.toLocaleString()} W`);
  yPos += 5;

  // Solar Panel Details
  addText('Solar Panel Specifications:', 14, true);
  addText('Panel Type: Jinko 550W');
  addText(`Number of Panels: ${results.solarPanels.count}`);
  addText(`Total Capacity: ${results.solarPanels.totalWattage.toLocaleString()} W`);
  addText(`Daily Output: ${results.solarPanels.dailyOutput.toFixed(2)} kWh/day`);
  yPos += 5;

  // Battery Details
  addText('Battery Specifications:', 14, true);
  if (selectedBatteryType === 'Tubular') {
    const battery = results.batteryOptions.tubular;
    addText(`Battery Type: ${battery.modelName}`);
    addText(`Number of Batteries: ${battery.count}`);
    addText(`Total Capacity: ${(battery.totalCapacity / 1000).toFixed(1)} kWh`);
    addText('Depth of Discharge: 50%');
  } else {
    const battery = results.batteryOptions.lithium;
    addText(`Battery Type: ${battery.modelName}`);
    addText(`Number of Batteries: ${battery.count}`);
    addText(`Total Capacity: ${(battery.totalCapacity / 1000).toFixed(1)} kWh`);
    addText('Depth of Discharge: 90%');
  }
  yPos += 5;

  // Total Price
  addText('Total System Price:', 14, true);
  const totalPrice = selectedBatteryType === 'Tubular' 
    ? results.totalPrice.withTubular 
    : results.totalPrice.withLithium;
  addText(formatCurrency(totalPrice), 14, true);
  yPos += 5;

  // Footer note
  doc.setFontSize(10);
  doc.setFont('helvetica', 'italic');
  doc.text('*Installation materials and labour fees will be quoted after inspection.', margin, yPos);

  // Save the PDF
  doc.save('solarmate-pro-recommendation.pdf');
};