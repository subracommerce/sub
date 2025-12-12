import { SignerWalletAdapterProps } from "@solana/wallet-adapter-base";
import bs58 from "bs58";

/**
 * Generate a secure authentication message following best practices
 */
export function createAuthMessage(publicKey: string, nonce: string): string {
  return `Sign in to SUBRA

This request will not trigger a blockchain transaction or cost any gas fees.

Wallet: ${publicKey}
Nonce: ${nonce}

By signing, you agree to our Terms of Service and Privacy Policy.`;
}

/**
 * Sign authentication message with wallet
 */
export async function signAuthMessage(
  signMessage: SignerWalletAdapterProps["signMessage"],
  message: string
): Promise<{ signature: string; message: string }> {
  if (!signMessage) {
    throw new Error("Wallet does not support message signing");
  }

  const messageBytes = new TextEncoder().encode(message);
  const signatureBytes = await signMessage(messageBytes);

  return {
    signature: bs58.encode(signatureBytes),
    message: bs58.encode(messageBytes),
  };
}

/**
 * Verify authentication with backend
 */
export async function verifyWalletAuth(
  publicKey: string,
  signature: string,
  message: string
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/wallet`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        publicKey,
        signature,
        message,
      }),
    });

    return await response.json();
  } catch (error) {
    return {
      success: false,
      error: "Network error. Please try again.",
    };
  }
}

/**
 * Generate secure random nonce
 */
export function generateNonce(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
}

