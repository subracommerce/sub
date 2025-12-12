import { FastifyRequest, FastifyReply } from "fastify";
import { verifyJWT, extractBearerToken } from "@subra/utils";
import { prisma } from "../lib/prisma";

declare module "fastify" {
  interface FastifyRequest {
    userId?: string;
    user?: {
      id: string;
      email: string;
      walletAddress: string | null;
    };
  }
}

/**
 * Middleware to authenticate requests using JWT
 */
export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  try {
    const token = extractBearerToken(request.headers.authorization);

    if (!token) {
      return reply.code(401).send({
        success: false,
        error: "Authentication required",
      });
    }

    const payload = verifyJWT(token, process.env.JWT_SECRET!);

    // Verify user exists and is active
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        walletAddress: true,
        isActive: true,
      },
    });

    if (!user || !user.isActive) {
      return reply.code(401).send({
        success: false,
        error: "Invalid or expired token",
      });
    }

    request.userId = user.id;
    request.user = user;
  } catch (error) {
    return reply.code(401).send({
      success: false,
      error: "Invalid or expired token",
    });
  }
}

/**
 * Middleware to authenticate API key requests
 */
export async function authenticateApiKey(request: FastifyRequest, reply: FastifyReply) {
  try {
    const apiKey = request.headers["x-api-key"] as string;

    if (!apiKey) {
      return reply.code(401).send({
        success: false,
        error: "API key required",
      });
    }

    // Hash the provided API key
    const { hashApiKey } = await import("@subra/utils");
    const hashedKey = hashApiKey(apiKey);

    // Find user by API key hash
    const user = await prisma.user.findFirst({
      where: {
        apiKeyHash: hashedKey,
        isActive: true,
      },
      select: {
        id: true,
        email: true,
        walletAddress: true,
      },
    });

    if (!user) {
      return reply.code(401).send({
        success: false,
        error: "Invalid API key",
      });
    }

    request.userId = user.id;
    request.user = user;
  } catch (error) {
    return reply.code(401).send({
      success: false,
      error: "Invalid API key",
    });
  }
}

