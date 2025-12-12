import { FastifyPluginAsync } from "fastify";
import { prisma } from "../lib/prisma";
import { authenticate } from "../middleware/auth";
import { enqueueZkProof } from "../lib/queue";

export const zkReceiptRoutes: FastifyPluginAsync = async (fastify) => {
  // Apply authentication to all routes
  fastify.addHook("preHandler", authenticate);

  /**
   * Get all ZK receipts for current user
   */
  fastify.get("/", async (request, reply) => {
    const receipts = await prisma.zkReceipt.findMany({
      where: { userId: request.userId! },
      select: {
        id: true,
        transactionId: true,
        verified: true,
        onChainTxHash: true,
        chainId: true,
        createdAt: true,
        transaction: {
          select: {
            amount: true,
            currency: true,
            fiatAmount: true,
            type: true,
            status: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return reply.send({
      success: true,
      data: receipts,
    });
  });

  /**
   * Get a specific ZK receipt
   */
  fastify.get("/:receiptId", async (request, reply) => {
    const { receiptId } = request.params as { receiptId: string };

    const receipt = await prisma.zkReceipt.findFirst({
      where: {
        id: receiptId,
        userId: request.userId!,
      },
      select: {
        id: true,
        transactionId: true,
        proof: true,
        publicInputs: true,
        verificationKey: true,
        verified: true,
        onChainTxHash: true,
        chainId: true,
        metadata: true,
        createdAt: true,
        transaction: {
          select: {
            id: true,
            type: true,
            amount: true,
            currency: true,
            fiatAmount: true,
            metadata: true,
            createdAt: true,
          },
        },
      },
    });

    if (!receipt) {
      return reply.code(404).send({
        success: false,
        error: "ZK receipt not found",
      });
    }

    return reply.send({
      success: true,
      data: receipt,
    });
  });

  /**
   * Generate ZK receipt for a transaction
   */
  fastify.post("/generate/:transactionId", async (request, reply) => {
    const { transactionId } = request.params as { transactionId: string };

    // Verify transaction ownership
    const transaction = await prisma.transaction.findFirst({
      where: {
        id: transactionId,
        userId: request.userId!,
        status: "completed",
      },
    });

    if (!transaction) {
      return reply.code(404).send({
        success: false,
        error: "Transaction not found or not completed",
      });
    }

    // Check if receipt already exists
    const existing = await prisma.zkReceipt.findUnique({
      where: { transactionId },
    });

    if (existing) {
      return reply.code(409).send({
        success: false,
        error: "ZK receipt already exists for this transaction",
      });
    }

    // Create placeholder receipt
    const receipt = await prisma.zkReceipt.create({
      data: {
        transactionId,
        userId: request.userId!,
        proof: "pending",
        publicInputs: {},
        verified: false,
      },
      select: {
        id: true,
        transactionId: true,
        verified: true,
        createdAt: true,
      },
    });

    // Enqueue proof generation
    await enqueueZkProof({
      transactionId,
      userId: request.userId!,
      data: {
        amount: Number(transaction.amount),
        currency: transaction.currency,
        timestamp: transaction.createdAt.toISOString(),
      },
    });

    return reply.code(201).send({
      success: true,
      data: receipt,
      message: "ZK proof generation started",
    });
  });

  /**
   * Verify a ZK receipt
   */
  fastify.post("/:receiptId/verify", async (request, reply) => {
    const { receiptId } = request.params as { receiptId: string };

    const receipt = await prisma.zkReceipt.findFirst({
      where: {
        id: receiptId,
        userId: request.userId!,
      },
    });

    if (!receipt) {
      return reply.code(404).send({
        success: false,
        error: "ZK receipt not found",
      });
    }

    if (receipt.proof === "pending") {
      return reply.code(400).send({
        success: false,
        error: "ZK proof generation in progress",
      });
    }

    // TODO: Implement actual ZK proof verification
    // For now, return the current verification status
    const verified = receipt.verified;

    return reply.send({
      success: true,
      data: {
        receiptId: receipt.id,
        verified,
        onChainTxHash: receipt.onChainTxHash,
      },
    });
  });
};

