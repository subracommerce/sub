"use client";

import dynamic from "next/dynamic";

const WalletGateInner = dynamic(
  () => import("./wallet-gate-inner").then((mod) => mod.WalletGateInner),
  { ssr: false }
);

export function WalletGate({ children }: { children: React.ReactNode }) {
  return <WalletGateInner>{children}</WalletGateInner>;
}

