"use client";

import React, { useMemo, useEffect } from "react";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";

import "@solana/wallet-adapter-react-ui/styles.css";

export function Providers({ children }: { children: React.ReactNode }) {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  // Empty array - let wallet standard auto-detect
  const wallets = useMemo(() => [], []);

  // CRITICAL: Clear ALL cached wallet connections and force clean state
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Comprehensive cache clearing
      const keysToRemove = [
        'walletName',
        'walletAdapter', 
        'wallet-adapter',
        'subra-wallet-v1',
        'subra-wallet-v2',
        'solana-wallet',
        'phantom-wallet',
        'solflare-wallet',
        'backpack-wallet',
        'glow-wallet',
        'slope-wallet',
        'sollet-wallet'
      ];
      
      keysToRemove.forEach(key => {
        try {
          localStorage.removeItem(key);
          sessionStorage.removeItem(key);
        } catch (e) {
          console.warn('Failed to remove key:', key);
        }
      });
      
      console.log('🧹 Cleared all wallet caches');
    }
  }, []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider 
        wallets={wallets} 
        autoConnect={false} // CRITICAL: Never auto-connect
        localStorageKey={null as any} // CRITICAL: Disable localStorage persistence
      >
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
