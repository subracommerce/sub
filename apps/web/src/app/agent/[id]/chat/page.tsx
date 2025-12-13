"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/store/auth";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Bot, Send, User, Sparkles, TrendingUp } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "agent";
  content: string;
  timestamp: Date;
  xpGained?: number;
}

export default function AgentChatPage() {
  const params = useParams();
  const router = useRouter();
  const { token } = useAuthStore();
  const { toast } = useToast();
  
  const [agent, setAgent] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadAgent();
  }, [params.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadAgent = async () => {
    try {
      const response = await fetch(`http://localhost:4000/agent/${params.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!response.ok) throw new Error("Failed to load agent");
      
      const data = await response.json();
      if (data.success) {
        setAgent(data.data);
        // Add welcome message
        setMessages([
          {
            id: "welcome",
            role: "agent",
            content: `Hello! I'm ${data.data.name}, your ${data.data.type} agent. How can I help you today?`,
            timestamp: new Date(),
          },
        ]);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load agent",
        variant: "destructive",
      });
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const userInput = input;
    setInput("");
    setIsLoading(true);

    try {
      // Determine task type based on input
      let taskType = "search";
      let taskInput: any = {};

      if (userInput.toLowerCase().includes("compare") || userInput.toLowerCase().includes("best price")) {
        taskType = "compare";
        // Extract product name (simple parsing)
        const productMatch = userInput.match(/compare (.+)|best price for (.+)|find cheapest (.+)/i);
        taskInput = {
          productName: productMatch ? (productMatch[1] || productMatch[2] || productMatch[3]) : userInput,
          marketplaces: ["amazon", "ebay"],
        };
      } else {
        // Default to search
        taskInput = {
          query: userInput,
          marketplaces: ["amazon", "ebay"],
        };
      }

      // Create task
      const response = await fetch(`http://localhost:4000/agent/task`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          agentId: params.id,
          type: taskType,
          input: taskInput,
        }),
      });

      const data = await response.json();

      if (data.success && data.data.result.success) {
        const result = data.data.result.data;
        const xpGained = data.data.result.experienceGained;

        let responseContent = "";
        
        if (taskType === "search") {
          responseContent = `I found ${result.totalResults} products for "${result.query}"!\n\nTop results:\n`;
          result.products.slice(0, 3).forEach((p: any, i: number) => {
            responseContent += `\n${i + 1}. ${p.name}\n   💰 $${p.price} at ${p.marketplace}\n   ⭐ ${p.rating}/5 (${p.reviews} reviews)`;
          });
        } else if (taskType === "compare") {
          responseContent = `I compared prices for "${result.productName}"!\n\n`;
          responseContent += `🎯 Best Deal: $${result.bestPrice} at ${result.bestMarketplace}\n`;
          responseContent += `💰 You save: $${result.savings.toFixed(2)}\n`;
          responseContent += `📊 Price range: $${result.priceRange.min} - $${result.priceRange.max}`;
        }

        const agentMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "agent",
          content: responseContent,
          timestamp: new Date(),
          xpGained,
        };

        setMessages((prev) => [...prev, agentMessage]);
      } else {
        throw new Error(data.error || "Task failed");
      }
    } catch (error: any) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "agent",
        content: `Sorry, I encountered an error: ${error.message}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!agent) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 sticky top-0 bg-white/80 backdrop-blur-xl z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Button
            onClick={() => router.push(`/agent/${params.id}`)}
            variant="ghost"
            size="sm"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Agent
          </Button>
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-gray-900" />
            <span className="font-semibold text-gray-900">{agent.name}</span>
            <Badge variant="outline" className="capitalize">
              {agent.type}
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="border-gray-900">
            <CardHeader className="border-b border-gray-200">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-6 w-6" />
                  Chat with {agent.name}
                </CardTitle>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Activity className="h-4 w-4" />
                  {messages.length - 1} messages
                </div>
              </div>
            </CardHeader>
            
            {/* Messages */}
            <CardContent className="p-0">
              <div className="h-[500px] overflow-y-auto p-6 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {message.role === "agent" && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center flex-shrink-0">
                        <Bot className="w-5 h-5 text-white" />
                      </div>
                    )}
                    <div
                      className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                        message.role === "user"
                          ? "bg-gray-900 text-white"
                          : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-line">{message.content}</p>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-xs opacity-70">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </p>
                        {message.xpGained && (
                          <Badge variant="outline" className="ml-2 text-xs">
                            <Sparkles className="h-3 w-3 mr-1" />
                            +{message.xpGained} XP
                          </Badge>
                        )}
                      </div>
                    </div>
                    {message.role === "user" && (
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-gray-600" />
                      </div>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center">
                      <Bot className="w-5 h-5 text-white animate-pulse" />
                    </div>
                    <div className="bg-gray-100 rounded-2xl px-4 py-3">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-900 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-900 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-gray-900 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="border-t border-gray-200 p-4">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    sendMessage();
                  }}
                  className="flex gap-2"
                >
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask your agent to search or compare products..."
                    disabled={isLoading}
                    className="flex-1"
                  />
                  <Button 
                    type="submit" 
                    disabled={isLoading || !input.trim()}
                    className="bg-gray-900 hover:bg-black"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
                <p className="text-xs text-gray-500 mt-2">
                  Try: "search for gaming laptops" or "compare iPhone 15 Pro prices"
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
