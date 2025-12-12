import { FastifyPluginAsync } from "fastify";
import { Keypair } from "@solana/web3.js";
import { prisma } from "../lib/prisma";
import { signJWT } from "@subra/utils";
import bs58 from "bs58";
import * as bip39 from "bip39";
import { derivePath } from "ed25519-hd-key";

export const createWalletRoutes: FastifyPluginAsync = async (fastify) => {
  // Create Solana wallet with proper BIP39 seed phrase
  fastify.post("/auth/create-wallet", async (request, reply) => {
    try {
      // Generate proper BIP39 mnemonic (12 words)
      const mnemonic = bip39.generateMnemonic(128); // 128 bits = 12 words
      const seed = await bip39.mnemonicToSeed(mnemonic);
      
      // Derive Solana keypair from seed using standard derivation path
      const path = "m/44'/501'/0'/0'"; // Solana's BIP44 path
      const derivedSeed = derivePath(path, seed.toString("hex")).key;
      const keypair = Keypair.fromSeed(derivedSeed);
      
      const publicKey = keypair.publicKey.toBase58();
      const secretKey = bs58.encode(keypair.secretKey);

      // Create user with embedded wallet
      const user = await prisma.user.create({
        data: {
          email: `${publicKey.slice(0, 8)}@wallet.subra`,
          walletAddress: publicKey,
          passwordHash: null, // No password for wallet-only accounts
        },
      });

      const token = signJWT(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET!
      );

      // Return mnemonic, public key, and secret key
      return reply.send({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            walletAddress: user.walletAddress,
          },
          token,
          wallet: {
            mnemonic, // 12-word seed phrase
            publicKey,
            secretKey, // For advanced users
          },
        },
      });
    } catch (error: any) {
      fastify.log.error(error);
      return reply.status(500).send({
        success: false,
        error: error.message || "Failed to create wallet",
      });
    }
  });
};
