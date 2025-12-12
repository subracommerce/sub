"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/store/auth";
import Link from "next/link";
import { ConnectWalletButton } from "@/components/connect-wallet-button";
import { Wallet, Mail, Plus } from "lucide-react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingWallet, setIsCreatingWallet] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { setAuth } = useAuthStore();

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        setAuth(data.data.user, data.data.token);
        toast({
          title: "Success!",
          description: "Account created successfully",
        });
        router.push("/dashboard");
      } else {
        toast({
          title: "Error",
          description: data.error || "Registration failed",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to connect to server",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateWallet = async () => {
    setIsCreatingWallet(true);
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/create-wallet`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (data.success) {
        setAuth(data.data.user, data.data.token);
        
        // Show wallet credentials to user
        const walletInfo = `🎉 Wallet Created Successfully!

📍 Public Address:
${data.data.wallet.publicKey}

🔐 Private Key (SAVE THIS!):
${data.data.wallet.secretKey}

⚠️ IMPORTANT: Save your private key in a secure location. You'll need it to access your wallet. We don't store this!`;

        // Copy to clipboard
        try {
          await navigator.clipboard.writeText(walletInfo);
          toast({
            title: "Wallet Created! 🎉",
            description: "Your wallet details have been copied to clipboard. Save them securely!",
            duration: 10000,
          });
        } catch (err) {
          toast({
            title: "Wallet Created! 🎉",
            description: "Please save the wallet details shown below!",
            duration: 10000,
          });
        }

        // Show in alert
        alert(walletInfo);

        router.push("/dashboard");
      } else {
        toast({
          title: "Error",
          description: "Failed to create wallet",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create wallet",
        variant: "destructive",
      });
    } finally {
      setIsCreatingWallet(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Create Account</CardTitle>
          <CardDescription className="text-center">
            Choose how you want to get started
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Option 1: Connect Existing Wallet */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <Wallet className="w-4 h-4" />
              <span className="text-sm font-medium">Already have a Solana wallet?</span>
            </div>
            <ConnectWalletButton />
            <p className="text-xs text-muted-foreground text-center">
              Connect Phantom, Solflare, or any Solana wallet
            </p>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          {/* Option 2: Create New Wallet */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <Plus className="w-4 h-4" />
              <span className="text-sm font-medium">New to crypto?</span>
            </div>
            <Button 
              onClick={handleCreateWallet}
              disabled={isCreatingWallet}
              className="w-full transition-all hover:scale-105"
              variant="outline"
            >
              {isCreatingWallet ? "Creating Wallet..." : "Create New Wallet"}
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              We'll create a Solana wallet for you (Web2 friendly)
            </p>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          {/* Option 3: Email/Password */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <Mail className="w-4 h-4" />
              <span className="text-sm font-medium">Sign up with email</span>
            </div>
            <form onSubmit={handleEmailSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                />
                <p className="text-xs text-muted-foreground">
                  Minimum 8 characters
                </p>
              </div>
              <Button 
                type="submit" 
                className="w-full transition-all hover:scale-105" 
                disabled={isLoading} 
                variant="outline"
              >
                {isLoading ? "Creating account..." : "Sign Up with Email"}
              </Button>
            </form>
            <p className="text-xs text-muted-foreground text-center">
              You'll connect a wallet later in dashboard
            </p>
          </div>

          <div className="text-center text-sm pt-4 border-t">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
