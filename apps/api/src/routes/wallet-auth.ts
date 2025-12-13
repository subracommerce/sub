import { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { signJWT } from "@subra/utils";
import { PublicKey } from "@solana/web3.js";
import bs58 from "bs58";
import * as nacl from "tweetnacl";
import crypto from "crypto";

const nonceSchema = z.object({
  walletAddress: z.string().min(32).max(44), // Solana address length
});

const verifySchema = z.object({
  walletAddress: z.string().min(32).max(44),
  signature: z.string(),
  message: z.string(),
  nonce: z.string(),
});

// In-memory nonce storage (use Redis in production)
const nonces = new Map<string, { nonce: string; timestamp: number }>();

// Clean old nonces every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [address, data] of nonces.entries()) {
    if (now - data.timestamp > 5 * 60 * 1000) { // 5 minutes
      nonces.delete(address);
    }
  }
}, 5 * 60 * 1000);

export const walletAuthRoutes: FastifyPluginAsync = async (fastify) => {
  // Generate nonce for wallet authentication
  fastify.post("/auth/wallet/nonce", async (request, reply) => {
    try {
      const { walletAddress } = nonceSchema.parse(request.body);

      // Validate Solana address format
      try {
        new PublicKey(walletAddress);
      } catch {
        return reply.status(400).send({
          success: false,
          error: "Invalid Solana wallet address",
        });
      }

      // Generate cryptographically secure nonce
      const nonce = crypto.randomBytes(32).toString("hex");
      
      // Store nonce with timestamp
      nonces.set(walletAddress, {
        nonce,
        timestamp: Date.now(),
      });

      return reply.send({
        success: true,
        data: { nonce },
      });
    } catch (error: any) {
      fastify.log.error(error);
      
      if (error.name === "ZodError") {
        return reply.status(400).send({
          success: false,
          error: error.errors[0].message,
        });
      }
      
      return reply.status(500).send({
        success: false,
        error: "Failed to generate nonce",
      });
    }
  });

  // Verify wallet signature and authenticate
  fastify.post("/auth/wallet/verify", async (request, reply) => {
    try {
      const { walletAddress, signature, message, nonce } = verifySchema.parse(request.body);

      // Validate Solana address
      let publicKey: PublicKey;
      try {
        publicKey = new PublicKey(walletAddress);
      } catch {
        return reply.status(400).send({
          success: false,
          error: "Invalid Solana wallet address",
        });
      }

      // Verify nonce exists and is recent
      const storedNonce = nonces.get(walletAddress);
      if (!storedNonce) {
        return reply.status(400).send({
          success: false,
          error: "Invalid or expired nonce. Please try again.",
        });
      }

      // Check if nonce matches
      if (storedNonce.nonce !== nonce) {
        return reply.status(400).send({
          success: false,
          error: "Invalid nonce",
        });
      }

      // Check if nonce is not too old (5 minutes)
      if (Date.now() - storedNonce.timestamp > 5 * 60 * 1000) {
        nonces.delete(walletAddress);
        return reply.status(400).send({
          success: false,
          error: "Nonce expired. Please try again.",
        });
      }

      // Verify the signature
      const messageBytes = new TextEncoder().encode(message);
      const signatureBytes = bs58.decode(signature);
      const publicKeyBytes = publicKey.toBytes();

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

      // Delete used nonce (prevent replay attacks)
      nonces.delete(walletAddress);

      // Find or create user
      let user = await prisma.user.findUnique({
        where: { walletAddress },
      });

      if (!user) {
        // Create new user with wallet
        user = await prisma.user.create({
          data: {
            email: `${walletAddress.slice(0, 8)}@wallet.subra`,
            walletAddress,
            passwordHash: null, // Wallet-only users don't have passwords
          },
        });
      }

      // Generate JWT
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
    } catch (error: any) {
      fastify.log.error(error);
      
      if (error.name === "ZodError") {
        return reply.status(400).send({
          success: false,
          error: error.errors[0].message,
        });
      }
      
      return reply.status(500).send({
        success: false,
        error: "Authentication failed",
      });
    }
  });
};
