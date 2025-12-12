"use client";

import dynamic from "next/dynamic";

// Dynamically import with no SSR to avoid hydration issues
const WalletButtonInner = dynamic(
  () => import("./wallet-button-inner").then((mod) => mod.WalletButtonInner),
  { ssr: false }
);

export function ConnectWalletButton() {
  return <WalletButtonInner />;
}

