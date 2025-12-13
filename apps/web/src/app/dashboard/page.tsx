"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/store/auth";
import { useToast } from "@/hooks/use-toast";
import { Bot, Plus, LogOut, Home as HomeIcon } from "lucide-react";
import Link from "next/link";
import { CreateAgentDialog } from "@/components/create-agent-dialog";
import type { Agent } from "@subra/sdk";

export default function DashboardPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const { isAuthenticated, token, user, clearAuth } = useAuthStore();
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
      console.error("Failed to load agents:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAgentCreated = () => {
    setShowCreateDialog(false);
    loadAgents();
    toast({ title: "Agent created successfully!" });
  };

  const handleCreateAgentClick = () => {
    setShowCreateDialog(true);
  };

  const handleSignOut = () => {
    clearAuth();
    toast({ title: "Signed out successfully" });
    router.push("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="absolute inset-0 bg-agentic-grid animate-grid-drift pointer-events-none" />
      
      {/* Header */}
      <header className="relative border-b-2 border-gray-200 bg-white/80 backdrop-blur-sm z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-gray-900 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">
              <span className="bg-gradient-to-b from-green-500 from-50% to-blue-500 to-50% bg-clip-text text-transparent">S</span>UBRA
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            {user?.walletAddress && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-gray-50 border-2 border-gray-200 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse-smooth" />
                <span className="text-xs font-mono font-medium text-gray-700">
                  {user.walletAddress.slice(0, 4)}...{user.walletAddress.slice(-4)}
                </span>
              </div>
            )}
            
            {!user?.hasWallet && (
              <Link href="/auth/register">
                <Button size="sm" variant="outline" className="border-2 border-gray-900">
                  Create Wallet
                </Button>
              </Link>
            )}
            
            <Button 
              variant="outline" 
              onClick={() => router.push("/")} 
              className="border-2 border-gray-900 hover:bg-gray-900 hover:text-white transition-all"
            >
              <HomeIcon className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Home</span>
            </Button>
            
            <Button 
              variant="outline"
              onClick={handleSignOut}
              className="border-2 border-red-200 text-red-600 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all"
              title="Sign Out"
            >
              <LogOut className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="relative container mx-auto px-4 py-8 z-10">
        <div className="mb-8">
          <h2 className="text-4xl font-bold mb-2">Dashboard</h2>
          <p className="text-gray-600">Manage your AI shopping agents</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-2 border-gray-200 hover:border-gray-900 transition-all hover:shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-gray-600">Active Agents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{agents.length}</div>
            </CardContent>
          </Card>
          <Card className="border-2 border-gray-200 hover:border-gray-900 transition-all hover:shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-gray-600">Purchases</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">0</div>
            </CardContent>
          </Card>
          <Card className="border-2 border-gray-200 hover:border-gray-900 transition-all hover:shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-gray-600">Total Spent</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">$0.00</div>
            </CardContent>
          </Card>
          <Card className="border-2 border-gray-200 hover:border-gray-900 transition-all hover:shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-gray-600">Wallet</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs font-medium text-green-600">
                {user?.hasWallet ? "Connected" : "Not Connected"}
              </div>
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
                  Create your first AI shopping agent to start automating your purchases
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
                <Card key={agent.id} className="border-2 border-gray-200 hover:border-gray-900 transition-all hover:shadow-xl hover:scale-105 group">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-12 h-12 rounded-lg bg-gray-900 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Bot className="w-6 h-6 text-white" />
                      </div>
                      <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                        agent.isActive ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-700"
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
