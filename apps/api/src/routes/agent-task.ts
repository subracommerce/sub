import { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { authenticate } from "../middleware/auth";
import { agentExecutor } from "../services/agent-executor";

const createTaskSchema = z.object({
  agentId: z.string().uuid(),
  type: z.enum(["search", "compare", "negotiate", "purchase", "track"]),
  input: z.record(z.any()),
  priority: z.number().int().min(0).max(10).optional(),
});

export const agentTaskRoutes: FastifyPluginAsync = async (fastify) => {
  // Create a new task for an agent
  fastify.post(
    "/agent/task",
    { onRequest: [authenticate] },
    async (request, reply) => {
      try {
        const { agentId, type, input, priority } = createTaskSchema.parse(
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

        // Create task
        const task = await prisma.agentTask.create({
          data: {
            agentId,
            userId: request.userId,
            type,
            input,
            priority: priority || 0,
            status: "pending",
          },
        });

        fastify.log.info(`Created ${type} task for agent ${agentId}`);

        // Execute task immediately (in background for real implementation)
        // For now, we'll execute synchronously
        let result;

        if (type === "search") {
          result = await agentExecutor.executeSearchTask(
            agentId,
            task.id,
            input.query as string,
            input.marketplaces as string[] | undefined
          );
        } else if (type === "compare") {
          result = await agentExecutor.executeCompareTask(
            agentId,
            task.id,
            input.productName as string,
            input.marketplaces as string[] | undefined
          );
        } else if (type === "purchase") {
          result = await agentExecutor.executePurchaseTask(
            agentId,
            task.id,
            request.userId,
            input.productId as string,
            input.productName as string,
            input.price as number,
            input.merchant as string,
            (input.currency as "SOL" | "USDC") || "USDC"
          );
        } else {
          // Other task types not yet implemented
          await prisma.agentTask.update({
            where: { id: task.id },
            data: {
              status: "failed",
              error: `Task type "${type}" not yet implemented`,
            },
          });
          
          return reply.send({
            success: false,
            error: `Task type "${type}" coming soon`,
          });
        }

        return reply.status(201).send({
          success: true,
          data: {
            task: {
              id: task.id,
              type: task.type,
              status: result.success ? "completed" : "failed",
            },
            result,
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
          error: error.message || "Failed to create task",
        });
      }
    }
  );

  // Get all tasks for an agent
  fastify.get(
    "/agent/:agentId/tasks",
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

        const tasks = await prisma.agentTask.findMany({
          where: { agentId },
          orderBy: { createdAt: "desc" },
          take: 50,
        });

        return reply.send({
          success: true,
          data: {
            agentId,
            agentName: agent.name,
            tasks,
            total: tasks.length,
          },
        });
      } catch (error: any) {
        fastify.log.error(error);
        return reply.status(500).send({
          success: false,
          error: error.message || "Failed to get tasks",
        });
      }
    }
  );

  // Get agent activity feed
  fastify.get(
    "/agent/:agentId/activity",
    { onRequest: [authenticate] },
    async (request, reply) => {
      try {
        const { agentId } = request.params as { agentId: string };
        const { limit } = request.query as { limit?: string };

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

        const activities = await agentExecutor.getActivityHistory(
          agentId,
          limit ? parseInt(limit) : 50
        );

        return reply.send({
          success: true,
          data: {
            agentId,
            agentName: agent.name,
            activities,
            total: activities.length,
          },
        });
      } catch (error: any) {
        fastify.log.error(error);
        return reply.status(500).send({
          success: false,
          error: error.message || "Failed to get activity",
        });
      }
    }
  );
};

