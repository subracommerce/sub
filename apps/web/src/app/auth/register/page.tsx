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
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Animated Grid Background - like homepage */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      
      {/* Floating Gradient Orbs - Blue/Green like homepage */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-green-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
      <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000" />

      {/* Mouse spotlight effect - like homepage */}
      <div className="pointer-events-none fixed inset-0 z-30 transition duration-300 lg:absolute" style={{background: 'radial-gradient(600px at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(29, 78, 216, 0.08), transparent 80%)'}} />

      {/* Home Button */}
      <div className="absolute top-6 left-6 z-20">
        <Button
          onClick={handleGoHome}
          variant="ghost"
          className="text-gray-900 hover:text-black hover:bg-gray-100 transition-all"
          size="sm"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Hero Header */}
          <div className="text-center mb-12 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-gray-900 bg-white mb-6 animate-slide-in-down">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              <span className="text-sm font-semibold text-gray-900">
                AI Agent • Commerce • Marketplace
              </span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-b from-green-500 to-blue-500 bg-clip-text text-transparent">S</span>
              <span className="text-gray-900">UBRA</span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-2">
              Choose Your Path to Autonomous Commerce
            </p>
            <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
              <Shield className="h-4 w-4 text-green-500" />
              Secured by Zero-Knowledge Cryptography
            </p>
          </div>

          {/* Main Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Auth Options - 2 Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Wallet Options Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Connect Wallet */}
                <Link href="/auth/wallet">
                  <Card className="h-full border-2 border-gray-900 hover:shadow-2xl transition-all hover:scale-105 group relative overflow-hidden cursor-pointer bg-white animate-fade-in-up corner-accents">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <CardHeader className="relative z-10">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-4 shadow-lg group-hover:shadow-blue-500/50 transition-all">
                        <Wallet className="h-7 w-7 text-white" />
                      </div>
                      <CardTitle className="text-2xl text-gray-900">
                        Connect Wallet
                      </CardTitle>
                      <CardDescription className="text-base">
                        Phantom, Solflare, Ledger, or any Solana wallet
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Instant connection</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Your keys, your control</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>

                {/* Create Wallet */}
                <Card 
                  onClick={() => setShowCreateWallet(true)}
                  className="h-full border-2 border-gray-900 hover:shadow-2xl transition-all hover:scale-105 group relative overflow-hidden cursor-pointer bg-white animate-fade-in-up corner-accents"
                  style={{animationDelay: '0.1s'}}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <CardHeader className="relative z-10">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mb-4 shadow-lg group-hover:shadow-green-500/50 transition-all">
                      <Plus className="h-7 w-7 text-white" />
                    </div>
                    <CardTitle className="text-2xl text-gray-900">
                      Create Wallet
                    </CardTitle>
                    <CardDescription className="text-base">
                      Generate a new Solana wallet in seconds
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Password protected</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Encrypted & secure</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Email Registration */}
              <Card className="border-2 border-gray-900 hover:shadow-2xl transition-all group relative overflow-hidden bg-white animate-fade-in-up corner-accents" style={{animationDelay: '0.2s'}}>
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardHeader className="relative z-10">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl text-gray-900 mb-2">
                        Email Registration
                      </CardTitle>
                      <CardDescription className="text-base">
                        Traditional sign up with email and password
                      </CardDescription>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center shadow-lg">
                      <Mail className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium text-gray-900">
                          Email Address
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="you@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="border-2 border-gray-900 focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="password" className="text-sm font-medium text-gray-900">
                          Password
                        </Label>
                        <Input
                          id="password"
                          type="password"
                          placeholder="Min. 8 characters"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          className="border-2 border-gray-900 focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                      </div>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-gray-900 hover:bg-black text-white py-6 text-base font-semibold hover:scale-105 transition-all shadow-lg border-2 border-gray-900 relative overflow-hidden group/btn" 
                      size="lg"
                      disabled={isLoading}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000" />
                      <span className="relative z-10">{isLoading ? "Creating account..." : "Create Account"}</span>
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Footer */}
              <div className="text-center text-sm text-gray-600 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
                <p>
                  Already have an account?{" "}
                  <Link href="/auth/login" className="font-semibold text-gray-900 hover:text-black underline">
                    Sign in
                  </Link>
                </p>
              </div>
            </div>

            {/* Right Sidebar - Info Cards */}
            <div className="space-y-6">
              {/* Platform Stats */}
              <Card className="border-2 border-gray-900 bg-white animate-fade-in-up corner-accents" style={{animationDelay: '0.15s'}}>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Activity className="h-5 w-5 text-gray-900" />
                    <span className="text-gray-900">Platform Power</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                        &lt;100ms
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">Transaction finality on Solana</p>
                  </div>
                  <div>
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                        $0.00025
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">Average transaction cost</p>
                  </div>
                  <div>
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                        100%
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">Zero-knowledge verified</p>
                  </div>
                </CardContent>
              </Card>

              {/* Agent Capabilities */}
              <Card className="border-2 border-gray-900 bg-white animate-fade-in-up corner-accents" style={{animationDelay: '0.2s'}}>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Bot className="h-5 w-5 text-gray-900" />
                    <span className="text-gray-900">AI Agent Features</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r from-blue-50 to-transparent border-l-2 border-blue-500">
                    <Shield className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">Zero-Knowledge Proofs</p>
                      <p className="text-xs text-gray-600">Cryptographic privacy for all operations</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r from-green-50 to-transparent border-l-2 border-green-500">
                    <Zap className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">Autonomous Execution</p>
                      <p className="text-xs text-gray-600">Agents operate 24/7 based on your goals</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r from-blue-50 to-transparent border-l-2 border-blue-500">
                    <Activity className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">On-Chain Commerce</p>
                      <p className="text-xs text-gray-600">Search, negotiate, and execute purchases</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Security Badge */}
              <Card className="border-2 border-gray-900 bg-gradient-to-br from-gray-900 to-gray-800 text-white animate-fade-in-up corner-accents" style={{animationDelay: '0.25s'}}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                      <Shield className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold mb-2">Non-Custodial & Secure</h3>
                      <p className="text-sm text-gray-300 mb-3">
                        Your keys, your assets. All wallets encrypted with AES-256.
                      </p>
                      <div className="flex gap-2 flex-wrap">
                        <span className="px-2 py-1 rounded-full text-xs bg-white/10 border border-white/20 font-medium">AES-256</span>
                        <span className="px-2 py-1 rounded-full text-xs bg-white/10 border border-white/20 font-medium">Non-Custodial</span>
                        <span className="px-2 py-1 rounded-full text-xs bg-white/10 border border-white/20 font-medium">Open Source</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
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
