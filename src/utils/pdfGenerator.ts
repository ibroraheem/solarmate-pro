import { jsPDF } from 'jspdf';
import { SystemResults } from '../types';

export const generatePDF = (
  results: SystemResults,
  selectedBatteryType: 'Tubular' | 'Lithium',
  backupHours: number,
  selectedState?: { name: string }
) => {
  const doc = new jsPDF();
  const margin = 20;
  const pageWidth = 210;
  const pageHeight = 297;
  const lineHeight = 10;
  let yPos = margin;

  // Modern color palette
  const colors = {
    primary: '#16a34a', // green
    accent: '#fbbf24', // yellow
    background: '#f8fafc', // light
    text: '#1f2937', // dark
    lightText: '#6b7280',
    border: '#e2e8f0',
    section: '#e0f2fe', // light blue
    box: '#f1f5f9', // very light
    header: '#15803d', // deep green
    footer: '#fbbf24', // yellow
  };

  // Helper: Add wrapped text
  const addWrappedText = (text: string, x: number, y: number, maxWidth: number, fontSize = 12, color = colors.text, isBold = false) => {
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', isBold ? 'bold' : 'normal');
    doc.setTextColor(color);
    const lines = doc.splitTextToSize(text, maxWidth);
    lines.forEach((line: string) => {
      doc.text(line, x, y);
      y += lineHeight;
    });
    return y;
  };

  // Helper: Section header
  const addSectionHeader = (title: string) => {
    doc.addPage();
    yPos = margin;
    doc.setFillColor(colors.primary);
    doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 16, 4, 4, 'F');
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor('#fff');
    doc.text(title, pageWidth / 2, yPos + 11, { align: 'center' });
    yPos += 22;
  };

  // Helper: Content box
  const addBox = (lines: string[], title?: string) => {
    const boxWidth = pageWidth - 2 * margin;
    const boxHeight = lines.length * lineHeight + (title ? 18 : 8);
    if (yPos + boxHeight > pageHeight - margin) { doc.addPage(); yPos = margin; }
    doc.setFillColor(colors.box);
    doc.roundedRect(margin, yPos, boxWidth, boxHeight, 4, 4, 'F');
    let y = yPos + 10;
    if (title) {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(colors.primary);
      doc.text(title, margin + 6, y);
      y += lineHeight;
    }
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(colors.text);
    lines.forEach((line: string) => {
      y = addWrappedText(line, margin + 6, y, boxWidth - 12, 11, colors.text);
    });
    yPos += boxHeight + 8;
  };

  // Helper: Footer
  const addFooter = () => {
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFillColor(colors.footer);
      doc.rect(0, pageHeight - 15, pageWidth, 15, 'F');
      doc.setFontSize(10);
      doc.setTextColor(colors.header);
      doc.text('Created by Ibro Raheem', margin, pageHeight - 6, { align: 'left' });
      doc.text('WhatsApp: +234 906 673 0744', pageWidth / 2, pageHeight - 6, { align: 'center' });
      doc.text('Portfolio: ibroraheem.netlify.app', pageWidth - margin, pageHeight - 6, { align: 'right' });
      doc.setTextColor(colors.text);
      doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, pageHeight - 2, { align: 'center' });
    }
  };

  // --- COVER PAGE ---
  doc.setFillColor(colors.primary);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');
  doc.setFontSize(32);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor('#fff');
  doc.text('SOLARMATE', pageWidth / 2, 60, { align: 'center' });
  doc.setFontSize(18);
  doc.text('Comprehensive Solar System Sizing Report', pageWidth / 2, 80, { align: 'center' });
  doc.setFontSize(14);
  doc.setTextColor(colors.accent);
  doc.text('Prepared for you by Ibro Raheem', pageWidth / 2, 100, { align: 'center' });
  doc.setFontSize(12);
  doc.setTextColor('#fff');
  doc.text('WhatsApp: +234 906 673 0744', pageWidth / 2, 110, { align: 'center' });
  doc.text('Portfolio: ibroraheem.netlify.app', pageWidth / 2, 120, { align: 'center' });
  doc.setDrawColor(colors.accent);
  doc.setLineWidth(1.5);
  doc.line(margin, 130, pageWidth - margin, 130);
  doc.setFontSize(10);
  doc.setTextColor(colors.lightText);
  doc.text('Generated on: ' + new Date().toLocaleDateString(), pageWidth / 2, 140, { align: 'center' });
  doc.addPage();
  yPos = margin;

  // --- EXECUTIVE SUMMARY ---
  addSectionHeader('Executive Summary');
  addBox([
    'This comprehensive solar system design report provides a detailed analysis of your energy requirements and a complete solution for your solar power needs.',
    '',
    'Key Highlights:',
    `• Total System Capacity: ${results.solarPanels.totalWattage.toLocaleString()} W`,
    `• Daily Energy Generation: ${results.solarPanels.dailyOutput.toFixed(2)} kWh`,
    `• Battery Backup Duration: ${backupHours} hours`,
    `• Estimated System Cost: NGN ${results.totalPrice[selectedBatteryType === 'Tubular' ? 'withTubular' : 'withLithium'].range.lowerBound.toLocaleString()} - NGN ${results.totalPrice[selectedBatteryType === 'Tubular' ? 'withTubular' : 'withLithium'].range.upperBound.toLocaleString()}`,
    selectedState?.name ? `• Location: ${selectedState.name}` : ''
  ], 'Report Overview');

  // --- SYSTEM OVERVIEW ---
  addSectionHeader('System Overview');
  addBox([
    `Total Load: ${results.peakLoad.toLocaleString()} W`,
    `Inverter Size: ${results.inverterSize} KVA`,
    `System Voltage: ${results.systemVoltage}V`,
    `Battery Bank: ${results.batteryOptions[selectedBatteryType.toLowerCase() as 'tubular' | 'lithium'].count} x ${results.batteryOptions[selectedBatteryType.toLowerCase() as 'tubular' | 'lithium'].modelName}`,
    `Solar Panels: ${results.solarPanels.count} x ${results.solarPanels.totalWattage / results.solarPanels.count}W`,
    `Daily Output: ${results.solarPanels.dailyOutput.toFixed(2)} kWh/day`
  ]);

  // --- FINANCIAL ANALYSIS ---
  addSectionHeader('Financial Analysis');
  const dailyGeneration = results.solarPanels.dailyOutput;
  const annualGeneration = dailyGeneration * 365;
  const currentRate = 225; // NGN per kWh
  const annualSavings = annualGeneration * currentRate;
  const systemCost = results.totalPrice[selectedBatteryType === 'Tubular' ? 'withTubular' : 'withLithium'].base;
  const paybackPeriod = systemCost / annualSavings;
  const batteryLife = selectedBatteryType === 'Tubular' ? 3 : 8; // years
  const batteryReplacements = Math.ceil(25 / batteryLife) - 1;
  const batteryCost = results.batteryOptions[selectedBatteryType.toLowerCase() as 'tubular' | 'lithium'].totalPrice;
  const totalBatteryCost = batteryCost * batteryReplacements;
  const maintenanceCost = systemCost * 0.05 * 25;
  const total25YearCost = systemCost + totalBatteryCost + maintenanceCost;
  const total25YearSavings = annualSavings * 25;
  const netSavings = total25YearSavings - total25YearCost;
  addBox([
    'Financial Calculations:',
    '',
    '1. Energy Generation:',
    `• Daily Generation: ${dailyGeneration.toFixed(2)} kWh`,
    `• Annual Generation: ${annualGeneration.toFixed(2)} kWh`,
    '',
    '2. Cost Savings:',
    `• Current Electricity Rate: NGN ${currentRate}/kWh`,
    `• Annual Savings: NGN ${annualSavings.toLocaleString()}`,
    `• Monthly Savings: NGN ${(annualSavings / 12).toLocaleString()}`,
    '',
    '3. System Costs:',
    `• Initial System Cost: NGN ${systemCost.toLocaleString()}`,
    `• Battery Replacements (${batteryReplacements} times): NGN ${totalBatteryCost.toLocaleString()}`,
    `• Maintenance (25 years): NGN ${maintenanceCost.toLocaleString()}`,
    `• Total 25-Year Cost: NGN ${total25YearCost.toLocaleString()}`,
    '',
    '4. Return on Investment:',
    `• Payback Period: ${paybackPeriod.toFixed(1)} years`,
    `• 25-Year Savings: NGN ${total25YearSavings.toLocaleString()}`,
    `• Net Savings: NGN ${netSavings.toLocaleString()}`]);

  // --- ENVIRONMENTAL IMPACT ---
  addSectionHeader('Environmental Impact');
  const annualCO2Reduction = results.solarPanels.dailyOutput * 365 * 0.5; 
  const treesEquivalent = Math.ceil(annualCO2Reduction * 50);
  addBox([
    'Carbon Footprint Reduction:',
    `• Annual CO₂ Reduction: ${annualCO2Reduction.toFixed(2)} tons`,
    `• Equivalent to planting ${treesEquivalent} trees per year`,
    '',
  ]);

  // --- FOOTER ---
  addFooter();

  // Save the PDF
  doc.save('solar-system-report.pdf');
};