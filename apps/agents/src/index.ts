import { Worker } from "bullmq";
import { redis } from "./lib/redis";
import { prisma } from "./lib/prisma";
import { AgentTaskJob } from "./types";
import { ExplorerAgent } from "./agents/explorer";
import { NegotiatorAgent } from "./agents/negotiator";
import { ExecutionAgent } from "./agents/executor";
import { TrackerAgent } from "./agents/tracker";

const connection = {
  host: redis.options.host,
  port: redis.options.port,
};

/**
 * Worker for processing agent tasks
 */
const agentTaskWorker = new Worker<AgentTaskJob>(
  "agent-tasks",
  async (job) => {
    const { taskId, agentId, type, input } = job.data;

    console.log(`Processing task ${taskId} for agent ${agentId}`);

    try {
      // Update task status to in_progress
      await prisma.agentTask.update({
        where: { id: taskId },
        data: {
          status: "in_progress",
          startedAt: new Date(),
        },
      });

      // Get agent details
      const agent = await prisma.agent.findUnique({
        where: { id: agentId },
      });

      if (!agent) {
        throw new Error(`Agent ${agentId} not found`);
      }

      let output: any;

      // Route to appropriate agent based on type
      switch (agent.type) {
        case "explorer":
          output = await new ExplorerAgent(agent).execute(type, input);
          break;
        case "negotiator":
          output = await new NegotiatorAgent(agent).execute(type, input);
          break;
        case "executor":
          output = await new ExecutionAgent(agent).execute(type, input);
          break;
        case "tracker":
          output = await new TrackerAgent(agent).execute(type, input);
          break;
        default:
          throw new Error(`Unknown agent type: ${agent.type}`);
      }

      // Update task with output
      await prisma.agentTask.update({
        where: { id: taskId },
        data: {
          status: "completed",
          output,
          completedAt: new Date(),
        },
      });

      console.log(`Task ${taskId} completed successfully`);
    } catch (error: any) {
      console.error(`Task ${taskId} failed:`, error);

      // Update task with error
      await prisma.agentTask.update({
        where: { id: taskId },
        data: {
          status: "failed",
          error: error.message,
          completedAt: new Date(),
        },
      });

      throw error;
    }
  },
  {
    connection,
    concurrency: 5,
  }
);

agentTaskWorker.on("completed", (job) => {
  console.log(`✅ Job ${job.id} completed`);
});

agentTaskWorker.on("failed", (job, err) => {
  console.error(`❌ Job ${job?.id} failed:`, err);
});

console.log("🤖 SUBRA Agent Runtime started");
console.log("Listening for agent tasks...");

