"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/store/auth";
import { useToast } from "@/hooks/use-toast";
import { Bot, Plus, Sparkles } from "lucide-react";
import Link from "next/link";
import { ConnectWalletButton } from "@/components/connect-wallet-button";
import { WalletRequiredBanner } from "@/components/wallet-required-banner";
import { CreateAgentDialog } from "@/components/create-agent-dialog";
import type { Agent } from "@subra/sdk";

export default function DashboardPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const { isAuthenticated, token } = useAuthStore();
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
        description: "Please connect your Solana wallet first to create agents",
        variant: "destructive",
      });
      return;
    }
    setShowCreateDialog(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold">SUBRA Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <ConnectWalletButton />
            <Button variant="outline" onClick={() => router.push("/")}>
              Home
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Wallet Required Banner */}
        <WalletRequiredBanner />

        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Welcome to Your Dashboard</h2>
          <p className="text-muted-foreground">
            Manage your AI agents, view tasks, and track transactions
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="transition-all duration-300 hover:shadow-md hover:-translate-y-1">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Agents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{agents.length}</div>
            </CardContent>
          </Card>
          <Card className="transition-all duration-300 hover:shadow-md hover:-translate-y-1">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">0</div>
            </CardContent>
          </Card>
          <Card className="transition-all duration-300 hover:shadow-md hover:-translate-y-1">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Spent
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">$0.00</div>
            </CardContent>
          </Card>
        </div>

        {/* Agents Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold">Your AI Agents</h3>
            <Button 
              onClick={handleCreateAgentClick}
              className="transition-all hover:scale-105"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Agent
            </Button>
          </div>

          {agents.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Bot className="w-16 h-16 text-muted-foreground mb-4" />
                <h4 className="text-xl font-semibold mb-2">No agents yet</h4>
                <p className="text-muted-foreground mb-4 text-center max-w-md">
                  Create your first AI agent to start shopping autonomously
                </p>
                <Button 
                  onClick={handleCreateAgentClick}
                  className="transition-all hover:scale-105"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Agent
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {agents.map((agent) => (
                <Card key={agent.id} className="agent-card transition-all duration-300 hover:shadow-lg">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Bot className="w-8 h-8 text-primary" />
                      <span className={`text-xs px-2 py-1 rounded-full transition-all ${
                        agent.isActive ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
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
                    <p className="text-sm text-muted-foreground mb-4">
                      {agent.description || "No description"}
                    </p>
                    <div className="flex gap-2">
                      <Link href={`/agent/${agent.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full transition-all hover:scale-105">
                          View Details
                        </Button>
                      </Link>
                      <Link href={`/agent/${agent.id}/chat`} className="flex-1">
                        <Button size="sm" className="w-full transition-all hover:scale-105">
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
