"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { useToast } from "@/hooks/use-toast";
import bs58 from "bs58";

export function ConnectWalletButton() {
  const wallet = useWallet();
  const { publicKey, signMessage, connected, disconnect, connecting } = wallet;
  const { setAuth, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const { toast } = useToast();
  const authInProgressRef = useRef(false);
  const hasShownSignatureRef = useRef(false);

  useEffect(() => {
    // Only proceed if:
    // 1. Wallet is connected
    // 2. We have public key
    // 3. We can sign messages
    // 4. Not already authenticated
    // 5. Not currently authenticating
    // 6. Haven't shown signature already
    if (
      connected &&
      publicKey &&
      signMessage &&
      !isAuthenticated &&
      !authInProgressRef.current &&
      !hasShownSignatureRef.current
    ) {
      hasShownSignatureRef.current = true;
      authInProgressRef.current = true;
      
      // Show signature popup immediately
      authenticateWallet();
    }

    // Reset flags when disconnected
    if (!connected) {
      authInProgressRef.current = false;
      hasShownSignatureRef.current = false;
    }
  }, [connected, publicKey, signMessage, isAuthenticated]);

  const authenticateWallet = async () => {
    if (!publicKey || !signMessage) {
      authInProgressRef.current = false;
      hasShownSignatureRef.current = false;
      return;
    }

    try {
      // Create message to sign
      const timestamp = Date.now();
      const messageText = `Sign this message to authenticate with SUBRA\n\nWallet: ${publicKey.toBase58()}\nTimestamp: ${timestamp}`;
      const message = new TextEncoder().encode(messageText);

      console.log("🔐 Requesting signature from wallet...");

      // This WILL show Phantom popup
      const signature = await signMessage(message);

      console.log("✅ Signature received, verifying...");

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
          description: `Authenticated as ${publicKey.toBase58().slice(0, 8)}...${publicKey.toBase58().slice(-4)}`,
        });
        router.push("/dashboard");
      } else {
        toast({
          title: "Authentication Failed",
          description: data.error || "Failed to verify wallet signature",
          variant: "destructive",
        });
        authInProgressRef.current = false;
        hasShownSignatureRef.current = false;
        disconnect();
      }
    } catch (error: any) {
      console.error("❌ Wallet auth error:", error);
      authInProgressRef.current = false;
      hasShownSignatureRef.current = false;

      // Check if user rejected the signature
      if (
        error.message?.includes("User rejected") ||
        error.message?.includes("rejected") ||
        error.code === 4001
      ) {
        toast({
          title: "Signature Rejected",
          description: "You must sign the message to authenticate",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Connection Failed",
          description: error.message || "Failed to authenticate wallet",
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
