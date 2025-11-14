'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Banknote, MapPin, Calendar, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface CashPaymentProps {
  amount: number;
  onSuccess: (transactionId: string) => void;
}

export default function CashPayment({ amount, onSuccess }: CashPaymentProps) {
  const [receiptNumber, setReceiptNumber] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (receiptNumber.trim()) {
      onSuccess(`CASH-${receiptNumber}`);
    } else {
      toast.error('Please enter receipt number');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
        <div className="flex items-center gap-3 mb-6">
          <Banknote className="w-8 h-8 text-green-600" />
          <h3 className="text-2xl font-bold text-gray-900">Cash Payment</h3>
        </div>

        <div className="bg-green-50 rounded-xl p-6 mb-6 border-2 border-green-200">
          <div className="flex items-center gap-3 mb-4">
            <MapPin className="w-5 h-5 text-green-700" />
            <p className="font-semibold text-green-900">Payment Counter Location</p>
          </div>
          <p className="text-sm text-green-800 mb-2">
            <strong>BEC Administrative Block</strong><br />
            Accounts Department, Ground Floor<br />
            Room No: 104
          </p>
          <div className="flex items-center gap-2 mt-3">
            <Calendar className="w-4 h-4 text-green-700" />
            <span className="text-xs text-green-800">
              Mon-Fri: 9:00 AM - 5:00 PM | Sat: 9:00 AM - 1:00 PM
            </span>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-800">
              <p className="font-semibold mb-2">Payment Instructions:</p>
              <ol className="list-decimal list-inside space-y-1 text-xs">
                <li>Visit the payment counter during office hours</li>
                <li>Carry your USN and fee details</li>
                <li>Make payment of ₹{amount.toLocaleString()} in cash</li>
                <li>Collect the official receipt</li>
                <li>Enter the receipt number below to update records</li>
              </ol>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Receipt Number
            </label>
            <input
              type="text"
              value={receiptNumber}
              onChange={(e) => setReceiptNumber(e.target.value)}
              placeholder="Enter receipt number from counter"
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-green-500 focus:outline-none transition-colors font-mono"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-4 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all transform hover:scale-105"
          >
            Confirm Cash Payment
          </button>
        </form>
      </div>
    </motion.div>
  );
}