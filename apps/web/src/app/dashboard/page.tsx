"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateAgentDialog } from "@/components/create-agent-dialog";
import { Shield, Bot, TrendingUp, CheckCircle, LogOut, ArrowLeft, Zap, Activity } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const [showCreateAgent, setShowCreateAgent] = useState(false);
  const router = useRouter();

  const handleAgentCreated = () => {
    setShowCreateAgent(false);
  };

  const handleGoBack = () => {
    router.push("/");
  };

  const handleSignOut = () => {
    // Redirect to login page (now with all options)
    router.push("/auth/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 relative overflow-hidden">
      {/* Animated Background with subtle movement */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)] bg-[size:4rem_4rem] animate-grid-slow opacity-20" />
      
      {/* Colorful Floating Orbs */}
      <div className="absolute top-40 right-40 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-green-400/20 rounded-full blur-3xl animate-float-1" />
      <div className="absolute bottom-40 left-40 w-80 h-80 bg-gradient-to-br from-green-400/15 to-blue-400/15 rounded-full blur-3xl animate-float-2" />
      <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-gradient-to-br from-purple-400/10 to-blue-400/10 rounded-full blur-3xl animate-float-3" />
      
      {/* Subtle pulsing accent dots */}
      <div className="absolute top-20 left-20 w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
      <div className="absolute top-40 right-60 w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{animationDelay: '1s'}} />
      <div className="absolute bottom-60 left-40 w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{animationDelay: '2s'}} />
      
      {/* Header with glass morphism */}
      <header className="border-b-2 border-gray-200/50 sticky top-0 bg-white/80 backdrop-blur-xl z-10 relative shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="text-2xl font-bold transition-all">
              <span className="bg-gradient-to-b from-blue-500 via-green-500 to-blue-500 bg-clip-text text-transparent group-hover:from-blue-600 group-hover:via-green-600 group-hover:to-blue-600 transition-all">S</span>
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent group-hover:from-black group-hover:to-gray-900 transition-colors">UBRA</span>
            </div>
          </Link>
          
          <div className="flex items-center gap-3">
            <Button 
              onClick={handleGoBack}
              variant="outline" 
              className="border-2 border-blue-500/50 hover:border-blue-500 hover:bg-blue-50 hover:scale-105 transition-all shadow-md" 
              size="sm"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Home
            </Button>
            <Button 
              onClick={handleSignOut}
              variant="outline" 
              className="border-2 border-gray-900 hover:bg-gray-900 hover:text-white hover:scale-105 transition-all shadow-md" 
              size="sm"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Page Title with gradient */}
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Agent Command Center
          </h1>
          <p className="text-gray-600 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Monitor and manage your autonomous AI agents
            <Activity className="h-4 w-4 text-green-500 animate-pulse ml-1" />
          </p>
        </div>

        {/* Stats Grid - More Colorful */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card className="border-2 border-green-200 hover:shadow-2xl transition-all hover:scale-105 hover:border-green-400 group relative overflow-hidden animate-fade-in-up bg-gradient-to-br from-green-50 to-white">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-gray-900">Deployed Agents</CardTitle>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center group-hover:animate-pulse-glow shadow-lg">
                <Bot className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">0</div>
              <p className="text-xs text-gray-600 mt-1 flex items-center gap-1">
                <Zap className="h-3 w-3 text-green-500" />
                Deploy your first agent
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-200 hover:shadow-2xl transition-all hover:scale-105 hover:border-blue-400 group relative overflow-hidden animate-fade-in-up bg-gradient-to-br from-blue-50 to-white" style={{animationDelay: '0.1s'}}>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-gray-900">On-Chain Volume</CardTitle>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center group-hover:animate-pulse-glow shadow-lg">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">$0</div>
              <p className="text-xs text-gray-600 mt-1 flex items-center gap-1">
                <Activity className="h-3 w-3 text-blue-500" />
                Total agent transactions
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-200 hover:shadow-2xl transition-all hover:scale-105 hover:border-purple-400 group relative overflow-hidden animate-fade-in-up bg-gradient-to-br from-purple-50 to-white" style={{animationDelay: '0.2s'}}>
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-gray-900">Tasks Executed</CardTitle>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center group-hover:animate-pulse-glow shadow-lg">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">0</div>
              <p className="text-xs text-gray-600 mt-1 flex items-center gap-1">
                <Zap className="h-3 w-3 text-purple-500" />
                Autonomous operations
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Agent Creation - More Colorful */}
          <Card className="border-2 border-blue-200 hover:shadow-2xl transition-all hover:border-blue-400 corner-accents relative overflow-hidden group animate-slide-in-right bg-gradient-to-br from-blue-50/50 to-white">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader className="relative z-10">
              <CardTitle className="text-2xl bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent flex items-center gap-2">
                <Bot className="h-6 w-6 text-blue-600" />
                Deploy Your First Agent
              </CardTitle>
              <CardDescription>
                Create an autonomous AI agent to execute on-chain commerce tasks
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <Button 
                onClick={() => setShowCreateAgent(true)}
                className="w-full bg-gradient-to-r from-blue-600 via-green-600 to-blue-600 hover:from-blue-700 hover:via-green-700 hover:to-blue-700 text-white border-2 border-blue-600 hover:scale-105 transition-all relative overflow-hidden group/btn shadow-lg" 
                size="lg"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000" />
                <Bot className="mr-2 h-5 w-5 relative z-10" />
                <span className="relative z-10">Create Agent</span>
              </Button>
            </CardContent>
          </Card>

          {/* Features - More Colorful */}
          <Card className="border-2 border-green-200 hover:shadow-2xl transition-all hover:border-green-400 relative overflow-hidden group animate-slide-in-right bg-gradient-to-br from-green-50/50 to-white" style={{animationDelay: '0.1s'}}>
            <div className="absolute inset-0 bg-gradient-to-bl from-green-500/5 via-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader className="relative z-10">
              <CardTitle className="text-2xl bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent flex items-center gap-2">
                <Zap className="h-6 w-6 text-green-600" />
                Agent Capabilities
              </CardTitle>
              <CardDescription>
                What your AI agents can do
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 relative z-10">
              <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-purple-50/50 transition-colors group/item">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-md">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">Zero-Knowledge Proofs</p>
                  <p className="text-sm text-gray-600">Privacy-preserving transaction verification</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-green-50/50 transition-colors group/item">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-md">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">Autonomous Execution</p>
                  <p className="text-sm text-gray-600">Agents act independently based on your goals</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-blue-50/50 transition-colors group/item">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">On-Chain Commerce</p>
                  <p className="text-sm text-gray-600">Search, compare, and execute purchases</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Empty State - More Colorful */}
        <Card className="mt-8 border-2 border-blue-200 hover:shadow-2xl transition-all relative overflow-hidden group animate-scale-in bg-gradient-to-br from-blue-50/30 via-white to-green-50/30">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 to-green-100/50 opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardContent className="py-12 text-center relative z-10">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500 via-green-500 to-blue-600 flex items-center justify-center group-hover:animate-pulse-glow shadow-xl">
              <Bot className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
              No Agents Yet
            </h3>
            <p className="text-gray-600 mb-8">Create your first AI agent to get started with autonomous commerce</p>
            <Button 
              onClick={() => setShowCreateAgent(true)}
              className="bg-gradient-to-r from-blue-600 via-green-600 to-blue-600 hover:from-blue-700 hover:via-green-700 hover:to-blue-700 text-white border-2 border-blue-600 hover:scale-110 transition-all relative overflow-hidden group/btn shadow-lg"
              size="lg"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000" />
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
