import React, { useState, useEffect } from 'react';
import { initializePaystack, loadPaystackScript, hasPaid } from '../services/paystack';
import { SystemResults } from '../types';
import { generatePDF } from '../utils/pdfGenerator';
import PaymentHistory from './PaymentHistory';

interface PremiumDownloadButtonProps {
  results: SystemResults;
  selectedBatteryType: 'Tubular' | 'Lithium';
}

const PremiumDownloadButton: React.FC<PremiumDownloadButtonProps> = ({
  results,
  selectedBatteryType,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [isPaid, setIsPaid] = useState(false);

  useEffect(() => {
    loadPaystackScript().catch(console.error);
    const paid = hasPaid();
    setIsPaid(paid);
    const savedEmail = localStorage.getItem('premium_user_email');
    if (savedEmail) {
      setEmail(atob(savedEmail));
    }
  }, []);

  const handlePayment = async () => {
    if (!email) {
      alert('Please enter your email address');
      return;
    }

    setIsLoading(true);
    try {
      initializePaystack(email, () => {
        setIsLoading(false);
        setIsPaid(true);
        // Generate PDF after successful payment
        generatePDF(results, selectedBatteryType);
      });
    } catch (error) {
      console.error('Payment failed:', error);
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!isPaid) {
      handlePayment();
      return;
    }
    generatePDF(results, selectedBatteryType);
  };

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
        </ul>
      </div>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
      />
      <button
        onClick={handleDownload}
        disabled={isLoading}
        className="w-full px-6 py-3 text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Processing...' : isPaid ? 'Download Report' : 'Download Report (NGN 2,000)'}
      </button>
      <p className="text-xs text-gray-500 text-center">
        Secure payment powered by Paystack
      </p>
      <PaymentHistory />
    </div>
  );
};

export default PremiumDownloadButton; 