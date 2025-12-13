import { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { signJWT } from "@subra/utils";
import { PublicKey } from "@solana/web3.js";
import bs58 from "bs58";
import nacl from "tweetnacl";

const walletAuthSchema = z.object({
  publicKey: z.string(),
  signature: z.string(),
  message: z.string(),
});

export const walletAuthRoutes: FastifyPluginAsync = async (fastify) => {
  // Wallet-based authentication
  fastify.post("/auth/wallet", async (request, reply) => {
    try {
      const { publicKey, signature, message } = walletAuthSchema.parse(
        request.body
      );

      // Verify signature
      const publicKeyBytes = new PublicKey(publicKey).toBytes();
      const signatureBytes = bs58.decode(signature);
      const messageBytes = bs58.decode(message);

      const isValid = nacl.sign.detached.verify(
        messageBytes,
        signatureBytes,
        publicKeyBytes
      );

      if (!isValid) {
        return reply.status(401).send({
          success: false,
          error: "Invalid signature",
        });
      }

      // Find or create user by wallet address
      let user = await prisma.user.findUnique({
        where: { walletAddress: publicKey },
      });

      if (!user) {
        user = await prisma.user.create({
          data: {
            email: `${publicKey.slice(0, 8)}@wallet.subra`,
            walletAddress: publicKey,
            passwordHash: null, // No password for wallet auth
          },
        });
      }

      const token = signJWT(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET!
      );

      return reply.send({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            walletAddress: user.walletAddress,
            hasWallet: true,
          },
          token,
        },
      });
    } catch (error) {
      fastify.log.error(error);
      return reply.status(400).send({
        success: false,
        error: "Invalid request",
      });
    }
  });
};

