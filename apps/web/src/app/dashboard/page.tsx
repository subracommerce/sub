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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b-2 border-gray-200 sticky top-0 bg-white/80 backdrop-blur-sm z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold">
              <span className="bg-gradient-to-b from-green-500 to-blue-500 bg-clip-text text-transparent">S</span>
              <span className="text-gray-900">UBRA</span>
            </div>
          </Link>
          
          <div className="flex items-center gap-3">
            <Button 
              onClick={handleGoBack}
              variant="outline" 
              className="border-2" 
              size="sm"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Home
            </Button>
            <Link href="/auth/login">
              <Button variant="outline" className="border-2 border-gray-900" size="sm">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Agent Command Center</h1>
          <p className="text-gray-600">Monitor and manage your autonomous AI agents</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card className="border-2 border-gray-200 hover:shadow-lg transition-all hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Deployed Agents</CardTitle>
              <Bot className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">0</div>
              <p className="text-xs text-gray-600">Deploy your first agent</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-gray-200 hover:shadow-lg transition-all hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">On-Chain Volume</CardTitle>
              <TrendingUp className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">$0</div>
              <p className="text-xs text-gray-600">Total agent transactions</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-gray-200 hover:shadow-lg transition-all hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tasks Executed</CardTitle>
              <CheckCircle className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">0</div>
              <p className="text-xs text-gray-600">Autonomous operations</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Agent Creation */}
          <Card className="border-2 border-gray-200 hover:shadow-xl transition-all">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-900">Deploy Your First Agent</CardTitle>
              <CardDescription>
                Create an autonomous AI agent to execute on-chain commerce tasks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => setShowCreateAgent(true)}
                className="w-full bg-gray-900 hover:bg-black text-white border-2 border-gray-900 hover:scale-105 transition-all" 
                size="lg"
              >
                <Bot className="mr-2 h-5 w-5" />
                Create Agent
              </Button>
            </CardContent>
          </Card>

          {/* Features */}
          <Card className="border-2 border-gray-200 hover:shadow-xl transition-all">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-900">Agent Capabilities</CardTitle>
              <CardDescription>
                What your AI agents can do
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
        <Card className="mt-8 border-2 border-gray-200">
          <CardContent className="py-12 text-center">
            <Bot className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Agents Yet</h3>
            <p className="text-gray-600 mb-6">Create your first AI agent to get started</p>
            <Button 
              onClick={() => setShowCreateAgent(true)}
              className="bg-gray-900 hover:bg-black text-white border-2 border-gray-900 hover:scale-105 transition-all"
            >
              <Bot className="mr-2 h-5 w-5" />
              Deploy Agent
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
