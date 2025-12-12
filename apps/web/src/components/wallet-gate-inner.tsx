"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { ConnectWalletButton } from "./connect-wallet-button";

export function WalletGateInner({ children }: { children: React.ReactNode }) {
  const { connected } = useWallet();

  if (!connected) {
    return (
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
    );
  }

  return <>{children}</>;
}

