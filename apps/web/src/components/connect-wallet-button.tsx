"use client";

import { useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";
import bs58 from "bs58";

export function ConnectWalletButton() {
  const { publicKey, signMessage, connected, disconnect } = useWallet();
  const { setAuth } = useAuthStore();
  const router = useRouter();

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
        router.push("/dashboard");
      } else {
        // If verification fails, disconnect
        disconnect();
      }
    } catch (error) {
      console.error("Wallet auth failed:", error);
      // If user rejects signature, disconnect
      disconnect();
    }
  };

  return (
    <WalletMultiButton className="!bg-primary hover:!bg-primary/90 !text-primary-foreground !rounded-lg" />
  );
}

