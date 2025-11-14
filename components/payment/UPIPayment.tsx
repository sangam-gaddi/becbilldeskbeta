'use client';

import { useState } from 'react';
import { Copy, Check, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Image from 'next/image';

interface UPIPaymentProps {
  amount: number;
  onSuccess: (transactionId: string) => void;
}

export default function UPIPayment({ amount, onSuccess }: UPIPaymentProps) {
  const [transactionId, setTransactionId] = useState('');
  const [copied, setCopied] = useState(false);
  const upiId = 'becbilldesk@paytm';

  const copyUPI = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    toast.success('UPI ID copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (transactionId.trim()) {
      onSuccess(transactionId);
    } else {
      toast.error('Please enter transaction ID');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Pay via UPI</h3>
        
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 mb-6">
          <p className="text-sm text-gray-600 mb-3">UPI ID</p>
          <div className="flex items-center justify-between bg-white rounded-lg p-4 border-2 border-purple-200">
            <span className="font-mono font-bold text-gray-900 text-lg">{upiId}</span>
            <button
              onClick={copyUPI}
              className="ml-4 p-2 hover:bg-purple-100 rounded-lg transition-colors"
            >
              {copied ? (
                <Check className="w-5 h-5 text-green-600" />
              ) : (
                <Copy className="w-5 h-5 text-purple-600" />
              )}
            </button>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-amber-800">
            <p className="font-semibold mb-1">Payment Instructions:</p>
            <ol className="list-decimal list-inside space-y-1 text-xs">
              <li>Copy the UPI ID above</li>
              <li>Open any UPI app (PhonePe, Google Pay, Paytm, etc.)</li>
              <li>Pay ₹{amount.toLocaleString()} to the UPI ID</li>
              <li>Enter the transaction ID below after payment</li>
            </ol>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Transaction ID / UPI Reference Number
            </label>
            <input
              type="text"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              placeholder="Enter 12-digit transaction ID"
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition-colors font-mono"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-4 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105"
          >
            Verify Payment
          </button>
        </form>
      </div>
    </motion.div>
  );
}