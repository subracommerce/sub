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

  // CRITICAL: Clear ALL cached wallet connections on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Clear all possible wallet cache keys
      const keysToRemove = [
        'walletName',
        'walletAdapter', 
        'wallet-adapter',
        'subra-wallet-v1',
        'solana-wallet',
        'phantom-wallet',
        'solflare-wallet'
      ];
      
      keysToRemove.forEach(key => {
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
      });
      
      console.log('🧹 Cleared all wallet caches');
    }
  }, []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider 
        wallets={wallets} 
        autoConnect={false} // CRITICAL: Never auto-connect
        localStorageKey="subra-wallet-v2" // New unique key
      >
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
