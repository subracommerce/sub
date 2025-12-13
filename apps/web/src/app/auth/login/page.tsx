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
import { Sparkles, Mail, Wallet, ArrowLeft, Home } from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden">
      {/* Animated Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:3rem_3rem] animate-grid-slow opacity-50" />
      
      {/* Floating Orbs */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-full blur-3xl animate-float-1" />
      <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-br from-blue-500/15 to-purple-500/15 rounded-full blur-3xl animate-float-2" />
      
      {/* Scan Line Effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-full h-[2px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent animate-scan-line" />
      </div>

      {/* Home Button - Top Left */}
      <Button
        onClick={handleGoHome}
        variant="outline"
        className="absolute top-4 left-4 z-20 border-2 hover:bg-gray-100 hover:scale-105 transition-all"
        size="sm"
      >
        <Home className="mr-2 h-4 w-4" />
        Home
      </Button>
      
      <Card className="w-full max-w-md border-2 border-gray-900 shadow-2xl relative z-10 bg-white/95 backdrop-blur-sm animate-fade-in-up corner-accents">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center animate-pulse-glow relative">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-gray-900 to-gray-700 animate-shimmer opacity-30" />
              <Sparkles className="w-6 h-6 text-white relative z-10" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-base">Sign in to your SUBRA account</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Wallet Login Option */}
          <div className="space-y-3 animate-slide-in-right">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500/20 to-blue-500/20 flex items-center justify-center">
                <Wallet className="h-4 w-4 text-gray-700" />
              </div>
              <h3 className="text-base font-semibold">Sign In with Wallet</h3>
            </div>
            <Link href="/auth/wallet" className="block">
              <Button 
                className="w-full bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 hover:from-black hover:via-gray-900 hover:to-black text-white border-2 border-gray-900 py-6 text-base font-semibold hover:scale-105 transition-all relative overflow-hidden group" 
                size="lg"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                <Wallet className="mr-2 h-5 w-5 relative z-10" /> 
                <span className="relative z-10">Connect Wallet</span>
              </Button>
            </Link>
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
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-2 focus:ring-2 focus:ring-gray-900 transition-all"
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
                className="border-2 focus:ring-2 focus:ring-gray-900 transition-all"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full border-2 border-gray-900 bg-white text-gray-900 hover:bg-gray-900 hover:text-white py-3 hover:scale-105 transition-all" 
              size="lg"
              disabled={isLoading}
            >
              <Mail className="mr-2 h-5 w-5" />
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="text-center text-sm text-gray-600 pt-4 border-t-2 space-y-3 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            <div>
              Don't have an account?{" "}
              <Link href="/auth/register" className="font-semibold text-gray-900 hover:underline">
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
    </div>
  );
}
