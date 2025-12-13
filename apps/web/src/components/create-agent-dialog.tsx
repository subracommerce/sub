"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuthStore } from "@/store/auth";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CreateAgentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const agentTypes = [
  { value: "explorer", label: "Explorer", description: "Search and discover products" },
  { value: "negotiator", label: "Negotiator", description: "Compare prices and negotiate" },
  { value: "executor", label: "Executor", description: "Execute purchases autonomously" },
  { value: "tracker", label: "Tracker", description: "Track orders and shipments" },
];

export function CreateAgentDialog({ open, onOpenChange, onSuccess }: CreateAgentDialogProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState("explorer");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { token, user } = useAuthStore();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if user has a wallet
    if (!user?.hasWallet) {
      toast({
        title: "Wallet Required",
        description: "Please create a wallet first to deploy agents",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/agent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, type, description }),
      });

      const data = await response.json();

      if (data.success) {
        setName("");
        setType("explorer");
        setDescription("");
        toast({
          title: "Agent Created!",
          description: `${name} is ready to start working`,
        });
        onSuccess();
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to create agent",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to connect to server",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">Create New AI Agent</DialogTitle>
          <DialogDescription>
            Choose an agent type and give it a name to get started
          </DialogDescription>
        </DialogHeader>

        {!user?.hasWallet && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You need to create a wallet first to deploy AI agents
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Agent Name</Label>
            <Input
              id="name"
              placeholder="My Shopping Assistant"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={!user?.hasWallet}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Agent Type</Label>
            <Select value={type} onValueChange={setType} disabled={!user?.hasWallet}>
              <SelectTrigger>
                <SelectValue placeholder="Select agent type" />
              </SelectTrigger>
              <SelectContent>
                {agentTypes.map((agentType) => (
                  <SelectItem key={agentType.value} value={agentType.value}>
                    <div>
                      <div className="font-medium">{agentType.label}</div>
                      <div className="text-xs text-muted-foreground">
                        {agentType.description}
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Input
              id="description"
              placeholder="Describe what this agent will do..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={!user?.hasWallet}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 border-2"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading || !user?.hasWallet} 
              className="flex-1 bg-gray-900 hover:bg-black"
            >
              {isLoading ? "Creating..." : "Create Agent"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
