import { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { Keypair } from "@solana/web3.js";
import { prisma } from "../lib/prisma";
import { signJWT, hashPassword } from "@subra/utils";
import bs58 from "bs58";
import * as bip39 from "bip39";
import { derivePath } from "ed25519-hd-key";
import CryptoJS from "crypto-js";
import { authenticate } from "../middleware/auth";

const createWalletSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const createWalletRoutes: FastifyPluginAsync = async (fastify) => {
  // Create password-protected Solana wallet
  fastify.post("/auth/create-wallet", async (request, reply) => {
    try {
      const { password } = createWalletSchema.parse(request.body);

      // Generate proper BIP39 mnemonic (12 words)
      const mnemonic = bip39.generateMnemonic(128);
      const seed = await bip39.mnemonicToSeed(mnemonic);
      
      // Derive Solana keypair from seed
      const path = "m/44'/501'/0'/0'";
      const derivedSeed = derivePath(path, seed.toString("hex")).key;
      const keypair = Keypair.fromSeed(derivedSeed);
      
      const publicKey = keypair.publicKey.toBase58();
      const secretKey = bs58.encode(keypair.secretKey);

      // Encrypt the secret key with user's password
      const encryptedSecretKey = CryptoJS.AES.encrypt(secretKey, password).toString();
      
      // Also encrypt the mnemonic for backup recovery
      const encryptedMnemonic = CryptoJS.AES.encrypt(mnemonic, password).toString();

      // Hash the password for authentication
      const hashedPassword = await hashPassword(password);

      // Create user with encrypted wallet
      const user = await prisma.user.create({
        data: {
          email: `${publicKey.slice(0, 8)}@wallet.subra`,
          walletAddress: publicKey,
          passwordHash: hashedPassword,
          // Store encrypted keys (we'll add these fields to schema)
        },
      });

      // Store encrypted wallet separately (more secure)
      // In production, consider using AWS KMS or similar
      await prisma.$executeRaw`
        UPDATE users 
        SET 
          api_key = ${encryptedSecretKey},
          api_key_hash = ${encryptedMnemonic}
        WHERE id = ${user.id}
      `;

      const token = signJWT(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET!
      );

      // Return success - DO NOT send unencrypted keys to frontend
      return reply.send({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            walletAddress: user.walletAddress,
          },
          token,
          message: "Wallet created and secured with your password"
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
        error: error.message || "Failed to create wallet",
      });
    }
  });

  // Endpoint to decrypt and access wallet (for transactions)
  fastify.post("/wallet/decrypt", {
    onRequest: [authenticate]
  }, async (request, reply) => {
    try {
      const { password } = z.object({
        password: z.string()
      }).parse(request.body);

      const userId = (request.user as any).userId;
      
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          apiKey: true, // encrypted secret key
          apiKeyHash: true, // encrypted mnemonic
          passwordHash: true,
        }
      });

      if (!user || !user.apiKey) {
        return reply.status(404).send({
          success: false,
          error: "Wallet not found"
        });
      }

      // Verify password first
      const bcrypt = await import("bcryptjs");
      const isValid = await bcrypt.compare(password, user.passwordHash!);
      
      if (!isValid) {
        return reply.status(401).send({
          success: false,
          error: "Invalid password"
        });
      }

      // Decrypt secret key
      const secretKeyBytes = CryptoJS.AES.decrypt(user.apiKey, password);
      const secretKey = secretKeyBytes.toString(CryptoJS.enc.Utf8);

      if (!secretKey) {
        return reply.status(400).send({
          success: false,
          error: "Failed to decrypt wallet. Incorrect password?"
        });
      }

      return reply.send({
        success: true,
        data: {
          secretKey, // Only send when explicitly requested with valid password
        }
      });
    } catch (error: any) {
      fastify.log.error(error);
      return reply.status(500).send({
        success: false,
        error: "Failed to decrypt wallet"
      });
    }
  });
};
