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
    primary: '#2c3e50', // Dark Slate Blue
    accent: '#e74c3c', // Red Orange
    background: '#ecf0f1', // Light Grayish Blue
    text: '#34495e', // Darker Slate Blue
    lightText: '#7f8c8d', // Gray
    border: '#bdc3c7', // Silver
    section: '#d5dbdb', // Light Gray
    box: '#ffffff', // White
    header: '#2c3e50', // Dark Slate Blue
    footer: '#34495e', // Darker Slate Blue
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
    // Always add a new page before a section header, unless it's the first section after the cover.
    if (yPos !== margin + 16 + 6) { // Check if yPos is NOT right after the cover page's header + spacing
      doc.addPage();
      yPos = margin; // Reset yPos for the new page
    } else {
      // If it is the first section after the cover, just ensure yPos is set correctly.
      yPos = margin; // Although it should already be here due to addPage after cover
    }

    doc.setFillColor(colors.primary);
    doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 16, 4, 4, 'F');
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor('#fff');
    doc.text(title, pageWidth / 2, yPos + 11, { align: 'center' });
    // yPos should now be set to the position where the box content can start immediately below the header
    yPos += 16 + 6; // 16 for header height, 6 for space between header and box top
  };

  // Helper: Content box with better spacing
  const addBox = (lines: string[], title?: string) => {
    const boxWidth = pageWidth - 2 * margin;
    // Calculate the total height needed for the box including title and content lines
    const requiredHeight = (title ? 18 : 8) + lines.length * lineHeight; // Estimate for content + internal padding
    
    // Check if the entire box fits from the current yPos. If not, add a new page.
    if (yPos + requiredHeight > pageHeight - margin) {
      doc.addPage();
      yPos = margin; // Reset yPos for the new page
    }

    // Draw the box at the current yPos
    doc.setFillColor(colors.box);
    doc.roundedRect(margin, yPos, boxWidth, requiredHeight + 6, 4, 4, 'F'); // Reduced bottom padding to 6
    let y = yPos + (title ? 16 : 6); // Reduced top padding in box
    
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
      if (y + lineHeight > pageHeight - margin) {
        doc.addPage();
        y = margin + 10;
      }
      y = addWrappedText(line, margin + 6, y, boxWidth - 12, 11, colors.text);
    });
    
    yPos = y + 6; // Reduced space after box
  };

  // Helper: Footer
  const addFooter = () => {
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFillColor(colors.footer);
      doc.rect(0, pageHeight - 15, pageWidth, 15, 'F');
      doc.setFontSize(10);
      doc.setTextColor('#fff'); // White text on footer
      doc.text('Created by Ibrahim Abdulraheem', margin, pageHeight - 6, { align: 'left' });
      doc.text('WhatsApp: +234 906 673 0744', pageWidth / 2, pageHeight - 6, { align: 'center' });
      doc.text('Portfolio: ibroraheem.netlify.app', pageWidth - margin, pageHeight - 6, { align: 'right' });
      doc.setTextColor('#fff'); // White text for page numbers
      doc.text(`${i}`, pageWidth / 2, pageHeight - 6, { align: 'center' }); // Simple page number
    }
  };

  // --- COVER PAGE ---
  doc.setFillColor(colors.primary);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');
  
  // Logo/Title
  doc.setFontSize(36);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor('#fff');
  doc.text('SOLARMATE', pageWidth / 2, 80, { align: 'center' });
  
  // Subtitle
  doc.setFontSize(24);
  doc.text('Solar System Design Report', pageWidth / 2, 100, { align: 'center' });
  
  // Decorative line
  doc.setDrawColor(colors.accent);
  doc.setLineWidth(2);
  doc.line(margin, 120, pageWidth - margin, 120);
  
  // Project Details
  doc.setFontSize(14);
  doc.text('Project Details:', pageWidth / 2, 140, { align: 'center' });
  doc.setFontSize(12);
  doc.text(`Location: ${selectedState?.name || 'Not specified'}`, pageWidth / 2, 155, { align: 'center' });
  doc.text(`System Size: ${results.inverterSize} kVA`, pageWidth / 2, 165, { align: 'center' });
  doc.text(`Backup Duration: ${backupHours} hours`, pageWidth / 2, 175, { align: 'center' });
  
  // Author Info
  doc.setFontSize(14);
  doc.setTextColor('#fff'); // Author info on cover page white
  doc.text('Prepared by:', pageWidth / 2, 200, { align: 'center' });
  doc.setFontSize(12);
  doc.text('Ibrahim Abdulraheem', pageWidth / 2, 215, { align: 'center' });
  doc.text('WhatsApp: +234 906 673 0744', pageWidth / 2, 225, { align: 'center' });
  doc.text('Portfolio: ibroraheem.netlify.app', pageWidth / 2, 235, { align: 'center' });
  
  // Date
  doc.setFontSize(10);
  doc.setTextColor(colors.lightText);
  doc.text('Generated on: ' + new Date().toLocaleDateString(), pageWidth / 2, 260, { align: 'center' });

  doc.addPage(); // Start a new page after the cover

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
  const maintenanceCost = systemCost * 0.05 * 25; // 5% of system cost annually for 25 years
  const total25YearCost = systemCost + totalBatteryCost + maintenanceCost;
  const total25YearSavings = annualSavings * 25;
  const netSavings = total25YearSavings - total25YearCost;

  // Financial Analysis Content
  const financialContent = [
    '1. Energy Generation and Savings',
    '',
    `• Expected Annual Energy Generation: ${annualGeneration.toFixed(2)} kWh`,
    `• Current Electricity Rate: NGN ${currentRate}/kWh`,
    `• Estimated Annual Savings: NGN ${annualSavings.toLocaleString()}`,
    '',
    '2. System Cost Analysis',
    '',
    `• Initial System Cost: NGN ${systemCost.toLocaleString()}`,
    `• Battery Replacement Cost (${batteryReplacements} times): NGN ${totalBatteryCost.toLocaleString()}`,
    `• Maintenance Cost (25 years): NGN ${maintenanceCost.toLocaleString()}`,
    `• Total 25-Year Cost: NGN ${total25YearCost.toLocaleString()}`,
    '',
    '3. Return on Investment',
    '',
    `• Payback Period: ${paybackPeriod.toFixed(1)} years`,
    `• 25-Year Grid Electricity Cost: NGN ${total25YearSavings.toLocaleString()}`,
    `• Net Savings Over 25 Years: NGN ${netSavings.toLocaleString()}`,
    '',
    '4. Additional Benefits',
    '',
    '• Energy Independence',
    '• Protection from Rising Electricity Costs',
    '• Increased Property Value',
    '• Reduced Carbon Footprint',
    '• Minimal Maintenance Requirements'
  ];

  // Add Generator Comparison to Financial Analysis if available
  if (results.generatorComparison) {
    const generator = results.generatorComparison.generator;
    const estimatedAnnualFuelCost = results.generatorComparison.estimatedAnnualCost;
    const generatorTotalHoursLifespan = 11000; // Average lifespan in running hours
    const dailyRunningHours = 8; // Assuming 8 hours/day for comparison
    const generatorLifespanYears = generatorTotalHoursLifespan / (dailyRunningHours * 365);

    financialContent.push(
      '',
      '5. Generator Comparison',
      '',
      `• Comparable Generator: ${generator.brandModel} (${generator.capacitykVA} kVA)`,
      `• Initial Cost: NGN ${generator.priceRange.replace(/₦/g, '').trim()}`,
      `• Annual Fuel Cost (${dailyRunningHours} hrs/day): NGN ${Math.ceil(estimatedAnnualFuelCost).toLocaleString()}`,
      `• Estimated Lifespan: ${generatorLifespanYears.toFixed(1)} years`,
      '',
      'Generator Additional Costs:',
      '• Regular fuel expenses',
      '• Maintenance and repairs',
      '• Noise pollution',
      '• Environmental impact',
      '• Reliability concerns',
      '',
      'Solar Advantages:',
      '• No fuel costs',
      '• Minimal maintenance',
      '• Silent operation',
      '• Zero emissions',
      '• Reliable performance'
    );
  }

  // Break down Financial Analysis into multiple boxes
  // 1. Energy Generation and Savings
  addBox([
    `• Expected Annual Energy Generation: ${annualGeneration.toFixed(2)} kWh`,
    `• Current Electricity Rate: NGN ${currentRate}/kWh`,
    `• Estimated Annual Savings: NGN ${annualSavings.toLocaleString()}`,
  ], 'Energy Generation and Savings');

  // 2. System Cost Analysis
  addBox([
    `• Initial System Cost: NGN ${systemCost.toLocaleString()}`,
    `• Battery Replacement Cost (${batteryReplacements} times): NGN ${totalBatteryCost.toLocaleString()}`,
    `• Maintenance Cost (25 years): NGN ${maintenanceCost.toLocaleString()}`,
    `• Total 25-Year Cost: NGN ${total25YearCost.toLocaleString()}`,
  ], 'System Cost Analysis');

  // 3. Return on Investment
  addBox([
    `• Payback Period: ${paybackPeriod.toFixed(1)} years`,
    `• 25-Year Grid Electricity Cost: NGN ${total25YearSavings.toLocaleString()}`,
    `• Net Savings Over 25 Years: NGN ${netSavings.toLocaleString()}`,
  ], 'Return on Investment');

  // 4. Additional Benefits
  addBox([
    '• Energy Independence',
    '• Protection from Rising Electricity Costs',
    '• Increased Property Value',
    '• Reduced Carbon Footprint',
    '• Minimal Maintenance Requirements'
  ], 'Additional Benefits');

  // 5. Generator Comparison (if available)
  if (results.generatorComparison) {
    const generator = results.generatorComparison.generator;
    const estimatedAnnualFuelCost = results.generatorComparison.estimatedAnnualCost;
    const generatorTotalHoursLifespan = 11000;
    const dailyRunningHours = 8;
    const generatorLifespanYears = generatorTotalHoursLifespan / (dailyRunningHours * 365);

    addBox([
      `• Comparable Generator: ${generator.brandModel} (${generator.capacitykVA} kVA)`,
      `• Initial Cost: NGN ${generator.priceRange.replace(/₦/g, '').trim()}`,
      `• Annual Fuel Cost (${dailyRunningHours} hrs/day): NGN ${Math.ceil(estimatedAnnualFuelCost).toLocaleString()}`,
      `• Estimated Lifespan: ${generatorLifespanYears.toFixed(1)} years`,
      '',
      'Generator Additional Costs:',
      '• Regular fuel expenses',
      '• Maintenance and repairs',
      '• Noise pollution',
      '• Environmental impact',
      '• Reliability concerns',
      '',
      'Solar Advantages:',
      '• No fuel costs',
      '• Minimal maintenance',
      '• Silent operation',
      '• Zero emissions',
      '• Reliable performance'
    ], 'Generator Comparison');
  }

  // --- ENVIRONMENTAL IMPACT ---
  addSectionHeader('Environmental Impact');

  // Calculate environmental metrics
  const annualCO2Reduction = results.solarPanels.dailyOutput * 365 * 0.5; // 0.5 tons CO2 per MWh saved
  const treesEquivalent = Math.ceil(annualCO2Reduction * 50); // 50 trees per ton of CO2

  // Break down Environmental Impact into multiple boxes
  // 1. Carbon Footprint Reduction
  addBox([
    `• Annual CO₂ Reduction: ${annualCO2Reduction.toFixed(2)} tons`,
    `• Equivalent to planting ${treesEquivalent} trees annually`,
  ], 'Carbon Footprint Reduction');

  // 2. Environmental Benefits
  addBox([
    '• Clean, renewable energy generation',
    '• Zero harmful emissions during operation',
    '• Reduced dependence on fossil fuels',
    '• Contribution to sustainable development',
    '• Support for climate change mitigation',
  ], 'Environmental Benefits');

  // 3. Long-term Impact
  addBox([
    '• Reduced carbon footprint over system lifetime',
    '• Contribution to global sustainability goals',
    '• Positive environmental legacy',
    '• Support for clean energy transition',
  ], 'Long-term Impact');

  // --- BILL OF MATERIALS ---
  addSectionHeader('Bill of Materials');

  const batteryOption = results.batteryOptions[selectedBatteryType.toLowerCase() as 'tubular' | 'lithium'];

  addBox([
    'Based on your requirements, here is a list of the main components needed:',
    '',
    `• Inverter: 1 x ${results.inverterSize} kVA Hybrid Inverter`,
    `• Solar Panels: ${results.solarPanels.count} x ${results.solarPanels.totalWattage / results.solarPanels.count}W Monocrystalline Solar Panels`,
    `• Battery Bank: ${batteryOption.count} x ${batteryOption.modelName} (${(batteryOption.totalCapacity / 1000).toFixed(1)} kWh)`,
    `• AC Breaker: 1 x ${results.components.acBreaker.size} A`,
    `• DC Breaker: 1 x ${results.components.dcBreaker.size} A`,
    `• AVR: 1 x ${results.components.avr.size} kVA`,
    `• Recommended AC Cable Size: ${results.components.acBreaker.cableSize} mm²`,
    `• Recommended DC Cable Size: ${results.components.dcBreaker.cableSize} mm²`,
    `• Changeover Switch: 1 x ${results.components.changeoverSwitch.size} A (${results.components.changeoverSwitch.type})`,
    results.inverterSize >= 5 ? '  (Note: Automatic recommended for 5kVA+ if no major financial constraint)' : '  (Note: Manual typically sufficient below 5kVA)',
    '',
    'Important Considerations:',
    '',
    '• A site visit is required to determine accurate cable lengths, optimal panel orientations, and for a comprehensive site survey.',
    '• Additional components (e.g., surge protectors, trunking, mounting structure) may be required based on the site survey.',
    '',
    'For further details and site assessment, please contact Ibrahim Abdulraheem:',
    'WhatsApp: +234 906 673 0744',
  ], 'Bill of Materials');

  // --- FOOTER ---
  addFooter();

  // Save the PDF
  doc.save('solar-system-report.pdf');
};