"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/store/auth";
import { useToast } from "@/hooks/use-toast";
import { Bot, Plus, LogOut, Sparkles } from "lucide-react";
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
      // Silent fail
    } finally {
      setIsLoading(false);
    }
  };

  const handleAgentCreated = () => {
    setShowCreateDialog(false);
    loadAgents();
    toast({ title: "Agent created" });
  };

  const handleCreateAgentClick = () => {
    if (!connected) {
      toast({
        title: "Wallet Required",
        description: "Connect your wallet first",
        variant: "destructive",
      });
      return;
    }
    setShowCreateDialog(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />
      
      {/* Header */}
      <header className="relative border-b-2 border-gray-200 bg-white/80 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-gray-900 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">SUBRA</h1>
          </div>
          <div className="flex items-center gap-3">
            <ConnectWalletButton />
            <Button variant="outline" onClick={() => router.push("/")} className="border-2 border-gray-900">
              Home
            </Button>
            <Button variant="ghost" size="icon" onClick={() => { clearAuth(); router.push("/"); }}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="relative container mx-auto px-4 py-8">
        <WalletRequiredBanner />

        <div className="mb-8">
          <h2 className="text-4xl font-bold mb-2">Dashboard</h2>
          <p className="text-gray-600">Manage your AI shopping agents</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="border-2 border-gray-200 hover:border-gray-900 transition-all hover:shadow-xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Active Agents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{agents.length}</div>
            </CardContent>
          </Card>
          <Card className="border-2 border-gray-200 hover:border-gray-900 transition-all hover:shadow-xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Purchases</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">0</div>
            </CardContent>
          </Card>
          <Card className="border-2 border-gray-200 hover:border-gray-900 transition-all hover:shadow-xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Spent</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">$0.00</div>
            </CardContent>
          </Card>
        </div>

        {/* Agents */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold">Your Agents</h3>
            <Button 
              onClick={handleCreateAgentClick}
              className="bg-gray-900 hover:bg-black text-white transition-all hover:scale-105 shadow-lg border-2 border-gray-900"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Agent
            </Button>
          </div>

          {agents.length === 0 ? (
            <Card className="border-2 border-dashed border-gray-300">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Bot className="w-20 h-20 text-gray-300 mb-4" />
                <h4 className="text-xl font-semibold mb-2">No agents yet</h4>
                <p className="text-gray-600 mb-6 text-center max-w-md">
                  Create your first AI shopping agent
                </p>
                <Button 
                  onClick={handleCreateAgentClick}
                  className="bg-gray-900 hover:bg-black text-white border-2 border-gray-900"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Agent
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {agents.map((agent) => (
                <Card key={agent.id} className="border-2 border-gray-200 hover:border-gray-900 transition-all hover:shadow-xl hover:scale-105">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-12 h-12 rounded-lg bg-gray-900 flex items-center justify-center">
                        <Bot className="w-6 h-6 text-white" />
                      </div>
                      <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                        agent.isActive ? "bg-gray-900 text-white" : "bg-gray-200 text-gray-700"
                      }`}>
                        {agent.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <CardTitle className="text-xl">{agent.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">{agent.description || "Shopping agent"}</p>
                    <div className="flex gap-2">
                      <Link href={`/agent/${agent.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full border-2 border-gray-900">
                          View
                        </Button>
                      </Link>
                      <Link href={`/agent/${agent.id}/chat`} className="flex-1">
                        <Button size="sm" className="w-full bg-gray-900 hover:bg-black">
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
