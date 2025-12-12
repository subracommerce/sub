"use client";

import dynamic from "next/dynamic";

const WalletRequiredBannerInner = dynamic(
  () => import("./wallet-required-banner-inner").then((mod) => mod.WalletRequiredBannerInner),
  { ssr: false }
);

export function WalletRequiredBanner() {
  return <WalletRequiredBannerInner />;
}

