"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateAgentDialog } from "@/components/create-agent-dialog";
import { Shield, Bot, TrendingUp, CheckCircle, LogOut, ArrowLeft, Zap } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const [showCreateAgent, setShowCreateAgent] = useState(false);
  const router = useRouter();

  const handleAgentCreated = () => {
    setShowCreateAgent(false);
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Subtle Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      
      {/* Minimal Dark Orbs */}
      <div className="absolute top-40 right-40 w-96 h-96 bg-gradient-to-br from-gray-900/5 to-gray-700/5 rounded-full filter blur-3xl" />
      <div className="absolute bottom-40 left-40 w-80 h-80 bg-gradient-to-br from-gray-800/5 to-green-500/10 rounded-full filter blur-3xl" />
      
      {/* Header */}
      <header className="border-b border-gray-200 sticky top-0 bg-white/80 backdrop-blur-xl z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="text-2xl font-bold">
              <span className="bg-gradient-to-b from-green-600 to-blue-600 bg-clip-text text-transparent">S</span>
              <span className="text-gray-900">UBRA</span>
            </div>
          </Link>
          
          <div className="flex items-center gap-3">
            <Button 
              onClick={() => router.push("/")}
              variant="outline" 
              className="border-gray-300 hover:border-gray-900" 
              size="sm"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Home
            </Button>
            <Button 
              onClick={() => router.push("/auth/register")}
              variant="outline" 
              className="border-gray-900 bg-gray-900 text-white hover:bg-black" 
              size="sm"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Agent Command Center
          </h1>
          <p className="text-gray-600 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Monitor and manage your AI agents
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card className="border border-gray-300 hover:border-gray-900 hover:shadow-lg transition-all bg-white animate-fade-in-up">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-900">Deployed Agents</CardTitle>
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center">
                <Bot className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">0</div>
              <p className="text-xs text-gray-600 mt-1">Deploy your first agent</p>
            </CardContent>
          </Card>

          <Card className="border border-gray-300 hover:border-gray-900 hover:shadow-lg transition-all bg-white animate-fade-in-up" style={{animationDelay: '0.05s'}}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-900">On-Chain Volume</CardTitle>
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-gray-800 to-green-600 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">$0</div>
              <p className="text-xs text-gray-600 mt-1">Total transactions</p>
            </CardContent>
          </Card>

          <Card className="border border-gray-300 hover:border-gray-900 hover:shadow-lg transition-all bg-white animate-fade-in-up" style={{animationDelay: '0.1s'}}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-900">Tasks Executed</CardTitle>
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">0</div>
              <p className="text-xs text-gray-600 mt-1">Autonomous operations</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border border-gray-300 bg-white animate-slide-in-right">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-900">Deploy Your First Agent</CardTitle>
              <CardDescription>Create an autonomous AI agent</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => setShowCreateAgent(true)}
                className="w-full bg-gray-900 hover:bg-black text-white" 
                size="lg"
              >
                <Bot className="mr-2 h-5 w-5" />
                Create Agent
              </Button>
            </CardContent>
          </Card>

          <Card className="border border-gray-300 bg-white animate-slide-in-right" style={{animationDelay: '0.05s'}}>
            <CardHeader>
              <CardTitle className="text-2xl text-gray-900">Agent Capabilities</CardTitle>
              <CardDescription>What your agents can do</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start space-x-3">
                <Shield className="h-5 w-5 text-gray-900 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Zero-Knowledge Proofs</p>
                  <p className="text-sm text-gray-600">Privacy-preserving verification</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Bot className="h-5 w-5 text-gray-900 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Autonomous Execution</p>
                  <p className="text-sm text-gray-600">Agents act independently</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <TrendingUp className="h-5 w-5 text-gray-900 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900 text-sm">On-Chain Commerce</p>
                  <p className="text-sm text-gray-600">Search and execute purchases</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Empty State */}
        <Card className="mt-8 border border-gray-300 bg-white animate-scale-in">
          <CardContent className="py-12 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center">
              <Bot className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Agents Yet</h3>
            <p className="text-gray-600 mb-8">Create your first AI agent to get started</p>
            <Button 
              onClick={() => setShowCreateAgent(true)}
              className="bg-gray-900 hover:bg-black text-white"
              size="lg"
            >
              <Bot className="mr-2 h-5 w-5" />
              Deploy Agent
            </Button>
          </CardContent>
        </Card>
      </div>

      <CreateAgentDialog 
        open={showCreateAgent} 
        onOpenChange={setShowCreateAgent}
        onSuccess={handleAgentCreated}
      />
    </div>
  );
}

}
