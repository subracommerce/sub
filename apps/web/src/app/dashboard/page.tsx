"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/store/auth";
import { useToast } from "@/hooks/use-toast";
import { Bot, Plus, Sparkles, LogOut } from "lucide-react";
import Link from "next/link";
import { ConnectWalletButton } from "@/components/connect-wallet-button";
import { WalletRequiredBanner } from "@/components/wallet-required-banner";
import { CreateAgentDialog } from "@/components/create-agent-dialog";
import type { Agent } from "@subra/sdk";

export default function DashboardPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const { isAuthenticated, token, clearAuth } = useAuthStore();
  const { connected } = useWallet();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }
    loadAgents();
  }, [isAuthenticated, router]);

  const loadAgents = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/agent`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setAgents(data.data);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load agents",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAgentCreated = () => {
    setShowCreateDialog(false);
    loadAgents();
    toast({
      title: "Success!",
      description: "Your AI agent has been created",
    });
  };

  const handleCreateAgentClick = () => {
    if (!connected) {
      toast({
        title: "Wallet Required",
        description: "Please connect your Solana wallet first",
        variant: "destructive",
      });
      return;
    }
    setShowCreateDialog(true);
  };

  const handleLogout = () => {
    clearAuth();
    router.push("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b-2 bg-white/80 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-2xl font-bold">SUBRA</h1>
          </div>
          <div className="flex items-center gap-3">
            <ConnectWalletButton />
            <Button variant="outline" onClick={() => router.push("/")} className="border-2">
              Home
            </Button>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <WalletRequiredBanner />

        {/* Welcome */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Dashboard</h2>
          <p className="text-gray-600">Manage your AI agents and transactions</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="border-2 transition-all hover:shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Active Agents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{agents.length}</div>
            </CardContent>
          </Card>
          <Card className="border-2 transition-all hover:shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">0</div>
            </CardContent>
          </Card>
          <Card className="border-2 transition-all hover:shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Spent</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">$0.00</div>
            </CardContent>
          </Card>
        </div>

        {/* Agents */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold">Your AI Agents</h3>
            <Button 
              onClick={handleCreateAgentClick}
              className="bg-black hover:bg-gray-900 text-white transition-all hover:scale-105"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Agent
            </Button>
          </div>

          {agents.length === 0 ? (
            <Card className="border-2 border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Bot className="w-16 h-16 text-gray-400 mb-4" />
                <h4 className="text-xl font-semibold mb-2">No agents yet</h4>
                <p className="text-gray-600 mb-4 text-center max-w-md">
                  Create your first AI agent to start shopping autonomously
                </p>
                <Button 
                  onClick={handleCreateAgentClick}
                  className="bg-black hover:bg-gray-900 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Agent
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {agents.map((agent) => (
                <Card key={agent.id} className="border-2 transition-all hover:shadow-xl hover:scale-105">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                        <Bot className="w-5 h-5 text-white" />
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        agent.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                      }`}>
                        {agent.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <CardTitle>{agent.name}</CardTitle>
                    <CardDescription>
                      {agent.type.charAt(0).toUpperCase() + agent.type.slice(1)} Agent
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">
                      {agent.description || "No description"}
                    </p>
                    <div className="flex gap-2">
                      <Link href={`/agent/${agent.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full border-2">
                          View
                        </Button>
                      </Link>
                      <Link href={`/agent/${agent.id}/chat`} className="flex-1">
                        <Button size="sm" className="w-full bg-black hover:bg-gray-900 text-white">
                          Chat
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <CreateAgentDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSuccess={handleAgentCreated}
      />
    </div>
  );
}
