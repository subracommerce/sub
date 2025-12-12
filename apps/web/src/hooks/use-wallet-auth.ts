"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect } from "react";
import { useAuthStore } from "@/store/auth";
import bs58 from "bs58";

export function useWalletAuth() {
  const { publicKey, signMessage, connected } = useWallet();
  const { setAuth } = useAuthStore();

  useEffect(() => {
    if (connected && publicKey && signMessage) {
      handleWalletAuth();
    }
  }, [connected, publicKey]);

  const handleWalletAuth = async () => {
    if (!publicKey || !signMessage) return;

    try {
      // Create message to sign
      const message = new TextEncoder().encode(
        `Sign this message to authenticate with SUBRA:\n\nWallet: ${publicKey.toBase58()}\nTimestamp: ${Date.now()}`
      );

      // Request signature from wallet
      const signature = await signMessage(message);

      // Send to backend for verification
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/wallet`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          publicKey: publicKey.toBase58(),
          signature: bs58.encode(signature),
          message: bs58.encode(message),
        }),
      });

      const data = await response.json();

      if (data.success) {
        setAuth(data.data.user, data.data.token);
      }
    } catch (error) {
      console.error("Wallet auth failed:", error);
    }
  };

  return { handleWalletAuth };
}

