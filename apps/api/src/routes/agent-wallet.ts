import { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { agentWalletService } from "../services/agent-wallet";
import { authenticate } from "../middleware/auth";

const createWalletSchema = z.object({
  agentId: z.string().uuid(),
});

const fundWalletSchema = z.object({
  agentId: z.string().uuid(),
  amountSOL: z.number().positive(),
  fromPrivateKey: z.string(), // User's wallet private key (temporary - will use better method later)
});

export const agentWalletRoutes: FastifyPluginAsync = async (fastify) => {
  // Create wallet for agent
  fastify.post(
    "/agent/wallet/create",
    { onRequest: [authenticate] },
    async (request, reply) => {
      try {
        const { agentId } = createWalletSchema.parse(request.body);

        // Verify agent belongs to user
        const agent = await prisma.agent.findFirst({
          where: {
            id: agentId,
            userId: request.userId,
          },
        });

        if (!agent) {
          return reply.status(404).send({
            success: false,
            error: "Agent not found",
          });
        }

        const wallet = await agentWalletService.createAgentWallet(agentId);

        return reply.send({
          success: true,
          data: {
            publicKey: wallet.walletAddress,
            balance: wallet.balance,
            message: "Agent wallet created successfully",
          },
        });
      } catch (error: any) {
        fastify.log.error(error);
        return reply.status(500).send({
          success: false,
          error: error.message || "Failed to create agent wallet",
        });
      }
    }
  );

  // Get agent wallet balance
  fastify.get(
    "/agent/:agentId/wallet/balance",
    { onRequest: [authenticate] },
    async (request, reply) => {
      try {
        const { agentId } = request.params as { agentId: string };

        // Verify agent belongs to user
        const agent = await prisma.agent.findFirst({
          where: {
            id: agentId,
            userId: request.userId,
          },
        });

        if (!agent) {
          return reply.status(404).send({
            success: false,
            error: "Agent not found",
          });
        }

        const balance = await agentWalletService.getWalletBalance(agentId);

        return reply.send({
          success: true,
          data: {
            agentId,
            walletAddress: agent.walletAddress,
            balance,
          },
        });
      } catch (error: any) {
        fastify.log.error(error);
        return reply.status(500).send({
          success: false,
          error: error.message || "Failed to get wallet balance",
        });
      }
    }
  );

  // Fund agent wallet (temporary implementation)
  fastify.post(
    "/agent/wallet/fund",
    { onRequest: [authenticate] },
    async (request, reply) => {
      try {
        const { agentId, amountSOL, fromPrivateKey } = fundWalletSchema.parse(
          request.body
        );

        // Verify agent belongs to user
        const agent = await prisma.agent.findFirst({
          where: {
            id: agentId,
            userId: request.userId,
          },
        });

        if (!agent) {
          return reply.status(404).send({
            success: false,
            error: "Agent not found",
          });
        }

        const signature = await agentWalletService.fundAgentWallet(
          agentId,
          fromPrivateKey,
          amountSOL
        );

        return reply.send({
          success: true,
          data: {
            signature,
            amountSOL,
            message: `Successfully funded agent wallet with ${amountSOL} SOL`,
          },
        });
      } catch (error: any) {
        fastify.log.error(error);
        return reply.status(500).send({
          success: false,
          error: error.message || "Failed to fund agent wallet",
        });
      }
    }
  );

  // Get agent wallet info
  fastify.get(
    "/agent/:agentId/wallet",
    { onRequest: [authenticate] },
    async (request, reply) => {
      try {
        const { agentId } = request.params as { agentId: string };

        // Verify agent belongs to user
        const agent = await fastify.prisma.agent.findFirst({
          where: {
            id: agentId,
            userId: request.userId,
          },
          select: {
            id: true,
            name: true,
            walletAddress: true,
            walletBalance: true,
          },
        });

        if (!agent) {
          return reply.status(404).send({
            success: false,
            error: "Agent not found",
          });
        }

        if (!agent.walletAddress) {
          return reply.send({
            success: true,
            data: {
              hasWallet: false,
              message: "Agent does not have a wallet yet",
            },
          });
        }

        // Refresh balance from blockchain
        const currentBalance = await agentWalletService.getWalletBalance(
          agentId
        );

        return reply.send({
          success: true,
          data: {
            hasWallet: true,
            agentId: agent.id,
            agentName: agent.name,
            walletAddress: agent.walletAddress,
            balance: currentBalance,
          },
        });
      } catch (error: any) {
        fastify.log.error(error);
        return reply.status(500).send({
          success: false,
          error: error.message || "Failed to get agent wallet info",
        });
      }
    }
  );
};

