"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/store/auth";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, Mail, Wallet, Plus, Home, ArrowLeft, Shield, Zap, Lock, CheckCircle, Bot, Activity } from "lucide-react";
import { CreateWalletModal } from "@/components/create-wallet-modal";
import { useWallet } from "@solana/wallet-adapter-react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateWallet, setShowCreateWallet] = useState(false);
  const { setAuth, clearAuth } = useAuthStore();
  const { disconnect, select } = useWallet();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const signOut = async () => {
      clearAuth();
      try {
        await disconnect();
        select(null);
        if (typeof window !== 'undefined') {
          localStorage.removeItem('walletName');
          localStorage.removeItem('subra-auth');
        }
      } catch (e) {}
    };
    signOut();
  }, [clearAuth, disconnect, select]);

  const handleRegister = async (e: React.FormEvent) => {
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
        toast({
          title: "Registration failed",
          description: data.error || "Please try again",
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

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Subtle Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      
      {/* Minimal Dark Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-gray-900/5 to-gray-700/5 rounded-full filter blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-gray-800/5 to-green-500/10 rounded-full filter blur-3xl" />

      {/* Back Button */}
      <div className="absolute top-6 left-6 z-20">
        <Button onClick={() => router.push("/")} variant="ghost" className="text-gray-900 hover:text-black" size="sm">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Minimal Hero */}
          <div className="text-center mb-12 animate-fade-in-up">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-b from-green-600 to-blue-600 bg-clip-text text-transparent">S</span>
              <span className="text-gray-900">UBRA</span>
            </h1>
            <p className="text-lg text-gray-600">Choose your authentication method</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Auth Options */}
            <div className="lg:col-span-2 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Connect Wallet */}
                <Link href="/auth/wallet">
                  <Card className="h-full border border-gray-300 hover:border-gray-900 hover:shadow-lg transition-all cursor-pointer bg-white animate-fade-in-up">
                    <CardHeader>
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center mb-3">
                        <Wallet className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="text-xl text-gray-900">Connect Wallet</CardTitle>
                      <CardDescription>Use existing Solana wallet</CardDescription>
                    </CardHeader>
                  </Card>
                </Link>

                {/* Create Wallet */}
                <Card 
                  onClick={() => setShowCreateWallet(true)}
                  className="h-full border border-gray-300 hover:border-gray-900 hover:shadow-lg transition-all cursor-pointer bg-white animate-fade-in-up"
                  style={{animationDelay: '0.05s'}}
                >
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-gray-800 to-green-600 flex items-center justify-center mb-3">
                      <Plus className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-xl text-gray-900">Create Wallet</CardTitle>
                    <CardDescription>Generate new wallet instantly</CardDescription>
                  </CardHeader>
                </Card>
              </div>

              {/* Email Registration */}
              <Card className="border border-gray-300 bg-white animate-fade-in-up" style={{animationDelay: '0.1s'}}>
                <CardHeader>
                  <CardTitle className="text-xl text-gray-900">Email Registration</CardTitle>
                  <CardDescription>Traditional sign up</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium text-gray-900">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="you@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="border-gray-300 focus:border-gray-900"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password" className="text-sm font-medium text-gray-900">Password</Label>
                        <Input
                          id="password"
                          type="password"
                          placeholder="Min. 8 characters"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          className="border-gray-300 focus:border-gray-900"
                        />
                      </div>
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-gray-900 hover:bg-black text-white" 
                      disabled={isLoading}
                    >
                      {isLoading ? "Creating..." : "Create Account"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <div className="text-center text-sm text-gray-600">
                Already have an account?{" "}
                <Link href="/auth/login" className="font-semibold text-gray-900 hover:underline">
                  Sign in
                </Link>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card className="border border-gray-300 bg-white animate-fade-in-up" style={{animationDelay: '0.15s'}}>
                <CardHeader>
                  <CardTitle className="text-lg text-gray-900">Platform</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">&lt;100ms</div>
                    <p className="text-sm text-gray-600">Transaction finality</p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">$0.00025</div>
                    <p className="text-sm text-gray-600">Average cost</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray-300 bg-gradient-to-br from-gray-900 to-gray-800 text-white animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                <CardContent className="pt-6">
                  <Shield className="h-8 w-8 mb-3" />
                  <h3 className="font-bold mb-2">Non-Custodial</h3>
                  <p className="text-sm text-gray-300 mb-3">Your keys, your control. Encrypted with AES-256.</p>
                  <div className="flex gap-2 flex-wrap">
                    <span className="px-2 py-1 rounded text-xs bg-white/10 border border-white/20">Secure</span>
                    <span className="px-2 py-1 rounded text-xs bg-white/10 border border-white/20">Private</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <CreateWalletModal open={showCreateWallet} onOpenChange={setShowCreateWallet} />
    </div>
  );
}
