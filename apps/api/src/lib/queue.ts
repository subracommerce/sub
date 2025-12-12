import { Queue, Worker, Job } from "bullmq";
import { redis } from "./redis";

const connection = {
  host: redis.options.host,
  port: redis.options.port,
};

/**
 * Agent task queue for long-running operations
 */
export const agentTaskQueue = new Queue("agent-tasks", { connection });

/**
 * Transaction processing queue
 */
export const transactionQueue = new Queue("transactions", { connection });

/**
 * ZK proof generation queue
 */
export const zkProofQueue = new Queue("zk-proofs", { connection });

/**
 * Type definitions for queue jobs
 */
export interface AgentTaskJob {
  taskId: string;
  agentId: string;
  type: string;
  input: Record<string, any>;
}

export interface TransactionJob {
  transactionId: string;
  userId: string;
  type: string;
  amount: number;
  currency: string;
}

export interface ZkProofJob {
  transactionId: string;
  userId: string;
  data: Record<string, any>;
}

/**
 * Add a task to the agent task queue
 */
export async function enqueueAgentTask(job: AgentTaskJob) {
  return agentTaskQueue.add("process-task", job, {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 2000,
    },
  });
}

/**
 * Add a transaction to the transaction queue
 */
export async function enqueueTransaction(job: TransactionJob) {
  return transactionQueue.add("process-transaction", job, {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 5000,
    },
  });
}

/**
 * Add a ZK proof generation job to the queue
 */
export async function enqueueZkProof(job: ZkProofJob) {
  return zkProofQueue.add("generate-proof", job, {
    attempts: 2,
    backoff: {
      type: "exponential",
      delay: 10000,
    },
  });
}

