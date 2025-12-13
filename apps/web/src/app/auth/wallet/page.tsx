"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuthStore } from "@/store/auth";
import { useToast } from "@/hooks/use-toast";
import { Shield, CheckCircle, Loader2, AlertCircle, Wallet as WalletIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import bs58 from "bs58";
import Link from "next/link";

export default function WalletAuthPage() {
  const { publicKey, signMessage, connected, disconnect, wallet, select } = useWallet();
  const { setVisible } = useWalletModal();
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const { toast } = useToast();
  
  const [status, setStatus] = useState<"idle" | "connecting" | "authenticating" | "success">("idle");
  const [error, setError] = useState<string | null>(null);
  const hasAttemptedAuth = useRef(false);

  // Force clean state on mount - clear any remembered wallet
  useEffect(() => {
    const init = async () => {
      console.log('🔒 Initializing - clearing wallet selection');
      
      // Force disconnect any existing connection
      if (connected) {
        await disconnect();
      }
      
      // Clear wallet selection
      select(null);
      
      // Clear localStorage cache
      if (typeof window !== 'undefined') {
        localStorage.removeItem('walletName');
      }
      
      setStatus("idle");
      setError(null);
      hasAttemptedAuth.current = false;
      
      console.log('✅ Clean state - ready for wallet selection');
    };
    
    init();
  }, []);

  // AUTOMATICALLY sign message when wallet connects
  useEffect(() => {
    const authenticateAfterConnection = async () => {
      if (connected && publicKey && signMessage && !hasAttemptedAuth.current && status === "connecting") {
        console.log('✅ Wallet connected! Requesting signature...');
        console.log('   Wallet:', wallet?.adapter?.name);
        console.log('   Address:', publicKey.toBase58());
        
        hasAttemptedAuth.current = true;
        setStatus("authenticating");
        setError(null);

        try {
          // Get nonce
          console.log('📡 Getting nonce...');
          const nonceResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/wallet/nonce`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ walletAddress: publicKey.toBase58() }),
          });

          if (!nonceResponse.ok) {
            throw new Error("Failed to get nonce");
          }

          const { data: { nonce } } = await nonceResponse.json();
          console.log('✅ Nonce received');

          // Request signature
          const message = `Sign in to SUBRA\n\nWallet: ${publicKey.toBase58()}\nNonce: ${nonce}\nTimestamp: ${new Date().toISOString()}\n\nThis proves you own this wallet.\nNo gas fees.`;
          const encodedMessage = new TextEncoder().encode(message);

          console.log('📝 Requesting signature...');
          const signature = await signMessage(encodedMessage);
          const signatureBase58 = bs58.encode(signature);
          
          console.log('✅ Signature received!');
          
          // Verify
          console.log('🔍 Verifying...');
          const authResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/wallet/verify`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              walletAddress: publicKey.toBase58(),
              signature: signatureBase58,
              message: message,
              nonce: nonce,
            }),
          });

          const authData = await authResponse.json();

          if (!authData.success) {
            throw new Error(authData.error || "Authentication failed");
          }

          console.log('✅ Authenticated!');

          setAuth(authData.data.user, authData.data.token);
          setStatus("success");
          
          toast({
            title: "Success!",
            description: `${wallet?.adapter?.name} authenticated`,
          });

          setTimeout(() => {
            router.push("/dashboard");
          }, 1500);

        } catch (error: any) {
          console.error("❌ Authentication failed:", error);
          
          // Disconnect and reset
          await disconnect();
          select(null);
          hasAttemptedAuth.current = false;
          setStatus("idle");
          
          if (error.message?.includes("User rejected") || error.message?.includes("User cancelled")) {
            setError("You cancelled the signature request. Please try again.");
          } else {
            setError(error.message || "Authentication failed. Please try again.");
          }
        }
      }
    };

    authenticateAfterConnection();
  }, [connected, publicKey, signMessage, status, wallet, disconnect, select, setAuth, router, toast]);

  // Detect when wallet connects (to show which wallet)
  useEffect(() => {
    if (connected && status === "idle") {
      console.log('🔌 Wallet connected, moving to connecting state');
      setStatus("connecting");
    }
  }, [connected, status]);

  // Reset when disconnected
  useEffect(() => {
    if (!connected && (status === "connecting" || status === "authenticating")) {
      console.log('❌ Wallet disconnected, resetting');
      hasAttemptedAuth.current = false;
      setStatus("idle");
    }
  }, [connected, status]);

  const handleSelectWallet = () => {
    console.log('👆 Opening wallet selection modal');
    setError(null);
    hasAttemptedAuth.current = false;
    
    // Open the wallet selection modal
    setVisible(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white relative overflow-hidden p-4">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:3rem_3rem] animate-grid-slow" />
      <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-full blur-3xl animate-float-1" />

      <Card className="w-full max-w-md border-2 border-gray-200 shadow-2xl relative z-10 bg-white">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center">
              <WalletIcon className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold">Connect Your Wallet</CardTitle>
          <CardDescription className="text-base">
            {status === "idle" && "Select your wallet to continue"}
            {status === "connecting" && `Connecting to ${wallet?.adapter?.name || "wallet"}...`}
            {status === "authenticating" && "Authenticating..."}
            {status === "success" && "Success!"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive" className="border-2">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Authentication Failed</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {status === "idle" && (
            <div className="space-y-4">
              <Alert className="border-2 border-blue-500 bg-blue-50">
                <Shield className="h-4 w-4 text-blue-600" />
                <AlertTitle className="text-blue-900">How It Works</AlertTitle>
                <AlertDescription className="text-blue-800 text-sm">
                  <ol className="list-decimal list-inside space-y-1 mt-2">
                    <li>Click "Select Wallet" below</li>
                    <li>Choose your wallet from the list</li>
                    <li>Approve connection in wallet popup</li>
                    <li>Sign message to authenticate</li>
                    <li>You're in! No gas fees</li>
                  </ol>
                </AlertDescription>
              </Alert>

              <Button 
                onClick={handleSelectWallet}
                className="w-full bg-gray-900 hover:bg-black text-white py-6 text-base font-semibold hover:scale-105 transition-all"
                size="lg"
              >
                <WalletIcon className="mr-2 h-5 w-5" />
                Select Wallet
              </Button>
              
              <p className="text-xs text-gray-500 text-center">
                Phantom • Solflare • Backpack • Ledger • Torus
              </p>
            </div>
          )}

          {status === "connecting" && (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <Loader2 className="h-16 w-16 animate-spin text-gray-900" />
              <div className="text-center">
                <p className="text-lg font-semibold">Connecting to {wallet?.adapter?.name || "Wallet"}...</p>
                <p className="text-sm text-gray-600 mt-2">
                  Waiting for wallet popup...
                </p>
              </div>
            </div>
          )}

          {status === "authenticating" && (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <Loader2 className="h-16 w-16 animate-spin text-gray-900" />
              <div className="text-center">
                <p className="text-lg font-semibold">Authenticating...</p>
                <p className="text-sm text-gray-600 mt-2">
                  Check your {wallet?.adapter?.name || "wallet"} popup
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Please sign the message to continue
                </p>
              </div>
            </div>
          )}

          {status === "success" && (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center">
                <CheckCircle className="h-10 w-10 text-white" />
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold">Authenticated!</p>
                <p className="text-sm text-gray-600 mt-2">Redirecting to dashboard...</p>
              </div>
            </div>
          )}

          <div className="text-center text-sm text-gray-600 pt-4 border-t-2">
            <Link href="/auth/register" className="font-semibold text-gray-900 hover:underline">
              ← Back to registration
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
