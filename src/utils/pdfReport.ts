import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { SystemResults } from '../types';

interface PDFReportOptions {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  installationAddress: string;
}

export const generatePDFReport = async (
  results: SystemResults,
  options: PDFReportOptions
): Promise<Blob> => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  
  // Title Page
  doc.setFontSize(24);
  doc.text('Solar System Design Report', pageWidth / 2, 40, { align: 'center' });
  
  doc.setFontSize(16);
  doc.text('Customer Information', pageWidth / 2, 60, { align: 'center' });
  
  doc.setFontSize(12);
  doc.text(`Name: ${options.customerName}`, 20, 80);
  doc.text(`Email: ${options.customerEmail}`, 20, 90);
  doc.text(`Phone: ${options.customerPhone}`, 20, 100);
  doc.text(`Address: ${options.installationAddress}`, 20, 110);
  
  // System Overview
  doc.addPage();
  doc.setFontSize(20);
  doc.text('System Overview', 20, 30);
  
  doc.setFontSize(12);
  const systemOverview = [
    ['Peak Load', `${(results.peakLoad / 1000).toFixed(1)} kW`],
    ['Daily Consumption', `${(results.dailyConsumption / 1000).toFixed(1)} kWh`],
    ['Solar Production', `${results.solarPanels.dailyProduction.toFixed(1)} kWh`],
    ['Battery Capacity', `${(results.batteries.count * results.batteries.capacity).toFixed(1)} kWh`],
    ['Backup Hours', `${results.backupHours} hours`],
  ];
  
  (doc as any).autoTable({
    startY: 40,
    head: [['Parameter', 'Value']],
    body: systemOverview,
    theme: 'grid',
  });
  
  // Component Details
  doc.addPage();
  doc.setFontSize(20);
  doc.text('Component Specifications', 20, 30);
  
  // Solar Panels
  doc.setFontSize(14);
  doc.text('Solar Panels', 20, 45);
  const solarDetails = [
    ['Number of Panels', `${results.solarPanels.count}`],
    ['Panel Capacity', `${results.solarPanels.capacity}W`],
    ['Total Capacity', `${results.solarPanels.totalCapacity}kWp`],
    ['Daily Production', `${results.solarPanels.dailyProduction.toFixed(1)}kWh`],
  ];
  
  (doc as any).autoTable({
    startY: 55,
    body: solarDetails,
    theme: 'grid',
  });
  
  // Batteries
  doc.setFontSize(14);
  doc.text('Battery Bank', 20, 100);
  const batteryDetails = [
    ['Number of Batteries', `${results.batteries.count}`],
    ['Battery Type', results.batteries.type],
    ['Capacity per Battery', `${results.batteries.capacity}kWh`],
    ['Total Capacity', `${(results.batteries.count * results.batteries.capacity).toFixed(1)}kWh`],
    ['System Voltage', `${results.batteries.voltage}V`],
  ];
  
  (doc as any).autoTable({
    startY: 110,
    body: batteryDetails,
    theme: 'grid',
  });
  
  // Inverter
  doc.setFontSize(14);
  doc.text('Inverter', 20, 155);
  const inverterDetails = [
    ['Type', results.inverter.type],
    ['Capacity', `${results.inverter.size}kVA`],
    ['System Voltage', `${results.inverter.voltage}V`],
  ];
  
  (doc as any).autoTable({
    startY: 165,
    body: inverterDetails,
    theme: 'grid',
  });
  
  // System Protection
  doc.addPage();
  doc.setFontSize(20);
  doc.text('System Protection & Safety', 20, 30);
  
  // Circuit Protection
  doc.setFontSize(14);
  doc.text('Circuit Protection', 20, 45);
  const protectionDetails = [
    ['Main Breaker', `${Math.ceil(results.peakLoad / 230)}A`],
    ['Solar Array Breaker', `${Math.ceil(results.solarPanels.totalCapacity * 1000 / 48)}A`],
    ['Battery Bank Breaker', `${Math.ceil(results.batteries.count * results.batteries.capacity * 1000 / 48)}A`],
  ];
  
  (doc as any).autoTable({
    startY: 55,
    body: protectionDetails,
    theme: 'grid',
  });
  
  // Cable Specifications
  doc.setFontSize(14);
  doc.text('Cable Specifications', 20, 100);
  const cableDetails = [
    ['Solar Array', `${Math.ceil(results.solarPanels.totalCapacity * 1000 / 48 / 4)}mm²`],
    ['Battery Bank', `${Math.ceil(results.batteries.count * results.batteries.capacity * 1000 / 48 / 4)}mm²`],
    ['Load Distribution', `${Math.ceil(results.peakLoad / 230 / 4)}mm²`],
  ];
  
  (doc as any).autoTable({
    startY: 110,
    body: cableDetails,
    theme: 'grid',
  });
  
  // Energy Analysis
  doc.addPage();
  doc.setFontSize(20);
  doc.text('Energy Analysis', 20, 30);
  
  // Add charts here using doc.addImage()
  // You'll need to convert the charts to base64 images first
  
  // Recommendations
  doc.addPage();
  doc.setFontSize(20);
  doc.text('System Recommendations', 20, 30);
  
  doc.setFontSize(12);
  const recommendations = [
    '• Regular maintenance of solar panels is recommended every 6 months',
    '• Battery terminals should be checked and cleaned quarterly',
    '• Keep the inverter area well-ventilated and free from dust',
    '• Monitor system performance through the inverter display',
    '• Consider expanding the system if energy needs increase',
  ];
  
  recommendations.forEach((rec, index) => {
    doc.text(rec, 20, 50 + (index * 10));
  });
  
  // Convert to blob
  return doc.output('blob');
}; 