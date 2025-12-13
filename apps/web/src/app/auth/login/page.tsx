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
import { Sparkles, Mail, Wallet } from "lucide-react";
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
        
        // Clear localStorage
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

  return (
    <div className="flex min-h-screen items-center justify-center bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:3rem_3rem] animate-grid-slow" />
      <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-full blur-3xl animate-float-1" />
      
      <Card className="w-full max-w-md border-2 border-gray-900 shadow-2xl relative z-10 bg-white">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <div className="w-12 h-12 rounded-xl bg-gray-900 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold">Welcome Back</CardTitle>
          <CardDescription className="text-base">Sign in to your SUBRA account</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Wallet Login Option */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <Wallet className="h-5 w-5 text-gray-700" />
              <h3 className="text-base font-semibold">Sign In with Wallet</h3>
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
          </div>

          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t-2 border-gray-300" />
            </div>
            <div className="relative bg-white px-4 text-sm text-gray-500 font-medium">Or sign in with email</div>
          </div>

          {/* Email Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
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
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-2"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full border-2 border-gray-900 bg-white text-gray-900 hover:bg-gray-900 hover:text-white py-3" 
              size="lg"
              disabled={isLoading}
            >
              <Mail className="mr-2 h-5 w-5" />
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="text-center text-sm text-gray-600 pt-4 border-t-2">
            Don't have an account?{" "}
            <Link href="/auth/register" className="font-semibold text-gray-900 hover:underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
