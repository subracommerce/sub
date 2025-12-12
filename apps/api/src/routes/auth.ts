import { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { hashPassword, verifyPassword, signJWT } from "@subra/utils";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  walletAddress: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const walletLoginSchema = z.object({
  walletAddress: z.string(),
  signature: z.string(),
  message: z.string(),
});

export const authRoutes: FastifyPluginAsync = async (fastify) => {
  /**
   * Register with email and password
   */
  fastify.post("/register", async (request, reply) => {
    try {
      const body = registerSchema.parse(request.body);

      // Check if user already exists
      const existing = await prisma.user.findUnique({
        where: { email: body.email },
      });

      if (existing) {
        return reply.code(409).send({
          success: false,
          error: "User already exists",
        });
      }

      // Hash password
      const passwordHash = await hashPassword(body.password);

      // Create user
      const user = await prisma.user.create({
        data: {
          email: body.email,
          passwordHash,
          walletAddress: body.walletAddress,
        },
        select: {
          id: true,
          email: true,
          walletAddress: true,
          createdAt: true,
        },
      });

      // Generate JWT
      const token = signJWT(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET!
      );

      return reply.code(201).send({
        success: true,
        data: {
          user,
          token,
        },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.code(400).send({
          success: false,
          error: "Validation error",
          details: error.errors,
        });
      }
      throw error;
    }
  });

  /**
   * Login with email and password
   */
  fastify.post("/login", async (request, reply) => {
    try {
      const body = loginSchema.parse(request.body);

      // Find user
      const user = await prisma.user.findUnique({
        where: { email: body.email },
      });

      if (!user || !user.passwordHash) {
        return reply.code(401).send({
          success: false,
          error: "Invalid credentials",
        });
      }

      // Verify password
      const valid = await verifyPassword(body.password, user.passwordHash);

      if (!valid) {
        return reply.code(401).send({
          success: false,
          error: "Invalid credentials",
        });
      }

      // Check if user is active
      if (!user.isActive) {
        return reply.code(403).send({
          success: false,
          error: "Account is disabled",
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
          },
          token,
        },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.code(400).send({
          success: false,
          error: "Validation error",
          details: error.errors,
        });
      }
      throw error;
    }
  });

  /**
   * Login with wallet signature
   */
  fastify.post("/wallet-login", async (request, reply) => {
    try {
      const body = walletLoginSchema.parse(request.body);

      // TODO: Verify signature with ethers/web3
      // For now, simplified implementation

      // Find or create user
      let user = await prisma.user.findUnique({
        where: { walletAddress: body.walletAddress },
      });

      if (!user) {
        // Auto-register wallet user
        user = await prisma.user.create({
          data: {
            email: `${body.walletAddress}@wallet.subra`,
            walletAddress: body.walletAddress,
          },
        });
      }

      if (!user.isActive) {
        return reply.code(403).send({
          success: false,
          error: "Account is disabled",
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
          },
          token,
        },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.code(400).send({
          success: false,
          error: "Validation error",
          details: error.errors,
        });
      }
      throw error;
    }
  });
};

