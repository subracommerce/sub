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
import { Sparkles, Mail, Wallet, Plus, Home, ArrowLeft, Shield, Zap, Lock, CheckCircle } from "lucide-react";
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

  // Clear auth and wallet on mount (for sign out)
  useEffect(() => {
    const signOut = async () => {
      console.log('🔓 Clearing auth state');
      clearAuth();
      
      try {
        await disconnect();
        select(null);
        
        if (typeof window !== 'undefined') {
          localStorage.removeItem('walletName');
          localStorage.removeItem('subra-auth');
        }
      } catch (e) {
        console.error('Disconnect error:', e);
      }
      
      console.log('✅ Ready for registration');
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

  const handleGoHome = () => {
    router.push("/");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-green-50 relative overflow-hidden py-12">
      {/* Animated Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:3rem_3rem] animate-grid-slow opacity-30" />
      
      {/* Multiple Colorful Floating Orbs */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-blue-400/30 to-purple-400/30 rounded-full blur-3xl animate-float-1" />
      <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-br from-green-400/25 to-blue-400/25 rounded-full blur-3xl animate-float-2" />
      <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-gradient-to-br from-purple-400/20 to-green-400/20 rounded-full blur-3xl animate-float-3" />
      <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-gradient-to-br from-green-400/15 to-blue-400/15 rounded-full blur-3xl animate-float-1" style={{animationDelay: '2s'}} />

      {/* Pulsing accent dots */}
      <div className="absolute top-40 left-1/4 w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
      <div className="absolute top-60 right-1/3 w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{animationDelay: '1s'}} />
      <div className="absolute bottom-40 left-1/3 w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{animationDelay: '2s'}} />

      {/* Home Button - Top Left */}
      <Button
        onClick={handleGoHome}
        variant="outline"
        className="absolute top-4 left-4 z-20 border-2 hover:bg-white hover:scale-105 transition-all shadow-lg backdrop-blur-sm"
        size="sm"
      >
        <Home className="mr-2 h-4 w-4" />
        Home
      </Button>
      
      <div className="w-full max-w-6xl mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Auth Options */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <Card className="border-2 border-gray-900 shadow-2xl bg-white/95 backdrop-blur-sm animate-fade-in-up corner-accents">
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-3">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-green-500 flex items-center justify-center animate-pulse-glow relative shadow-xl">
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-green-500 animate-shimmer opacity-30" />
                    <Sparkles className="w-8 h-8 text-white relative z-10" />
                  </div>
                </div>
                <CardTitle className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">
                  Join SUBRA
                </CardTitle>
                <CardDescription className="text-base mt-2">Choose your preferred authentication method</CardDescription>
              </CardHeader>
            </Card>

            {/* Wallet Options Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Connect Existing Wallet Card */}
              <Card className="border-2 border-blue-200 hover:shadow-2xl transition-all hover:scale-105 hover:border-blue-400 group relative overflow-hidden animate-slide-in-right bg-gradient-to-br from-blue-50 to-white">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardHeader className="relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-3 shadow-lg group-hover:animate-pulse-glow">
                    <Wallet className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                    Connect Wallet
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Use your existing Solana wallet (Phantom, Solflare, etc.)
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative z-10">
                  <Link href="/auth/wallet" className="block">
                    <Button 
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-6 font-semibold hover:scale-105 transition-all relative overflow-hidden group/btn shadow-lg" 
                      size="lg"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000" />
                      <Wallet className="mr-2 h-5 w-5 relative z-10" /> 
                      <span className="relative z-10">Connect</span>
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Create New Wallet Card */}
              <Card className="border-2 border-green-200 hover:shadow-2xl transition-all hover:scale-105 hover:border-green-400 group relative overflow-hidden animate-slide-in-right bg-gradient-to-br from-green-50 to-white" style={{animationDelay: '0.05s'}}>
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardHeader className="relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mb-3 shadow-lg group-hover:animate-pulse-glow">
                    <Plus className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                    Create Wallet
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Generate a new secure Solana wallet instantly
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative z-10">
                  <Button 
                    onClick={() => setShowCreateWallet(true)}
                    className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-6 font-semibold hover:scale-105 transition-all relative overflow-hidden group/btn shadow-lg" 
                    size="lg"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000" />
                    <Plus className="mr-2 h-5 w-5 relative z-10" /> 
                    <span className="relative z-10">Create</span>
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Email Registration Card */}
            <Card className="border-2 border-purple-200 hover:shadow-2xl transition-all hover:border-purple-400 group relative overflow-hidden animate-slide-in-right bg-gradient-to-br from-purple-50 to-white" style={{animationDelay: '0.1s'}}>
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardHeader className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:animate-pulse-glow inline-block mb-3">
                  <Mail className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">
                  Sign Up with Email
                </CardTitle>
                <CardDescription className="text-sm">
                  Traditional registration with email and password
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-600" />
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="border-2 focus:ring-2 focus:ring-purple-500 transition-all"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium flex items-center gap-2">
                      <Lock className="h-4 w-4 text-gray-600" />
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Min. 8 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="border-2 focus:ring-2 focus:ring-purple-500 transition-all"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white py-6 hover:scale-105 transition-all shadow-lg relative overflow-hidden group/btn" 
                    size="lg"
                    disabled={isLoading}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000" />
                    <Mail className="mr-2 h-5 w-5 relative z-10" />
                    <span className="relative z-10">{isLoading ? "Creating account..." : "Sign Up"}</span>
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Footer */}
            <div className="text-center text-sm text-gray-600 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              <p className="mb-3">
                Already have an account?{" "}
                <Link href="/auth/login" className="font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:from-blue-700 hover:to-purple-700">
                  Sign in
                </Link>
              </p>
              <Button 
                onClick={handleGoHome}
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-gray-900 hover:scale-105 transition-all"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </div>
          </div>

          {/* Right Column - Feature Cards */}
          <div className="space-y-6 animate-fade-in-up" style={{animationDelay: '0.15s'}}>
            {/* Why SUBRA Card */}
            <Card className="border-2 border-gray-200 hover:shadow-xl transition-all bg-white/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  Why SUBRA?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <p>Deploy autonomous AI agents in seconds</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <p>Zero-knowledge privacy for all transactions</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <p>Built on Solana for speed and low fees</p>
                </div>
              </CardContent>
            </Card>

            {/* Security Card */}
            <Card className="border-2 border-blue-200 hover:shadow-xl transition-all bg-gradient-to-br from-blue-50 to-white">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  Secure & Private
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-gray-600">
                <p>Your keys, your assets. All wallets are encrypted and secured with industry-standard cryptography.</p>
                <div className="flex gap-2 flex-wrap">
                  <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700 font-medium">AES-256</span>
                  <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-700 font-medium">Non-Custodial</span>
                  <span className="px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-700 font-medium">ZK Proofs</span>
                </div>
              </CardContent>
            </Card>

            {/* Getting Started Card */}
            <Card className="border-2 border-green-200 hover:shadow-xl transition-all bg-gradient-to-br from-green-50 to-white">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-green-600" />
                  Get Started
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">1</div>
                  <p>Choose your authentication method</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">2</div>
                  <p>Create your first AI agent</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">3</div>
                  <p>Watch it execute autonomous tasks</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Create Wallet Modal */}
      <CreateWalletModal 
        open={showCreateWallet} 
        onOpenChange={setShowCreateWallet} 
      />
    </div>
  );
}
