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
      doc.text('Created by Ibrahim Abdulraheem', margin, pageHeight - 6, { align: 'left' });
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
  doc.text('Prepared for you by Ibrahim Abdulraheem', pageWidth / 2, 100, { align: 'center' });
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
  const currentRate = 225; // NGN per kWh - This should ideally be dynamic/user input
  const annualSavings = annualGeneration * currentRate;
  const systemCost = results.totalPrice[selectedBatteryType === 'Tubular' ? 'withTubular' : 'withLithium'].base;
  const paybackPeriod = systemCost / annualSavings;
  const batteryLife = selectedBatteryType === 'Tubular' ? 3 : 8; // years - These should ideally come from data/system.ts
  const batteryReplacements = Math.ceil(25 / batteryLife) - 1;
  const batteryCost = results.batteryOptions[selectedBatteryType.toLowerCase() as 'tubular' | 'lithium'].totalPrice;
  const totalBatteryCost = batteryCost * batteryReplacements;
  const maintenanceCost = systemCost * 0.05 * 25; // 5% of system cost annually for 25 years - This should ideally be configurable or more realistic
  const total25YearCost = systemCost + totalBatteryCost + maintenanceCost;
  const total25YearSavings = annualSavings * 25;
  const netSavings = total25YearSavings - total25YearCost;

  addBox([
    'See the potential financial benefits of your solar system:',
    '',
    `• Expected Annual Energy Generation: ${annualGeneration.toFixed(2)} kWh`,
    `• Based on the current electricity rate (approx. NGN ${currentRate}/kWh), this could save you about NGN ${annualSavings.toLocaleString()} per year.`,
    '',
    `• Your estimated initial system cost is NGN ${systemCost.toLocaleString()}.`,
    `• With potential annual savings, your system could pay for itself in approximately ${paybackPeriod.toFixed(1)} years.`,
    '',
    `• Over a 25-year lifespan, factoring in potential battery replacements and maintenance, the total estimated cost is NGN ${total25YearCost.toLocaleString()}.`,
    `• Compared to grid electricity over 25 years (NGN ${total25YearSavings.toLocaleString()}), you could see net savings of around NGN ${netSavings.toLocaleString()}.`,
    '',
    'Beyond savings, enjoy energy independence, protection from rising electricity costs, and increased property value.'
  ], 'Understanding Your Solar Investment');

  // --- GENERATOR COMPARISON ---
  if (results.generatorComparison) {
    addSectionHeader('Generator Comparison');
    const generator = results.generatorComparison.generator;
    const estimatedAnnualFuelCost = results.generatorComparison.estimatedAnnualCost;
    const solarSystemCostAnnualized = results.totalPrice[selectedBatteryType === 'Tubular' ? 'withTubular' : 'withLithium'].base / 25; // Simple straight-line depreciation over 25 years

    // Calculate generator lifespan in years based on 8 hours/day running
    const generatorTotalHoursLifespan = 11000; // Average lifespan in running hours (10k-12k range)
    const dailyRunningHours = 8; // Assuming 8 hours/day for comparison
    const generatorLifespanYears = generatorTotalHoursLifespan / (dailyRunningHours * 365);

    addBox([
      `To help you understand the long-term value of solar, here's a cost and reliability comparison with running a petrol generator and relying solely on the grid:`,
      '',
      `• Comparable Petrol Generator: ${generator.brandModel} (${generator.capacitykVA} kVA)`,
      `  - Estimated Annual Fuel Cost (assuming ${dailyRunningHours} hrs/day): NGN ${Math.ceil(estimatedAnnualFuelCost).toLocaleString()}`,
      `  - Estimated Lifespan: Approximately ${generatorLifespanYears.toFixed(1)} years (based on ${dailyRunningHours} hrs/day or ${generatorTotalHoursLifespan.toLocaleString()} total running hours).`,
      '',
      '**Generator Additional Costs & Considerations:**',
      '•  Significant recurring expenses for fuel.',
      '•  Regular maintenance, service, and repair costs.',
      '•  Wear and tear reduces lifespan and efficiency over time.',
      '•  Noise pollution and exhaust fumes.',
      '•  Reliability can be inconsistent, especially with cheaper models.',
      '•  Highly susceptible to volatile and rising fuel prices.',
      '',
      `• Grid Electricity Cost (Annual Estimate based on your consumption): NGN ${(results.solarPanels.dailyOutput * 365 * 225).toLocaleString()}`,
      '',
      `• Your Recommended Solar System (${results.inverterSize} kVA):`,
      `  - Estimated Annualized System Cost (over 25 years): NGN ${Math.ceil(solarSystemCostAnnualized).toLocaleString()}`,
      `  - Estimated Annual Savings (vs Grid): NGN ${results.netSavings.toLocaleString()}`,
      `  - Annual Energy Generation: ${(results.solarPanels.dailyOutput * 365).toLocaleString()} kWh`,
      '',
      '**Key Takeaway:** While requiring a higher initial investment, solar provides clean, reliable energy with predictable costs (mostly initial) and significant long-term savings, avoiding the recurring fuel expenses and maintenance burdens of generators, and offering independence from grid fluctuations.',
      '',
      '*Note: Generator fuel costs and grid electricity tariffs can fluctuate, impacting these cost comparisons. Solar performance can also vary based on weather and maintenance.*',
    ], 'Cost, Reliability, and Lifespan Comparison');
  }

  // --- ENVIRONMENTAL IMPACT ---
  addSectionHeader('Environmental Impact');
  const annualCO2Reduction = results.solarPanels.dailyOutput * 365 * 0.5; // 0.5 tons CO2 per MWh - Example conversion factor
  const treesEquivalent = Math.ceil(annualCO2Reduction * 50); // 50 trees per ton of CO2 - Example conversion factor
  addBox([
    'Going solar reduces your carbon footprint and helps the environment.',
    '',
    `• Annually, your system could reduce CO₂ emissions by about ${annualCO2Reduction.toFixed(2)} tons.`,
    `• This is like planting ${treesEquivalent} trees every year!`, // Corrected sentence structure
    '',
    'Choosing solar means clean energy, less air pollution, and supporting sustainable development.'
  ]);

  // --- FOOTER ---
  addFooter();

  // Save the PDF
  doc.save('solar-system-report.pdf');
};