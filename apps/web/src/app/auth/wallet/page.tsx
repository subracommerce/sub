"use client";

import { useEffect, useState, useCallback } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/store/auth";
import { ConnectWalletButton } from "@/components/connect-wallet-button";
import { createAuthMessage, signAuthMessage, verifyWalletAuth, generateNonce } from "@/lib/wallet-auth";
import { Wallet, Shield, CheckCircle, AlertCircle, Lock } from "lucide-react";
import Link from "next/link";

export default function WalletAuthPage() {
  const wallet = useWallet();
  const { publicKey, signMessage, disconnect, select, wallets } = wallet;
  const router = useRouter();
  const { toast } = useToast();
  const { setAuth, isAuthenticated } = useAuthStore();
  const [isSigning, setIsSigning] = useState(false);
  const [step, setStep] = useState<"connect" | "sign" | "success">("connect");
  const [isTestingWallet, setIsTestingWallet] = useState(false);
  const [walletError, setWalletError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  // Test if wallet is actually unlocked and accessible
  const testWalletAccess = useCallback(async () => {
    if (!publicKey || !signMessage) {
      setWalletError("Wallet not ready");
      return false;
    }

    setIsTestingWallet(true);
    setWalletError(null);

    try {
      // Try to access the public key - this will fail if wallet is locked
      const pubKeyString = publicKey.toBase58();
      
      if (!pubKeyString || pubKeyString.length < 32) {
        throw new Error("Invalid public key");
      }

      console.log("✅ Wallet is unlocked and accessible:", pubKeyString.slice(0, 8) + "...");
      setIsTestingWallet(false);
      return true;
    } catch (error: any) {
      console.error("❌ Wallet access test failed:", error);
      setWalletError("Wallet appears to be locked. Please unlock Phantom and try again.");
      
      // Disconnect the false connection
      setTimeout(() => {
        disconnect();
      }, 100);
      
      setIsTestingWallet(false);
      return false;
    }
  }, [publicKey, signMessage, disconnect]);

  // When publicKey appears, test if wallet is truly accessible
  useEffect(() => {
    if (publicKey && signMessage) {
      console.log("🔍 Wallet connected, testing accessibility...");
      testWalletAccess().then((isReady) => {
        if (isReady) {
          setStep("sign");
        } else {
          setStep("connect");
        }
      });
    } else {
      setStep("connect");
      setWalletError(null);
    }
  }, [publicKey, signMessage, testWalletAccess]);

  const handleSignIn = async () => {
    if (!publicKey || !signMessage) {
      toast({
        title: "Wallet Not Ready",
        description: "Please connect and unlock your wallet first",
        variant: "destructive",
      });
      return;
    }

    // Test wallet access before attempting to sign
    const isAccessible = await testWalletAccess();
    if (!isAccessible) {
      toast({
        title: "Wallet Locked",
        description: "Please unlock your Phantom wallet and reconnect",
        variant: "destructive",
      });
      return;
    }

    setIsSigning(true);

    try {
      const nonce = generateNonce();
      const message = createAuthMessage(publicKey.toBase58(), nonce);

      console.log("🔐 Requesting signature from wallet...");

      const { signature, message: encodedMessage } = await signAuthMessage(
        signMessage,
        message
      );

      console.log("✅ Signature received, verifying...");

      const result = await verifyWalletAuth(
        publicKey.toBase58(),
        signature,
        encodedMessage
      );

      if (result.success) {
        setAuth(result.data.user, result.data.token);
        setStep("success");
        
        toast({
          title: "Welcome! 🎉",
          description: `Signed in as ${publicKey.toBase58().slice(0, 8)}...`,
        });

        setTimeout(() => {
          router.push("/dashboard");
        }, 1500);
      } else {
        toast({
          title: "Authentication Failed",
          description: result.error || "Failed to verify signature",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("❌ Sign in error:", error);

      if (
        error.message?.includes("User rejected") ||
        error.message?.includes("rejected") ||
        error.code === 4001
      ) {
        toast({
          title: "Signature Rejected",
          description: "You declined the signature request",
          variant: "destructive",
        });
      } else if (error.message?.includes("locked")) {
        toast({
          title: "Wallet Locked",
          description: "Please unlock your Phantom wallet first",
          variant: "destructive",
        });
        disconnect();
      } else {
        toast({
          title: "Error",
          description: error.message || "Failed to sign message. Make sure your wallet is unlocked.",
          variant: "destructive",
        });
      }
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
          {/* Important Instructions */}
          {step === "connect" && (
            <Alert className="border-blue-500 bg-blue-50 dark:bg-blue-950">
              <Shield className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800 dark:text-blue-200">
                <div className="space-y-3">
                  <p className="font-bold text-lg">⚠️ IMPORTANT: Unlock First!</p>
                  <ol className="text-sm space-y-2 list-decimal list-inside">
                    <li className="font-medium">
                      Click the Phantom extension in your browser
                    </li>
                    <li className="font-medium">
                      Enter your password to UNLOCK it
                    </li>
                    <li className="font-medium">
                      Then come back here and click "Connect Wallet"
                    </li>
                  </ol>
                  <p className="text-xs mt-2 pt-2 border-t border-blue-300">
                    ❌ Do NOT connect while Phantom is locked - it won't work!
                  </p>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Wallet Error */}
          {walletError && (
            <Alert className="border-red-500 bg-red-50 dark:bg-red-950">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800 dark:text-red-200">
                <div className="space-y-2">
                  <p className="font-medium">🔒 {walletError}</p>
                  <p className="text-sm">
                    Steps to fix:
                  </p>
                  <ol className="text-sm list-decimal list-inside space-y-1">
                    <li>Close any wallet connection</li>
                    <li>Open Phantom extension</li>
                    <li>Unlock with your password</li>
                    <li>Try connecting again</li>
                  </ol>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Testing Wallet */}
          {isTestingWallet && (
            <Alert>
              <AlertDescription>
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  <span>Verifying wallet is unlocked...</span>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Step 1: Connect Wallet */}
          {step === "connect" && !isTestingWallet && (
            <div className="space-y-4">
              <Alert>
                <Lock className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-2">
                    <p className="font-medium">Step 1: Connect Your Wallet</p>
                    <p className="text-sm">
                      Make sure Phantom is unlocked first!
                    </p>
                  </div>
                </AlertDescription>
              </Alert>
              
              <ConnectWalletButton />
              
              <p className="text-xs text-center text-muted-foreground">
                Don't have Phantom? <a href="https://phantom.app" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Download here</a>
              </p>
            </div>
          )}

          {/* Step 2: Sign Message */}
          {step === "sign" && publicKey && !isTestingWallet && (
            <div className="space-y-4">
              <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800 dark:text-green-200">
                  <div className="space-y-2">
                    <p className="font-medium">✅ Wallet Connected & Verified!</p>
                    <p className="text-sm font-mono">
                      {publicKey.toBase58().slice(0, 8)}...
                      {publicKey.toBase58().slice(-8)}
                    </p>
                  </div>
                </AlertDescription>
              </Alert>

              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-2">
                    <p className="font-medium">Step 2: Sign to Authenticate</p>
                    <p className="text-sm">
                      Click below and Phantom will ask you to sign a message. This proves you own this wallet and costs no gas fees.
                    </p>
                  </div>
                </AlertDescription>
              </Alert>

              <Button
                onClick={handleSignIn}
                disabled={isSigning}
                className="w-full transition-all hover:scale-105"
                size="lg"
              >
                {isSigning ? "Waiting for signature..." : "Sign Message to Continue"}
              </Button>

              <Button
                onClick={() => {
                  disconnect();
                  setStep("connect");
                }}
                variant="outline"
                className="w-full"
              >
                Use Different Wallet
              </Button>
            </div>
          )}

          {/* Step 3: Success */}
          {step === "success" && (
            <div className="space-y-4">
              <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800 dark:text-green-200">
                  <div className="space-y-2 text-center">
                    <p className="font-bold text-lg">🎉 Authentication Successful!</p>
                    <p className="text-sm">Redirecting to dashboard...</p>
                  </div>
                </AlertDescription>
              </Alert>
            </div>
          )}

          {/* Alternative Options */}
          <div className="text-center text-sm pt-4 border-t space-y-2">
            <p className="text-muted-foreground">Don't have a wallet?</p>
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
