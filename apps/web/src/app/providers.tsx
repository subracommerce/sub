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

  // ULTRA AGGRESSIVE: Clear everything on every mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      console.log('🧹 AGGRESSIVE cache clearing...');
      
      // Clear ALL localStorage
      try {
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
          if (key.includes('wallet') || key.includes('solana') || key.includes('phantom') || key.includes('solflare')) {
            localStorage.removeItem(key);
            console.log('  Removed:', key);
          }
        });
      } catch (e) {
        console.warn('Failed to clear localStorage');
      }
      
      // Clear ALL sessionStorage
      try {
        const keys = Object.keys(sessionStorage);
        keys.forEach(key => {
          if (key.includes('wallet') || key.includes('solana') || key.includes('phantom') || key.includes('solflare')) {
            sessionStorage.removeItem(key);
          }
        });
      } catch (e) {
        console.warn('Failed to clear sessionStorage');
      }
      
      console.log('✅ Cache cleared');
    }
  }, []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider 
        wallets={wallets} 
        autoConnect={false}
        localStorageKey={undefined as any}
      >
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
