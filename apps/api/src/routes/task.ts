import { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { authenticate } from "../middleware/auth";
import { enqueueAgentTask } from "../lib/queue";
import { TaskStatus } from "@prisma/client";

const createTaskSchema = z.object({
  agentId: z.string().uuid(),
  type: z.string(),
  input: z.record(z.any()),
  priority: z.number().int().min(0).max(10).default(0),
});

const queryTasksSchema = z.object({
  agentId: z.string().uuid().optional(),
  status: z.enum(["pending", "in_progress", "completed", "failed", "cancelled"]).optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
});

export const taskRoutes: FastifyPluginAsync = async (fastify) => {
  // Apply authentication to all routes
  fastify.addHook("preHandler", authenticate);

  /**
   * Create a new task
   */
  fastify.post("/", async (request, reply) => {
    try {
      const body = createTaskSchema.parse(request.body);

      // Verify agent ownership
      const agent = await prisma.agent.findFirst({
        where: {
          id: body.agentId,
          userId: request.userId!,
          isActive: true,
        },
      });

      if (!agent) {
        return reply.code(404).send({
          success: false,
          error: "Agent not found or inactive",
        });
      }

      // Create task
      const task = await prisma.agentTask.create({
        data: {
          agentId: body.agentId,
          userId: request.userId!,
          type: body.type,
          status: "pending",
          priority: body.priority,
          input: body.input,
        },
        select: {
          id: true,
          agentId: true,
          type: true,
          status: true,
          priority: true,
          input: true,
          createdAt: true,
        },
      });

      // Enqueue task for processing
      await enqueueAgentTask({
        taskId: task.id,
        agentId: task.agentId,
        type: task.type,
        input: task.input as Record<string, any>,
      });

      return reply.code(201).send({
        success: true,
        data: task,
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
   * Get tasks with optional filters
   */
  fastify.get("/", async (request, reply) => {
    try {
      const query = queryTasksSchema.parse(request.query);

      const where: any = { userId: request.userId! };
      
      if (query.agentId) {
        where.agentId = query.agentId;
      }
      
      if (query.status) {
        where.status = query.status as TaskStatus;
      }

      const skip = (query.page - 1) * query.limit;

      const [tasks, total] = await Promise.all([
        prisma.agentTask.findMany({
          where,
          select: {
            id: true,
            agentId: true,
            type: true,
            status: true,
            priority: true,
            input: true,
            output: true,
            error: true,
            startedAt: true,
            completedAt: true,
            createdAt: true,
            updatedAt: true,
            agent: {
              select: {
                name: true,
                type: true,
              },
            },
          },
          orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
          skip,
          take: query.limit,
        }),
        prisma.agentTask.count({ where }),
      ]);

      return reply.send({
        success: true,
        data: tasks,
        pagination: {
          page: query.page,
          limit: query.limit,
          total,
          totalPages: Math.ceil(total / query.limit),
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
   * Get a specific task
   */
  fastify.get("/:taskId", async (request, reply) => {
    const { taskId } = request.params as { taskId: string };

    const task = await prisma.agentTask.findFirst({
      where: {
        id: taskId,
        userId: request.userId!,
      },
      select: {
        id: true,
        agentId: true,
        type: true,
        status: true,
        priority: true,
        input: true,
        output: true,
        error: true,
        startedAt: true,
        completedAt: true,
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
    });

    if (!task) {
      return reply.code(404).send({
        success: false,
        error: "Task not found",
      });
    }

    return reply.send({
      success: true,
      data: task,
    });
  });

  /**
   * Cancel a task
   */
  fastify.post("/:taskId/cancel", async (request, reply) => {
    const { taskId } = request.params as { taskId: string };

    // Verify ownership and status
    const existing = await prisma.agentTask.findFirst({
      where: {
        id: taskId,
        userId: request.userId!,
      },
    });

    if (!existing) {
      return reply.code(404).send({
        success: false,
        error: "Task not found",
      });
    }

    if (existing.status === "completed" || existing.status === "cancelled") {
      return reply.code(400).send({
        success: false,
        error: "Cannot cancel completed or already cancelled task",
      });
    }

    const task = await prisma.agentTask.update({
      where: { id: taskId },
      data: {
        status: "cancelled",
        updatedAt: new Date(),
      },
      select: {
        id: true,
        status: true,
        updatedAt: true,
      },
    });

    return reply.send({
      success: true,
      data: task,
    });
  });
};

