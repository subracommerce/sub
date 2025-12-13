"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateAgentDialog } from "@/components/create-agent-dialog";
import { Shield, Bot, TrendingUp, CheckCircle, LogOut, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const [showCreateAgent, setShowCreateAgent] = useState(false);
  const router = useRouter();

  const handleAgentCreated = () => {
    setShowCreateAgent(false);
    // Refresh agents list or show success message
  };

  const handleGoBack = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)] bg-[size:4rem_4rem] animate-grid-slow opacity-30" />
      
      {/* Floating Orbs */}
      <div className="absolute top-40 right-40 w-96 h-96 bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-full blur-3xl animate-float-1" />
      <div className="absolute bottom-40 left-40 w-80 h-80 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-float-2" />
      
      {/* Header */}
      <header className="border-b-2 border-gray-200/50 sticky top-0 bg-white/90 backdrop-blur-md z-10 relative">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="text-2xl font-bold hover:animate-text-glitch transition-all">
              <span className="bg-gradient-to-b from-green-500 to-blue-500 bg-clip-text text-transparent group-hover:from-green-600 group-hover:to-blue-600 transition-all">S</span>
              <span className="text-gray-900 group-hover:text-black transition-colors">UBRA</span>
            </div>
          </Link>
          
          <div className="flex items-center gap-3">
            <Button 
              onClick={handleGoBack}
              variant="outline" 
              className="border-2 hover:scale-105 transition-all" 
              size="sm"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Home
            </Button>
            <Link href="/auth/login">
              <Button variant="outline" className="border-2 border-gray-900 hover:bg-gray-900 hover:text-white hover:scale-105 transition-all" size="sm">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Page Title */}
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent mb-2">
            Agent Command Center
          </h1>
          <p className="text-gray-600 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Monitor and manage your autonomous AI agents
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card className="border-2 border-gray-200 hover:shadow-2xl transition-all hover:scale-105 hover:border-green-500/50 group relative overflow-hidden animate-fade-in-up">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-medium">Deployed Agents</CardTitle>
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500/20 to-blue-500/20 flex items-center justify-center group-hover:animate-pulse-glow">
                <Bot className="h-4 w-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">0</div>
              <p className="text-xs text-gray-600 mt-1">Deploy your first agent</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-gray-200 hover:shadow-2xl transition-all hover:scale-105 hover:border-blue-500/50 group relative overflow-hidden animate-fade-in-up" style={{animationDelay: '0.1s'}}>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-medium">On-Chain Volume</CardTitle>
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center group-hover:animate-pulse-glow">
                <TrendingUp className="h-4 w-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">$0</div>
              <p className="text-xs text-gray-600 mt-1">Total agent transactions</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-gray-200 hover:shadow-2xl transition-all hover:scale-105 hover:border-purple-500/50 group relative overflow-hidden animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-medium">Tasks Executed</CardTitle>
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center group-hover:animate-pulse-glow">
                <CheckCircle className="h-4 w-4 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">0</div>
              <p className="text-xs text-gray-600 mt-1">Autonomous operations</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Agent Creation */}
          <Card className="border-2 border-gray-200 hover:shadow-2xl transition-all hover:border-gray-300 corner-accents relative overflow-hidden group animate-slide-in-right">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute inset-0 scanline-overlay" />
            <CardHeader className="relative z-10">
              <CardTitle className="text-2xl bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Deploy Your First Agent
              </CardTitle>
              <CardDescription>
                Create an autonomous AI agent to execute on-chain commerce tasks
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <Button 
                onClick={() => setShowCreateAgent(true)}
                className="w-full bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 hover:from-black hover:via-gray-900 hover:to-black text-white border-2 border-gray-900 hover:scale-105 transition-all relative overflow-hidden group/btn" 
                size="lg"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000" />
                <Bot className="mr-2 h-5 w-5 relative z-10" />
                <span className="relative z-10">Create Agent</span>
              </Button>
            </CardContent>
          </Card>

          {/* Features */}
          <Card className="border-2 border-gray-200 hover:shadow-2xl transition-all hover:border-gray-300 relative overflow-hidden group animate-slide-in-right" style={{animationDelay: '0.1s'}}>
            <div className="absolute inset-0 bg-gradient-to-bl from-blue-500/5 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader className="relative z-10">
              <CardTitle className="text-2xl bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Agent Capabilities
              </CardTitle>
              <CardDescription>
                What your AI agents can do
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 relative z-10">
              <div className="flex items-start space-x-3">
                <Shield className="h-5 w-5 text-gray-900 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900">Zero-Knowledge Proofs</p>
                  <p className="text-sm text-gray-600">Privacy-preserving transaction verification</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Bot className="h-5 w-5 text-gray-900 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900">Autonomous Execution</p>
                  <p className="text-sm text-gray-600">Agents act independently based on your goals</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <TrendingUp className="h-5 w-5 text-gray-900 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900">On-Chain Commerce</p>
                  <p className="text-sm text-gray-600">Search, compare, and execute purchases</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Empty State */}
        <Card className="mt-8 border-2 border-gray-200 hover:shadow-2xl transition-all relative overflow-hidden group animate-scale-in">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-100/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardContent className="py-12 text-center relative z-10">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center group-hover:animate-pulse-glow">
              <Bot className="h-10 w-10 text-gray-600" />
            </div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
              No Agents Yet
            </h3>
            <p className="text-gray-600 mb-8">Create your first AI agent to get started</p>
            <Button 
              onClick={() => setShowCreateAgent(true)}
              className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 hover:from-black hover:via-gray-900 hover:to-black text-white border-2 border-gray-900 hover:scale-110 transition-all relative overflow-hidden group/btn"
              size="lg"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000" />
              <Bot className="mr-2 h-5 w-5 relative z-10" />
              <span className="relative z-10">Deploy Agent</span>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Create Agent Dialog */}
      <CreateAgentDialog 
        open={showCreateAgent} 
        onOpenChange={setShowCreateAgent}
        onSuccess={handleAgentCreated}
      />
    </div>
  );
}
