import { useState, useCallback, useEffect } from 'react';
import { useAccount, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { toast } from 'sonner';

interface PaymentConfig {
  amount: string;
  recipient: `0x${string}`;
}

export function usePayment({ amount, recipient }: PaymentConfig) {
  const { address, isConnected } = useAccount();
  const { sendTransaction, data: hash, error: sendError, isPending: isSending, reset } = useSendTransaction();
  
  // ✅ FIX: This hook now properly watches the hash
  const { 
    isLoading: isConfirming, 
    isSuccess: isConfirmed, 
    error: receiptError 
  } = useWaitForTransactionReceipt({ 
    hash,
    confirmations: 1, // Wait for 1 confirmation
  });

  const [recordingPayment, setRecordingPayment] = useState(false);
  const [paymentRecorded, setPaymentRecorded] = useState(false);

  // ✅ DEBUG: Log state changes
  useEffect(() => {
    if (hash) {
      console.log('📝 Transaction hash received:', hash);
    }
    if (isConfirming) {
      console.log('⏳ Transaction confirming...');
    }
    if (isConfirmed) {
      console.log('✅ Transaction confirmed!');
    }
  }, [hash, isConfirming, isConfirmed]);

  const initiatePayment = useCallback(async () => {
    if (!isConnected) {
      toast.error('Wallet not connected', {
        description: 'Please connect your wallet first',
      });
      return;
    }

    try {
      // Reset previous state
      setPaymentRecorded(false);
      setRecordingPayment(false);
      
      sendTransaction({
        to: recipient,
        value: parseEther(amount),
      });

      toast.info('Transaction initiated', {
        description: 'Please confirm in your wallet',
      });
    } catch (error: any) {
      console.error('❌ Transaction initiation error:', error);
      toast.error('Transaction failed', {
        description: error.message || 'Unknown error occurred',
      });
    }
  }, [isConnected, sendTransaction, recipient, amount]);

  const recordPayment = useCallback(async () => {
    if (!hash || recordingPayment || paymentRecorded) {
      console.log('⏭️  Skipping record:', { hash, recordingPayment, paymentRecorded });
      return false;
    }

    console.log('💾 Recording payment to database...');
    setRecordingPayment(true);

    try {
      const response = await fetch('/api/payments/crypto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transactionHash: hash,
          walletAddress: address,
          amount: parseFloat(amount),
        }),
      });

      const data = await response.json();
      console.log('📡 API Response:', data);

      if (data.success) {
        setPaymentRecorded(true);
        toast.success('Payment recorded!', {
          description: 'Your payment has been confirmed and saved',
          duration: 5000,
        });
        return true;
      } else {
        throw new Error(data.error || 'Recording failed');
      }
    } catch (error: any) {
      console.error('❌ Payment recording error:', error);
      toast.error('Failed to record payment', {
        description: error.message,
      });
      return false;
    } finally {
      setRecordingPayment(false);
    }
  }, [hash, address, amount, recordingPayment, paymentRecorded]);

  return {
    // State
    address,
    isConnected,
    hash,
    isSending,
    isConfirming,
    isConfirmed,
    recordingPayment,
    paymentRecorded,
    
    // Errors
    sendError,
    receiptError,
    
    // Actions
    initiatePayment,
    recordPayment,
    reset,
  };
}
