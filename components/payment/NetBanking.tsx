'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, CreditCard, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

interface NetBankingProps {
  amount: number;
  onSuccess: (transactionId: string) => void;
}

const banks = [
  { id: 'sbi', name: 'State Bank of India', logo: '' },
  { id: 'hdfc', name: 'HDFC Bank', logo: '🏦' },
  { id: 'icici', name: 'ICICI Bank', logo: '🏦' },
  { id: 'axis', name: 'Axis Bank', logo: '🏦' },
  { id: 'pnb', name: 'Punjab National Bank', logo: '🏦' },
  { id: 'kotak', name: 'Kotak Mahindra Bank', logo: '🏦' },
];

export default function NetBanking({ amount, onSuccess }: NetBankingProps) {
  const [selectedBank, setSelectedBank] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleProceed = () => {
    if (!selectedBank) {
      toast.error('Please select a bank');
      return;
    }

    setProcessing(true);
    toast.success('Redirecting to bank portal...');
    
    setTimeout(() => {
      const mockTransactionId = `NB${Date.now()}${Math.random().toString(36).substring(7).toUpperCase()}`;
      setProcessing(false);
      onSuccess(mockTransactionId);
    }, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
        <div className="flex items-center gap-3 mb-6">
          <Building2 className="w-8 h-8 text-blue-600" />
          <h3 className="text-2xl font-bold text-gray-900">Net Banking</h3>
        </div>

        <p className="text-gray-600 mb-6">Select your bank to proceed with payment</p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {banks.map((bank) => (
            <button
              key={bank.id}
              onClick={() => setSelectedBank(bank.id)}
              className={`p-4 rounded-xl border-2 transition-all ${
                selectedBank === bank.id
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <div className="text-3xl mb-2">{bank.logo}</div>
              <p className="text-sm font-semibold text-gray-900">{bank.name}</p>
            </button>
          ))}
        </div>

        <div className="bg-blue-50 rounded-xl p-4 mb-6 flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-blue-600" />
          <p className="text-sm text-blue-900">
            Secure payment gateway powered by 256-bit SSL encryption
          </p>
        </div>

        <button
          onClick={handleProceed}
          disabled={!selectedBank || processing}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {processing ? 'Processing...' : `Pay ₹${amount.toLocaleString()}`}
        </button>
      </div>
    </motion.div>
  );
}