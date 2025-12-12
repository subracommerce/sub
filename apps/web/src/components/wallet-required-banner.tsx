"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

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
          <Link href="/auth/wallet">
            <Button variant="default" className="transition-all hover:scale-105">
              Connect Wallet
            </Button>
          </Link>
        </div>
      </AlertDescription>
    </Alert>
  );
}
