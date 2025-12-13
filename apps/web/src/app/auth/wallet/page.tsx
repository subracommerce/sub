"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuthStore } from "@/store/auth";
import { useToast } from "@/hooks/use-toast";
import { Shield, CheckCircle, Loader2, AlertCircle, Wallet as WalletIcon } from "lucide-react";
import bs58 from "bs58";
import Link from "next/link";

export default function WalletAuthPage() {
  const { publicKey, signMessage, connected, disconnect, wallet, connecting } = useWallet();
  const { connection } = useConnection();
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const { toast } = useToast();
  
  const [step, setStep] = useState<"select" | "sign" | "authenticating" | "success">("select");
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const hasAttemptedAuth = useRef(false);
  const connectionAttempted = useRef(false);

  // Force disconnect on mount to ensure clean state
  useEffect(() => {
    const forceCleanState = async () => {
      console.log('🧹 Forcing clean state on mount');
      
      if (connected) {
        console.log('🔌 Disconnecting existing wallet');
        await disconnect();
      }
      
      setStep("select");
      setError(null);
      hasAttemptedAuth.current = false;
      connectionAttempted.current = false;
    };
    
    forceCleanState();
  }, []);

  // Monitor connection state changes
  useEffect(() => {
    console.log('🔌 Wallet state:', { 
      connected, 
      connecting,
      hasPublicKey: !!publicKey, 
      hasSignMessage: !!signMessage,
      walletName: wallet?.adapter?.name,
      step,
      connectionAttempted: connectionAttempted.current
    });

    // If disconnected unexpectedly, reset
    if (!connected && !connecting && step !== "select" && step !== "success") {
      console.log('❌ Wallet disconnected, resetting to select step');
      setStep("select");
      setError(null);
      hasAttemptedAuth.current = false;
      connectionAttempted.current = false;
    }

    // If wallet connects successfully
    if (connected && publicKey && step === "select" && !connectionAttempted.current) {
      connectionAttempted.current = true;
      validateAndProceed();
    }
  }, [connected, publicKey, signMessage, connecting, step, wallet]);

  const validateAndProceed = async () => {
    console.log('🔍 Validating wallet connection...');
    
    // Small delay to ensure wallet is fully ready
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Check if signMessage is available
    if (!signMessage) {
      console.error('❌ signMessage not available - wallet might be locked');
      setError("Wallet is locked or not ready. Please unlock your wallet and try again.");
      await disconnect();
      connectionAttempted.current = false;
      return;
    }

    // Check if wallet adapter is connected
    if (!wallet?.adapter?.connected) {
      console.error('❌ Wallet adapter not connected');
      setError("Wallet connection failed. Please try again.");
      await disconnect();
      connectionAttempted.current = false;
      return;
    }

    console.log('✅ Connection validated, proceeding to sign step');
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
      console.log('🔐 Step 1: Requesting nonce from backend...');
      
      const nonceResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/wallet/nonce`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress: publicKey.toBase58() }),
      });

      if (!nonceResponse.ok) {
        throw new Error("Failed to get authentication nonce");
      }

      const { data: { nonce } } = await nonceResponse.json();
      console.log('✅ Nonce received:', nonce.slice(0, 16) + '...');

      const message = `Sign this message to authenticate with SUBRA\n\nWallet: ${publicKey.toBase58()}\nNonce: ${nonce}\nTimestamp: ${new Date().toISOString()}\n\nThis signature will not cost any gas fees.`;
      const encodedMessage = new TextEncoder().encode(message);

      console.log('📝 Step 2: Requesting signature from wallet...');

      const signature = await signMessage(encodedMessage);
      const signatureBase58 = bs58.encode(signature);
      
      console.log('✅ Signature received:', signatureBase58.slice(0, 16) + '...');

      console.log('🔍 Step 3: Verifying signature with backend...');
      
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
        description: "Successfully authenticated with your Solana wallet",
      });

      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);

    } catch (error: any) {
      console.error("❌ Wallet authentication error:", error);
      
      hasAttemptedAuth.current = false;
      
      if (error.message?.includes("User rejected")) {
        setError("You rejected the signature request. Please try again.");
        setStep("sign");
      } else if (error.message?.includes("Wallet not connected")) {
        setError("Please connect your wallet first");
        setStep("select");
        connectionAttempted.current = false;
        await disconnect();
      } else {
        setError(error.message || "Failed to authenticate. Please try again.");
        setStep("sign");
      }
      
      setIsAuthenticating(false);
    }
  };

  const handleDisconnect = async () => {
    console.log('🔌 Manual disconnect');
    await disconnect();
    setStep("select");
    setError(null);
    hasAttemptedAuth.current = false;
    connectionAttempted.current = false;
  };

  const handleTryAgain = async () => {
    console.log('🔄 Try again');
    setError(null);
    setStep("select");
    hasAttemptedAuth.current = false;
    connectionAttempted.current = false;
    await disconnect();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white relative overflow-hidden p-4">
      {/* Background */}
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
            {step === "select" && "Choose your Solana wallet to continue"}
            {step === "sign" && "Sign the message to authenticate"}
            {step === "authenticating" && "Verifying your signature..."}
            {step === "success" && "Successfully authenticated!"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Error Alert */}
          {error && (
            <Alert variant="destructive" className="border-2">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {error}
                <Button 
                  onClick={handleTryAgain}
                  variant="outline"
                  size="sm"
                  className="mt-2 w-full"
                >
                  Try Again
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Step 1: Select Wallet */}
          {step === "select" && (
            <div className="space-y-4">
              <Alert className="border-2 border-blue-500 bg-blue-50">
                <Shield className="h-4 w-4 text-blue-600" />
                <AlertTitle className="text-blue-900">Secure Connection</AlertTitle>
                <AlertDescription className="text-blue-800 text-sm">
                  <ul className="list-disc list-inside space-y-1 mt-2">
                    <li>Your wallet extension will popup</li>
                    <li>Approve the connection request</li>
                    <li>Then you'll sign a message</li>
                    <li>No gas fees required</li>
                  </ul>
                </AlertDescription>
              </Alert>

              <div className="flex flex-col items-center space-y-4">
                {/* Use the standard WalletMultiButton */}
                <div className="wallet-adapter-button-wrapper w-full">
                  <WalletMultiButton 
                    className="!w-full !bg-gray-900 hover:!bg-black !text-white !rounded-lg !px-6 !py-4 !text-base !font-semibold !transition-all hover:!scale-105 !justify-center"
                  />
                </div>
                
                <p className="text-sm text-gray-600 text-center">
                  Supports Phantom, Solflare, Backpack, Ledger, and more
                </p>
                
                <Alert className="border-2 border-gray-200 bg-gray-50 w-full">
                  <AlertCircle className="h-4 w-4 text-gray-600" />
                  <AlertTitle className="text-gray-900 text-sm">Important</AlertTitle>
                  <AlertDescription className="text-gray-700 text-xs">
                    <ul className="list-disc list-inside space-y-1 mt-1">
                      <li>Click "Select Wallet" above</li>
                      <li>Choose your wallet from the list</li>
                      <li>Your wallet extension will popup</li>
                      <li>Approve the connection</li>
                    </ul>
                  </AlertDescription>
                </Alert>
              </div>
            </div>
          )}

          {/* Step 2: Sign Message */}
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
                <p className="font-semibold mb-2">What happens next?</p>
                <ul className="space-y-1 text-gray-700">
                  <li>✓ Your wallet will pop up</li>
                  <li>✓ Review the message</li>
                  <li>✓ Click "Sign" or "Approve"</li>
                  <li>✓ No gas fees</li>
                  <li>✓ Account created instantly</li>
                </ul>
              </div>

              <div className="space-y-3 pt-2">
                <Button 
                  onClick={handleSignAndAuthenticate}
                  className="w-full bg-gray-900 hover:bg-black text-white py-6 text-base font-semibold hover:scale-105 transition-all"
                  size="lg"
                  disabled={isAuthenticating || !signMessage}
                >
                  <Shield className="mr-2 h-5 w-5" />
                  Sign & Authenticate
                </Button>

                <Button 
                  onClick={handleDisconnect}
                  variant="outline"
                  className="w-full border-2"
                  disabled={isAuthenticating}
                >
                  Disconnect & Choose Different Wallet
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Authenticating */}
          {(step === "authenticating" || isAuthenticating) && (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <Loader2 className="h-16 w-16 animate-spin text-gray-900" />
              <div className="text-center">
                <p className="text-lg font-semibold">Authenticating...</p>
                <p className="text-sm text-gray-600 mt-2">
                  Verifying your signature...
                </p>
              </div>
            </div>
          )}

          {/* Step 4: Success */}
          {step === "success" && (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center">
                <CheckCircle className="h-10 w-10 text-white" />
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold">Success!</p>
                <p className="text-sm text-gray-600 mt-2">
                  Redirecting to dashboard...
                </p>
              </div>
            </div>
          )}

          {/* Back to registration */}
          <div className="text-center text-sm text-gray-600 pt-4 border-t-2">
            <Link href="/auth/register" className="font-semibold text-gray-900 hover:underline">
              ← Back to registration
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Custom CSS to style the wallet button */}
      <style jsx global>{`
        .wallet-adapter-button-wrapper button {
          width: 100% !important;
          background-color: #111827 !important;
          color: white !important;
          font-size: 16px !important;
          padding: 1.5rem !important;
          border-radius: 0.5rem !important;
          font-weight: 600 !important;
          transition: all 0.3s !important;
        }
        
        .wallet-adapter-button-wrapper button:hover {
          background-color: #000000 !important;
          transform: scale(1.05) !important;
        }
        
        .wallet-adapter-modal-wrapper {
          z-index: 9999 !important;
        }
      `}</style>
    </div>
  );
}
