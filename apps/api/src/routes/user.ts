import { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { authenticate } from "../middleware/auth";
import { generateApiKey, hashApiKey } from "@subra/utils";

const updateUserSchema = z.object({
  walletAddress: z.string().optional(),
});

export const userRoutes: FastifyPluginAsync = async (fastify) => {
  // Apply authentication to all routes
  fastify.addHook("preHandler", authenticate);

  /**
   * Get current user
   */
  fastify.get("/me", async (request, reply) => {
    const user = await prisma.user.findUnique({
      where: { id: request.userId! },
      select: {
        id: true,
        email: true,
        walletAddress: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            agents: true,
            tasks: true,
            transactions: true,
          },
        },
      },
    });

    return reply.send({
      success: true,
      data: user,
    });
  });

  /**
   * Update current user
   */
  fastify.patch("/me", async (request, reply) => {
    try {
      const body = updateUserSchema.parse(request.body);

      const user = await prisma.user.update({
        where: { id: request.userId! },
        data: body,
        select: {
          id: true,
          email: true,
          walletAddress: true,
          updatedAt: true,
        },
      });

      return reply.send({
        success: true,
        data: user,
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
   * Generate API key
   */
  fastify.post("/api-key", async (request, reply) => {
    const apiKey = generateApiKey();
    const apiKeyHash = hashApiKey(apiKey);

    await prisma.user.update({
      where: { id: request.userId! },
      data: {
        apiKey,
        apiKeyHash,
      },
    });

    return reply.send({
      success: true,
      data: {
        apiKey,
        message: "Save this API key securely. It won't be shown again.",
      },
    });
  });

  /**
   * Revoke API key
   */
  fastify.delete("/api-key", async (request, reply) => {
    await prisma.user.update({
      where: { id: request.userId! },
      data: {
        apiKey: null,
        apiKeyHash: null,
      },
    });

    return reply.send({
      success: true,
      message: "API key revoked",
    });
  });
};

