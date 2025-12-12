import { FastifyPluginAsync } from "fastify";
import { Keypair } from "@solana/web3.js";
import { prisma } from "../lib/prisma";
import { signJWT, hashPassword } from "@subra/utils";
import bs58 from "bs58";
import crypto from "crypto";

export const createWalletRoutes: FastifyPluginAsync = async (fastify) => {
  // Create embedded Solana wallet for web2 users
  fastify.post("/auth/create-wallet", async (request, reply) => {
    try {
      // Generate new Solana keypair
      const keypair = Keypair.generate();
      const publicKey = keypair.publicKey.toBase58();
      const secretKey = bs58.encode(keypair.secretKey);

      // Generate random password (user won't need it, but DB requires it)
      const randomPassword = crypto.randomBytes(32).toString('hex');
      const hashedPassword = await hashPassword(randomPassword);

      // Create user with embedded wallet
      const user = await prisma.user.create({
        data: {
          email: `${publicKey.slice(0, 8)}@wallet.subra`,
          walletAddress: publicKey,
          password: hashedPassword,
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

