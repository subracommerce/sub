import { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { authenticate } from "../middleware/auth";
import { AgentType } from "@prisma/client";

const createAgentSchema = z.object({
  name: z.string().min(1).max(100),
  type: z.enum(["explorer", "negotiator", "executor", "tracker"]),
  description: z.string().max(500).optional(),
});

const updateAgentSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  isActive: z.boolean().optional(),
});

export const agentRoutes: FastifyPluginAsync = async (fastify) => {
  // Apply authentication to all routes
  fastify.addHook("preHandler", authenticate);

  /**
   * Create a new agent
   */
  fastify.post("/", async (request, reply) => {
    try {
      const body = createAgentSchema.parse(request.body);

      const agent = await prisma.agent.create({
        data: {
          userId: request.userId!,
          name: body.name,
          type: body.type as AgentType,
          description: body.description,
          // TODO: Generate wallet for agent (MPC or delegated EOA)
          // walletAddress: await generateAgentWallet(),
        },
        select: {
          id: true,
          name: true,
          type: true,
          description: true,
          walletAddress: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return reply.code(201).send({
        success: true,
        data: agent,
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
   * Get all agents for current user
   */
  fastify.get("/", async (request, reply) => {
    const agents = await prisma.agent.findMany({
      where: { userId: request.userId! },
      select: {
        id: true,
        name: true,
        type: true,
        description: true,
        walletAddress: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            tasks: true,
            transactions: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return reply.send({
      success: true,
      data: agents,
    });
  });

  /**
   * Get a specific agent
   */
  fastify.get("/:agentId", async (request, reply) => {
    const { agentId } = request.params as { agentId: string };

    const agent = await prisma.agent.findFirst({
      where: {
        id: agentId,
        userId: request.userId!,
      },
      select: {
        id: true,
        name: true,
        type: true,
        description: true,
        walletAddress: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            tasks: true,
            transactions: true,
          },
        },
      },
    });

    if (!agent) {
      return reply.code(404).send({
        success: false,
        error: "Agent not found",
      });
    }

    return reply.send({
      success: true,
      data: agent,
    });
  });

  /**
   * Update an agent
   */
  fastify.patch("/:agentId", async (request, reply) => {
    try {
      const { agentId } = request.params as { agentId: string };
      const body = updateAgentSchema.parse(request.body);

      // Verify ownership
      const existing = await prisma.agent.findFirst({
        where: {
          id: agentId,
          userId: request.userId!,
        },
      });

      if (!existing) {
        return reply.code(404).send({
          success: false,
          error: "Agent not found",
        });
      }

      const agent = await prisma.agent.update({
        where: { id: agentId },
        data: body,
        select: {
          id: true,
          name: true,
          type: true,
          description: true,
          isActive: true,
          updatedAt: true,
        },
      });

      return reply.send({
        success: true,
        data: agent,
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
   * Delete an agent
   */
  fastify.delete("/:agentId", async (request, reply) => {
    const { agentId } = request.params as { agentId: string };

    // Verify ownership
    const existing = await prisma.agent.findFirst({
      where: {
        id: agentId,
        userId: request.userId!,
      },
    });

    if (!existing) {
      return reply.code(404).send({
        success: false,
        error: "Agent not found",
      });
    }

    await prisma.agent.delete({
      where: { id: agentId },
    });

    return reply.send({
      success: true,
      message: "Agent deleted successfully",
    });
  });
};

