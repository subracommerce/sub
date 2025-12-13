"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuthStore } from "@/store/auth";
import { useToast } from "@/hooks/use-toast";
import { Shield, CheckCircle, Loader2, AlertCircle, Wallet } from "lucide-react";
import bs58 from "bs58";
import Link from "next/link";

export default function WalletAuthPage() {
  const { publicKey, signMessage, connected, disconnect } = useWallet();
  const { connection } = useConnection();
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const { toast } = useToast();
  
  const [step, setStep] = useState<"connect" | "sign" | "authenticating" | "success">("connect");
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Reset when wallet disconnects
  useEffect(() => {
    if (!connected && step !== "connect") {
      setStep("connect");
      setError(null);
    }
  }, [connected, step]);

  // Auto-proceed to sign step when wallet connects
  useEffect(() => {
    if (connected && publicKey && step === "connect") {
      setStep("sign");
    }
  }, [connected, publicKey, step]);

  const handleSignAndAuthenticate = async () => {
    if (!publicKey || !signMessage) {
      setError("Wallet not properly connected");
      return;
    }

    setIsAuthenticating(true);
    setError(null);

    try {
      // Step 1: Get nonce from backend
      const nonceResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/wallet/nonce`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress: publicKey.toBase58() }),
      });

      if (!nonceResponse.ok) {
        throw new Error("Failed to get authentication nonce");
      }

      const { data: { nonce } } = await nonceResponse.json();

      // Step 2: Create message to sign
      const message = `Sign this message to authenticate with SUBRA\n\nWallet: ${publicKey.toBase58()}\nNonce: ${nonce}\nTimestamp: ${new Date().toISOString()}`;
      const encodedMessage = new TextEncoder().encode(message);

      // Step 3: Sign the message
      setStep("authenticating");
      const signature = await signMessage(encodedMessage);
      const signatureBase58 = bs58.encode(signature);

      // Step 4: Verify signature and authenticate
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

      // Step 5: Store auth and redirect
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
      console.error("Wallet authentication error:", error);
      
      if (error.message?.includes("User rejected")) {
        setError("You rejected the signature request. Please try again.");
      } else if (error.message?.includes("Wallet not connected")) {
        setError("Please connect your wallet first");
      } else {
        setError(error.message || "Failed to authenticate. Please try again.");
      }
      
      setStep("sign");
      setIsAuthenticating(false);
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleDisconnect = () => {
    disconnect();
    setStep("connect");
    setError(null);
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
              <Wallet className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold">Connect Your Wallet</CardTitle>
          <CardDescription className="text-base">
            {step === "connect" && "Choose your Solana wallet to continue"}
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
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Step 1: Connect Wallet */}
          {step === "connect" && (
            <div className="space-y-4">
              <Alert className="border-2 border-blue-500 bg-blue-50">
                <Shield className="h-4 w-4 text-blue-600" />
                <AlertTitle className="text-blue-900">Secure Connection</AlertTitle>
                <AlertDescription className="text-blue-800 text-sm">
                  You'll be asked to sign a message to prove wallet ownership. No gas fees required.
                </AlertDescription>
              </Alert>

              <div className="flex flex-col items-center space-y-4 pt-4">
                <WalletMultiButton className="!bg-gray-900 hover:!bg-black !text-white !rounded-lg !px-6 !py-3 !text-base !font-semibold !transition-all hover:!scale-105" />
                
                <p className="text-sm text-gray-600 text-center">
                  Supports Phantom, Solflare, Backpack, and more
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Sign Message */}
          {step === "sign" && !isAuthenticating && (
            <div className="space-y-4">
              <Alert className="border-2 border-green-500 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-900">Wallet Connected</AlertTitle>
                <AlertDescription className="text-green-800 text-sm">
                  {publicKey?.toBase58().slice(0, 8)}...{publicKey?.toBase58().slice(-8)}
                </AlertDescription>
              </Alert>

              <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4 text-sm">
                <p className="font-semibold mb-2">What happens next?</p>
                <ul className="space-y-1 text-gray-700">
                  <li>• You'll sign a secure message</li>
                  <li>• No transaction or gas fees</li>
                  <li>• Proves you own this wallet</li>
                  <li>• Creates your account instantly</li>
                </ul>
              </div>

              <div className="space-y-3 pt-2">
                <Button 
                  onClick={handleSignAndAuthenticate}
                  className="w-full bg-gray-900 hover:bg-black text-white py-6 text-base font-semibold hover:scale-105 transition-all"
                  size="lg"
                  disabled={isAuthenticating}
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
                  Disconnect Wallet
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
                  Verifying your signature with the blockchain
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
    </div>
  );
}

