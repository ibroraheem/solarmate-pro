import React, { useState, useEffect } from 'react';
import { initializePaystack, loadPaystackScript } from '../services/paystack';
import { SystemResults } from '../types';
import { generatePDF } from '../utils/pdfGenerator';

interface PremiumDownloadButtonProps {
  results: SystemResults | null;
  backupHours: number;
  selectedState: { name: string; psh: number } | undefined;
}

const PremiumDownloadButton: React.FC<PremiumDownloadButtonProps> = ({
  results,
  backupHours,
  selectedState,
}) => {
  const [isPaid, setIsPaid] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');

  // Check payment status on component mount
  useEffect(() => {
    const checkPaymentStatus = () => {
      const paymentTimestamp = localStorage.getItem('solarMateReportPaymentTimestamp');
      if (paymentTimestamp) {
        const timePaid = parseInt(paymentTimestamp, 10);
        const tenMinutesInMillis = 10 * 60 * 1000;
        if (Date.now() - timePaid < tenMinutesInMillis) {
          setIsPaid(true);
        } else {
          localStorage.removeItem('solarMateReportPaymentTimestamp');
          setIsPaid(false);
        }
      } else {
        setIsPaid(false);
      }
    };

    checkPaymentStatus();
  }, []);

  const handlePayment = async () => {
    if (!email) {
      alert('Please enter your email address to proceed with payment');
      return;
    }

    setIsLoading(true);
    try {
      await loadPaystackScript();
      initializePaystack(email, () => {
        setIsPaid(true);
        localStorage.setItem('solarMateReportPaymentTimestamp', Date.now().toString());
        setIsLoading(false);
      });
    } catch (error) {
      console.error('Payment initialization failed:', error);
      setIsLoading(false);
      setIsPaid(false);
    }
  };

  const handleDownload = () => {
    if (results && isPaid) {
      generatePDF(results, results.batteryOptions.lithium.count > 0 ? 'Lithium' : 'Tubular', backupHours, selectedState);
    }
  };

  if (!results) {
    return null;
  }

  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-semibold text-gray-800">Download System Report</h3>
      <div className="space-y-2 text-center">
        <p className="text-sm text-gray-600">
          Get your detailed solar system report with:
        </p>
        <ul className="text-sm text-gray-600 list-disc list-inside">
          <li>Complete component specifications</li>
          <li>Detailed pricing breakdown</li>
          <li>Technical specifications</li>
          <li>System performance analysis</li>
          <li>Solar laws and regulations</li>
          <li>Location-based solar data</li>
          <li>Environmental impact analysis</li>
          <li>Maintenance and warranty information</li>
        </ul>
      </div>

      {!isPaid ? (
        <div className="w-full space-y-4">
          <div className="w-full">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <button
            onClick={handlePayment}
            disabled={isLoading || !email}
            className="w-full px-6 py-3 text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Processing Payment...' : 'Pay NGN 2,000 to Download Report'}
          </button>
        </div>
      ) : (
        <button
          onClick={handleDownload}
          className="w-full px-6 py-3 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Download Your Report
        </button>
      )}
      <p className="text-xs text-gray-500 text-center">
        Secure payment powered by Paystack
      </p>
    </div>
  );
};

export default PremiumDownloadButton; 