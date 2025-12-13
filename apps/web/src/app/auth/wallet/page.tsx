"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Wallet, CheckCircle, XCircle, ArrowLeft, X, Shield, Bot, Zap, ShoppingCart, ArrowLeftRight, Package } from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { useToast } from "@/hooks/use-toast";
import bs58 from "bs58";

type WalletAuthStep = "select" | "authenticating" | "success" | "error";

export default function WalletAuthPage() {
  const router = useRouter();
  const { publicKey, signMessage, connected, disconnect, wallet, select } = useWallet();
  const { setAuth } = useAuthStore();
  const { toast } = useToast();

  const [step, setStep] = useState<WalletAuthStep>("select");
  const [error, setError] = useState<string | null>(null);

  const isAuthenticatingRef = useRef(false);
  const hasAttemptedConnectRef = useRef(false);

  // Clear wallet state on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const keysToClear = ['walletName', 'walletAdapter', 'wallet-adapter', 'subra-wallet-v1'];
      keysToClear.forEach(key => {
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
      });
    }
    select(null);
    if (connected) disconnect();
    setStep("select");
    setError(null);
    isAuthenticatingRef.current = false;
    hasAttemptedConnectRef.current = false;
  }, [disconnect, select, connected]);

  // Main authentication flow - SIMPLIFIED
  const connectAndAuthenticate = useCallback(async () => {
    if (isAuthenticatingRef.current || !wallet?.adapter) return;

    isAuthenticatingRef.current = true;
    setError(null);
    setStep("authenticating");

    try {
      // Step 1: Connect wallet
      if (!connected) {
        console.log('🔌 Connecting wallet...');
        await wallet.adapter.connect();
        // Give wallet time to initialize
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Step 2: Wait for publicKey and signMessage to be available
      let retries = 0;
      while ((!publicKey || !signMessage) && retries < 5) {
        console.log(`⏳ Waiting for wallet to be ready... (attempt ${retries + 1})`);
        await new Promise(resolve => setTimeout(resolve, 500));
        retries++;
      }

      if (!publicKey || !signMessage) {
        throw new Error("Unable to access wallet. Please make sure your wallet is unlocked and try again.");
      }

      console.log('✅ Wallet ready!');
      console.log('📡 Requesting nonce...');

      // Step 3: Request Nonce
      const nonceResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/wallet/nonce`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress: publicKey.toBase58() }),
      });
      const nonceData = await nonceResponse.json();

      if (!nonceResponse.ok || !nonceData.success) {
        throw new Error(nonceData.error || "Failed to get authentication nonce");
      }

      console.log('✅ Nonce received');

      const message = new TextEncoder().encode(
        `Sign this message to authenticate with SUBRA\n\nWallet: ${publicKey.toBase58()}\nNonce: ${nonceData.data.nonce}\nTimestamp: ${new Date().toISOString()}\n\nThis signature will not cost any gas fees.`
      );

      // Step 4: Request Signature - this will trigger the popup
      console.log('📝 Requesting signature...');
      const signature = await signMessage(message);
      const signatureBase58 = bs58.encode(signature);

      console.log('✅ Signature received');

      // Step 5: Verify Signature
      console.log('🔍 Verifying signature...');
      const verifyResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/wallet/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          walletAddress: publicKey.toBase58(),
          signature: signatureBase58,
          message: new TextDecoder().decode(message),
          nonce: nonceData.data.nonce,
        }),
      });
      const verifyData = await verifyResponse.json();

      if (!verifyResponse.ok || !verifyData.success) {
        throw new Error(verifyData.error || "Failed to verify signature");
      }

      console.log('✅ Authentication successful!');

      setAuth(verifyData.data.user, verifyData.data.token);
      setStep("success");
      toast({ 
        title: "Authentication Successful!", 
        description: "Redirecting to dashboard..." 
      });
      
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (err: any) {
      console.error('❌ Authentication failed:', err);
      
      // Provide user-friendly error messages
      let userError = err.message || "Authentication failed";
      
      if (userError.includes("User rejected") || userError.includes("rejected")) {
        userError = "You rejected the signature request. Please try again and approve the signature.";
      }
      
      setError(userError);
      setStep("error");
      toast({ 
        title: "Authentication Failed", 
        description: userError, 
        variant: "destructive" 
      });
      disconnect();
    } finally {
      isAuthenticatingRef.current = false;
    }
  }, [publicKey, signMessage, wallet, connected, setAuth, router, toast, disconnect]);

  // Trigger auth when wallet selected
  useEffect(() => {
    if (wallet?.adapter && !hasAttemptedConnectRef.current) {
      console.log(`🎯 Wallet selected: ${wallet.adapter.name}`);
      hasAttemptedConnectRef.current = true;
      connectAndAuthenticate();
    }
  }, [wallet, connectAndAuthenticate]);

  return (
    <div className="min-h-screen bg-white relative overflow-hidden flex items-center justify-center p-4">
      {/* Subtle Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      
      {/* Minimal Dark Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-gray-900/10 to-gray-700/10 rounded-full filter blur-3xl animate-pulse" style={{animationDuration: '4s'}} />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-gray-800/10 to-green-500/10 rounded-full filter blur-3xl animate-pulse" style={{animationDuration: '5s', animationDelay: '1s'}} />

      {/* Navigation Buttons */}
      <Button
        onClick={() => router.back()}
        variant="ghost"
        className="absolute top-4 left-4 z-20 text-gray-900 hover:text-black"
        size="sm"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <Button
        onClick={() => router.push("/")}
        variant="ghost"
        className="absolute top-4 right-4 z-20 text-gray-900 hover:text-black"
        size="sm"
      >
        <X className="h-4 w-4" />
      </Button>

      <div className="w-full max-w-6xl relative z-10">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Card */}
          <div className="lg:col-span-2">
            <Card className="border border-gray-300 bg-white shadow-lg animate-fade-in-up">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center">
                    <Wallet className="h-7 w-7 text-white" />
                  </div>
                </div>
                <CardTitle className="text-3xl font-bold text-gray-900">
                  Connect Wallet
                </CardTitle>
                <CardDescription className="text-base">
                  Securely authenticate with your Solana wallet
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {error && (
                  <Alert variant="destructive" className="animate-slide-in-down">
                    <XCircle className="h-4 w-4" />
                    <AlertTitle>Connection Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {step === "select" && (
                  <div className="flex flex-col items-center space-y-6 animate-fade-in-up">
                    <p className="text-gray-600 text-center">
                      Select your Solana wallet to continue
                    </p>
                    <WalletMultiButton className="w-full bg-gray-900 hover:bg-black text-white font-semibold py-4 rounded-lg shadow-lg transition-all" />
                    <p className="text-sm text-gray-500 text-center">
                      Don't have a wallet?{" "}
                      <button onClick={() => router.push("/auth/register")} className="underline text-gray-900 hover:text-black">
                        Create one
                      </button>
                    </p>
                  </div>
                )}

                {step === "authenticating" && (
                  <div className="flex flex-col items-center space-y-6 py-8 animate-fade-in">
                    <Loader2 className="h-12 w-12 animate-spin text-gray-900" />
                    <p className="text-xl font-bold text-gray-900">Authenticating...</p>
                    <p className="text-gray-600 text-center text-sm">
                      Please approve the signature request in your wallet popup
                    </p>
                    <Button
                      onClick={() => {
                        disconnect();
                        setStep("select");
                        setError(null);
                        isAuthenticatingRef.current = false;
                        hasAttemptedConnectRef.current = false;
                      }}
                      variant="outline"
                      className="w-full border-gray-300"
                    >
                      Cancel
                    </Button>
                  </div>
                )}

                {step === "success" && (
                  <div className="flex flex-col items-center space-y-6 py-8 animate-fade-in">
                    <CheckCircle className="h-16 w-16 text-green-600" />
                    <p className="text-3xl font-bold text-gray-900">Authenticated!</p>
                    <p className="text-gray-600 text-center">Redirecting to dashboard...</p>
                  </div>
                )}

                {step === "error" && (
                  <div className="flex flex-col items-center space-y-6 py-8 animate-fade-in">
                    <XCircle className="h-16 w-16 text-red-600" />
                    <p className="text-3xl font-bold text-gray-900">Failed</p>
                    <p className="text-gray-600 text-center">{error}</p>
                    <Button
                      onClick={() => {
                        setStep("select");
                        setError(null);
                        isAuthenticatingRef.current = false;
                        hasAttemptedConnectRef.current = false;
                      }}
                      className="w-full bg-gray-900 hover:bg-black text-white"
                    >
                      Try Again
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Feature Cards */}
          <div className="space-y-6">
            {/* Coming Soon */}
            <Card className="border border-gray-300 bg-white animate-fade-in-up" style={{animationDelay: '0.1s'}}>
              <CardHeader>
                <CardTitle className="text-lg text-gray-900">What's Next</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center flex-shrink-0">
                    <Shield className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">ZK Proofs</p>
                    <p className="text-xs text-gray-600">Privacy-preserving verification</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-800 to-green-600 flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">AI Agents</p>
                    <p className="text-xs text-gray-600">Autonomous commerce execution</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center flex-shrink-0">
                    <ShoppingCart className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Marketplace</p>
                    <p className="text-xs text-gray-600">Multi-platform integration</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Roadmap Features */}
            <Card className="border border-gray-300 bg-white animate-fade-in-up" style={{animationDelay: '0.15s'}}>
              <CardHeader>
                <CardTitle className="text-lg text-gray-900">Coming Soon</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <ArrowLeftRight className="h-4 w-4 text-gray-900" />
                  <span className="text-gray-600">Agent-to-Agent payments (x402)</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Package className="h-4 w-4 text-gray-900" />
                  <span className="text-gray-600">Dropshipping capabilities</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Zap className="h-4 w-4 text-gray-900" />
                  <span className="text-gray-600">Price negotiation engine</span>
                </div>
              </CardContent>
            </Card>

            {/* Security */}
            <Card className="border border-gray-300 bg-gradient-to-br from-gray-900 to-gray-800 text-white animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              <CardContent className="pt-6">
                <Shield className="h-8 w-8 mb-3" />
                <h3 className="font-bold mb-2">Secure Connection</h3>
                <p className="text-sm text-gray-300 mb-3">
                  Your wallet signature never leaves your device. We verify cryptographically.
                </p>
                <div className="flex gap-2">
                  <span className="px-2 py-1 rounded text-xs bg-white/10 border border-white/20">Non-Custodial</span>
                  <span className="px-2 py-1 rounded text-xs bg-white/10 border border-white/20">Secure</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
