'use client';

import { http, createConfig } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { injected, walletConnect } from 'wagmi/connectors';

// Get WalletConnect Project ID from environment
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '';

if (!projectId || projectId === 'your-walletconnect-project-id-here') {
  console.warn('⚠️  WalletConnect Project ID not configured in .env.local');
}

// Define metadata
const metadata = {
  name: 'BVV Sangha College Payment',
  description: 'Secure blockchain payment for college fees',
  url: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
};

// Create Wagmi Configuration
export const config = createConfig({
  chains: [sepolia],
  connectors: [
    // MetaMask/Injected wallet connector
    injected({
      target: 'metaMask',
      shimDisconnect: true,
    }),
    
    // WalletConnect v2 with QR code modal - ENHANCED
    walletConnect({
      projectId,
      metadata,
      showQrModal: true, // ✅ Enable QR modal
      qrModalOptions: {
        themeMode: 'light',
        themeVariables: {
          '--wcm-z-index': '99999',
          '--wcm-accent-color': '#3b82f6',
        },
      },
    }),
  ],
  transports: {
    [sepolia.id]: http('https://ethereum-sepolia-rpc.publicnode.com'),
  },
  ssr: true,
});

// Declare module for type safety
declare module 'wagmi' {
  interface Register {
    config: typeof config;
  }
}
