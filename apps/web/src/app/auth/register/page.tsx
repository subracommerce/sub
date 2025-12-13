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
import { CreateWalletModal } from "@/components/create-wallet-modal";
import { Wallet, Plus, Mail, Sparkles, Shield } from "lucide-react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateWalletModal, setShowCreateWalletModal] = useState(false);
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
        toast({ title: "Account created successfully!" });
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

  return (
    <div className="flex min-h-screen items-center justify-center bg-white relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:3rem_3rem] animate-grid-slow" />
      <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-full blur-3xl animate-float-1" />
      
      <Card className="w-full max-w-md border-2 border-gray-900 shadow-2xl relative z-10 bg-white">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <div className="w-12 h-12 rounded-xl bg-gray-900 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold">Get Started with SUBRA</CardTitle>
          <CardDescription className="text-base">Choose your preferred way to join</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Option 1: Connect External Wallet */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-5 w-5 text-gray-700" />
              <h3 className="text-base font-semibold">Have a Solana Wallet?</h3>
            </div>
            <Link href="/auth/wallet" className="block">
              <Button 
                className="w-full bg-gray-900 hover:bg-black text-white border-2 border-gray-900 py-6 text-base font-semibold hover:scale-105 transition-all" 
                size="lg"
              >
                <Wallet className="mr-2 h-5 w-5" /> 
                Connect Wallet
              </Button>
            </Link>
            <p className="text-xs text-gray-600">
              Secure sign-in with Phantom, Solflare, or other Solana wallets
            </p>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t-2 border-gray-300" />
            </div>
            <div className="relative bg-white px-4 text-sm text-gray-500 font-medium">Or</div>
          </div>

          {/* Option 2: Create New Wallet */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <Plus className="h-5 w-5 text-gray-700" />
              <h3 className="text-base font-semibold">New to Crypto?</h3>
            </div>
            <Button 
              className="w-full bg-black hover:bg-gray-900 text-white py-6 text-base font-semibold hover:scale-105 transition-all" 
              size="lg" 
              onClick={() => setShowCreateWalletModal(true)}
              disabled={isLoading}
            >
              <Plus className="mr-2 h-5 w-5" /> 
              Create New Wallet
            </Button>
            <p className="text-xs text-gray-600">
              Password-protected Solana wallet • No extension needed
            </p>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t-2 border-gray-300" />
            </div>
            <div className="relative bg-white px-4 text-sm text-gray-500 font-medium">Or</div>
          </div>

          {/* Option 3: Email Signup */}
          <form onSubmit={handleEmailRegister} className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Mail className="h-5 w-5 text-gray-700" />
              <h3 className="text-base font-semibold">Sign Up with Email</h3>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-2"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Min. 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-2"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full border-2 border-gray-900 bg-white text-gray-900 hover:bg-gray-900 hover:text-white" 
              variant="outline" 
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Sign Up"}
            </Button>
            <p className="text-xs text-gray-600 text-center">
              You'll need to create a wallet later to deploy agents
            </p>
          </form>

          <div className="text-center text-sm text-gray-600 pt-4 border-t-2">
            Already have an account?{" "}
            <Link href="/auth/login" className="font-semibold text-gray-900 hover:underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>

      <CreateWalletModal
        open={showCreateWalletModal}
        onOpenChange={setShowCreateWalletModal}
      />
    </div>
  );
}
