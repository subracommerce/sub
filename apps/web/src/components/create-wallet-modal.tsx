"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Alert, AlertDescription } from "./ui/alert";
import { Copy, Check, Eye, EyeOff, AlertTriangle, ShieldCheck } from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { useToast } from "@/hooks/use-toast";

interface CreateWalletModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateWalletModal({ open, onOpenChange }: CreateWalletModalProps) {
  const [step, setStep] = useState<"creating" | "show-seed" | "confirm">("creating");
  const [mnemonic, setMnemonic] = useState<string>("");
  const [publicKey, setPublicKey] = useState<string>("");
  const [showSeed, setShowSeed] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [copied, setCopied] = useState(false);
  const { setAuth } = useAuthStore();
  const router = useRouter();
  const { toast } = useToast();

  const handleCreateWallet = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/create-wallet`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      const data = await response.json();

      if (data.success) {
        setMnemonic(data.data.wallet.mnemonic);
        setPublicKey(data.data.wallet.publicKey);
        setAuth(data.data.user, data.data.token);
        setStep("show-seed");
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to create wallet",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create wallet",
        variant: "destructive",
      });
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(mnemonic);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Copied!",
      description: "Seed phrase copied to clipboard",
    });
  };

  const handleContinue = () => {
    if (!confirmed) {
      toast({
        title: "Please confirm",
        description: "You must confirm that you've saved your seed phrase",
        variant: "destructive",
      });
      return;
    }
    onOpenChange(false);
    router.push("/dashboard");
  };

  // Start creating when modal opens
  if (open && step === "creating" && !mnemonic) {
    handleCreateWallet();
  }

  const words = mnemonic.split(" ");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        {step === "creating" && (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mb-4"></div>
            <p className="text-lg font-medium">Creating your Solana wallet...</p>
            <p className="text-sm text-muted-foreground mt-2">This will only take a moment</p>
          </div>
        )}

        {step === "show-seed" && (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl flex items-center gap-2">
                <ShieldCheck className="h-6 w-6 text-green-500" />
                Wallet Created Successfully!
              </DialogTitle>
              <DialogDescription>
                Your 12-word recovery phrase is the ONLY way to recover your wallet
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Warning */}
              <Alert className="border-red-500 bg-red-50 dark:bg-red-950">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800 dark:text-red-200">
                  <p className="font-bold mb-2">⚠️ CRITICAL: Save Your Recovery Phrase</p>
                  <ul className="text-sm space-y-1 list-disc list-inside">
                    <li>Write it down on paper and store it securely</li>
                    <li>Never share it with anyone</li>
                    <li>We cannot recover it if you lose it</li>
                    <li>Anyone with this phrase can access your funds</li>
                  </ul>
                </AlertDescription>
              </Alert>

              {/* Wallet Address */}
              <div>
                <label className="text-sm font-medium text-muted-foreground">Your Wallet Address:</label>
                <div className="mt-2 p-3 bg-muted rounded-lg font-mono text-sm break-all">
                  {publicKey}
                </div>
              </div>

              {/* Recovery Phrase */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Recovery Phrase (12 Words):
                  </label>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowSeed(!showSeed)}
                    >
                      {showSeed ? (
                        <><EyeOff className="h-4 w-4 mr-2" /> Hide</>
                      ) : (
                        <><Eye className="h-4 w-4 mr-2" /> Show</>
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCopy}
                      disabled={!showSeed}
                    >
                      {copied ? (
                        <><Check className="h-4 w-4 mr-2" /> Copied!</>
                      ) : (
                        <><Copy className="h-4 w-4 mr-2" /> Copy</>
                      )}
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 p-4 bg-muted rounded-lg">
                  {words.map((word, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-3 bg-background rounded border"
                    >
                      <span className="text-xs text-muted-foreground font-medium w-6">
                        {index + 1}.
                      </span>
                      <span className={`font-mono font-medium ${showSeed ? "" : "blur-sm select-none"}`}>
                        {word}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Confirmation Checkbox */}
              <div className="flex items-start space-x-3 p-4 border rounded-lg">
                <input
                  type="checkbox"
                  id="confirm"
                  checked={confirmed}
                  onChange={(e) => setConfirmed(e.target.checked)}
                  className="mt-1"
                />
                <label htmlFor="confirm" className="text-sm cursor-pointer">
                  <span className="font-semibold">I have saved my recovery phrase securely.</span>
                  <br />
                  <span className="text-muted-foreground">
                    I understand that if I lose it, I will lose access to my wallet forever.
                  </span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={handleContinue}
                  disabled={!confirmed}
                  className="flex-1"
                  size="lg"
                >
                  Continue to Dashboard
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

