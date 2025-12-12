"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { Button } from "./ui/button";
import { Wallet } from "lucide-react";
import { useEffect } from "react";

export function ConnectWalletButton() {
  const { publicKey, disconnect, connected } = useWallet();
  const { setVisible } = useWalletModal();

  // Clear any false connections
  useEffect(() => {
    if (connected && !publicKey) {
      console.log("Clearing false connection...");
      disconnect();
    }
  }, [connected, publicKey, disconnect]);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (connected && publicKey) {
      disconnect();
    } else {
      console.log("Opening wallet modal...");
      setVisible(true);
    }
  };

  return (
    <Button
      onClick={handleClick}
      type="button"
      className="bg-gray-900 hover:bg-black text-white border-2 border-gray-900"
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
