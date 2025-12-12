"use client";

import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/store/auth";
import { generateNonce } from "@/lib/wallet-auth";
import { Wallet, Shield, CheckCircle, AlertCircle, Info } from "lucide-react";
import Link from "next/link";
import bs58 from "bs58";

export default function WalletAuthPage() {
  const { publicKey, signMessage, disconnect, connect, select, wallets, wallet } = useWallet();
  const router = useRouter();
  const { toast } = useToast();
  const { setAuth, isAuthenticated } = useAuthStore();
  const [isSigning, setIsSigning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showWalletSelector, setShowWalletSelector] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  const handleSelectWallet = async (walletName: string) => {
    const selectedWallet = wallets.find(w => w.adapter.name === walletName);
    if (selectedWallet) {
      select(selectedWallet.adapter.name);
      setShowWalletSelector(false);
      
      try {
        await connect();
      } catch (err: any) {
        console.error("Connection error:", err);
        toast({
          title: "Connection Failed",
          description: err.message || "Failed to connect wallet",
          variant: "destructive",
        });
      }
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
      
      // Encode message
      const messageBytes = new TextEncoder().encode(message);
      
      // THIS is where Phantom should popup
      const signatureBytes = await signMessage(messageBytes);
      
      console.log("✅ Got signature!");
      
      // Encode for backend
      const signature = bs58.encode(signatureBytes);
      const encodedMessage = bs58.encode(messageBytes);

      // Verify with backend
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
        errorMessage = "You declined the signature request.";
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
            Sign In with Wallet
          </CardTitle>
          <CardDescription className="text-center">
            Connect your Solana wallet to continue
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Instructions */}
          {!publicKey && !showWalletSelector && (
            <Alert className="border-blue-500 bg-blue-50 dark:bg-blue-950">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800 dark:text-blue-200">
                <p className="font-medium mb-2">Before connecting:</p>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  <li>Make sure Phantom wallet is installed</li>
                  <li>Unlock it by entering your password</li>
                  <li>Then click "Connect Wallet" below</li>
                </ul>
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

          {/* Not Connected - Show Wallet Selection */}
          {!publicKey && !showWalletSelector && (
            <div className="space-y-4">
              <Button
                onClick={() => setShowWalletSelector(true)}
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

          {/* Wallet Selector */}
          {showWalletSelector && !publicKey && (
            <div className="space-y-3">
              <p className="text-sm font-medium">Choose your wallet:</p>
              {wallets.filter(w => w.readyState === "Installed").map((wallet) => (
                <Button
                  key={wallet.adapter.name}
                  onClick={() => handleSelectWallet(wallet.adapter.name)}
                  variant="outline"
                  className="w-full justify-start"
                >
                  {wallet.adapter.icon && (
                    <img src={wallet.adapter.icon} alt={wallet.adapter.name} className="w-6 h-6 mr-2" />
                  )}
                  {wallet.adapter.name}
                </Button>
              ))}
              <Button
                onClick={() => setShowWalletSelector(false)}
                variant="ghost"
                className="w-full"
              >
                Cancel
              </Button>
            </div>
          )}

          {/* Connected - Ready to Sign */}
          {publicKey && (
            <div className="space-y-4">
              <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800 dark:text-green-200">
                  <div className="space-y-2">
                    <p className="font-semibold">✅ Wallet Connected</p>
                    <p className="text-xs font-mono break-all">
                      {publicKey.toBase58()}
                    </p>
                  </div>
                </AlertDescription>
              </Alert>

              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  <p className="text-sm font-medium mb-1">Ready to authenticate</p>
                  <p className="text-xs">
                    Click below and Phantom will ask you to sign a message. This is free and proves you own this wallet.
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
                    Sign Message
                  </>
                )}
              </Button>

              <Button
                onClick={() => {
                  disconnect();
                  setError(null);
                  setShowWalletSelector(false);
                }}
                variant="outline"
                className="w-full"
                disabled={isSigning}
              >
                Disconnect
              </Button>

              {isSigning && (
                <Alert className="border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <AlertDescription className="text-yellow-800 dark:text-yellow-200 text-xs">
                    <p className="font-medium mb-1">Check your Phantom extension!</p>
                    <p>• Look for the Phantom icon in your browser toolbar</p>
                    <p>• A popup should appear asking you to sign</p>
                    <p>• Click "Sign" or "Approve" in Phantom</p>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {/* Alternative Options */}
          <div className="text-center text-sm pt-4 border-t space-y-2">
            <p className="text-muted-foreground">Other sign-in options:</p>
            <div className="flex gap-2 justify-center flex-wrap">
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
