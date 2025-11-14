'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, Loader, ChevronDown, ChevronUp, ExternalLink, CheckCircle2, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatPanel from '@/components/ChatPanel';
import toast from 'react-hot-toast';
import { FEE_STRUCTURE, FeeType, calculateTotal } from '@/lib/data/feeStructure';

interface Student {
  usn: string;
  studentName: string;
  email: string;
  paidFees?: string[];
}

interface Payment {
  _id: string;
  feeIds: string[];
  amount: number;
  transactionHash: string;
  paymentMethod: string;
  createdAt: string;
}

export default function DashboardPage() {
  const [student, setStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFees, setSelectedFees] = useState<string[]>([]);
  const [expandedFees, setExpandedFees] = useState<string[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [paidFeeIds, setPaidFeeIds] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
    loadPayments();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (!response.ok) {
        router.push('/login');
        return;
      }
      const data = await response.json();
      setStudent(data.student);
      setPaidFeeIds(data.student.paidFees || []);
    } catch (error) {
      router.push('/login');
    } finally {
      setIsLoading(false);
    }
  };

  const loadPayments = async () => {
    try {
      const response = await fetch('/api/payments');
      if (response.ok) {
        const data = await response.json();
        setPayments(data.payments || []);
      }
    } catch (error) {
      console.error('Failed to load payments:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      toast.success('Logged out successfully');
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const toggleFeeSelection = (feeId: string) => {
    if (paidFeeIds.includes(feeId)) {
      toast.error('This fee has already been paid');
      return;
    }

    setSelectedFees(prev =>
      prev.includes(feeId)
        ? prev.filter(id => id !== feeId)
        : [...prev, feeId]
    );
  };

  const toggleFeeExpand = (feeId: string) => {
    setExpandedFees(prev =>
      prev.includes(feeId)
        ? prev.filter(id => id !== feeId)
        : [...prev, feeId]
    );
  };

  const handleProceedToPayment = () => {
    if (selectedFees.length === 0) {
      toast.error('Please select at least one fee to pay');
      return;
    }

    const feeIdsParam = selectedFees.join(',');
    router.push(`/payment?feeIds=${feeIdsParam}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="three-body">
          <div className="three-body__dot"></div>
          <div className="three-body__dot"></div>
          <div className="three-body__dot"></div>
        </div>
      </div>
    );
  }

  const totalAmount = calculateTotal(selectedFees);
  const unpaidFees = FEE_STRUCTURE.filter(fee => !paidFeeIds.includes(fee.id));
  const paidFeesData = FEE_STRUCTURE.filter(fee => paidFeeIds.includes(fee.id));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
              {student?.studentName.charAt(0)}
            </div>
            <div>
              <h1 className="text-gray-900 font-bold text-xl">{student?.studentName}</h1>
              <p className="text-gray-600 text-sm">{student?.usn}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-6 py-3 bg-red-500 rounded-lg text-white font-bold text-sm uppercase hover:bg-red-600 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
          >
            <p className="text-gray-600 text-sm mb-2">Total Pending</p>
            <p className="text-3xl font-bold text-gray-900">
              ₹{unpaidFees.reduce((sum, fee) => sum + fee.total, 0).toLocaleString()}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
          >
            <p className="text-gray-600 text-sm mb-2">Total Paid</p>
            <p className="text-3xl font-bold text-green-600">
              ₹{paidFeesData.reduce((sum, fee) => sum + fee.total, 0).toLocaleString()}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
          >
            <p className="text-gray-600 text-sm mb-2">Transactions</p>
            <p className="text-3xl font-bold text-gray-900">{payments.length}</p>
          </motion.div>
        </div>

        {/* Unpaid Fees */}
        {unpaidFees.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Pending Payments</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {unpaidFees.map((fee, index) => (
                <motion.div
                  key={fee.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`bg-white rounded-2xl p-6 border-2 transition-all cursor-pointer ${
                    selectedFees.includes(fee.id)
                      ? 'border-green-500 shadow-lg'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3 flex-1">
                      <input
                        type="checkbox"
                        checked={selectedFees.includes(fee.id)}
                        onChange={() => toggleFeeSelection(fee.id)}
                        className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-2xl">{fee.icon}</span>
                          <h3 className="text-xl font-bold text-gray-900">{fee.name}</h3>
                        </div>
                        <p className="text-sm text-gray-600">
                          Due: {new Date(fee.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-3xl font-bold text-gray-900">₹{fee.total.toLocaleString()}</p>
                    <p className="text-sm text-gray-500 mt-1">0.0001 ETH (Sepolia)</p>
                  </div>

                  <button
                    onClick={() => toggleFeeExpand(fee.id)}
                    className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <span className="text-sm font-semibold text-gray-700">View Breakdown</span>
                    {expandedFees.includes(fee.id) ? (
                      <ChevronUp className="w-4 h-4 text-gray-600" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-600" />
                    )}
                  </button>

                  <AnimatePresence>
                    {expandedFees.includes(fee.id) && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 space-y-2"
                      >
                        {fee.breakdown.map((item) => (
                          <div key={item.id} className="flex justify-between items-start p-3 bg-gray-50 rounded-lg">
                            <div className="flex-1">
                              <p className="font-semibold text-gray-900 text-sm">{item.category}</p>
                              <p className="text-xs text-gray-600">{item.description}</p>
                            </div>
                            <p className="font-bold text-gray-900">₹{item.amount.toLocaleString()}</p>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Paid Fees */}
        {paidFeesData.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Paid Fees</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {paidFeesData.map((fee) => (
                <div
                  key={fee.id}
                  className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{fee.icon}</span>
                        <h3 className="text-xl font-bold text-gray-900">{fee.name}</h3>
                      </div>
                      <p className="text-sm text-green-700 font-semibold">Payment Completed</p>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">₹{fee.total.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Transaction History */}
        {payments.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Transaction History</h2>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="space-y-4">
                {payments.map((payment) => (
                  <div
                    key={payment._id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                        <p className="font-bold text-gray-900">
                          {payment.feeIds.map(id => FEE_STRUCTURE.find(f => f.id === id)?.name).join(', ')}
                        </p>
                      </div>
                      <p className="text-sm text-gray-600">
                        {new Date(payment.createdAt).toLocaleString()}  {payment.paymentMethod.toUpperCase()}
                      </p>
                      <a
                        href={`https://sepolia.etherscan.io/tx/${payment.transactionHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 mt-1"
                      >
                        View on Etherscan
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <p className="text-xl font-bold text-green-600">₹{payment.amount.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating Payment Button */}
      <AnimatePresence>
        {selectedFees.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-24 right-6 z-40"
          >
            <div className="bg-white rounded-2xl p-6 shadow-2xl border border-gray-200 min-w-[300px]">
              <p className="text-sm text-gray-600 mb-2">{selectedFees.length} fee(s) selected</p>
              <p className="text-3xl font-bold text-gray-900 mb-4">₹{totalAmount.toLocaleString()}</p>
              <button
                onClick={handleProceedToPayment}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-4 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-105"
              >
                Proceed to Payment
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      {student && <ChatPanel usn={student.usn} studentName={student.studentName} />}
    </div>
  );
}