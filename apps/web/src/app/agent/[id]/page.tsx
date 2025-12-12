"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/store/auth";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Bot, Activity, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";

export default function AgentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, token } = useAuthStore();
  const { toast } = useToast();
  const [agent, setAgent] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }
    loadAgentDetails();
  }, [isAuthenticated, params.id]);

  const loadAgentDetails = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/agent/${params.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      if (data.success) {
        setAgent(data.data);
        // Load tasks for this agent
        // TODO: Add tasks endpoint
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load agent details",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">
          <Bot className="w-12 h-12 animate-spin" />
        </div>
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle>Agent Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard">
              <Button>Back to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Link href="/dashboard">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Agent Info */}
          <div className="md:col-span-1">
            <Card className="agent-card">
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <Bot className="w-12 h-12 text-primary" />
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      agent.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {agent.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <CardTitle className="text-2xl">{agent.name}</CardTitle>
                <CardDescription className="capitalize">
                  {agent.type} Agent
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Description</p>
                  <p className="text-sm">{agent.description || "No description"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Created</p>
                  <p className="text-sm">
                    {new Date(agent.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <Button
                  className="w-full"
                  onClick={() => router.push(`/agent/${params.id}/chat`)}
                >
                  Start Chat
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Activity & Stats */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="w-5 h-5 mr-2" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                {tasks.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Bot className="w-16 h-16 mx-auto mb-4 opacity-20" />
                    <p>No activity yet</p>
                    <p className="text-sm mt-2">
                      Start a chat to see your agent in action
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {tasks.map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          {task.status === "completed" ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-600" />
                          )}
                          <div>
                            <p className="font-medium">{task.type}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(task.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs ${
                            task.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : task.status === "failed"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {task.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

