"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateAgentDialog } from "@/components/create-agent-dialog";
import { Shield, Bot, TrendingUp, CheckCircle, LogOut, ArrowLeft, Zap, Activity, Lock, ShoppingCart, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { useToast } from "@/hooks/use-toast";

interface Agent {
  id: string;
  name: string;
  type: string;
  description?: string;
  walletAddress?: string;
  isActive: boolean;
  createdAt: string;
  _count?: {
    tasks: number;
    transactions: number;
  };
}

export default function DashboardPage() {
  const [showCreateAgent, setShowCreateAgent] = useState(false);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { token, user } = useAuthStore();
  const { toast } = useToast();

  // Fetch agents on mount
  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:4000/agent", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch agents");
      }

      const data = await response.json();
      if (data.success) {
        setAgents(data.data);
      }
    } catch (error: any) {
      console.error("Failed to fetch agents:", error);
      toast({
        title: "Error",
        description: "Failed to load agents",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAgentCreated = () => {
    setShowCreateAgent(false);
    fetchAgents(); // Refresh agent list
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Subtle Grid - like homepage */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      
      {/* Minimal floating orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-gray-900/5 to-gray-700/5 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-gray-800/5 to-green-500/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
      
      {/* Header with glass effect */}
      <header className="border-b border-gray-200 sticky top-0 bg-white/80 backdrop-blur-xl z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="text-2xl font-bold">
              <span className="bg-gradient-to-b from-green-600 to-blue-600 bg-clip-text text-transparent group-hover:from-green-700 group-hover:to-blue-700 transition-all">S</span>
              <span className="text-gray-900 group-hover:text-black transition-colors">UBRA</span>
            </div>
          </Link>
          
          <div className="flex items-center gap-3">
            <Button 
              onClick={() => router.push("/")}
              variant="outline" 
              className="border-gray-300 hover:border-gray-900 transition-all" 
              size="sm"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Home
            </Button>
            <Button 
              onClick={() => router.push("/auth/register")}
              variant="outline" 
              className="border-gray-900 bg-gray-900 text-white hover:bg-black transition-all" 
              size="sm"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Hero Section */}
        <div className="mb-12 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-900 bg-white mb-6 animate-slide-in-down">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            <span className="text-sm font-semibold text-gray-900">
              Agent Command Center
            </span>
          </div>
          
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Welcome Back
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            Deploy and manage your autonomous AI agents. Monitor performance, track transactions, and watch your agents work 24/7.
          </p>
        </div>

        {/* Stats Cards - Like homepage feature cards */}
        <div className="grid gap-6 md:grid-cols-3 mb-12">
          <Card className="group border border-gray-900 bg-white hover:shadow-2xl transition-all duration-300 relative overflow-hidden animate-fade-in-up corner-accents">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-gray-900">Active Agents</CardTitle>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Bot className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {loading ? "..." : agents.length}
              </div>
              <p className="text-xs text-gray-600 flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-gray-900" />
                {agents.length === 0 ? "Deploy your first agent" : "Active and ready"}
              </p>
            </CardContent>
          </Card>

          <Card className="group border border-gray-900 bg-white hover:shadow-2xl transition-all duration-300 relative overflow-hidden animate-fade-in-up corner-accents" style={{animationDelay: '0.1s'}}>
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-gray-900">On-Chain Volume</CardTitle>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-800 to-green-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold text-gray-900 mb-1">$0</div>
              <p className="text-xs text-gray-600 flex items-center gap-1">
                <Activity className="h-3 w-3 text-green-600" />
                Total agent transactions
              </p>
            </CardContent>
          </Card>

          <Card className="group border border-gray-900 bg-white hover:shadow-2xl transition-all duration-300 relative overflow-hidden animate-fade-in-up corner-accents" style={{animationDelay: '0.2s'}}>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-gray-900">ZK Proofs</CardTitle>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Shield className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold text-gray-900 mb-1">0</div>
              <p className="text-xs text-gray-600 flex items-center gap-1">
                <Lock className="h-3 w-3 text-gray-900" />
                Verified transactions
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-2 mb-12">
          {/* Deploy Agent Card */}
          <Card className="group border border-gray-900 bg-white hover:shadow-2xl transition-all duration-300 relative overflow-hidden animate-slide-in-right corner-accents">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900/5 via-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader className="relative z-10">
              <div className="flex items-start justify-between mb-2">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Bot className="h-6 w-6 text-white" />
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-900 border border-gray-900">
                  Quick Start
                </span>
              </div>
              <CardTitle className="text-2xl text-gray-900">Deploy AI Agent</CardTitle>
              <CardDescription className="text-base">
                Launch your first autonomous commerce agent in seconds
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <Button 
                onClick={() => setShowCreateAgent(true)}
                className="w-full bg-gray-900 hover:bg-black text-white py-6 text-base font-semibold transition-all hover:scale-105 relative overflow-hidden group/btn" 
                size="lg"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000" />
                <Bot className="mr-2 h-5 w-5 relative z-10" />
                <span className="relative z-10">Create Agent</span>
              </Button>
            </CardContent>
          </Card>

          {/* What Agents Do */}
          <Card className="group border border-gray-900 bg-white hover:shadow-2xl transition-all duration-300 relative overflow-hidden animate-slide-in-right corner-accents" style={{animationDelay: '0.05s'}}>
            <div className="absolute inset-0 bg-gradient-to-bl from-green-500/5 via-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader className="relative z-10">
              <div className="flex items-start justify-between mb-2">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-800 to-green-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-gray-900 border border-gray-900">
                  Capabilities
                </span>
              </div>
              <CardTitle className="text-2xl text-gray-900">Autonomous Commerce</CardTitle>
              <CardDescription className="text-base">
                What your AI agents can do for you
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 relative z-10">
              <div className="flex items-start space-x-3 p-3 rounded-lg border border-gray-200 hover:border-gray-900 transition-colors">
                <Shield className="h-5 w-5 text-gray-900 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Zero-Knowledge Proofs</p>
                  <p className="text-xs text-gray-600">Privacy-preserving transaction verification</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 rounded-lg border border-gray-200 hover:border-gray-900 transition-colors">
                <Bot className="h-5 w-5 text-gray-900 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900 text-sm">24/7 Autonomous Execution</p>
                  <p className="text-xs text-gray-600">Agents work independently based on your goals</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 rounded-lg border border-gray-200 hover:border-gray-900 transition-colors">
                <ShoppingCart className="h-5 w-5 text-gray-900 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Smart Commerce</p>
                  <p className="text-xs text-gray-600">Search, compare, negotiate, and execute purchases</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Agents List or Empty State */}
        {loading ? (
          <Card className="border border-gray-900 bg-white">
            <CardContent className="py-16 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4" />
              <p className="text-gray-600">Loading agents...</p>
            </CardContent>
          </Card>
        ) : agents.length === 0 ? (
          <Card className="border border-gray-900 bg-white hover:shadow-2xl transition-all duration-300 relative overflow-hidden animate-scale-in corner-accents">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-100/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardContent className="py-16 text-center relative z-10">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center animate-pulse-glow">
                <Bot className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-3">
                No Agents Deployed Yet
              </h3>
              <p className="text-gray-600 mb-2 text-lg">Create your first AI agent to unlock autonomous commerce</p>
              <p className="text-sm text-gray-500 mb-8 max-w-md mx-auto">
                Your agent will search products, compare prices, negotiate deals, and execute purchases—all while you sleep
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
                <Button 
                  onClick={() => setShowCreateAgent(true)}
                  className="w-full sm:w-auto bg-gray-900 hover:bg-black text-white px-8 py-6 text-base font-semibold transition-all hover:scale-105 relative overflow-hidden group/btn"
                  size="lg"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000" />
                  <Bot className="mr-2 h-5 w-5 relative z-10" />
                  <span className="relative z-10">Deploy Your First Agent</span>
                </Button>
                
                <Link href="/">
                  <Button 
                    variant="outline"
                    className="w-full sm:w-auto border-gray-900 text-gray-900 hover:bg-gray-100 px-8 py-6 text-base transition-all"
                    size="lg"
                  >
                    Learn More
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Your Agents</h2>
              <Button 
                onClick={() => setShowCreateAgent(true)}
                className="bg-gray-900 hover:bg-black text-white"
              >
                <Bot className="mr-2 h-4 w-4" />
                Deploy New Agent
              </Button>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {agents.map((agent) => (
                <Card 
                  key={agent.id} 
                  className="group border border-gray-900 bg-white hover:shadow-2xl transition-all duration-300 relative overflow-hidden corner-accents cursor-pointer"
                  onClick={() => router.push(`/agent/${agent.id}`)}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-900/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <CardHeader className="relative z-10">
                    <div className="flex items-start justify-between mb-2">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Bot className="h-6 w-6 text-white" />
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        agent.isActive 
                          ? "bg-green-100 text-green-900 border border-green-900" 
                          : "bg-gray-100 text-gray-600 border border-gray-300"
                      }`}>
                        {agent.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <CardTitle className="text-xl text-gray-900">{agent.name}</CardTitle>
                    <CardDescription className="text-sm">
                      {agent.type.charAt(0).toUpperCase() + agent.type.slice(1)} Agent
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    {agent.description && (
                      <p className="text-sm text-gray-600 mb-4">{agent.description}</p>
                    )}
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>
                        {agent.walletAddress 
                          ? `${agent.walletAddress.slice(0, 4)}...${agent.walletAddress.slice(-4)}`
                          : "No wallet"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Activity className="h-3 w-3" />
                        {agent._count?.tasks || 0} tasks
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* What Makes SUBRA Different */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <Card className="border border-gray-200 bg-white hover:border-gray-900 hover:shadow-lg transition-all animate-fade-in-up" style={{animationDelay: '0.3s'}}>
            <CardContent className="pt-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center mb-4">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Non-Custodial</h3>
              <p className="text-sm text-gray-600">
                Your keys, your assets. All operations cryptographically verified with zero-knowledge proofs.
              </p>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 bg-white hover:border-gray-900 hover:shadow-lg transition-all animate-fade-in-up" style={{animationDelay: '0.4s'}}>
            <CardContent className="pt-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-800 to-green-600 flex items-center justify-center mb-4">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Lightning Fast</h3>
              <p className="text-sm text-gray-600">
                Built on Solana. Sub-second finality and fraction-of-a-cent transaction costs.
              </p>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 bg-white hover:border-gray-900 hover:shadow-lg transition-all animate-fade-in-up" style={{animationDelay: '0.5s'}}>
            <CardContent className="pt-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center mb-4">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Truly Autonomous</h3>
              <p className="text-sm text-gray-600">
                Agents operate independently, learning and adapting to find the best deals for you.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <CreateAgentDialog 
        open={showCreateAgent} 
        onOpenChange={setShowCreateAgent}
        onSuccess={handleAgentCreated}
      />
    </div>
  );
}
