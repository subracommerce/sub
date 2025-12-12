"use client";

import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/store/auth";
import { generateNonce } from "@/lib/wallet-auth";
import { Wallet, Shield, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";
import bs58 from "bs58";

export default function WalletAuthPage() {
  const { publicKey, signMessage, disconnect, connected } = useWallet();
  const { setVisible } = useWalletModal();
  const router = useRouter();
  const { toast } = useToast();
  const { setAuth, isAuthenticated } = useAuthStore();
  const [isSigning, setIsSigning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  // Force disconnect any cached connections on page load
  useEffect(() => {
    if (connected && !isAuthenticated) {
      console.log("Clearing cached connection from previous session...");
      disconnect();
    }
  }, []);

  // Prevent false connections
  useEffect(() => {
    if (connected && !publicKey) {
      console.warn("False connection detected, disconnecting...");
      disconnect();
    }
  }, [connected, publicKey, disconnect]);

  const handleConnect = () => {
    // Clear any old connections first
    if (connected) {
      disconnect();
      setTimeout(() => {
        setVisible(true);
      }, 100);
    } else {
      setVisible(true);
    }
  };

  const handleSignIn = async () => {
    if (!publicKey || !signMessage) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    setIsSigning(true);
    setError(null);

    try {
      const nonce = generateNonce();
      
      const message = `Sign in to SUBRA

This request will not trigger a blockchain transaction or cost any gas fees.

Wallet: ${publicKey.toBase58()}
Nonce: ${nonce}
Timestamp: ${new Date().toISOString()}

By signing, you agree to our Terms of Service and Privacy Policy.`;

      console.log("🔐 Requesting signature from Phantom...");
      
      const messageBytes = new TextEncoder().encode(message);
      
      // This MUST trigger Phantom popup
      const signatureBytes = await signMessage(messageBytes);
      
      console.log("✅ Signature received!");
      
      const signature = bs58.encode(signatureBytes);
      const encodedMessage = bs58.encode(messageBytes);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/wallet`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          publicKey: publicKey.toBase58(),
          signature,
          message: encodedMessage,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setAuth(result.data.user, result.data.token);
        
        toast({
          title: "Welcome! 🎉",
          description: "Successfully signed in",
        });

        router.push("/dashboard");
      } else {
        setError(result.error || "Authentication failed");
        toast({
          title: "Authentication Failed",
          description: result.error || "Failed to verify signature",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("❌ Error:", error);

      let errorMessage = "Failed to sign message";

      if (error.message?.includes("User rejected") || error.code === 4001 || error.code === "USER_REJECTED") {
        errorMessage = "You declined the signature request";
      } else if (error.message) {
        errorMessage = error.message;
      }

      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSigning(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-center mb-4">
            <Wallet className="w-12 h-12 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            Sign In with Wallet
          </CardTitle>
          <CardDescription className="text-center">
            Secure authentication using your Solana wallet
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <Alert className="border-red-500 bg-red-50 dark:bg-red-950">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800 dark:text-red-200">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {!connected && (
            <div className="space-y-4">
              <Alert className="border-blue-500 bg-blue-50 dark:bg-blue-950">
                <AlertDescription className="text-blue-800 dark:text-blue-200">
                  <p className="font-semibold mb-2">🔐 Secure Connection Process:</p>
                  <ol className="text-sm space-y-1 list-decimal list-inside">
                    <li>Make sure Phantom is unlocked</li>
                    <li>Click "Connect Wallet" below</li>
                    <li>Phantom popup will appear</li>
                    <li>Select your wallet and approve</li>
                    <li>Then sign the authentication message</li>
                  </ol>
                </AlertDescription>
              </Alert>

              <Button
                onClick={handleConnect}
                className="w-full"
                size="lg"
              >
                <Wallet className="mr-2 h-5 w-5" />
                Connect Wallet
              </Button>
              
              <p className="text-xs text-center text-muted-foreground">
                Don't have Phantom? <a href="https://phantom.app" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Download here</a>
              </p>
            </div>
          )}

          {connected && publicKey && (
            <div className="space-y-4">
              <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800 dark:text-green-200">
                  <p className="font-semibold mb-1">✅ Wallet Connected!</p>
                  <p className="text-xs font-mono break-all">
                    {publicKey.toBase58()}
                  </p>
                </AlertDescription>
              </Alert>

              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  <p className="text-sm font-medium mb-1">Now authenticate with signature</p>
                  <p className="text-xs">
                    Click below and Phantom will ask you to sign. This proves you own this wallet (free, no gas).
                  </p>
                </AlertDescription>
              </Alert>

              <Button
                onClick={handleSignIn}
                disabled={isSigning}
                className="w-full"
                size="lg"
              >
                {isSigning ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Waiting for Signature...
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    Sign to Authenticate
                  </>
                )}
              </Button>

              <Button
                onClick={() => {
                  disconnect();
                  setError(null);
                }}
                variant="outline"
                className="w-full"
                disabled={isSigning}
              >
                Disconnect & Try Again
              </Button>

              {isSigning && (
                <Alert className="border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <AlertDescription className="text-yellow-800 dark:text-yellow-200">
                    <p className="font-bold mb-2">📱 Check Phantom Extension</p>
                    <ul className="text-xs space-y-1 list-disc list-inside">
                      <li>Look for Phantom icon in browser toolbar</li>
                      <li>A popup should appear with signature request</li>
                      <li>Review the message</li>
                      <li>Click "Sign" or "Approve"</li>
                    </ul>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          <div className="text-center text-sm pt-4 border-t space-y-2">
            <p className="text-muted-foreground">Other options:</p>
            <div className="flex gap-2 justify-center">
              <Link href="/auth/register">
                <Button variant="link" size="sm">
                  Create Account
                </Button>
              </Link>
              <span className="text-muted-foreground">•</span>
              <Link href="/auth/login">
                <Button variant="link" size="sm">
                  Email Sign In
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
