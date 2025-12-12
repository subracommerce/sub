"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Alert, AlertDescription } from "./ui/alert";
import { ShieldCheck, Lock, Eye, EyeOff } from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { useToast } from "@/hooks/use-toast";

interface CreateWalletModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateWalletModal({ open, onOpenChange }: CreateWalletModalProps) {
  const [step, setStep] = useState<"password" | "creating" | "success">("password");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [publicKey, setPublicKey] = useState("");
  const { setAuth } = useAuthStore();
  const router = useRouter();
  const { toast } = useToast();

  const handleCreateWallet = async () => {
    if (password.length < 8) {
      toast({
        title: "Password too short",
        description: "Use at least 8 characters",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        variant: "destructive",
      });
      return;
    }

    setStep("creating");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/create-wallet`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (data.success) {
        setPublicKey(data.data.user.walletAddress);
        setAuth(data.data.user, data.data.token);
        setStep("success");
        
        toast({
          title: "Wallet Created!",
        });
      } else {
        setStep("password");
        toast({
          title: "Error",
          description: data.error || "Failed to create wallet",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      setStep("password");
      toast({
        title: "Error",
        description: "Failed to connect. Make sure API is running.",
        variant: "destructive",
      });
    }
  };

  const handleContinue = () => {
    onOpenChange(false);
    router.push("/dashboard");
  };

  const handleClose = () => {
    setPassword("");
    setConfirmPassword("");
    setStep("password");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md border-2 bg-white">
        {step === "password" && (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                  <Lock className="h-4 w-4 text-white" />
                </div>
                Create Wallet
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Min. 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-10 border-2"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-900 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="border-2"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1 border-2"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateWallet}
                  className="flex-1 bg-black hover:bg-gray-900 text-white"
                  size="lg"
                  disabled={!password || !confirmPassword}
                >
                  Create
                </Button>
              </div>
            </div>
          </>
        )}

        {step === "creating" && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-black"></div>
            </div>
            <p className="text-lg font-medium mt-6 text-gray-900">Creating wallet...</p>
          </div>
        )}

        {step === "success" && (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center">
                  <ShieldCheck className="h-4 w-4 text-white" />
                </div>
                Wallet Ready
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <Alert className="border-2 border-green-500 bg-green-50">
                <ShieldCheck className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-sm text-green-900">
                  Your Solana wallet is secured and ready
                </AlertDescription>
              </Alert>

              <div>
                <label className="text-xs font-medium text-gray-600">Wallet Address</label>
                <div className="mt-1 p-3 bg-gray-50 rounded-lg font-mono text-xs break-all border-2">
                  {publicKey}
                </div>
              </div>

              <Button
                onClick={handleContinue}
                className="w-full bg-black hover:bg-gray-900 text-white"
                size="lg"
              >
                Continue
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
