import { FastifyPluginAsync } from "fastify";
import { Keypair } from "@solana/web3.js";
import { prisma } from "../lib/prisma";
import { signJWT } from "@subra/utils";
import bs58 from "bs58";

export const createWalletRoutes: FastifyPluginAsync = async (fastify) => {
  // Create embedded Solana wallet for web2 users
  fastify.post("/auth/create-wallet", async (request, reply) => {
    try {
      // Generate new Solana keypair
      const keypair = Keypair.generate();
      const publicKey = keypair.publicKey.toBase58();
      const secretKey = bs58.encode(keypair.secretKey);

      // Create user with embedded wallet
      const user = await prisma.user.create({
        data: {
          email: `${publicKey.slice(0, 8)}@wallet.subra`,
          walletAddress: publicKey,
          password: "", // No password for wallet-only accounts
        },
      });

      const token = signJWT({ userId: user.id });

      // Return user, token, and wallet details
      // WARNING: In production, encrypt the secret key and store securely!
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
            publicKey,
            secretKey, // User must save this!
            mnemonic: null, // TODO: Generate mnemonic phrase
          },
        },
      });
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({
        success: false,
        error: "Failed to create wallet",
      });
    }
  });
};

