"use client";

import { useEffect, useState } from "react";
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
  const { publicKey, signMessage, connected, connecting, wallet: walletAdapter } = wallet;
  const router = useRouter();
  const { toast } = useToast();
  const { setAuth, isAuthenticated } = useAuthStore();
  const [isSigning, setIsSigning] = useState(false);
  const [step, setStep] = useState<"connect" | "sign" | "success">("connect");
  const [walletReady, setWalletReady] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  // Check if wallet is truly ready (unlocked and has public key)
  useEffect(() => {
    const checkWalletReady = async () => {
      if (connected && publicKey && signMessage) {
        // Try to get the public key to verify wallet is unlocked
        try {
          const key = publicKey.toBase58();
          if (key && key.length > 0) {
            setWalletReady(true);
            setStep("sign");
          } else {
            setWalletReady(false);
            setStep("connect");
          }
        } catch (error) {
          console.error("Wallet not ready:", error);
          setWalletReady(false);
          setStep("connect");
        }
      } else {
        setWalletReady(false);
        setStep("connect");
      }
    };

    checkWalletReady();
  }, [connected, publicKey, signMessage]);

  const handleSignIn = async () => {
    if (!publicKey || !signMessage || !walletReady) {
      toast({
        title: "Wallet Not Ready",
        description: "Please make sure your wallet is unlocked and connected",
        variant: "destructive",
      });
      return;
    }

    setIsSigning(true);

    try {
      // Generate nonce for security
      const nonce = generateNonce();
      
      // Create message to sign
      const message = createAuthMessage(publicKey.toBase58(), nonce);

      console.log("🔐 Requesting signature from wallet...");

      // Request signature (Phantom popup will show)
      const { signature, message: encodedMessage } = await signAuthMessage(
        signMessage,
        message
      );

      console.log("✅ Signature received, verifying...");

      // Verify with backend
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
          {/* Connection Instructions */}
          {!connected && !connecting && (
            <Alert className="border-blue-500 bg-blue-50 dark:bg-blue-950">
              <Shield className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800 dark:text-blue-200">
                <div className="space-y-2">
                  <p className="font-medium">Before you connect:</p>
                  <ol className="text-sm space-y-1 list-decimal list-inside">
                    <li>Make sure Phantom wallet extension is installed</li>
                    <li>Unlock your wallet with your password</li>
                    <li>Click "Connect Wallet" below</li>
                    <li>Approve the connection in Phantom</li>
                  </ol>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Step 1: Connect Wallet */}
          {step === "connect" && (
            <div className="space-y-4">
              {connecting && (
                <Alert>
                  <AlertDescription>
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                      <span>Connecting to wallet...</span>
                    </div>
                  </AlertDescription>
                </Alert>
              )}
              
              {!connected && !publicKey && (
                <Alert>
                  <Lock className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-2">
                      <p className="font-medium">Step 1: Unlock & Connect Your Wallet</p>
                      <p className="text-sm">
                        Make sure your Phantom wallet is unlocked, then click below.
                      </p>
                    </div>
                  </AlertDescription>
                </Alert>
              )}
              
              <ConnectWalletButton />
              
              <p className="text-xs text-center text-muted-foreground">
                Don't have Phantom? <a href="https://phantom.app" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Download here</a>
              </p>
            </div>
          )}

          {/* Step 2: Sign Message */}
          {step === "sign" && walletReady && publicKey && (
            <div className="space-y-4">
              <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800 dark:text-green-200">
                  <div className="space-y-2">
                    <p className="font-medium">✅ Wallet Connected & Unlocked</p>
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
                onClick={() => wallet.disconnect()}
                variant="outline"
                className="w-full"
              >
                Use Different Wallet
              </Button>
            </div>
          )}

          {/* Wallet Connected but Not Ready */}
          {connected && !walletReady && step === "connect" && (
            <Alert className="border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800 dark:text-yellow-200">
                <div className="space-y-2">
                  <p className="font-medium">Wallet appears locked or not ready</p>
                  <p className="text-sm">
                    Please unlock your Phantom wallet and refresh this page.
                  </p>
                </div>
              </AlertDescription>
            </Alert>
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
