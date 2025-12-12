"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/store/auth";
import { useToast } from "@/hooks/use-toast";
import { Wallet, Plus, Mail } from "lucide-react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const router = useRouter();
  const { toast } = useToast();

  const handleEmailRegister = async (e: React.FormEvent) => {
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
        toast({ title: "Account created!", description: "Welcome to SUBRA." });
        router.push("/dashboard");
      } else {
        toast({ title: "Error", description: data.error, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to connect to server", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNewWallet = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/create-wallet`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setAuth(data.data.user, data.data.token);
        
        // Show secret key in a modal/alert that user MUST save
        const secretKey = data.data.wallet.secretKey;
        const publicKey = data.data.wallet.publicKey;
        
        toast({ 
          title: "Wallet Created!", 
          description: `Your Solana wallet is ready: ${publicKey.slice(0, 8)}...`,
        });
        
        // Alert with secret key - user MUST save this
        setTimeout(() => {
          alert(`🔐 IMPORTANT: Save Your Secret Key!

Your wallet has been created successfully.

Public Address:
${publicKey}

Secret Key (SAVE THIS NOW):
${secretKey}

⚠️ WARNING:
- We do NOT store your secret key
- If you lose it, you lose access to your wallet forever
- Never share this with anyone
- Store it somewhere safe

Click OK after you've saved it.`);
          
          router.push("/dashboard");
        }, 500);
      } else {
        toast({ title: "Error", description: data.error || "Failed to create wallet", variant: "destructive" });
      }
    } catch (error: any) {
      console.error("Create wallet error:", error);
      toast({ 
        title: "Error", 
        description: error.message || "Failed to connect to server. Make sure the API is running.", 
        variant: "destructive" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-950">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Create Account</CardTitle>
          <CardDescription>Choose how you want to get started</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Option 1: Connect Existing Wallet */}
          <div className="space-y-3 text-center">
            <h3 className="text-lg font-semibold">Already have a Solana wallet?</h3>
            <Link href="/auth/wallet" passHref>
              <Button className="w-full" size="lg" variant="outline">
                <Wallet className="mr-2 h-5 w-5" /> Connect Wallet
              </Button>
            </Link>
            <p className="text-sm text-muted-foreground">
              Connect Phantom, Solflare, etc. for instant access
            </p>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative bg-white px-4 text-sm text-muted-foreground dark:bg-gray-950">
              Or
            </div>
          </div>

          {/* Option 2: Create New Wallet */}
          <div className="space-y-3 text-center">
            <h3 className="text-lg font-semibold">New to crypto?</h3>
            <Button 
              className="w-full" 
              size="lg" 
              onClick={handleCreateNewWallet} 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating Wallet...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-5 w-5" /> Create New Wallet
                </>
              )}
            </Button>
            <p className="text-sm text-muted-foreground">
              We'll create a Solana wallet for you instantly
            </p>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative bg-white px-4 text-sm text-muted-foreground dark:bg-gray-950">
              Or
            </div>
          </div>

          {/* Option 3: Sign up with Email */}
          <form onSubmit={handleEmailRegister} className="space-y-4">
            <h3 className="text-lg font-semibold text-center">Sign up with email</h3>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-5 w-5" /> Sign Up with Email
                </>
              )}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Connect wallet later in dashboard
            </p>
          </form>

          <div className="text-center text-sm">
            Already have an account?{" "}
            <Link href="/auth/login" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
