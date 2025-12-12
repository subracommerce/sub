"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Alert, AlertDescription } from "./ui/alert";
import { ShieldCheck, Lock, Eye, EyeOff, AlertTriangle } from "lucide-react";
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
    // Validate passwords
    if (password.length < 8) {
      toast({
        title: "Password too short",
        description: "Password must be at least 8 characters",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure both passwords match",
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
          title: "Wallet Created! 🎉",
          description: "Your Solana wallet is ready",
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
        description: error.message || "Failed to create wallet",
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
      <DialogContent className="max-w-lg">
        {step === "password" && (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl flex items-center gap-2">
                <Lock className="h-6 w-6 text-primary" />
                Create Your Wallet
              </DialogTitle>
              <DialogDescription>
                Set a secure password to protect your wallet
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              <Alert className="border-blue-500 bg-blue-50 dark:bg-blue-950">
                <ShieldCheck className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800 dark:text-blue-200">
                  <p className="font-semibold mb-2">🔐 How it works:</p>
                  <ul className="text-sm space-y-1 list-disc list-inside">
                    <li>Your wallet will be encrypted with this password</li>
                    <li>We securely store your encrypted wallet</li>
                    <li>You can access it anytime with your password</li>
                    <li>No need to copy seed phrases!</li>
                  </ul>
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Create Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="At least 8 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Use a strong password you'll remember
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>

              <Alert className="border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-800 dark:text-yellow-200">
                  <p className="font-semibold text-sm">Important:</p>
                  <p className="text-xs mt-1">
                    Keep your password safe. If you forget it, we cannot recover your wallet for you.
                  </p>
                </AlertDescription>
              </Alert>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateWallet}
                  className="flex-1"
                  size="lg"
                  disabled={!password || !confirmPassword}
                >
                  Create Wallet
                </Button>
              </div>
            </div>
          </>
        )}

        {step === "creating" && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mb-4"></div>
            <p className="text-lg font-medium">Creating your secure wallet...</p>
            <p className="text-sm text-muted-foreground mt-2">This will only take a moment</p>
          </div>
        )}

        {step === "success" && (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl flex items-center gap-2">
                <ShieldCheck className="h-6 w-6 text-green-500" />
                Wallet Created Successfully!
              </DialogTitle>
              <DialogDescription>
                Your Solana wallet is ready to use
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
                <ShieldCheck className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800 dark:text-green-200">
                  <p className="font-semibold mb-2">✅ Wallet Secured</p>
                  <ul className="text-sm space-y-1 list-disc list-inside">
                    <li>Your wallet is encrypted with your password</li>
                    <li>Backed up securely on our servers</li>
                    <li>Access it anytime with your password</li>
                    <li>Ready to receive and send SOL & tokens</li>
                  </ul>
                </AlertDescription>
              </Alert>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Your Wallet Address:</label>
                <div className="mt-2 p-4 bg-muted rounded-lg font-mono text-sm break-all border-2 border-green-500">
                  {publicKey}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Share this address to receive SOL and SPL tokens
                </p>
              </div>

              <Button
                onClick={handleContinue}
                className="w-full"
                size="lg"
              >
                Go to Dashboard
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
