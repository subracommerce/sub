"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuthStore } from "@/store/auth";
import { useToast } from "@/hooks/use-toast";
import { Shield, CheckCircle, Loader2, AlertCircle, Wallet as WalletIcon, Lock } from "lucide-react";
import bs58 from "bs58";
import Link from "next/link";

export default function WalletAuthPage() {
  const { publicKey, signMessage, connected, disconnect, wallet, select } = useWallet();
  const { setVisible } = useWalletModal();
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const { toast } = useToast();
  
  const [step, setStep] = useState<"select" | "sign" | "authenticating" | "success">("select");
  const [error, setError] = useState<string | null>(null);
  const hasAttemptedAuth = useRef(false);
  const connectionCheckRef = useRef<NodeJS.Timeout | null>(null);

  // Force clean state on mount
  useEffect(() => {
    const init = async () => {
      console.log('🔒 Initializing wallet page');
      
      if (connected) {
        console.log('  Found existing connection, disconnecting...');
        await disconnect();
      }
      
      if (wallet) {
        select(null);
      }
      
      setStep("select");
      setError(null);
      hasAttemptedAuth.current = false;
      
      console.log('✅ Ready for wallet selection');
    };
    
    init();
    
    return () => {
      if (connectionCheckRef.current) {
        clearTimeout(connectionCheckRef.current);
      }
    };
  }, []);

  // Monitor wallet state and TEST if it's actually usable
  useEffect(() => {
    const checkWalletState = async () => {
      if (!connected || !publicKey) {
        return;
      }

      console.log('🔍 Wallet connected, verifying it\'s actually unlocked...');
      console.log('  Wallet:', wallet?.adapter?.name);
      console.log('  Public Key:', publicKey.toBase58());
      console.log('  Has signMessage:', !!signMessage);

      // CRITICAL: Test if wallet is actually unlocked by trying to access it
      try {
        // Check if signMessage function exists
        if (!signMessage) {
          console.error('❌ WALLET IS LOCKED: signMessage not available');
          setError("Your wallet is locked! Please unlock your wallet first.");
          await disconnect();
          setStep("select");
          return;
        }

        // Try a test to see if wallet is accessible
        if (!wallet?.adapter?.publicKey) {
          console.error('❌ WALLET NOT READY: publicKey not accessible on adapter');
          setError("Wallet is not ready. Please unlock your wallet and try again.");
          await disconnect();
          setStep("select");
          return;
        }

        console.log('✅ Wallet is unlocked and ready');
        
        // Only proceed to sign step if we're not already there
        if (step !== "sign" && step !== "authenticating" && step !== "success") {
          setStep("sign");
        }
      } catch (error: any) {
        console.error('❌ Wallet check failed:', error);
        setError("Wallet connection failed. Please unlock your wallet and try again.");
        await disconnect();
        setStep("select");
      }
    };

    if (connected) {
      // Delay check slightly to let wallet fully initialize
      connectionCheckRef.current = setTimeout(checkWalletState, 300);
    }

    return () => {
      if (connectionCheckRef.current) {
        clearTimeout(connectionCheckRef.current);
      }
    };
  }, [connected, publicKey, signMessage, wallet, step]);

  const handleSelectWallet = () => {
    console.log('👆 Opening wallet selection modal');
    setError(null);
    setVisible(true);
  };

  const handleSignAndAuthenticate = async () => {
    if (!publicKey || !signMessage) {
      setError("Wallet not properly connected");
      return;
    }

    if (hasAttemptedAuth.current) {
      return;
    }

    hasAttemptedAuth.current = true;
    setStep("authenticating");
    setError(null);

    try {
      console.log('🔐 Requesting nonce...');
      
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

      const message = `Sign this message to authenticate with SUBRA\n\nWallet: ${publicKey.toBase58()}\nNonce: ${nonce}\nTimestamp: ${new Date().toISOString()}\n\nNo gas fees required.`;
      const encodedMessage = new TextEncoder().encode(message);

      console.log('📝 Requesting signature from wallet popup...');

      // This WILL popup if wallet is unlocked
      const signature = await signMessage(encodedMessage);
      const signatureBase58 = bs58.encode(signature);
      
      console.log('✅ Signature received');
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

      console.log('✅ Authentication successful!');

      setAuth(authData.data.user, authData.data.token);
      setStep("success");
      
      toast({
        title: "Success!",
        description: "Wallet authenticated",
      });

      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);

    } catch (error: any) {
      console.error("❌ Authentication error:", error);
      
      hasAttemptedAuth.current = false;
      
      if (error.message?.includes("User rejected")) {
        setError("You rejected the signature request.");
      } else {
        setError(error.message || "Authentication failed.");
      }
      
      setStep("sign");
    }
  };

  const handleDisconnect = async () => {
    console.log('🔌 Disconnecting wallet');
    
    try {
      await disconnect();
      select(null);
    } catch (e) {
      console.error('Disconnect error:', e);
    }
    
    setStep("select");
    setError(null);
    hasAttemptedAuth.current = false;
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
            {step === "select" && "Choose your Solana wallet"}
            {step === "sign" && "Sign to authenticate"}
            {step === "authenticating" && "Verifying..."}
            {step === "success" && "Success!"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive" className="border-2">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {error}
                {error.includes("locked") && (
                  <div className="mt-2 p-2 bg-red-100 rounded text-xs text-red-900">
                    <Lock className="h-3 w-3 inline mr-1" />
                    Please unlock your {wallet?.adapter?.name || "wallet"} extension and try again.
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}

          {/* Select Wallet */}
          {step === "select" && (
            <div className="space-y-4">
              <Alert className="border-2 border-blue-500 bg-blue-50">
                <Shield className="h-4 w-4 text-blue-600" />
                <AlertTitle className="text-blue-900">Before You Start</AlertTitle>
                <AlertDescription className="text-blue-800 text-sm">
                  <ul className="list-disc list-inside space-y-1 mt-2">
                    <li><strong>Unlock your wallet first!</strong></li>
                    <li>Click button below to choose wallet</li>
                    <li>Your wallet will popup for approval</li>
                    <li>Then you'll sign a message</li>
                  </ul>
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
              
              <p className="text-xs text-center text-gray-600">
                Phantom • Solflare • Backpack • Ledger • Torus
              </p>
            </div>
          )}

          {/* Sign Message */}
          {step === "sign" && (
            <div className="space-y-4">
              <Alert className="border-2 border-green-500 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-900">
                  {wallet?.adapter?.name || "Wallet"} Connected ✓
                </AlertTitle>
                <AlertDescription className="text-green-800 text-sm font-mono">
                  {publicKey?.toBase58().slice(0, 8)}...{publicKey?.toBase58().slice(-8)}
                </AlertDescription>
              </Alert>

              <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4 text-sm">
                <p className="font-semibold mb-2">Next Step:</p>
                <ul className="space-y-1 text-gray-700">
                  <li>✓ Click button below</li>
                  <li>✓ Your wallet will popup</li>
                  <li>✓ Review and sign the message</li>
                  <li>✓ No gas fees</li>
                </ul>
              </div>

              <div className="space-y-3">
                <Button 
                  onClick={handleSignAndAuthenticate}
                  className="w-full bg-gray-900 hover:bg-black text-white py-6 text-base font-semibold hover:scale-105 transition-all"
                  size="lg"
                  disabled={!signMessage}
                >
                  <Shield className="mr-2 h-5 w-5" />
                  Sign & Authenticate
                </Button>

                <Button 
                  onClick={handleDisconnect}
                  variant="outline"
                  className="w-full border-2"
                >
                  Disconnect & Choose Different Wallet
                </Button>
              </div>
            </div>
          )}

          {/* Authenticating */}
          {step === "authenticating" && (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <Loader2 className="h-16 w-16 animate-spin text-gray-900" />
              <div className="text-center">
                <p className="text-lg font-semibold">Authenticating...</p>
                <p className="text-sm text-gray-600 mt-2">Verifying signature...</p>
              </div>
            </div>
          )}

          {/* Success */}
          {step === "success" && (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center">
                <CheckCircle className="h-10 w-10 text-white" />
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold">Success!</p>
                <p className="text-sm text-gray-600 mt-2">Redirecting...</p>
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
