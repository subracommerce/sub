"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/store/auth";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Bot, Wallet, Copy, Zap, TrendingUp, Activity, MessageSquare, History } from "lucide-react";
import Link from "next/link";

interface Agent {
  id: string;
  name: string;
  type: string;
  description?: string;
  walletAddress?: string;
  walletBalance?: number;
  isActive: boolean;
  createdAt: string;
  _count?: {
    tasks: number;
    transactions: number;
  };
}

interface AgentSkill {
  id: string;
  skillType: string;
  level: number;
  experience: number;
  isActive: boolean;
}

interface Task {
  id: string;
  type: string;
  status: string;
  input: any;
  output: any;
  createdAt: string;
  completedAt?: string;
}

export default function AgentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { token } = useAuthStore();
  const { toast } = useToast();
  
  const [agent, setAgent] = useState<Agent | null>(null);
  const [skills, setSkills] = useState<AgentSkill[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAgentData();
  }, [params.id]);

  const fetchAgentData = async () => {
    try {
      setLoading(true);

      // Fetch agent details
      const agentResponse = await fetch(`http://localhost:4000/agent/${params.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (agentResponse.ok) {
        const agentData = await agentResponse.json();
        setAgent(agentData.data);
      }

      // Fetch skills
      const skillsResponse = await fetch(`http://localhost:4000/agent/${params.id}/skills`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (skillsResponse.ok) {
        const skillsData = await skillsResponse.json();
        setSkills(skillsData.data.skills || []);
      }

      // Fetch tasks
      const tasksResponse = await fetch(`http://localhost:4000/agent/${params.id}/tasks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (tasksResponse.ok) {
        const tasksData = await tasksResponse.json();
        setTasks(tasksData.data.tasks || []);
      }

    } catch (error: any) {
      console.error("Failed to fetch agent data:", error);
      toast({
        title: "Error",
        description: "Failed to load agent details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Wallet address copied to clipboard",
    });
  };

  const getSkillIcon = (skillType: string) => {
    const icons: Record<string, string> = {
      search: "🔍",
      compare: "💰",
      negotiate: "🤝",
      execute: "⚡",
    };
    return icons[skillType] || "🎯";
  };

  const getXPToNextLevel = (experience: number) => {
    const currentLevel = Math.floor(experience / 100) + 1;
    const xpInCurrentLevel = experience % 100;
    const xpNeeded = 100 - xpInCurrentLevel;
    return { xpInCurrentLevel, xpNeeded };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-gray-600">Agent not found</p>
            <Button
              onClick={() => router.push("/dashboard")}
              className="w-full mt-4"
            >
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 sticky top-0 bg-white/80 backdrop-blur-xl z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Button
            onClick={() => router.push("/dashboard")}
            variant="ghost"
            size="sm"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Agent Header */}
        <div className="flex items-start gap-6 mb-8">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center">
            <Bot className="h-10 w-10 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-bold text-gray-900">{agent.name}</h1>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                agent.isActive 
                  ? "bg-green-100 text-green-900 border border-green-900" 
                  : "bg-gray-100 text-gray-600 border border-gray-300"
              }`}>
                {agent.isActive ? "Active" : "Inactive"}
              </span>
            </div>
            <p className="text-lg text-gray-600 mb-2">
              {agent.type.charAt(0).toUpperCase() + agent.type.slice(1)} Agent
            </p>
            {agent.description && (
              <p className="text-gray-600">{agent.description}</p>
            )}
          </div>
          <Button
            onClick={() => router.push(`/agent/${agent.id}/chat`)}
            size="lg"
            className="bg-gray-900 hover:bg-black"
          >
            <MessageSquare className="mr-2 h-5 w-5" />
            Chat with Agent
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="border-gray-900">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {agent._count?.tasks || 0}
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-900">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {agent._count?.transactions || 0}
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-900">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Wallet Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {agent.walletBalance?.toFixed(4) || "0.0000"} SOL
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Skills */}
          <Card className="border-gray-900">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Skills & Experience
              </CardTitle>
              <CardDescription>Agent capabilities and progression</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {skills.length === 0 ? (
                <p className="text-gray-600 text-center py-4">No skills initialized</p>
              ) : (
                skills.map((skill) => {
                  const { xpInCurrentLevel, xpNeeded } = getXPToNextLevel(skill.experience);
                  return (
                    <div key={skill.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{getSkillIcon(skill.skillType)}</span>
                          <div>
                            <p className="font-semibold text-gray-900 capitalize">
                              {skill.skillType}
                            </p>
                            <p className="text-xs text-gray-600">
                              Level {skill.level} • {skill.experience} XP
                            </p>
                          </div>
                        </div>
                        <span className="px-2 py-1 bg-gray-50 border border-gray-300 rounded-full text-xs font-semibold text-gray-700">
                          {xpNeeded} XP to next level
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-gray-900 to-gray-700 h-2 rounded-full transition-all"
                          style={{ width: `${xpInCurrentLevel}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>

          {/* Wallet */}
          <Card className="border-gray-900">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                Wallet
              </CardTitle>
              <CardDescription>Agent's Solana wallet</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {agent.walletAddress ? (
                <>
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <span className="text-xs font-mono text-gray-700 flex-1 break-all">
                      {agent.walletAddress}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(agent.walletAddress!)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="pt-2 border-t border-gray-200">
                    <p className="text-sm text-gray-600 mb-2">Balance</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {agent.walletBalance?.toFixed(4) || "0.0000"} SOL
                    </p>
                  </div>
                </>
              ) : (
                <p className="text-gray-600 text-center py-4">No wallet created</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Tasks */}
        <Card className="border-gray-900 mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Recent Tasks
            </CardTitle>
            <CardDescription>Latest agent activities</CardDescription>
          </CardHeader>
          <CardContent>
            {tasks.length === 0 ? (
              <p className="text-gray-600 text-center py-8">No tasks yet</p>
            ) : (
              <div className="space-y-3">
                {tasks.slice(0, 5).map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-gray-900 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-1 bg-gray-50 border border-gray-300 rounded-full text-xs font-semibold text-gray-700 capitalize">
                          {task.type}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          task.status === "completed"
                            ? "bg-green-100 text-green-900 border border-green-900"
                            : task.status === "failed"
                            ? "bg-red-100 text-red-900 border border-red-900"
                            : "bg-yellow-100 text-yellow-900 border border-yellow-900"
                        }`}>
                          {task.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {new Date(task.createdAt).toLocaleString()}
                      </p>
                    </div>
                    {task.output && (
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">
                          {task.output.products?.length || task.output.totalResults || 0} results
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
