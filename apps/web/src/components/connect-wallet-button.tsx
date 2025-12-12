"use client";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export function ConnectWalletButton() {
  return (
    <WalletMultiButton className="!bg-primary hover:!bg-primary/90 !text-primary-foreground !rounded-lg !transition-all hover:!scale-105" />
  );
}
