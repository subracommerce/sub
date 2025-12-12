"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuthStore } from "@/store/auth";
import { useToast } from "@/hooks/use-toast";
import { WalletGate } from "./wallet-gate";

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
  const { token } = useAuthStore();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New AI Agent</DialogTitle>
          <DialogDescription>
            Choose an agent type and give it a name to get started
          </DialogDescription>
        </DialogHeader>

        {/* Wallet Required Check */}
        {!connected && (
          <Alert className="border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800 dark:text-yellow-200">
              <div className="space-y-3">
                <p className="font-medium">Wallet required to create agents</p>
                <p className="text-sm">
                  Agents need a Solana wallet to execute transactions on your behalf.
                </p>
                <ConnectWalletButton />
              </div>
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
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Agent Type</Label>
            <Select value={type} onValueChange={setType}>
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
            />
          </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? "Creating..." : "Create Agent"}
              </Button>
            </div>
          </form>
        </WalletGate>
      </DialogContent>
    </Dialog>
  );
}

