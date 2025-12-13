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
import { Sparkles, Mail, Wallet, ArrowLeft, Home, Plus } from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";
import { CreateWalletModal } from "@/components/create-wallet-modal";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateWallet, setShowCreateWallet] = useState(false);
  const { setAuth, clearAuth } = useAuthStore();
  const { disconnect, select } = useWallet();
  const router = useRouter();
  const { toast } = useToast();

  // Clear auth and wallet on mount (sign out)
  useEffect(() => {
    const signOut = async () => {
      console.log('🔓 Signing out - clearing auth and wallet');
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
      
      console.log('✅ Signed out');
    };
    
    signOut();
  }, [clearAuth, disconnect, select]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setAuth(data.data.user, data.data.token);
        toast({ title: "Welcome back!" });
        router.push("/dashboard");
      } else {
        toast({ 
          title: "Login failed", 
          description: data.error || "Invalid credentials",
          variant: "destructive" 
        });
      }
    } catch (error) {
      toast({ 
        title: "Error", 
        description: "Failed to connect to server",
        variant: "destructive" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoHome = () => {
    router.push("/");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50 relative overflow-hidden">
      {/* Animated Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:3rem_3rem] animate-grid-slow opacity-30" />
      
      {/* Floating Orbs - More Colorful */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-blue-400/30 to-green-400/30 rounded-full blur-3xl animate-float-1" />
      <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-br from-green-400/25 to-blue-400/25 rounded-full blur-3xl animate-float-2" />
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-br from-purple-400/20 to-blue-400/20 rounded-full blur-3xl animate-float-3" />

      {/* Home Button - Top Left */}
      <Button
        onClick={handleGoHome}
        variant="outline"
        className="absolute top-4 left-4 z-20 border-2 hover:bg-white hover:scale-105 transition-all shadow-lg"
        size="sm"
      >
        <Home className="mr-2 h-4 w-4" />
        Home
      </Button>
      
      <Card className="w-full max-w-lg border-2 border-gray-900 shadow-2xl relative z-10 bg-white/95 backdrop-blur-sm animate-fade-in-up corner-accents">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 via-green-500 to-blue-600 flex items-center justify-center animate-pulse-glow relative shadow-lg">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500 via-green-500 to-blue-600 animate-shimmer opacity-30" />
              <Sparkles className="w-7 h-7 text-white relative z-10" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-green-600 to-blue-600 bg-clip-text text-transparent">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-base">Choose how to access your SUBRA account</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-5">
          {/* Connect Existing Wallet */}
          <div className="space-y-3 animate-slide-in-right">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/30 to-green-500/30 flex items-center justify-center">
                <Wallet className="h-4 w-4 text-blue-600" />
              </div>
              <h3 className="text-base font-semibold text-gray-900">Connect Wallet</h3>
            </div>
            <Link href="/auth/wallet" className="block">
              <Button 
                className="w-full bg-gradient-to-r from-blue-600 via-blue-700 to-blue-600 hover:from-blue-700 hover:via-blue-800 hover:to-blue-700 text-white py-6 text-base font-semibold hover:scale-105 transition-all relative overflow-hidden group shadow-lg" 
                size="lg"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                <Wallet className="mr-2 h-5 w-5 relative z-10" /> 
                <span className="relative z-10">Connect Existing Wallet</span>
              </Button>
            </Link>
          </div>

          {/* Create New Wallet */}
          <div className="space-y-3 animate-slide-in-right" style={{animationDelay: '0.05s'}}>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500/30 to-blue-500/30 flex items-center justify-center">
                <Plus className="h-4 w-4 text-green-600" />
              </div>
              <h3 className="text-base font-semibold text-gray-900">Create New Wallet</h3>
            </div>
            <Button 
              onClick={() => setShowCreateWallet(true)}
              className="w-full bg-gradient-to-r from-green-600 via-green-700 to-green-600 hover:from-green-700 hover:via-green-800 hover:to-green-700 text-white py-6 text-base font-semibold hover:scale-105 transition-all relative overflow-hidden group shadow-lg" 
              size="lg"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <Plus className="mr-2 h-5 w-5 relative z-10" /> 
              <span className="relative z-10">Create Solana Wallet</span>
            </Button>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t-2 border-gray-300" />
            </div>
            <div className="relative bg-white px-4 text-sm text-gray-500 font-medium">Or sign in with email</div>
          </div>

          {/* Email Login Form */}
          <form onSubmit={handleLogin} className="space-y-4 animate-slide-in-right" style={{animationDelay: '0.1s'}}>
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
                className="border-2 focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-2 focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full border-2 border-gray-900 bg-white text-gray-900 hover:bg-gray-900 hover:text-white py-3 hover:scale-105 transition-all shadow-lg" 
              size="lg"
              disabled={isLoading}
            >
              <Mail className="mr-2 h-5 w-5" />
              {isLoading ? "Signing in..." : "Sign In with Email"}
            </Button>
          </form>

          <div className="text-center text-sm text-gray-600 pt-4 border-t-2 space-y-3 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            <div>
              Don't have an account?{" "}
              <Link href="/auth/register" className="font-semibold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent hover:from-blue-700 hover:to-green-700">
                Sign up
              </Link>
            </div>
            <div className="pt-2">
              <Button 
                onClick={handleGoHome}
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-gray-900 hover:scale-105 transition-all"
              >
                <Home className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Create Wallet Modal */}
      <CreateWalletModal 
        open={showCreateWallet} 
        onOpenChange={setShowCreateWallet} 
      />
    </div>
  );
}
