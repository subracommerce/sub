"use client";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { useToast } from "@/hooks/use-toast";
import bs58 from "bs58";

export function ConnectWalletButton() {
  const { publicKey, signMessage, connected, disconnect } = useWallet();
  const { setAuth, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    // Only authenticate if connected, has public key, can sign, and not already authenticated
    if (connected && publicKey && signMessage && !isAuthenticated) {
      handleWalletAuth();
    }
  }, [connected, publicKey, isAuthenticated]);

  const handleWalletAuth = async () => {
    if (!publicKey || !signMessage) return;

    try {
      // Create message to sign
      const message = new TextEncoder().encode(
        `Sign this message to authenticate with SUBRA:\n\nWallet: ${publicKey.toBase58()}\nTimestamp: ${Date.now()}`
      );

      // Request signature from wallet (this will open Phantom popup)
      const signature = await signMessage(message);

      // Send to backend for verification
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/wallet`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            publicKey: publicKey.toBase58(),
            signature: bs58.encode(signature),
            message: bs58.encode(message),
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setAuth(data.data.user, data.data.token);
        toast({
          title: "Wallet Connected! 🎉",
          description: `Connected as ${publicKey.toBase58().slice(0, 8)}...`,
        });
        router.push("/dashboard");
      } else {
        toast({
          title: "Authentication Failed",
          description: data.error || "Failed to verify wallet signature",
          variant: "destructive",
        });
        disconnect();
      }
    } catch (error: any) {
      console.error("Wallet auth failed:", error);
      
      // Only show error if user didn't cancel
      if (error.message && !error.message.includes("User rejected")) {
        toast({
          title: "Connection Failed",
          description: "Failed to authenticate wallet. Please try again.",
          variant: "destructive",
        });
      }
      
      disconnect();
    }
  };

  return (
    <WalletMultiButton className="!bg-primary hover:!bg-primary/90 !text-primary-foreground !rounded-lg !transition-all hover:!scale-105" />
  );
}
