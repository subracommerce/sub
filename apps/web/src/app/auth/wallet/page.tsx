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
import { Wallet, Shield, CheckCircle, AlertCircle, Lock, Info } from "lucide-react";
import Link from "next/link";

export default function WalletAuthPage() {
  const { publicKey, signMessage, disconnect, connected } = useWallet();
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
      const message = createAuthMessage(publicKey.toBase58(), nonce);

      console.log("🔐 Requesting signature...");
      toast({
        title: "Check Phantom",
        description: "Please check your Phantom wallet to sign the message",
      });

      // This will trigger Phantom to open
      // If locked, Phantom will ask for password first
      const { signature, message: encodedMessage } = await signAuthMessage(
        signMessage,
        message
      );

      console.log("✅ Signature received!");

      const result = await verifyWalletAuth(
        publicKey.toBase58(),
        signature,
        encodedMessage
      );

      if (result.success) {
        setAuth(result.data.user, result.data.token);
        
        toast({
          title: "Welcome! 🎉",
          description: `Successfully signed in`,
        });

        setTimeout(() => {
          router.push("/dashboard");
        }, 1000);
      } else {
        setError(result.error || "Authentication failed");
        toast({
          title: "Authentication Failed",
          description: result.error || "Failed to verify signature",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("❌ Sign in error:", error);

      let errorMessage = "Failed to sign message";
      let errorTitle = "Error";

      if (error.message?.includes("User rejected") || error.code === 4001) {
        errorTitle = "Signature Rejected";
        errorMessage = "You declined the signature request. Please try again and approve the signature.";
      } else if (error.message?.includes("wallet is locked") || error.message?.includes("locked")) {
        errorTitle = "Wallet Locked";
        errorMessage = "Your Phantom wallet is locked. Please unlock it in the extension and try again.";
      } else {
        errorMessage = error.message || errorMessage;
      }

      setError(errorMessage);
      toast({
        title: errorTitle,
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
            Sign In with Solana Wallet
          </CardTitle>
          <CardDescription className="text-center">
            Connect your wallet and sign a message to authenticate
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* How it works */}
          {!connected && (
            <Alert className="border-blue-500 bg-blue-50 dark:bg-blue-950">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800 dark:text-blue-200">
                <div className="space-y-2">
                  <p className="font-semibold">How to connect:</p>
                  <ol className="text-sm space-y-1 list-decimal list-inside">
                    <li>Click "Select Wallet" below</li>
                    <li>Choose Phantom (or your preferred wallet)</li>
                    <li>Approve the connection</li>
                    <li>When asked to sign, unlock your wallet if needed</li>
                    <li>Approve the signature</li>
                  </ol>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Error Display */}
          {error && (
            <Alert className="border-red-500 bg-red-50 dark:bg-red-950">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800 dark:text-red-200">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {/* Not Connected */}
          {!connected && (
            <div className="space-y-4">
              <div className="space-y-2">
                <ConnectWalletButton />
              </div>
              
              <p className="text-xs text-center text-muted-foreground">
                Don't have Phantom? <a href="https://phantom.app" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Download here</a>
              </p>
            </div>
          )}

          {/* Connected - Ready to Sign */}
          {connected && publicKey && (
            <div className="space-y-4">
              <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800 dark:text-green-200">
                  <div className="space-y-2">
                    <p className="font-semibold">✅ Wallet Connected</p>
                    <p className="text-sm font-mono break-all">
                      {publicKey.toBase58()}
                    </p>
                  </div>
                </AlertDescription>
              </Alert>

              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-2">
                    <p className="font-medium">Ready to authenticate</p>
                    <p className="text-sm">
                      Click below to sign a secure message. Phantom will prompt you to unlock (if locked) and then approve the signature. This is free and doesn't cost any gas.
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
                {isSigning ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Check Phantom Extension...
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    Sign to Continue
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
                Disconnect & Use Different Wallet
              </Button>

              {isSigning && (
                <Alert className="border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <AlertDescription className="text-yellow-800 dark:text-yellow-200">
                    <div className="space-y-1">
                      <p className="font-medium">Waiting for your signature...</p>
                      <p className="text-sm">
                        • Check your Phantom extension (top right of browser)
                      </p>
                      <p className="text-sm">
                        • You may need to unlock Phantom first
                      </p>
                      <p className="text-sm">
                        • Then click "Sign" or "Approve"
                      </p>
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {/* Alternative Options */}
          <div className="text-center text-sm pt-4 border-t space-y-2">
            <p className="text-muted-foreground">Prefer email login?</p>
            <div className="flex gap-2 justify-center">
              <Link href="/auth/register">
                <Button variant="link" size="sm">
                  Create Account
                </Button>
              </Link>
              <span className="text-muted-foreground">•</span>
              <Link href="/auth/login">
                <Button variant="link" size="sm">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
