import React from 'react';
import { BOM } from '../types';
import { DownloadIcon, PrinterIcon, InfoIcon } from 'lucide-react';

interface BillOfMaterialsProps {
  bom: BOM;
  onDownload: () => void;
  onPrint: () => void;
}

export const BillOfMaterials: React.FC<BillOfMaterialsProps> = ({
  bom,
  onDownload,
  onPrint,
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Bill of Materials</h2>
          <p className="text-gray-600">Detailed breakdown of system components</p>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={onDownload}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <DownloadIcon className="w-5 h-5 mr-2" />
            Download PDF
          </button>
          <button
            onClick={onPrint}
            className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <PrinterIcon className="w-5 h-5 mr-2" />
            Print
          </button>
        </div>
      </div>

      {/* Components Table */}
      <div className="mb-8">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Component</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Specifications</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Quantity</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Unit Price</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {bom.items.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="font-medium text-gray-900">{item.component.name}</div>
                  <div className="text-sm text-gray-500">{item.component.category}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm text-gray-900">
                    {Object.entries(item.component.specifications).map(([key, value]) => (
                      <div key={key} className="flex items-center">
                        <span className="font-medium">{key}:</span>
                        <span className="ml-2">{value}</span>
                      </div>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3 text-right text-sm text-gray-900">{item.quantity}</td>
                <td className="px-4 py-3 text-right text-sm text-gray-900">
                  {formatCurrency(item.component.price)}
                </td>
                <td className="px-4 py-3 text-right text-sm text-gray-900">
                  {formatCurrency(item.totalPrice)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Recommendations */}
      {bom.recommendations.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recommendations</h3>
          <div className="bg-blue-50 rounded-lg p-4">
            <ul className="space-y-2">
              {bom.recommendations.map((recommendation, index) => (
                <li key={index} className="flex items-start">
                  <InfoIcon className="w-5 h-5 text-blue-500 mr-2 mt-0.5" />
                  <span className="text-blue-700">{recommendation}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Cost Summary */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Cost Summary</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium">{formatCurrency(bom.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Installation (15%)</span>
            <span className="font-medium">{formatCurrency(bom.installation)}</span>
          </div>
          <div className="border-t border-gray-200 pt-3">
            <div className="flex justify-between">
              <span className="text-lg font-semibold text-gray-800">Total</span>
              <span className="text-lg font-bold text-gray-900">{formatCurrency(bom.total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 