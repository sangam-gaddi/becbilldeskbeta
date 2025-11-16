'use client';

import { useEffect, useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { usePayment } from '@/hooks/usePayment';
import { useRouter } from 'next/navigation';
import { Loader2, CheckCircle2, AlertCircle, ExternalLink, Smartphone, Wallet as WalletIcon } from 'lucide-react';

interface PaymentButtonProps {
  amount: string;
  recipient: `0x${string}`;
}

export function PaymentButton({ amount, recipient }: PaymentButtonProps) {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  
  const {
    isConnected,
    hash,
    isSending,
    isConfirming,
    isConfirmed,
    recordingPayment,
    paymentRecorded,
    sendError,
    receiptError,
    initiatePayment,
    recordPayment,
  } = usePayment({ amount, recipient });

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // ✅ FIX: Auto-record payment when confirmed
  useEffect(() => {
    console.log('🔍 Payment state:', { isConfirmed, hash, recordingPayment, paymentRecorded });
    
    if (isConfirmed && hash && !recordingPayment && !paymentRecorded) {
      console.log('🚀 Triggering payment recording...');
      recordPayment().then((success) => {
        console.log('✅ Recording result:', success);
        if (success) {
          setTimeout(() => {
            console.log('🔄 Redirecting to dashboard...');
            router.push('/dashboard');
            router.refresh();
          }, 3000);
        }
      });
    }
  }, [isConfirmed, hash, recordingPayment, paymentRecorded, recordPayment, router]);

  // Show wallet connection options
  if (!isConnected) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-400 p-6 rounded-xl">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-6 h-6 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-semibold text-yellow-900 text-lg mb-2">Connect Your Wallet</p>
              <p className="text-sm text-yellow-700 mb-3">
                Choose how you want to connect:
              </p>
              <ul className="text-sm text-yellow-800 space-y-2">
                <li className="flex items-center space-x-2">
                  <WalletIcon className="w-4 h-4" />
                  <span><strong>Desktop:</strong> Use MetaMask browser extension</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Smartphone className="w-4 h-4" />
                  <span><strong>Mobile:</strong> Click WalletConnect → Scan QR with MetaMask app</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Connection Instructions */}
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <p className="text-sm font-semibold text-blue-900 mb-2">
            {isMobile ? '📱 Mobile Instructions:' : '💻 Desktop Instructions:'}
          </p>
          {isMobile ? (
            <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
              <li>Click "Connect Wallet" below</li>
              <li>Select "WalletConnect"</li>
              <li>QR code will appear - scan it with MetaMask mobile app</li>
              <li>Approve connection in your app</li>
            </ol>
          ) : (
            <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
              <li>Click "Connect Wallet" below</li>
              <li>Select "MetaMask" for browser extension</li>
              <li>Or select "WalletConnect" to see QR code for mobile</li>
              <li>Approve connection</li>
            </ol>
          )}
        </div>
        
        {/* Connect Button */}
        <div className="flex flex-col items-center space-y-4">
          <ConnectButton 
            chainStatus="icon"
            showBalance={false}
            accountStatus={{
              smallScreen: 'avatar',
              largeScreen: 'full',
            }}
          />
          
          <p className="text-xs text-gray-600 text-center">
            💡 For mobile: Choose <strong>"WalletConnect"</strong> to see QR code
          </p>
        </div>
      </div>
    );
  }

  // Show error state
  if (sendError || receiptError) {
    const error = sendError || receiptError;
    return (
      <div className="space-y-4">
        <div className="bg-red-50 border-2 border-red-400 p-6 rounded-xl">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-6 h-6 text-red-600 mt-0.5" />
            <div>
              <p className="font-semibold text-red-900 text-lg">Transaction Failed</p>
              <p className="text-sm text-red-700 mt-1">
                {error?.message || 'An unknown error occurred'}
              </p>
            </div>
          </div>
        </div>
        
        <button
          onClick={initiatePayment}
          className="w-full bg-blue-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-[1.02]"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Show success state
  if (isConfirmed && hash) {
    return (
      <div className="space-y-4">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-400 p-6 rounded-xl animate-pulse-slow">
          <div className="flex items-start space-x-3">
            <CheckCircle2 className="w-6 h-6 text-green-600 mt-0.5 animate-bounce" />
            <div className="flex-1">
              <p className="font-semibold text-green-900 text-lg">✅ Payment Confirmed!</p>
              <p className="text-sm text-green-700 mt-1">
                Your transaction has been confirmed on the blockchain
              </p>
            </div>
          </div>
          
          {recordingPayment && (
            <div className="mt-4 flex items-center space-x-2 text-green-700">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Recording payment to database...</span>
            </div>
          )}
          
          {paymentRecorded && (
            <div className="mt-4 flex items-center space-x-2 text-green-800">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-sm font-semibold">✓ Payment saved to database!</span>
            </div>
          )}
        </div>

        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <p className="text-xs font-semibold text-blue-900 mb-2">Transaction Hash:</p>
          <p className="text-xs text-blue-800 font-mono break-all mb-3">{hash}</p>
          <a
            href={`https://sepolia.etherscan.io/tx/${hash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm font-semibold"
          >
            <span>View on Etherscan</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {paymentRecorded && (
          <p className="text-center text-green-600 text-sm font-semibold animate-pulse">
            🔄 Redirecting to dashboard in 3 seconds...
          </p>
        )}
      </div>
    );
  }

  // Show confirming state
  if (isConfirming) {
    return (
      <div className="space-y-4">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-400 p-6 rounded-xl">
          <div className="flex items-start space-x-3">
            <Loader2 className="w-6 h-6 text-blue-600 animate-spin mt-0.5" />
            <div>
              <p className="font-semibold text-blue-900 text-lg">⏳ Confirming Transaction</p>
              <p className="text-sm text-blue-700 mt-1">
                Waiting for blockchain confirmation (~15-30 seconds)
              </p>
            </div>
          </div>
        </div>

        {hash && (
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <p className="text-xs font-semibold text-blue-900 mb-2">Transaction Hash:</p>
            <p className="text-xs text-blue-800 font-mono break-all">{hash}</p>
          </div>
        )}

        <div className="flex items-center justify-center space-x-2 text-blue-600">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    );
  }

  // Show sending state
  if (isSending) {
    return (
      <div className="space-y-4">
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-400 p-6 rounded-xl">
          <div className="flex items-start space-x-3">
            <Loader2 className="w-6 h-6 text-purple-600 animate-spin mt-0.5" />
            <div>
              <p className="font-semibold text-purple-900 text-lg">Awaiting Confirmation</p>
              <p className="text-sm text-purple-700 mt-1">
                {isMobile 
                  ? 'Check your MetaMask app to confirm'
                  : 'Please confirm the transaction in your wallet'}
              </p>
            </div>
          </div>
        </div>

        <button
          disabled
          className="w-full bg-gray-400 text-white py-4 px-6 rounded-xl font-semibold text-lg cursor-not-allowed opacity-60"
        >
          Waiting for wallet confirmation...
        </button>
      </div>
    );
  }

  // Default: Show payment button
  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-green-50 to-teal-50 border-2 border-green-400 p-6 rounded-xl">
        <div className="flex items-start space-x-3">
          <CheckCircle2 className="w-6 h-6 text-green-600 mt-0.5" />
          <div>
            <p className="font-semibold text-green-900 text-lg">Wallet Connected</p>
            <p className="text-sm text-green-700 mt-1">
              You're ready to make a payment
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={initiatePayment}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
      >
        💰 Pay {amount} ETH (Sepolia Testnet)
      </button>

      <div className="flex justify-center">
        <ConnectButton showBalance={true} />
      </div>
    </div>
  );
}
