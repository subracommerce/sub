"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuthStore } from "@/store/auth";
import { useToast } from "@/hooks/use-toast";
import { Shield, CheckCircle, Loader2, AlertCircle, Wallet as WalletIcon, XCircle } from "lucide-react";
import bs58 from "bs58";
import Link from "next/link";

export default function WalletAuthPage() {
  const { publicKey, signMessage, connected, disconnect, wallet } = useWallet();
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const { toast } = useToast();
  
  const [step, setStep] = useState<"select" | "waiting" | "sign" | "authenticating" | "success">("select");
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [userInitiatedConnection, setUserInitiatedConnection] = useState(false);
  const hasAttemptedAuth = useRef(false);

  // AGGRESSIVE: Force disconnect on mount and stay disconnected
  useEffect(() => {
    const forceDisconnect = async () => {
      console.log('🔒 FORCING DISCONNECT ON MOUNT');
      
      if (connected || wallet) {
        console.log('  Disconnecting wallet:', wallet?.adapter?.name);
        try {
          await disconnect();
        } catch (e) {
          console.error('  Disconnect error:', e);
        }
      }
      
      setStep("select");
      setError(null);
      setUserInitiatedConnection(false);
      hasAttemptedAuth.current = false;
      
      console.log('✅ Clean state enforced');
    };
    
    forceDisconnect();
    
    // Also disconnect after a small delay to catch any async connections
    const timer = setTimeout(forceDisconnect, 100);
    return () => clearTimeout(timer);
  }, []);

  // ONLY proceed if user explicitly clicked connect
  useEffect(() => {
    if (!userInitiatedConnection) {
      // Ignore any automatic connections
      if (connected) {
        console.log('⚠️ Ignoring automatic connection (user did not initiate)');
      }
      return;
    }

    console.log('🔌 Wallet state (user-initiated):', { 
      connected, 
      hasPublicKey: !!publicKey, 
      hasSignMessage: !!signMessage,
      walletName: wallet?.adapter?.name,
      step
    });

    // Only proceed if connected AND user initiated AND we're waiting
    if (connected && publicKey && step === "waiting") {
      validateAndProceed();
    }

    // If disconnected while not in select step, reset
    if (!connected && step !== "select" && step !== "success") {
      console.log('❌ Wallet disconnected unexpectedly');
      setStep("select");
      setError(null);
      setUserInitiatedConnection(false);
      hasAttemptedAuth.current = false;
    }
  }, [connected, publicKey, signMessage, wallet, step, userInitiatedConnection]);

  const handleWalletButtonClick = () => {
    console.log('👆 User clicked wallet button - ALLOWING CONNECTION');
    setUserInitiatedConnection(true);
    setStep("waiting");
    setError(null);
  };

  const validateAndProceed = async () => {
    console.log('🔍 Validating wallet connection...');
    
    // Wait a bit for wallet to be fully ready
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (!signMessage) {
      console.error('❌ signMessage not available');
      setError("Wallet is not ready. Please try again.");
      await disconnect();
      setUserInitiatedConnection(false);
      setStep("select");
      return;
    }

    if (!wallet?.adapter?.connected) {
      console.error('❌ Wallet adapter not connected');
      setError("Wallet connection failed. Please try again.");
      await disconnect();
      setUserInitiatedConnection(false);
      setStep("select");
      return;
    }

    console.log('✅ Connection validated, ready to sign');
    setStep("sign");
  };

  const handleSignAndAuthenticate = async () => {
    if (!publicKey || !signMessage) {
      setError("Wallet not properly connected");
      return;
    }

    if (hasAttemptedAuth.current) {
      console.log('⚠️ Authentication already in progress');
      return;
    }

    hasAttemptedAuth.current = true;
    setIsAuthenticating(true);
    setError(null);
    setStep("authenticating");

    try {
      console.log('🔐 Step 1: Requesting nonce...');
      
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

      console.log('📝 Step 2: Requesting signature from wallet popup...');

      const signature = await signMessage(encodedMessage);
      const signatureBase58 = bs58.encode(signature);
      
      console.log('✅ Signature received');
      console.log('🔍 Step 3: Verifying with backend...');
      
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
        title: "Wallet Connected!",
        description: "Successfully authenticated",
      });

      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);

    } catch (error: any) {
      console.error("❌ Authentication error:", error);
      
      hasAttemptedAuth.current = false;
      
      if (error.message?.includes("User rejected")) {
        setError("You rejected the signature. Please try again.");
        setStep("sign");
      } else {
        setError(error.message || "Authentication failed. Please try again.");
        setStep("sign");
      }
      
      setIsAuthenticating(false);
    }
  };

  const handleDisconnect = async () => {
    console.log('🔌 User requested disconnect');
    await disconnect();
    setStep("select");
    setError(null);
    setUserInitiatedConnection(false);
    hasAttemptedAuth.current = false;
  };

  const handleStartOver = async () => {
    console.log('🔄 Starting over');
    setError(null);
    setStep("select");
    setUserInitiatedConnection(false);
    hasAttemptedAuth.current = false;
    await disconnect();
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
            {step === "select" && "Click below to choose your wallet"}
            {step === "waiting" && "Waiting for wallet connection..."}
            {step === "sign" && "Sign the message to authenticate"}
            {step === "authenticating" && "Verifying your signature..."}
            {step === "success" && "Successfully authenticated!"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive" className="border-2">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {error}
                <Button 
                  onClick={handleStartOver}
                  variant="outline"
                  size="sm"
                  className="mt-2 w-full"
                >
                  Start Over
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Step 1: Select Wallet */}
          {step === "select" && (
            <div className="space-y-4">
              <Alert className="border-2 border-blue-500 bg-blue-50">
                <Shield className="h-4 w-4 text-blue-600" />
                <AlertTitle className="text-blue-900">How It Works</AlertTitle>
                <AlertDescription className="text-blue-800 text-sm">
                  <ol className="list-decimal list-inside space-y-1 mt-2">
                    <li>Click the button below</li>
                    <li>Choose your wallet from the list</li>
                    <li>Your wallet will popup for approval</li>
                    <li>Approve the connection</li>
                    <li>Then sign a message (no gas fees)</li>
                  </ol>
                </AlertDescription>
              </Alert>

              <div className="flex flex-col items-center space-y-4" onClick={handleWalletButtonClick}>
                <div className="wallet-adapter-button-wrapper w-full">
                  <WalletMultiButton 
                    className="!w-full !bg-gray-900 hover:!bg-black !text-white !rounded-lg !px-6 !py-4 !text-base !font-semibold !transition-all hover:!scale-105 !justify-center"
                  />
                </div>
              </div>
              
              <p className="text-xs text-center text-gray-600">
                Supports Phantom, Solflare, Backpack, Ledger, Torus, and more
              </p>
            </div>
          )}

          {/* Step 2: Waiting for Connection */}
          {step === "waiting" && (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <Loader2 className="h-16 w-16 animate-spin text-gray-900" />
              <div className="text-center">
                <p className="text-lg font-semibold">Waiting for Wallet...</p>
                <p className="text-sm text-gray-600 mt-2">
                  Please approve the connection in your wallet popup
                </p>
              </div>
              <Button 
                onClick={handleStartOver}
                variant="outline"
                size="sm"
              >
                Cancel
              </Button>
            </div>
          )}

          {/* Step 3: Sign Message */}
          {step === "sign" && !isAuthenticating && (
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
                  <li>✓ Click the button below</li>
                  <li>✓ Your wallet will popup</li>
                  <li>✓ Review and sign the message</li>
                  <li>✓ No gas fees</li>
                </ul>
              </div>

              <div className="space-y-3 pt-2">
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

          {/* Step 4: Authenticating */}
          {(step === "authenticating" || isAuthenticating) && (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <Loader2 className="h-16 w-16 animate-spin text-gray-900" />
              <div className="text-center">
                <p className="text-lg font-semibold">Authenticating...</p>
                <p className="text-sm text-gray-600 mt-2">Verifying signature...</p>
              </div>
            </div>
          )}

          {/* Step 5: Success */}
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

      <style jsx global>{`
        .wallet-adapter-button-wrapper button {
          width: 100% !important;
          background-color: #111827 !important;
          color: white !important;
          font-size: 16px !important;
          padding: 1.5rem !important;
          border-radius: 0.5rem !important;
          font-weight: 600 !important;
        }
        .wallet-adapter-button-wrapper button:hover {
          background-color: #000000 !important;
        }
      `}</style>
    </div>
  );
}
