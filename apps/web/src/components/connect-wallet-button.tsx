"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { Button } from "./ui/button";
import { Wallet } from "lucide-react";

export function ConnectWalletButton() {
  const { publicKey, disconnect, connected } = useWallet();
  const { setVisible } = useWalletModal();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent any form submission or page refresh
    e.stopPropagation(); // Stop event bubbling
    
    if (connected && publicKey) {
      disconnect();
    } else {
      setVisible(true);
    }
  };

  return (
    <Button
      onClick={handleClick}
      type="button" // Explicitly set type to button
      className="!bg-primary hover:!bg-primary/90"
      size="lg"
    >
      <Wallet className="mr-2 h-4 w-4" />
      {connected && publicKey ? (
        `${publicKey.toBase58().slice(0, 4)}...${publicKey.toBase58().slice(-4)}`
      ) : (
        "Connect Wallet"
      )}
    </Button>
  );
}
