import React, { useState, useEffect } from 'react';
import { getPaymentHistory, clearPaymentData } from '../services/paystack';
import { formatCurrency } from '../utils/calculations';

const PaymentHistory: React.FC = () => {
  const [history, setHistory] = useState(getPaymentHistory());
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    setHistory(getPaymentHistory());
  }, []);

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all payment data? This is for testing purposes only.')) {
      clearPaymentData();
      setHistory([]);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!showHistory) {
    return (
      <button
        onClick={() => setShowHistory(true)}
        className="text-sm text-gray-600 hover:text-gray-800 underline"
      >
        View Payment History
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Payment History</h3>
          <div className="space-x-2">
            <button
              onClick={handleClearData}
              className="px-3 py-1 text-sm text-red-600 hover:text-red-800"
            >
              Clear Data (Test)
            </button>
            <button
              onClick={() => setShowHistory(false)}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
            >
              Close
            </button>
          </div>
        </div>

        {history.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No payment history found</p>
        ) : (
          <div className="space-y-4">
            {history.map((payment) => (
              <div
                key={payment.reference}
                className="border rounded-lg p-4 hover:bg-gray-50"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{payment.email}</p>
                    <p className="text-sm text-gray-500">
                      {formatDate(payment.date)}
                    </p>
                    <p className="text-sm text-gray-500">
                      Ref: {payment.reference}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(payment.amount)}</p>
                    <span
                      className={`inline-block px-2 py-1 text-xs rounded-full ${
                        payment.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {payment.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentHistory; 