"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { useToast } from "@/hooks/use-toast";
import { FileSignature } from "lucide-react";
import bs58 from "bs58";
import { useState } from "react";

export function WalletSignButton() {
  const { publicKey, signMessage, connected } = useWallet();
  const { setAuth } = useAuthStore();
  const router = useRouter();
  const { toast } = useToast();
  const [isSigning, setIsSigning] = useState(false);

  if (!connected || !publicKey) {
    return null;
  }

  const handleSign = async () => {
    if (!signMessage || isSigning) return;

    setIsSigning(true);

    try {
      const timestamp = Date.now();
      const messageText = `Sign this message to authenticate with SUBRA\n\nWallet: ${publicKey.toBase58()}\nTimestamp: ${timestamp}`;
      const message = new TextEncoder().encode(messageText);

      // This will show Phantom popup
      const signature = await signMessage(message);

      // Verify on backend
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
          title: "Authenticated! 🎉",
          description: "Successfully signed in with wallet",
        });
        router.push("/dashboard");
      } else {
        toast({
          title: "Authentication Failed",
          description: data.error || "Failed to verify signature",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Sign error:", error);
      
      if (error.message?.includes("User rejected") || error.code === 4001) {
        toast({
          title: "Signature Rejected",
          description: "You must sign to authenticate",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: error.message || "Failed to sign message",
          variant: "destructive",
        });
      }
    } finally {
      setIsSigning(false);
    }
  };

  return (
    <Button onClick={handleSign} disabled={isSigning} className="transition-all hover:scale-105">
      <FileSignature className="w-4 h-4 mr-2" />
      {isSigning ? "Signing..." : "Sign In with Wallet"}
    </Button>
  );
}

