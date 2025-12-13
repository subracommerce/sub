"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuthStore } from "@/store/auth";
import { useToast } from "@/hooks/use-toast";
import { Shield, CheckCircle, Loader2, AlertCircle, Wallet as WalletIcon, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import bs58 from "bs58";
import Link from "next/link";

export default function WalletAuthPage() {
  const { publicKey, signMessage, connected, disconnect, wallet, select, connect } = useWallet();
  const { setVisible } = useWalletModal();
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const { toast } = useToast();
  
  const [status, setStatus] = useState<"idle" | "connecting" | "authenticating" | "success">("idle");
  const [error, setError] = useState<string | null>(null);
  const hasAttemptedAuth = useRef(false);
  const hasAttemptedConnect = useRef(false);

  // Force clean state on mount
  useEffect(() => {
    const init = async () => {
      console.log('🔒 Initializing - clearing wallet selection');
      
      if (connected) {
        await disconnect();
      }
      
      select(null);
      
      if (typeof window !== 'undefined') {
        localStorage.removeItem('walletName');
      }
      
      setStatus("idle");
      setError(null);
      hasAttemptedAuth.current = false;
      hasAttemptedConnect.current = false;
      
      console.log('✅ Clean state - ready for wallet selection');
    };
    
    init();
  }, []);

  // When wallet is selected, manually trigger connect()
  useEffect(() => {
    const triggerConnect = async () => {
      if (wallet && !connected && !hasAttemptedConnect.current && status === "idle") {
        console.log('🚀 WALLET SELECTED:', wallet.adapter.name);
        console.log('   Manually calling connect()...');
        
        hasAttemptedConnect.current = true;
        setStatus("connecting");
        setError(null);
        
        try {
          console.log('   Attempting connection...');
          await connect();
          console.log('✅ Connect successful!');
        } catch (err: any) {
          console.error('❌ Connect failed:', err);
          
          hasAttemptedConnect.current = false;
          setStatus("idle");
          
          if (err.message?.includes("User rejected") || err.message?.includes("User cancelled")) {
            setError("You cancelled the connection. Please try again.");
          } else {
            setError(err.message || "Failed to connect. Please try again.");
          }
          
          select(null);
        }
      }
    };
    
    triggerConnect();
  }, [wallet, connected, status]);

  // When connected, request signature
  useEffect(() => {
    const authenticateAfterConnection = async () => {
      if (connected && publicKey && signMessage && !hasAttemptedAuth.current && status === "connecting") {
        console.log('✅ Wallet connected! Address:', publicKey.toBase58());
        console.log('   Wallet:', wallet?.adapter?.name);
        console.log('   Requesting signature...');
        
        hasAttemptedAuth.current = true;
        setStatus("authenticating");
        setError(null);

        try {
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

          const message = `Sign in to SUBRA\n\nWallet: ${publicKey.toBase58()}\nNonce: ${nonce}\nTimestamp: ${new Date().toISOString()}\n\nThis proves you own this wallet.\nNo gas fees.`;
          const encodedMessage = new TextEncoder().encode(message);

          console.log('📝 Requesting signature - popup should appear...');
          const signature = await signMessage(encodedMessage);
          const signatureBase58 = bs58.encode(signature);
          
          console.log('✅ Signature received!');
          
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
          
          await disconnect();
          select(null);
          hasAttemptedAuth.current = false;
          hasAttemptedConnect.current = false;
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

  // Reset when disconnected
  useEffect(() => {
    if (!connected && (status === "connecting" || status === "authenticating")) {
      console.log('❌ Wallet disconnected, resetting');
      hasAttemptedAuth.current = false;
      hasAttemptedConnect.current = false;
      setStatus("idle");
    }
  }, [connected, status]);

  const handleSelectWallet = () => {
    console.log('👆 User clicked Select Wallet button');
    console.log('   Opening wallet modal...');
    setError(null);
    hasAttemptedAuth.current = false;
    hasAttemptedConnect.current = false;
    
    // Open the wallet selection modal
    setVisible(true);
    console.log('📋 Modal should be visible now');
  };

  const handleCancel = async () => {
    console.log('❌ User clicked cancel');
    
    try {
      await disconnect();
      select(null);
    } catch (e) {
      console.error('Disconnect error:', e);
    }
    
    setStatus("idle");
    setError(null);
    hasAttemptedAuth.current = false;
    hasAttemptedConnect.current = false;
  };

  const handleGoBack = () => {
    router.back();
  };

  // Debug: log all state changes
  useEffect(() => {
    console.log('📊 STATE:', {
      status,
      connected,
      hasPublicKey: !!publicKey,
      hasSignMessage: !!signMessage,
      walletName: wallet?.adapter?.name,
      hasAttemptedConnect: hasAttemptedConnect.current,
      hasAttemptedAuth: hasAttemptedAuth.current,
    });
  }, [status, connected, publicKey, signMessage, wallet]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden p-4">
      {/* Animated Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:3rem_3rem] animate-grid-slow opacity-50" />
      
      {/* Floating Orbs */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-full blur-3xl animate-float-1" />
      <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-br from-blue-500/15 to-purple-500/15 rounded-full blur-3xl animate-float-2" />
      
      {/* Scan Line Effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-full h-[2px] bg-gradient-to-r from-transparent via-green-500/50 to-transparent animate-scan-line" />
      </div>

      {/* Back Button - Top Left */}
      <Button
        onClick={handleGoBack}
        variant="outline"
        className="absolute top-4 left-4 z-20 border-2 hover:bg-gray-100 hover:scale-105 transition-all"
        size="sm"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <Card className="w-full max-w-md border-2 border-gray-200 shadow-2xl relative z-10 bg-white/95 backdrop-blur-sm animate-fade-in-up corner-accents">
        <CardHeader className="text-center relative">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center animate-pulse-glow relative">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-green-500 to-blue-500 animate-shimmer opacity-50" />
              <WalletIcon className="w-8 h-8 text-white relative z-10" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent">
            Connect Your Wallet
          </CardTitle>
          <CardDescription className="text-base">
            {status === "idle" && "Select your wallet to continue"}
            {status === "connecting" && (
              <span className="flex items-center justify-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Connecting to {wallet?.adapter?.name || "wallet"}...
              </span>
            )}
            {status === "authenticating" && (
              <span className="flex items-center justify-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                Authenticating...
              </span>
            )}
            {status === "success" && "Success!"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive" className="border-2">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
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
                className="w-full bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 hover:from-black hover:via-gray-900 hover:to-black text-white py-6 text-base font-semibold hover:scale-105 transition-all relative overflow-hidden group"
                size="lg"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                <WalletIcon className="mr-2 h-5 w-5 relative z-10" />
                <span className="relative z-10">Select Wallet</span>
              </Button>
              
              <p className="text-xs text-gray-500 text-center">
                Phantom • Solflare • Backpack • Ledger • Torus
              </p>

              {/* Debug Info */}
              <div className="text-xs text-gray-400 text-center space-y-1 mt-4 p-3 bg-gray-50 rounded">
                <p>Debug Info:</p>
                <p>Connected: {connected ? "✅" : "❌"}</p>
                <p>Wallet: {wallet?.adapter?.name || "None"}</p>
                <p>Status: {status}</p>
              </div>
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
                <p className="text-xs text-gray-500 mt-2">
                  If popup doesn't appear, check if wallet is unlocked
                </p>
              </div>
              <Button 
                onClick={handleCancel}
                variant="outline"
                className="mt-4 border-2"
              >
                <AlertCircle className="mr-2 h-4 w-4" />
                Cancel
              </Button>
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
              <Button 
                onClick={handleCancel}
                variant="outline"
                className="mt-4 border-2"
              >
                <AlertCircle className="mr-2 h-4 w-4" />
                Cancel
              </Button>
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
