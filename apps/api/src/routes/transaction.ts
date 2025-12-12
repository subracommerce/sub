import { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { authenticate } from "../middleware/auth";
import { enqueueTransaction } from "../lib/queue";
import { TransactionType, TransactionStatus } from "@prisma/client";

const createPaymentSchema = z.object({
  agentId: z.string().uuid().optional(),
  amount: z.number().positive(),
  currency: z.string(),
  fromAddress: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

export const transactionRoutes: FastifyPluginAsync = async (fastify) => {
  // Apply authentication to all routes
  fastify.addHook("preHandler", authenticate);

  /**
   * Get all transactions for current user
   */
  fastify.get("/", async (request, reply) => {
    const transactions = await prisma.transaction.findMany({
      where: { userId: request.userId! },
      select: {
        id: true,
        type: true,
        status: true,
        amount: true,
        currency: true,
        fromAddress: true,
        toAddress: true,
        txHash: true,
        fiatAmount: true,
        fiatCurrency: true,
        metadata: true,
        createdAt: true,
        updatedAt: true,
        agent: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return reply.send({
      success: true,
      data: transactions,
    });
  });

  /**
   * Get a specific transaction
   */
  fastify.get("/:transactionId", async (request, reply) => {
    const { transactionId } = request.params as { transactionId: string };

    const transaction = await prisma.transaction.findFirst({
      where: {
        id: transactionId,
        userId: request.userId!,
      },
      select: {
        id: true,
        type: true,
        status: true,
        amount: true,
        currency: true,
        fromAddress: true,
        toAddress: true,
        txHash: true,
        chainId: true,
        fiatAmount: true,
        fiatCurrency: true,
        metadata: true,
        createdAt: true,
        updatedAt: true,
        agent: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
        zkReceipt: {
          select: {
            id: true,
            verified: true,
            onChainTxHash: true,
            createdAt: true,
          },
        },
      },
    });

    if (!transaction) {
      return reply.code(404).send({
        success: false,
        error: "Transaction not found",
      });
    }

    return reply.send({
      success: true,
      data: transaction,
    });
  });

  /**
   * Initiate a payment transaction
   */
  fastify.post("/payment", async (request, reply) => {
    try {
      const body = createPaymentSchema.parse(request.body);

      // Verify agent if provided
      if (body.agentId) {
        const agent = await prisma.agent.findFirst({
          where: {
            id: body.agentId,
            userId: request.userId!,
          },
        });

        if (!agent) {
          return reply.code(404).send({
            success: false,
            error: "Agent not found",
          });
        }
      }

      // Create transaction
      const transaction = await prisma.transaction.create({
        data: {
          userId: request.userId!,
          agentId: body.agentId,
          type: "purchase" as TransactionType,
          status: "pending" as TransactionStatus,
          amount: body.amount,
          currency: body.currency,
          fromAddress: body.fromAddress,
          metadata: body.metadata,
        },
        select: {
          id: true,
          type: true,
          status: true,
          amount: true,
          currency: true,
          createdAt: true,
        },
      });

      // Enqueue for processing
      await enqueueTransaction({
        transactionId: transaction.id,
        userId: request.userId!,
        type: transaction.type,
        amount: Number(transaction.amount),
        currency: transaction.currency,
      });

      return reply.code(201).send({
        success: true,
        data: transaction,
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
   * Get transaction statistics
   */
  fastify.get("/stats/summary", async (request, reply) => {
    const [totalTransactions, completedTransactions, totalSpent] = await Promise.all([
      prisma.transaction.count({
        where: { userId: request.userId! },
      }),
      prisma.transaction.count({
        where: {
          userId: request.userId!,
          status: "completed",
        },
      }),
      prisma.transaction.aggregate({
        where: {
          userId: request.userId!,
          status: "completed",
          type: "purchase",
        },
        _sum: {
          fiatAmount: true,
        },
      }),
    ]);

    return reply.send({
      success: true,
      data: {
        totalTransactions,
        completedTransactions,
        totalSpent: totalSpent._sum.fiatAmount || 0,
        currency: "USD",
      },
    });
  });
};

