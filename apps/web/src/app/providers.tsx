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

  // Clear old cached connections from ExePay or other projects
  useEffect(() => {
    // Clear any old wallet connections cached in browser
    if (typeof window !== 'undefined') {
      // Remove old wallet adapter cache
      const oldKeys = ['walletName', 'walletAdapter', 'wallet-adapter'];
      oldKeys.forEach(key => {
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
      });
    }
  }, []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider 
        wallets={wallets} 
        autoConnect={false} // Never auto-connect
        localStorageKey="subra-wallet-v1" // Use unique key for SUBRA
      >
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
