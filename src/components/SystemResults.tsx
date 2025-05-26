import React, { useState } from 'react';
import { SystemResults as SystemResultsType } from '../types';
import { InfoIcon } from './Icons';
import SystemCharts from './SystemCharts';
import { generatePDFReport } from '../utils/reportGenerator';
import { initializePayment } from '../utils/payment';

interface SystemResultsProps {
  results: SystemResultsType;
  onBack: () => void;
  onRestart: () => void;
}

const SystemResults: React.FC<SystemResultsProps> = ({ 
  results, 
  onBack,
  onRestart,
}) => {
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [customerEmail, setCustomerEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

  const getSystemSummary = () => {
    const systemType = 'Off-grid';
    const batteryType = results.batteries.type;
    const batteryCount = results.batteries.count;
    const panelCount = results.solarPanels.count;
    const totalCapacity = results.solarPanels.totalCapacity;

    return {
      type: systemType,
      description: `${systemType} system with ${panelCount} solar panels (${totalCapacity}kWp total) and ${batteryCount} ${batteryType} batteries`,
      backup: `${results.backupHours} hours of backup power`,
      dailyProduction: `${results.solarPanels.dailyProduction.toFixed(1)}kWh daily production`,
      peakLoad: `${(results.peakLoad / 1000).toFixed(1)}kW peak load`
    };
  };

  const summary = getSystemSummary();
  
  const handlePayment = async () => {
    if (!customerEmail) {
      setError('Please enter your email address');
      return;
    }

    setError(null);
    try {
      await initializePayment(
        customerEmail,
        async (reference) => {
          // Payment successful, generate report
          setIsGeneratingReport(true);
          try {
            const report = await generatePDFReport(results, {
              customerName: 'Customer',
              customerEmail,
              customerPhone: '',
              installationAddress: '',
              state: results.state || 'Lagos' // Provide default state if not available
            });
            
            // Create a download link with reference in filename
            const url = window.URL.createObjectURL(report);
            const link = document.createElement('a');
            link.href = url;
            link.download = `solar-system-design-report-${reference}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            
            setShowPaymentModal(false);
            setCustomerEmail('');
          } catch (error) {
            console.error('Error generating report:', error);
            setError('Failed to generate report. Please try again or contact support.');
          } finally {
            setIsGeneratingReport(false);
          }
        },
        () => {
          // Payment cancelled
          setShowPaymentModal(false);
          setCustomerEmail('');
        }
      );
    } catch (error) {
      console.error('Payment error:', error);
      setError('Payment failed. Please try again or contact support.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">System Analysis Results</h2>

      {/* System Summary Card */}
      <div className="bg-blue-50 p-6 rounded-xl mb-8">
        <h3 className="text-xl font-semibold mb-4">System Overview</h3>
        <div className="space-y-2">
          <p className="text-lg">{summary.description}</p>
          <p>• {summary.backup}</p>
          <p>• {summary.dailyProduction}</p>
          <p>• {summary.peakLoad}</p>
          <p>• System Voltage: {results.batteries.voltage}V</p>
          <p>• System Phase: Single Phase</p>
          <p className="text-red-600 font-medium">• Maximum System Capacity: 20kVA</p>
        </div>
      </div>

      {/* System Limitations Notice */}
      <div className="bg-red-50 border border-red-200 p-4 rounded-xl mb-8">
        <h3 className="text-lg font-semibold text-red-700 mb-2">System Limitations</h3>
        <div className="space-y-2 text-red-600">
          <p>• Maximum system capacity is limited to 20kVA</p>
          <p>• All systems are designed for single-phase operation</p>
          <p>• For larger systems, please contact for custom solutions</p>
        </div>
      </div>

      {/* System Charts */}
      <SystemCharts
        peakLoad={results.peakLoad}
        dailyConsumption={results.dailyConsumption}
        solarPanels={results.solarPanels}
        batteries={results.batteries}
        backupHours={results.backupHours}
      />

      {/* Component Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Solar Panels */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-lg font-semibold">Solar Panels</h3>
            <div className="group relative">
              <InfoIcon className="h-4 w-4 text-gray-400 cursor-help" />
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-2 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity">
                Solar panels convert sunlight into electricity. The number of panels is calculated based on your daily energy needs and local solar conditions.
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <p>• {results.solarPanels.count}x {results.solarPanels.capacity}W panels</p>
            <p>• {results.solarPanels.totalCapacity}kWp total capacity</p>
            <p>• {results.solarPanels.dailyProduction.toFixed(1)}kWh daily production</p>
          </div>
          </div>
          
        {/* Inverter */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-lg font-semibold">Inverter</h3>
            <div className="group relative">
              <InfoIcon className="h-4 w-4 text-gray-400 cursor-help" />
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-2 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity">
                The inverter converts DC power from solar panels to AC power for your home. It also manages battery charging and grid interaction.
              </div>
            </div>
                </div>
                <div className="space-y-2">
            <p>• {results.inverter.size}kVA {results.inverter.type}</p>
            <p>• {results.inverter.voltage}V system</p>
                  </div>
                </div>

        {/* Batteries */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-lg font-semibold">Batteries</h3>
            <div className="group relative">
              <InfoIcon className="h-4 w-4 text-gray-400 cursor-help" />
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-2 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity">
                Batteries store excess solar energy for use when the sun isn't shining. The number of batteries is calculated based on your backup requirements and system voltage.
              </div>
            </div>
                </div>
                <div className="space-y-2">
            <p>• {results.batteries.count}x {results.batteries.type} batteries</p>
            <p>• {results.batteries.capacity}kWh per battery ({results.batteries.count * results.batteries.capacity}kWh total)</p>
            <p>• {results.batteries.voltage}V system</p>
            <p>• {results.batteries.type === 'Lithium' ? '90%' : '50%'} depth of discharge</p>
                  </div>
                  </div>

        {/* Charge Controller */}
        {results.chargeController && (
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-lg font-semibold">Charge Controller</h3>
              <div className="group relative">
                <InfoIcon className="h-4 w-4 text-gray-400 cursor-help" />
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-2 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  The charge controller regulates the power flow from solar panels to batteries, preventing overcharging and optimizing charging efficiency.
                </div>
              </div>
            </div>
                  <div className="space-y-2">
              <p>• {results.chargeController.type} type</p>
              <p>• {results.chargeController.current}A current rating</p>
              <p>• {results.chargeController.voltage}V system</p>
                    </div>
                  </div>
                )}
            </div>
            
      {/* System Protection
      <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
        <h3 className="text-lg font-semibold mb-4">System Protection & Safety</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-2">AC Circuit Protection</h4>
            <div className="space-y-2">
              <p>• Main Breaker: {Math.ceil((results.peakLoad / 230) * 1.25)}A (for {Math.ceil(results.peakLoad / 1000)}kW system)</p>
              <p>• Inverter-Load Breaker: {Math.ceil((results.peakLoad / 230) * 1.25)}A</p>
              <p>• Mains-Inverter Breaker: {Math.ceil((results.peakLoad / 230) * 1.25)}A</p>
              </div>
              </div>
          <div>
            <h4 className="font-medium mb-2">DC Circuit Protection</h4>
            <div className="space-y-2">
              <p>• Solar String Breaker: {Math.ceil((results.solarPanels.capacity / 37) * 1.25)}A per string</p>
              <p>• Battery Bank Breaker: {Math.ceil((results.batteries.count * results.batteries.capacity * 1000 / results.batteries.voltage) * 1.25)}A</p>
              <p>• Number of Strings: {Math.ceil(results.solarPanels.count / Math.floor(results.batteries.voltage / 37))}</p>
              <p>• Panels per String: {Math.ceil(results.solarPanels.count / Math.ceil(results.solarPanels.count / Math.floor(results.batteries.voltage / 37)))}</p>
            </div>
              </div>
          <div>
            <h4 className="font-medium mb-2">Cable Specifications</h4>
            <div className="space-y-2">
              <p>• Solar Array: {Math.ceil((results.solarPanels.capacity / 37) * 1.25 / 4)}mm² per string</p>
              <p>• Battery Bank: {Math.ceil((results.batteries.count * results.batteries.capacity * 1000 / results.batteries.voltage) * 1.25 / 4)}mm²</p>
              <p>• Load Distribution: {Math.ceil((results.peakLoad / 230) * 1.25 / 4)}mm²</p>
            </div>
          </div>
        </div>
      </div> */}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Download Detailed Report</h3>
            <p className="text-gray-600 mb-4">
              Please enter your email address to proceed with the payment of ₦3,000
            </p>
            <input
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full p-2 border rounded mb-4"
            />
            {error && (
              <p className="text-red-500 text-sm mb-4">{error}</p>
            )}
            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setShowPaymentModal(false);
                  setCustomerEmail('');
                  setError(null);
                }}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handlePayment}
                disabled={isGeneratingReport}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
              >
                {isGeneratingReport ? 'Processing...' : 'Pay ₦3,000'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Back
        </button>
        <div className="space-x-4">
          <button
            onClick={onRestart}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Start New Calculation
          </button>
          <button
            onClick={() => setShowPaymentModal(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Download Detailed Report (₦3,000)
          </button>
        </div>
      </div>
    </div>
  );
};

export default SystemResults;