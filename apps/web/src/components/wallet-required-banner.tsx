"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ConnectWalletButton } from "./connect-wallet-button";
import { Wallet, AlertCircle } from "lucide-react";

export function WalletRequiredBanner() {
  const { connected } = useWallet();

  if (connected) return null;

  return (
    <Alert className="mb-6 border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
      <AlertCircle className="h-4 w-4 text-yellow-600" />
      <AlertTitle className="text-yellow-900 dark:text-yellow-100">
        Connect your wallet to get started
      </AlertTitle>
      <AlertDescription className="text-yellow-800 dark:text-yellow-200 mt-2">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <span>
            You need a Solana wallet to create agents, shop, and use the marketplace.
          </span>
          <ConnectWalletButton />
        </div>
      </AlertDescription>
    </Alert>
  );
}

