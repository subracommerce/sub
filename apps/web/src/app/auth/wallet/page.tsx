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
import { Wallet, Shield, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function WalletAuthPage() {
  const { publicKey, signMessage, connected, disconnect } = useWallet();
  const router = useRouter();
  const { toast } = useToast();
  const { setAuth, isAuthenticated } = useAuthStore();
  const [isSigning, setIsSigning] = useState(false);
  const [step, setStep] = useState<"connect" | "sign" | "success">("connect");

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (connected && publicKey) {
      setStep("sign");
    } else {
      setStep("connect");
    }
  }, [connected, publicKey]);

  const handleSignIn = async () => {
    if (!publicKey || !signMessage) {
      toast({
        title: "Error",
        description: "Wallet not properly connected",
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

      // Request signature (Phantom popup will show)
      const { signature, message: encodedMessage } = await signAuthMessage(
        signMessage,
        message
      );

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
      console.error("Sign in error:", error);

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
      } else {
        toast({
          title: "Error",
          description: error.message || "Failed to sign message",
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
          {/* Step 1: Connect Wallet */}
          {step === "connect" && (
            <div className="space-y-4">
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-2">
                    <p className="font-medium">Step 1: Connect Your Wallet</p>
                    <p className="text-sm">
                      Choose your Solana wallet to continue. We support Phantom,
                      Solflare, and more.
                    </p>
                  </div>
                </AlertDescription>
              </Alert>
              <ConnectWalletButton />
            </div>
          )}

          {/* Step 2: Sign Message */}
          {step === "sign" && connected && publicKey && (
            <div className="space-y-4">
              <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800 dark:text-green-200">
                  <div className="space-y-2">
                    <p className="font-medium">✅ Wallet Connected</p>
                    <p className="text-sm">
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
                      You'll be asked to sign a message to prove you own this
                      wallet. This is free and won't cost any gas.
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
                onClick={() => disconnect()}
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

