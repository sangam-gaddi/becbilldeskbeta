'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wallet, ExternalLink, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { useAccount, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { parseEther } from 'viem';
import toast from 'react-hot-toast';
import { COLLEGE_WALLET_ADDRESS, PAYMENT_AMOUNT_ETH } from '@/config/wagmi';

interface CryptoPaymentProps {
  amount: number;
  onSuccess: (transactionId: string) => void;
}

export default function CryptoPayment({ amount, onSuccess }: CryptoPaymentProps) {
  const { address, isConnected } = useAccount();
  
  const { sendTransaction, data: hash, isPending, error } = useSendTransaction();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (isSuccess && hash) {
      toast.success('Payment confirmed on blockchain!');
      onSuccess(hash);
    }
  }, [isSuccess, hash, onSuccess]);

  useEffect(() => {
    if (error) {
      console.error('Transaction error:', error);
      toast.error(error.message || 'Transaction failed. Please try again.');
    }
  }, [error]);

  const handlePayment = async () => {
    if (!isConnected || !address) {
      toast.error('Please connect your wallet first');
      return;
    }

    try {
      // Simple ETH transfer - no contract, no ABI needed!
      sendTransaction({
        to: COLLEGE_WALLET_ADDRESS as `0x${string}`,
        value: parseEther(PAYMENT_AMOUNT_ETH),
      });
      
      toast.success('Transaction submitted! Waiting for confirmation...', {
        duration: 5000,
      });
    } catch (err: any) {
      console.error('Payment error:', err);
      toast.error(err.message || 'Payment failed');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-2xl p-8 shadow-xl border border-purple-500/30">
        <div className="flex items-center gap-3 mb-6">
          <Wallet className="w-8 h-8 text-purple-300" />
          <h3 className="text-2xl font-bold text-white">Pay with Crypto</h3>
        </div>

        <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 mb-6 border border-purple-500/20">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-xs text-purple-300 mb-1">Network</p>
              <p className="text-sm font-bold text-white">Sepolia Testnet</p>
            </div>
            <div>
              <p className="text-xs text-purple-300 mb-1">Amount</p>
              <p className="text-sm font-bold text-white">{PAYMENT_AMOUNT_ETH} ETH</p>
            </div>
            <div className="col-span-2">
              <p className="text-xs text-purple-300 mb-1">College Wallet</p>
              <p className="text-xs font-mono text-white break-all">{COLLEGE_WALLET_ADDRESS}</p>
            </div>
          </div>
        </div>

        {!isConnected ? (
          <div className="space-y-4">
            <div className="bg-amber-500/20 border border-amber-500/30 rounded-xl p-4 mb-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-300 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-amber-100">
                  <p className="font-semibold mb-1">Before you pay:</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Make sure you have Sepolia ETH in your wallet</li>
                    <li>Get free Sepolia ETH from faucet if needed</li>
                    <li>Connect your wallet (MetaMask, Rainbow, etc.)</li>
                    <li>Mobile wallets can scan QR code!</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <ConnectButton 
                chainStatus="icon"
                showBalance={true}
              />
            </div>

            <div className="text-center mt-4 space-y-2">
              <a
                href="https://sepoliafaucet.com"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-purple-300 hover:text-purple-200 underline"
              >
                 Get Free Sepolia ETH (Alchemy Faucet)
              </a>
              <a
                href="https://www.infura.io/faucet/sepolia"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-purple-300 hover:text-purple-200 underline"
              >
                 Infura Sepolia Faucet
              </a>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-300" />
                <div>
                  <p className="text-sm font-semibold text-white">Wallet Connected</p>
                  <p className="text-xs text-green-300 font-mono">{address?.slice(0, 6)}...{address?.slice(-4)}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-center mb-4">
              <ConnectButton 
                chainStatus="icon"
                showBalance={true}
              />
            </div>

            {hash && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-4"
              >
                <p className="text-sm text-blue-100 mb-2 font-semibold flex items-center gap-2">
                  {isConfirming ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                       Confirming transaction...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                       Transaction confirmed!
                    </>
                  )}
                </p>
                <p className="text-xs text-blue-200 mb-2 font-mono break-all">
                  {hash}
                </p>
                <a
                  href={`https://sepolia.etherscan.io/tx/${hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-300 hover:text-blue-200 underline inline-flex items-center gap-1"
                >
                   View on Etherscan
                  <ExternalLink className="w-4 h-4" />
                </a>
              </motion.div>
            )}

            <button
              onClick={handlePayment}
              disabled={isPending || isConfirming || isSuccess}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 shadow-lg"
            >
              {isPending || isConfirming ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {isPending ? 'Sending Transaction...' : 'Confirming on Blockchain...'}
                </>
              ) : isSuccess ? (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  Payment Successful! 
                </>
              ) : (
                <>
                   Pay {PAYMENT_AMOUNT_ETH} ETH (₹{amount.toLocaleString()})
                </>
              )}
            </button>

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-red-500/20 border border-red-500/30 rounded-xl p-3"
              >
                <p className="text-sm text-red-200 font-semibold mb-1"> Transaction Failed</p>
                <p className="text-xs text-red-300">{error.message}</p>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}