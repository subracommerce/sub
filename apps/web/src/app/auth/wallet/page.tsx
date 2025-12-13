"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuthStore } from "@/store/auth";
import { useToast } from "@/hooks/use-toast";
import { Shield, CheckCircle, Loader2, AlertCircle, Wallet as WalletIcon } from "lucide-react";
import bs58 from "bs58";
import Link from "next/link";

export default function WalletAuthPage() {
  const { publicKey, signMessage, connected, disconnect, wallet } = useWallet();
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const { toast } = useToast();
  
  const [status, setStatus] = useState<"idle" | "authenticating" | "success">("idle");
  const [error, setError] = useState<string | null>(null);
  const hasAttemptedAuth = useRef(false);

  // AUTOMATICALLY sign message when wallet connects
  useEffect(() => {
    const authenticateAfterConnection = async () => {
      // Only proceed if:
      // 1. Wallet is connected
      // 2. We have publicKey and signMessage
      // 3. Haven't already attempted auth
      // 4. Not currently authenticating
      if (connected && publicKey && signMessage && !hasAttemptedAuth.current && status !== "authenticating") {
        console.log('✅ Wallet connected! IMMEDIATELY requesting signature...');
        
        hasAttemptedAuth.current = true;
        setStatus("authenticating");
        setError(null);

        try {
          // Step 1: Get nonce
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

          // Step 2: IMMEDIATELY request signature (NO separate button click!)
          const message = `Sign in to SUBRA\n\nWallet: ${publicKey.toBase58()}\nNonce: ${nonce}\nTimestamp: ${new Date().toISOString()}\n\nThis proves you own this wallet.\nNo gas fees.`;
          const encodedMessage = new TextEncoder().encode(message);

          console.log('📝 Requesting signature - POPUP SHOULD APPEAR NOW!');
          const signature = await signMessage(encodedMessage);
          const signatureBase58 = bs58.encode(signature);
          
          console.log('✅ Signature received!');
          
          // Step 3: Verify
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
            description: "Wallet authenticated",
          });

          setTimeout(() => {
            router.push("/dashboard");
          }, 1500);

        } catch (error: any) {
          console.error("❌ Authentication failed:", error);
          
          // Disconnect and reset on error
          await disconnect();
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
  }, [connected, publicKey, signMessage, status, disconnect, setAuth, router, toast]);

  // Reset when disconnected
  useEffect(() => {
    if (!connected && status !== "idle") {
      hasAttemptedAuth.current = false;
      setStatus("idle");
      setError(null);
    }
  }, [connected, status]);

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
            {status === "idle" && "Secure wallet authentication"}
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
                    <li>Choose your wallet and approve connection</li>
                    <li>Sign message to authenticate (automatic)</li>
                    <li>You're in! No gas fees</li>
                  </ol>
                </AlertDescription>
              </Alert>

              <div className="flex flex-col items-center space-y-4">
                <WalletMultiButton 
                  className="!bg-gray-900 hover:!bg-black !text-white !py-3 !px-6 !rounded-lg !text-base !font-semibold !transition-all hover:!scale-105"
                  style={{
                    backgroundColor: '#111827',
                    color: 'white',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '600',
                  }}
                />
                <p className="text-xs text-gray-500 text-center">
                  Phantom • Solflare • Backpack • Ledger • Torus
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
