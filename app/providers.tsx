'use client';

import * as React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, State } from 'wagmi';
import { 
  RainbowKitProvider, 
  lightTheme,
  connectorsForWallets
} from '@rainbow-me/rainbowkit';
import {
  metaMaskWallet,
  walletConnectWallet,
  coinbaseWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { config } from '@/config/wagmi.config';
import '@rainbow-me/rainbowkit/styles.css';

// Create QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5000,
    },
  },
});

export function Web3Providers({ 
  children,
  initialState 
}: { 
  children: React.ReactNode;
  initialState?: State;
}) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <WagmiProvider config={config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          modalSize="compact"
          theme={lightTheme({
            accentColor: '#3b82f6',
            accentColorForeground: 'white',
            borderRadius: 'large',
            fontStack: 'system',
          })}
          showRecentTransactions={true}
          appInfo={{
            appName: 'BVV College Payment',
            learnMoreUrl: 'https://ethereum.org/en/wallets/',
          }}
        >
          {mounted ? children : <div className="min-h-screen bg-gray-50" />}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
