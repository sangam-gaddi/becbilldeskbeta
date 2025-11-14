'use client';

import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia } from 'wagmi/chains';
import { 
  metaMaskWallet,
  rainbowWallet,
  walletConnectWallet,
  coinbaseWallet,
  trustWallet,
} from '@rainbow-me/rainbowkit/wallets';

export const config = getDefaultConfig({
  appName: 'BEC BillDesk',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'a01e2f3b4c5d6e7f8g9h0i1j2k3l4m5n',
  chains: [sepolia],
  wallets: [
    {
      groupName: 'Recommended',
      wallets: [metaMaskWallet, rainbowWallet, coinbaseWallet, trustWallet, walletConnectWallet],
    },
  ],
  ssr: true,
});

export const COLLEGE_WALLET_ADDRESS = '0xd87c05c93c7407b84905742ba3c34c8776f18fd9';
export const PAYMENT_AMOUNT_ETH = '0.0001';